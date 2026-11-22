import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import type { AccessTokenClaims } from "@workos-inc/node";
import { getWorkos } from "./workos.js";

export type Context = {
  session: AccessTokenClaims | null;
};

function bearerToken(req: Request): string | null {
  const header = req.headers.get("authorization");
  if (!header) return null;
  const [scheme, token] = header.split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !token) return null;
  return token;
}

export async function createContext(
  opts: FetchCreateContextFnOptions,
): Promise<Context> {
  const token = bearerToken(opts.req);
  if (!token) {
    return { session: null };
  }

  const workos = getWorkos();
  if (!workos) {
    return { session: null };
  }

  try {
    const claims = await workos.userManagement.verifyAccessToken(token);
    return { session: claims };
  } catch {
    return { session: null };
  }
}
