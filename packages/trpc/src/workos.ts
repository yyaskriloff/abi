import { WorkOS } from "@workos-inc/node";

let client: WorkOS | null | undefined;

export function getWorkos(): WorkOS | null {
  if (client !== undefined) return client;

  const apiKey = process.env.WORKOS_API_KEY;
  const workosClientId = process.env.WORKOS_CLIENT_ID;

  if (!apiKey || !workosClientId) {
    console.warn(
      "[@abi/trpc] WORKOS_API_KEY / WORKOS_CLIENT_ID not set; protected routes will reject authenticated requests",
    );
    client = null;
    return client;
  }

  client = new WorkOS(apiKey, { clientId: workosClientId });
  return client;
}
