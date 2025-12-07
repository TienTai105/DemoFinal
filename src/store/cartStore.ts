import { create } from 'zustand';
import type { CartItem, Product } from '../types';

interface CartStore {
  items: CartItem[];
  total: number;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  total: 0,

  addItem: (product: Product) => {
    set((state: CartStore) => {
      const existingItem = state.items.find((item: CartItem) => item.id === product.id);

      if (existingItem) {
        const updatedItems = state.items.map((item: CartItem) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
        return {
          items: updatedItems,
          total: get().getTotal(),
        };
      }

      const newItems: CartItem[] = [...state.items, { ...product, quantity: 1 }];
      return {
        items: newItems,
        total: get().getTotal(),
      };
    });
  },

  removeItem: (productId: string) => {
    set((state: CartStore) => {
      const updatedItems = state.items.filter((item: CartItem) => item.id !== productId);
      return {
        items: updatedItems,
        total: get().getTotal(),
      };
    });
  },

  updateQuantity: (productId: string, quantity: number) => {
    set((state: CartStore) => {
      if (quantity <= 0) {
        const updatedItems = state.items.filter((item: CartItem) => item.id !== productId);
        return {
          items: updatedItems,
          total: get().getTotal(),
        };
      }

      const updatedItems = state.items.map((item: CartItem) =>
        item.id === productId ? { ...item, quantity } : item
      );

      return {
        items: updatedItems,
        total: get().getTotal(),
      };
    });
  },

  clearCart: () => {
    set({ items: [], total: 0 });
  },

  getTotal: () => {
    const state = get();
    return state.items.reduce((sum: number, item: CartItem) => sum + item.price * item.quantity, 0);
  },
}));
