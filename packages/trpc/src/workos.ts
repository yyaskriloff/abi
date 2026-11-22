import { WorkOS } from "@workos-inc/node";

const apiKey = process.env.WORKOS_API_KEY;
const clientId = process.env.WORKOS_CLIENT_ID;

if (!apiKey) {
  console.warn(
    "[@abi/trpc] WORKOS_API_KEY is not set; protected routes will reject all requests",
  );
}

if (!clientId) {
  console.warn(
    "[@abi/trpc] WORKOS_CLIENT_ID is not set; access token verification will fail",
  );
}

export const workos = new WorkOS(apiKey ?? "missing", {
  clientId: clientId ?? "missing",
});
