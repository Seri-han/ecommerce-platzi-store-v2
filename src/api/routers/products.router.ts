import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

const API_BASE_URL = "https://api.escuelajs.co/api/v1";

const categorySchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  image: z.string(),
  creationAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

const productSchema = z.object({
  id: z.number(),
  title: z.string(),
  slug: z.string(),
  price: z.number(),
  description: z.string(),
  images: z.array(z.string()).default([]),
  creationAt: z.string().optional(),
  updatedAt: z.string().optional(),
  category: categorySchema,
});

export type Product = z.infer<typeof productSchema>;
export type Category = z.infer<typeof categorySchema>;

const productsListInputSchema = z.object({
  title: z.string().optional(),
  price: z.number().optional(),
  priceMin: z.number().optional(),
  priceMax: z.number().optional(),
  categoryId: z.number().optional(),
  categorySlug: z.string().optional(),
  offset: z.number().int().min(0).default(0),
  limit: z.number().int().min(1).max(100).default(20),
});

type ProductsListInput = z.infer<typeof productsListInputSchema>;

async function fetchJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(url, {
    method: "GET",
    signal,
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`EscuelaJS API error: ${response.status}`);
  }

  return (await response.json()) as T;
}

function buildProductsUrl(input: ProductsListInput): string {
  const url = new URL(`${API_BASE_URL}/products`);

  if (input.title) {
    url.searchParams.set("title", input.title);
  }

  if (typeof input.price === "number") {
    url.searchParams.set("price", String(input.price));
  }

  if (typeof input.priceMin === "number") {
    url.searchParams.set("price_min", String(input.priceMin));
  }

  if (typeof input.priceMax === "number") {
    url.searchParams.set("price_max", String(input.priceMax));
  }

  if (typeof input.categoryId === "number") {
    url.searchParams.set("categoryId", String(input.categoryId));
  }

  if (input.categorySlug) {
    url.searchParams.set("categorySlug", input.categorySlug);
  }

  url.searchParams.set("offset", String(input.offset));
  url.searchParams.set("limit", String(input.limit));

  return url.toString();
}

export const productsRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(productsListInputSchema.optional())
    .query(async ({ input, ctx }) => {
      const parsedInput = productsListInputSchema.parse(input ?? {});
      const url = buildProductsUrl(parsedInput);
      const data = await fetchJson<unknown>(url, ctx.signal);

      return z.array(productSchema).parse(data);
    }),

  getById: publicProcedure
    .input(
      z.object({
        id: z.number().int().positive(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const data = await fetchJson<unknown>(
        `${API_BASE_URL}/products/${input.id}`,
        ctx.signal,
      );

      return productSchema.parse(data);
    }),

  getRelated: publicProcedure
    .input(
      z.object({
        id: z.number().int().positive(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const data = await fetchJson<unknown>(
        `${API_BASE_URL}/products/${input.id}/related`,
        ctx.signal,
      );

      return z.array(productSchema).parse(data);
    }),

  getByCategory: publicProcedure
    .input(
      z.object({
        categoryId: z.number().int().positive(),
        limit: z.number().int().min(1).max(100).default(50),
        offset: z.number().int().min(0).default(0),
      }),
    )
    .query(async ({ input, ctx }) => {
      const url = new URL(`${API_BASE_URL}/products`);
      url.searchParams.set("categoryId", String(input.categoryId));
      url.searchParams.set("limit", String(input.limit));
      url.searchParams.set("offset", String(input.offset));

      const data = await fetchJson<unknown>(url.toString(), ctx.signal);

      return z.array(productSchema).parse(data);
    }),

  getCategories: publicProcedure.query(async ({ ctx }) => {
    const data = await fetchJson<unknown>(
      `${API_BASE_URL}/categories`,
      ctx.signal,
    );

    return z.array(categorySchema).parse(data);
  }),
});