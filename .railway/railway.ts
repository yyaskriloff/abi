import { defineRailway, github, group, project, service } from "railway/iac";

export default defineRailway(() => {
  const repo = github("yyaskriloff/abi");

  // Shared monorepo: keep repo root so pnpm workspaces resolve (@abi/trpc).
  const api = service("api", {
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
      // Browser-facing API URL; Railway interpolates after the api domain exists.
      VITE_API_URL: "https://${{api.RAILWAY_PUBLIC_DOMAIN}}",
      RAILPACK_SPA_OUTPUT_DIR: "admin/dist",
    },
  });

  return project("another-bright-idea", {
    resources: [group("Apps", [api, admin])],
  });
});
