import {
  bucket,
  defineRailway,
  github,
  group,
  postgres,
  project,
  ref,
  service,
} from "railway/iac";

export default defineRailway(() => {
  const repo = github("yyaskriloff/abi");

  const blob = bucket("blob-store", { region: "iad" });
  const db = postgres("database");

  // Shared monorepo: keep repo root so pnpm workspaces resolve (@abi/trpc).
  const trpc = service("trpc", {
    source: repo,
    build: {
      buildCommand:
        "corepack enable && pnpm install --frozen-lockfile && pnpm --filter @abi/trpc build",
      watchPatterns: [
        "trpc/**",
        "package.json",
        "pnpm-lock.yaml",
        "pnpm-workspace.yaml",
      ],
    },
    start: "corepack enable && pnpm --filter @abi/trpc start",
    healthcheck: "/",
    env: {
      NODE_ENV: "production",
      DATABASE_URL: db.env.DATABASE_URL,
      BUCKET: ref(blob, "BUCKET"),
      ACCESS_KEY_ID: ref(blob, "ACCESS_KEY_ID"),
      SECRET_ACCESS_KEY: ref(blob, "SECRET_ACCESS_KEY"),
      ENDPOINT: ref(blob, "ENDPOINT"),
      REGION: ref(blob, "REGION"),
    },
  });

  const admin = service("admin", {
    source: repo,
    build: {
      buildCommand:
        "corepack enable && pnpm install --frozen-lockfile && pnpm --filter @abi/admin build",
      watchPatterns: [
        "admin/**",
        "trpc/**",
        "package.json",
        "pnpm-lock.yaml",
        "pnpm-workspace.yaml",
      ],
    },
    env: {
      // Browser-facing API URL; Railway interpolates after the trpc domain exists.
      VITE_API_URL: "https://${{trpc.RAILWAY_PUBLIC_DOMAIN}}",
      RAILPACK_SPA_OUTPUT_DIR: "admin/dist",
    },
  });

  return project("another-bright-idea", {
    resources: [group("Apps", [trpc, admin]), group("Data", [db, blob])],
  });
});
