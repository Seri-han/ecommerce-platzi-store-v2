import axios from "axios";
import { ProductSchema, ProductsSchema } from "../../backend/schemas/productSchema";

const API = axios.create({
  baseURL: "https://api.escuelajs.co/api/v1",
  timeout: 15000,
});

let categoriesCache: any[] | null = null;

API.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export const platziApi = {
  getAllProducts: async (limit = 50, offset = 0) => {
    const response = await API.get(`/products?limit=${limit}&offset=${offset}`);

    const parsed = ProductsSchema.safeParse(response.data);

    if (!parsed.success) {
      console.error("Invalid products response:", parsed.error.format());
      throw new Error("Invalid products data");
    }

    return { data: parsed.data };
  },

  getProductsByCategory: async (categoryId: number) => {
    const response = await API.get(`/products?categoryId=${categoryId}`);

    const parsed = ProductsSchema.safeParse(response.data);

    if (!parsed.success) {
      console.error("Invalid category products response:", parsed.error.format());
      throw new Error("Invalid category products data");
    }

    return { data: parsed.data };
  },

  getProductById: async (id: number) => {
    const response = await API.get(`/products/${id}`);

    const parsed = ProductSchema.safeParse(response.data);

    if (!parsed.success) {
      console.error("Invalid product response:", parsed.error.format());
      throw new Error("Invalid product data");
    }

    return { data: parsed.data };
  },

  getAllCategories: async () => {
    if (categoriesCache) {
      return { data: categoriesCache };
    }

    const response = await API.get("/categories");
    categoriesCache = response.data;
    return { data: response.data };
  },
};