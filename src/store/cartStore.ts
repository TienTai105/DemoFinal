import { create } from "zustand";
import type { CartItem } from "../types";

interface CartStore {
  items: CartItem[];
  total: number;
  addItem: (item: any) => void;
  removeItem: (itemKey: string) => void;
  updateQuantity: (itemKey: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  total: 0,

  addItem: (item: any) => {
    set((state: CartStore) => {
      // Create unique key based on id + size + color
      const itemKey = `${item.id}-${item.size || 'default'}-${item.color || 'default'}`;
      
      const existing = state.items.find(
        (x) => `${x.id}-${x.size || 'default'}-${x.color || 'default'}` === itemKey
      );

      if (existing) {
        // Same product, size, and color -> increase quantity
        const updated = state.items.map((x) =>
          `${x.id}-${x.size || 'default'}-${x.color || 'default'}` === itemKey
            ? { ...x, quantity: x.quantity + (item.quantity || 1) }
            : x
        );

        return { items: updated, total: get().getTotal() };
      }

      // Different size or color -> add as new line item
      return {
        items: [...state.items, { ...item }],
        total: get().getTotal(),
      };
    });
  },

  removeItem: (itemKey: string) => {
    set((state: CartStore) => {
      const updated = state.items.filter(
        (x) => `${x.id}-${x.size || 'default'}-${x.color || 'default'}` !== itemKey
      );
      return { items: updated, total: get().getTotal() };
    });
  },

  updateQuantity: (itemKey: string, quantity: number) => {
    set((state: CartStore) => {
      if (quantity <= 0) {
        const removed = state.items.filter(
          (x) => `${x.id}-${x.size || 'default'}-${x.color || 'default'}` !== itemKey
        );
        return { items: removed, total: get().getTotal() };
      }

      const updated = state.items.map((x) =>
        `${x.id}-${x.size || 'default'}-${x.color || 'default'}` === itemKey
          ? { ...x, quantity }
          : x
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
