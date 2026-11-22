import {
  bucket,
  defineRailway,
  github,
  group,
  postgres,
  project,
  ref,
  service,
  volume,
} from "railway/iac";

export default defineRailway(() => {
  const database = postgres("database", { region: "us-east4-eqdc4a" });
  const databaseVolume = volume("database-volume", {
    alerts: { usage: { "100": {}, "80": {}, "95": {} } },
    allowOnlineResize: true,
    region: "us-east4-eqdc4a",
    sizeMB: 5000,
  });

  const blobStore = bucket("blob-store", { region: "iad" });

  const trpc = service("trpc", {
    source: github("yyaskriloff/abi", { branch: "main", checkSuites: false }),
    build: {
      buildCommand:
        "corepack enable && pnpm install --frozen-lockfile && pnpm --filter @abi/trpc build",
      buildEnvironment: "V3",
      builder: "RAILPACK",
      watchPatterns: [
        "packages/trpc/**",
        "package.json",
        "pnpm-lock.yaml",
        "pnpm-workspace.yaml",
      ],
    },
    start: "corepack enable && pnpm --filter @abi/trpc start",
    healthcheck: "/",
    replicas: { "us-east4-eqdc4a": 1 },
    deploy: {
      limitOverride: { containers: { cpu: 0.5, memoryBytes: 500000000 } },
    },
    env: {
      NODE_ENV: "production",
      DATABASE_URL: database.env.DATABASE_URL,
      BUCKET: ref(blobStore, "BUCKET"),
      ACCESS_KEY_ID: ref(blobStore, "ACCESS_KEY_ID"),
      SECRET_ACCESS_KEY: ref(blobStore, "SECRET_ACCESS_KEY"),
      ENDPOINT: ref(blobStore, "ENDPOINT"),
      REGION: ref(blobStore, "REGION"),
    },
  });

  const admin = service("admin", {
    source: github("yyaskriloff/abi", { branch: "main" }),
    build: {
      buildCommand:
        "corepack enable && pnpm install --frozen-lockfile && pnpm --filter @abi/admin build",
      buildEnvironment: "V3",
      builder: "RAILPACK",
      watchPatterns: [
        "apps/admin/**",
        "packages/trpc/**",
        "package.json",
        "pnpm-lock.yaml",
        "pnpm-workspace.yaml",
      ],
    },
    replicas: { "us-east4-eqdc4a": 1 },
    deploy: {
      limitOverride: { containers: { cpu: 0.5, memoryBytes: 500000000 } },
    },
    env: {
      // Browser-facing API URL; Railway interpolates after the trpc domain exists.
      VITE_API_URL: "https://${{trpc.RAILWAY_PUBLIC_DOMAIN}}",
      RAILPACK_SPA_OUTPUT_DIR: "apps/admin/dist",
    },
  });
  const Apps = group("Apps", [trpc, admin]);
  const Data = group("Data", [database, blobStore]);

  return project("another-bright-idea", {
    resources: [databaseVolume, Apps, Data],
  });
});
