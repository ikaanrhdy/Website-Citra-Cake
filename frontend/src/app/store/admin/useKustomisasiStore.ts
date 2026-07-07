import { create } from "zustand";
import type {
  KustomisasiTab,
  KustomisasiStatus,
  KustomisasiItem,
} from "@/types/kustomisasi";

export type { KustomisasiTab, KustomisasiStatus, KustomisasiItem };

interface KustomisasiState {
  activeTab: KustomisasiTab;
  items: Record<KustomisasiTab, KustomisasiItem[]>;
  setActiveTab: (tab: KustomisasiTab) => void;
  addItem: (tab: KustomisasiTab, item: KustomisasiItem) => void;
  updateItem: (tab: KustomisasiTab, item: KustomisasiItem) => void;
  deleteItem: (tab: KustomisasiTab, id: string) => void;
}

const defaultItems: Record<KustomisasiTab, KustomisasiItem[]> = {
  "Base Cake": [
    { id: "bc-1", nama: "Brownies Kukus", harga: null, status: "Tersedia" },
    { id: "bc-2", nama: "Sponge Cake", harga: 10000, status: "Tersedia" },
    { id: "bc-3", nama: "Chiffon Cake", harga: 15000, status: "Tersedia" },
    { id: "bc-4", nama: "Red Velvet", harga: 5000, status: "Tersedia" },
  ],
  "Tipe Cream": [
    { id: "tc-1", nama: "Buttercream", harga: null, status: "Tersedia" },
    { id: "tc-2", nama: "Whipped Cream", harga: 5000, status: "Tersedia" },
    { id: "tc-3", nama: "Cream Cheese", harga: 10000, status: "Tersedia" },
    { id: "tc-4", nama: "Ganache", harga: null, status: "Tersedia" },
  ],
  "Warna Cream": [
    {
      id: "wc-1",
      nama: "Putih",
      harga: null,
      status: "Tersedia",
      warna: "#FFFFFF",
    },
    {
      id: "wc-2",
      nama: "Merah",
      harga: null,
      status: "Tersedia",
      warna: "#DC2626",
    },
    {
      id: "wc-3",
      nama: "Pink",
      harga: null,
      status: "Tersedia",
      warna: "#EC4899",
    },
    {
      id: "wc-4",
      nama: "Coklat",
      harga: null,
      status: "Tersedia",
      warna: "#6A4441",
    },
    {
      id: "wc-5",
      nama: "Biru",
      harga: null,
      status: "Tersedia",
      warna: "#3B82F6",
    },
    {
      id: "wc-6",
      nama: "Kuning",
      harga: null,
      status: "Tersedia",
      warna: "#EAB308",
    },
    {
      id: "wc-7",
      nama: "Ungu",
      harga: null,
      status: "Tersedia",
      warna: "#9333EA",
    },
    {
      id: "wc-8",
      nama: "Hijau",
      harga: null,
      status: "Tersedia",
      warna: "#22C55E",
    },
  ],
  Layer: [
    { id: "ly-1", nama: "1", harga: null, status: "Tersedia" },
    { id: "ly-2", nama: "2", harga: 25000, status: "Tersedia" },
    { id: "ly-3", nama: "3", harga: 50000, status: "Tersedia" },
    { id: "ly-4", nama: "4", harga: 75000, status: "Tersedia" },
  ],
  Ukuran: [
    { id: "uk-1", nama: "12 cm", harga: 50000, status: "Tersedia" },
    { id: "uk-2", nama: "18 cm", harga: 100000, status: "Tersedia" },
    { id: "uk-3", nama: "20 cm", harga: 150000, status: "Tersedia" },
    { id: "uk-4", nama: "25 cm", harga: 200000, status: "Tersedia" },
    { id: "uk-5", nama: "30 cm", harga: 250000, status: "Tersedia" },
    { id: "uk-6", nama: "35 cm", harga: 300000, status: "Tersedia" },
    { id: "uk-7", nama: "40 cm", harga: 350000, status: "Tersedia" },
    { id: "uk-8", nama: "45 cm", harga: 400000, status: "Tersedia" },
    { id: "uk-9", nama: "50 cm", harga: 450000, status: "Tersedia" },
    { id: "uk-10", nama: "55 cm", harga: 500000, status: "Tersedia" },
  ],
  Topping: [
    { id: "tp-1", nama: "Random", harga: null, status: "Tersedia" },
    { id: "tp-2", nama: "Fresh Fruit", harga: 4000, status: "Tersedia" },
    { id: "tp-3", nama: "Sprinkles", harga: 2000, status: "Tersedia" },
    { id: "tp-4", nama: "Chocolate Drip", harga: 5000, status: "Tersedia" },
    { id: "tp-5", nama: "Gold Flakes", harga: 8000, status: "Tersedia" },
  ],
  Lilin: [
    { id: "ll-1", nama: "Lilin Random", harga: null, status: "Tersedia" },
    { id: "ll-2", nama: "Spiral isi 5", harga: 10000, status: "Tersedia" },
    { id: "ll-3", nama: "Angka Gold", harga: 4000, status: "Tersedia" },
    { id: "ll-4", nama: "Angka Silver", harga: 4000, status: "Tersedia" },
    { id: "ll-5", nama: "Huruf Gold", harga: 5000, status: "Tersedia" },
    { id: "ll-6", nama: "Huruf Silver", harga: 5000, status: "Tersedia" },
  ],
  Topper: [
    { id: "tpr-1", nama: "Tambah Topper", harga: 10000, status: "Tersedia" },
  ],
};

export const useKustomisasiStore = create<KustomisasiState>((set) => ({
  activeTab: "Base Cake",
  items: defaultItems,

  setActiveTab: (tab) => set({ activeTab: tab }),

  addItem: (tab, item) =>
    set((state) => ({
      items: { ...state.items, [tab]: [...state.items[tab], item] },
    })),

  updateItem: (tab, updated) =>
    set((state) => ({
      items: {
        ...state.items,
        [tab]: state.items[tab].map((i) => (i.id === updated.id ? updated : i)),
      },
    })),

  deleteItem: (tab, id) =>
    set((state) => ({
      items: {
        ...state.items,
        [tab]: state.items[tab].filter((i) => i.id !== id),
      },
    })),
}));
