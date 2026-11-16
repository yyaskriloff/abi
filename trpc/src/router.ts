import { z } from "zod";
import { publicProcedure, router } from "./trpc.js";

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
});

export type AppRouter = typeof appRouter;
