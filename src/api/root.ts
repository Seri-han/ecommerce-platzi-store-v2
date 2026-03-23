import { createTRPCRouter } from "./trpc";
import { productsRouter } from "./routers/products.router";

export const appRouter = createTRPCRouter({
  products: productsRouter,
});

export type AppRouter = typeof appRouter;