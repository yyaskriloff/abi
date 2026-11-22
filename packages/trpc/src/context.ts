import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import type { AccessTokenClaims } from "@workos-inc/node";
import { workos } from "./workos.js";

export type SessionClaims = AccessTokenClaims;

export type Context = {
  session: SessionClaims | null;
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

  try {
    const claims = await workos.userManagement.verifyAccessToken(token);
    return { session: claims };
  } catch (error) {
    console.warn("[@abi/trpc] access token verification failed", error);
    return { session: null };
  }
}
