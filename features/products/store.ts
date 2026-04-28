import { create } from "zustand";
import type { ProductFilters } from "./types";

interface ProductsStore {
  filters: ProductFilters;
  searchQuery: string;
  setFilters: (filters: Partial<ProductFilters>) => void;
  resetFilters: () => void;
  setSearchQuery: (query: string) => void;
}

export const useProductsStore = create<ProductsStore>((set) => ({
  filters: {},
  searchQuery: "",

  setFilters: (filters) =>
    set((state) => ({ filters: { ...state.filters, ...filters } })),

  resetFilters: () => set({ filters: {} }),

  setSearchQuery: (searchQuery) => set({ searchQuery }),
}));
