import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  id: number;
  title: string;
  price: number;
  quantity: number;
  image?: string;
  images?: string[];
};

type CartProduct = Omit<CartItem, "quantity">;

interface CartState {
  cart: CartItem[];
  addToCart: (product: CartProduct) => void;
  updateQuantity: (id: number, quantity: number) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
}

type PersistedCartState = {
  cart?: unknown;
};

function normalizeCartItem(item: unknown): CartItem | null {
  if (!item || typeof item !== "object") {
    return null;
  }

  const cartItem = item as Record<string, unknown>;
  const id = Number(cartItem.id);
  const title = typeof cartItem.title === "string"
    ? cartItem.title
    : typeof cartItem.name === "string"
      ? cartItem.name
      : "Untitled product";
  const price = Number(cartItem.price);
  const quantity = Number(cartItem.quantity);
  const image = typeof cartItem.image === "string" ? cartItem.image : undefined;
  const images = Array.isArray(cartItem.images)
    ? cartItem.images.filter((value): value is string => typeof value === "string")
    : undefined;

  if (!Number.isFinite(id)) {
    return null;
  }

  return {
    id,
    title,
    price: Number.isFinite(price) ? price : 0,
    quantity: Number.isFinite(quantity) && quantity > 0 ? quantity : 1,
    image,
    images,
  };
}

function normalizeCart(cart: unknown): CartItem[] {
  if (!Array.isArray(cart)) {
    return [];
  }

  return cart
    .map(normalizeCartItem)
    .filter((item): item is CartItem => item !== null);
}

const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],

      addToCart: (product) =>
        set((state) => {
          const existingItem = state.cart.find((item) => item.id === product.id);

          if (existingItem) {
            return {
              cart: state.cart.map((item) =>
                item.id === product.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item,
              ),
            };
          }

          return {
            cart: [...state.cart, { ...product, quantity: 1 }],
          };
        }),

      updateQuantity: (id, quantity) => {
        set((state) => ({
          cart: state.cart.map((item) =>
            item.id === id ? { ...item, quantity } : item,
          ),
        }));
      },

      removeFromCart: (id) => {
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== id),
        }));
      },

      clearCart: () => set({ cart: [] }),
    }),
    {
      name: "cart-storage",
      version: 1,
      migrate: (persistedState) => {
        const state = (persistedState ?? {}) as PersistedCartState;

        return {
          cart: normalizeCart(state.cart),
        };
      },
      merge: (persistedState, currentState) => {
        const state = (persistedState ?? {}) as PersistedCartState;

        return {
          ...currentState,
          cart: normalizeCart(state.cart),
        };
      },
    },
  ),
);

export default useCartStore;
