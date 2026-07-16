import type {
  SelectOption,
  WarnaCreamOption,
  ToppingId,
  LilinId,
} from "@/types/cake";

// Semua angka harga di file ini cuma placeholder,
// tinggal disesuaikan dengan harga asli Citra Cake.

export const UKURAN_OPTIONS: number[] = [10, 12, 18, 20, 25];

export const LAYER_OPTIONS: number[] = [1, 2, 3, 4];

export const HARGA_DASAR_PER_UKURAN: Record<number, number> = {
  10: 80000,
  12: 120000,
  18: 180000,
  20: 250000,
  25: 320000,
};

export const HARGA_TAMBAH_LAYER = 75000; // per layer tambahan di atas layer pertama

export const BASE_CAKE_OPTIONS: SelectOption[] = [
  { id: "brownies-kukus", label: "Brownies Kukus", price: 0 },
  { id: "sponge-cake", label: "Sponge Cake", price: 0 },
  { id: "red-velvet", label: "Red Velvet", price: 0 },
  { id: "chiffon", label: "Chiffon", price: 15000 },
];

export const TIPE_CREAM_OPTIONS: SelectOption[] = [
  { id: "buttercream", label: "Buttercream", price: 0 },
  { id: "whipped-cream", label: "Whipped Cream", price: 0 },
  { id: "ganache", label: "Ganache", price: 8000 },
  { id: "fondant", label: "Fondant", price: 20000 },
];

export const WARNA_CREAM_OPTIONS: WarnaCreamOption[] = [
  { id: "merah", label: "Merah", base: "#D6455B", drip: "#B22F44" },
  { id: "pink", label: "Pink Lembut", base: "#F3A6C0", drip: "#F9D3E1" },
  { id: "coklat", label: "Cokelat", base: "#7B4B33", drip: "#5A3323" },
  { id: "putih", label: "Vanilla", base: "#FBF3E7", drip: "#EFE0C8" },
  { id: "kuning", label: "Lemon", base: "#F3CE5B", drip: "#E8B637" },
  { id: "ungu", label: "Taro", base: "#B48AD1", drip: "#9A6BC0" },
];

export const TOPPING_OPTIONS: Array<SelectOption & { id: ToppingId }> = [
  { id: "random", label: "Random", price: 0 },
  { id: "freshFruit", label: "Fresh Fruit", price: 8000 },
  { id: "sprinkles", label: "Sprinkles", price: 4000 },
];

export const LILIN_OPTIONS: Array<SelectOption & { id: LilinId }> = [
  { id: "random", label: "Lilin Random", price: 0 },
  { id: "angkaGold", label: "Angka Gold", price: 6000 },
  { id: "hurufGold", label: "Huruf Gold", price: 6000 },
  { id: "spiral5", label: "Spiral isi 5", price: 10000 },
  { id: "angkaSilver", label: "Angka Silver", price: 6000 },
  { id: "hurufSilver", label: "Huruf Silver", price: 6000 },
];

export const TOPPER_PRICE_PER_PCS = 10000;
