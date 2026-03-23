import { initTRPC } from "@trpc/server";
import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "./root";

export type TRPCContext = {
  signal?: AbortSignal;
};

const t = initTRPC.context<TRPCContext>().create({
  allowOutsideOfServer: true,
  isServer: false,
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;

export const trpc = createTRPCReact<AppRouter>();