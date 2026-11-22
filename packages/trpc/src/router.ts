import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "./trpc.js";

export const appRouter = router({
  hello: publicProcedure
    .input(z.object({ name: z.string().min(1).default("world") }))
    .query(({ input }) => ({
      message: `Hello, ${input.name}!`,
    })),
  health: publicProcedure.query(() => ({
    ok: true as const,
    service: "abi-trpc",
  })),
  me: protectedProcedure.query(({ ctx }) => ({
    sub: ctx.session.sub,
    sid: ctx.session.sid,
    orgId: ctx.session.org_id,
    role: ctx.session.role,
    roles: ctx.session.roles,
    permissions: ctx.session.permissions,
  })),
});

export type AppRouter = typeof appRouter;
