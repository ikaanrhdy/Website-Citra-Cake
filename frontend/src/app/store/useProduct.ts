import { create } from "zustand";
import { product } from "@/data/product";
import type { products } from "@/types/data";

type ProductState = {
  data: products[];
  isLoading: boolean;
  error: string | null;

  inputSearch: string;

  setSearch: (value: string) => void;

  getProducts: () => Promise<void>;
  getProductById: (id: string) => products | undefined;

  filteredProducts: () => products[];
};

export const useProductStore = create<ProductState>((set, get) => ({
  data: [],
  isLoading: false,
  error: null,

  inputSearch: "",

  setSearch: (value) => {
    set({ inputSearch: value });
  },

  getProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      await new Promise((r) => setTimeout(r, 800));
      set({ data: product, isLoading: false });
    } catch {
      set({ error: "Gagal mengambil data produk", isLoading: false });
    }
  },

  getProductById: (id) => {
    return get().data.find((item) => item.id === id);
  },

  // ⬇️ STORE HANYA RETURN DATA MENTAH
  filteredProducts: () => {
    return get().data;
  },
}));
