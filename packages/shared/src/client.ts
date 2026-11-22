import { QueryClient } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { trpc } from "./trpc";

export type AbiTrpcClientOptions = {
  getAccessToken?: () => Promise<string | null>;
};

export function createQueryClient() {
  return new QueryClient();
}

/** Wraps AuthKit (or similar) getters that throw when signed out. */
export function toTrpcAccessTokenGetter(
  getAccessToken: () => Promise<string>,
): () => Promise<string | null> {
  return async () => {
    try {
      return await getAccessToken();
    } catch {
      return null;
    }
  };
}

export function createAbiTrpcClient(
  apiUrl: string,
  options: AbiTrpcClientOptions = {},
) {
  const base = apiUrl.replace(/\/$/, "");
  const { getAccessToken } = options;

  return trpc.createClient({
    links: [
      httpBatchLink({
        url: `${base}/trpc`,
        headers: async () => {
          if (!getAccessToken) return {};
          const token = await getAccessToken();
          if (!token) return {};
          return { Authorization: `Bearer ${token}` };
        },
      }),
    ],
  });
}
