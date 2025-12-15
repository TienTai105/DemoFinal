import { create } from 'zustand';

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
}

interface WishlistStore {
  items: WishlistItem[];
  addItem: (item: WishlistItem) => void;
  removeItem: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistStore>((set, get) => ({
  items: [],

  addItem: (item: WishlistItem) => {
    set((state) => {
      const exists = state.items.find((i) => i.id === item.id);
      if (exists) {
        return state; // Item already in wishlist
      }
      return { items: [...state.items, item] };
    });
  },

  removeItem: (id: string) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    }));
  },

  isInWishlist: (id: string) => {
    return get().items.some((item) => item.id === id);
  },

  clearWishlist: () => {
    set({ items: [] });
  },
}));
