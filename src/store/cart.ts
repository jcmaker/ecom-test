import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, CartState } from "@/types/cart";

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (newItem) => {
        const items = get().items;
        const existing = items.find((i) => i.productId === newItem.productId);
        if (existing) {
          set({
            items: items.map((i) =>
              i.productId === newItem.productId
                ? { ...i, quantity: i.quantity + (newItem.quantity ?? 1) }
                : i
            ),
          });
        } else {
          set({
            items: [
              ...items,
              { ...newItem, quantity: newItem.quantity ?? 1 },
            ],
          });
        }
      },

      removeItem: (productId) => {
        set({ items: get().items.filter((i) => i.productId !== productId) });
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.productId === productId ? { ...i, quantity } : i
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      totalItems: () => get().items.reduce((acc, i) => acc + i.quantity, 0),

      totalAmount: () =>
        get().items.reduce((acc, i) => acc + i.price * i.quantity, 0),
    }),
    {
      name: "school-store-cart",
    }
  )
);
