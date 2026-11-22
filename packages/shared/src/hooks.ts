import { trpc } from "./trpc";

export function useHealth() {
  return trpc.health.useQuery();
}

export function useHello(name: string) {
  return trpc.hello.useQuery({ name });
}
