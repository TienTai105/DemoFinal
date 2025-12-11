import { create } from "zustand";
import type { CartItem } from "../types";

interface CartStore {
  items: CartItem[];
  total: number;
  addItem: (item: any) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  total: 0,

  addItem: (item: any) => {
    set((state: CartStore) => {
      const existing = state.items.find((x) => x.id === item.id);

      if (existing) {
        const updated = state.items.map((x) =>
          x.id === item.id
            ? { ...x, quantity: x.quantity + (item.quantity || 1) }
            : x
        );

        return { items: updated, total: get().getTotal() };
      }

      return {
        items: [...state.items, { ...item }],
        total: get().getTotal(),
      };
    });
  },

  removeItem: (productId: string) => {
    set((state: CartStore) => {
      const updated = state.items.filter((x) => x.id !== productId);
      return { items: updated, total: get().getTotal() };
    });
  },

  updateQuantity: (productId: string, quantity: number) => {
    set((state: CartStore) => {
      if (quantity <= 0) {
        const removed = state.items.filter((x) => x.id !== productId);
        return { items: removed, total: get().getTotal() };
      }

      const updated = state.items.map((x) =>
        x.id === productId ? { ...x, quantity } : x
      );

      return { items: updated, total: get().getTotal() };
    });
  },

  clearCart: () => {
    set({ items: [], total: 0 });
  },

  getTotal: () => {
    const state = get();
    return state.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  },
}));
