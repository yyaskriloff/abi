import { QueryClient } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { trpc } from "./trpc";

export function createQueryClient() {
  return new QueryClient();
}

export function createAbiTrpcClient(apiUrl: string) {
  const base = apiUrl.replace(/\/$/, "");
  return trpc.createClient({
    links: [
      httpBatchLink({
        url: `${base}/trpc`,
      }),
    ],
  });
}
