import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { persistStorage } from "../../lib/persist-storage";
import type { Product, CartItem } from "../../lib/types";

interface CartStore {
  items: CartItem[];
  lastUpdated: number;
  addItem: (product: Product, quantity?: number, customDimensions?: { width: number; height: number }) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      lastUpdated: Date.now(),

      addItem: (product, quantity = 1, customDimensions) => {
        if (product.productType === "quote_only") {
          if (__DEV__) {
            console.warn(
              `[cart] refused to add quote_only product "${product.name}" — use the quote flow instead`,
            );
          }
          return;
        }
        const { items } = get();
        const existingIndex = items.findIndex(
          (item) => item.product.id === product.id,
        );

        if (existingIndex >= 0) {
          const updated = [...items];
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: updated[existingIndex].quantity + quantity,
          };
          set({ items: updated, lastUpdated: Date.now() });
        } else {
          const newItem: CartItem = {
            id: `${product.id}-${Date.now()}`,
            product,
            quantity,
            customDimensions,
            calculatedPrice: product.price,
          };
          set({ items: [...items, newItem], lastUpdated: Date.now() });
        }
      },

      removeItem: (itemId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId),
          lastUpdated: Date.now(),
        }));
      },

      updateQuantity: (itemId, quantity) => {
        if (quantity < 1) return;
        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId ? { ...item, quantity } : item,
          ),
          lastUpdated: Date.now(),
        }));
      },

      clearCart: () => set({ items: [], lastUpdated: Date.now() }),
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => persistStorage),
    },
  ),
);

export const useCartItemCount = () =>
  useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.quantity, 0),
  );

export const useCartSubtotal = () =>
  useCartStore((state) =>
    state.items.reduce(
      (sum, item) => sum + (item.calculatedPrice || item.product.price || 0) * item.quantity,
      0,
    ),
  );
