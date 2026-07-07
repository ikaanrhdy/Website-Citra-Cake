import { create } from "zustand";
import type { productsAdmin } from "@/types/data";
import { product } from "@/data/productAdmin";

interface ProductStore {
  products: productsAdmin[];
  search: string;
  setSearch: (value: string) => void;
  addProduct: (item: productsAdmin) => void;
  updateProduct: (id: string, data: Partial<productsAdmin>) => void;
  deleteProduct: (id: string) => void;
}

export const useProductStore = create<ProductStore>((set) => ({
  products: product,
  search: "",
  setSearch: (value) => set({ search: value }),
  addProduct: (item) =>
    set((state) => ({ products: [...state.products, item] })),
  updateProduct: (id, data) =>
    set((state) => ({
      products: state.products.map((p) =>
        p.id === id ? { ...p, ...data } : p,
      ),
    })),
  deleteProduct: (id) =>
    set((state) => ({
      products: state.products.filter((p) => p.id !== id),
    })),
}));
