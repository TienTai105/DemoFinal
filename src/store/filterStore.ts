import { create } from 'zustand';
import type { Filters } from '../types';

interface FilterStore {
  filters: Filters;
  setFilters: (filters: Filters) => void;
  clearFilters: () => void;
  updateFilter: (key: keyof Filters, value: any) => void;
}

export const useFilterStore = create<FilterStore>((set) => ({
  filters: {},

  setFilters: (filters: Filters) => {
    set({ filters });
  },

  clearFilters: () => {
    set({ filters: {} });
  },

  updateFilter: (key: keyof Filters, value: any) => {
    set((state) => ({
      filters: { ...state.filters, [key]: value },
    }));
  },
}));
