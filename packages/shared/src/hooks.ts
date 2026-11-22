import { trpc } from "./trpc";

export function useHealth() {
  return trpc.health.useQuery();
}

export function useHello(name: string) {
  return trpc.hello.useQuery({ name });
}

export function useMe(enabled = true) {
  return trpc.me.useQuery(undefined, {
    enabled,
    retry: false,
  });
}
