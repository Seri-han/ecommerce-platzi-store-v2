import { initTRPC } from "@trpc/server";
import { productsRouter } from "./routers/products.router";

const t = initTRPC.create();

export const appRouter = t.router({
  products: productsRouter
});

export type AppRouter = typeof appRouter;