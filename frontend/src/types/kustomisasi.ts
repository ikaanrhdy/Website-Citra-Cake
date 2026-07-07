export type KustomisasiTab =
  | "Base Cake"
  | "Tipe Cream"
  | "Warna Cream"
  | "Layer"
  | "Ukuran"
  | "Topping"
  | "Lilin"
  | "Topper";

export type KustomisasiStatus = "Tersedia" | "Habis";

export interface KustomisasiItem {
  id: string;
  nama: string;
  harga: number | null; // null = Gratis
  status: KustomisasiStatus;
  warna?: string; // khusus tab "Warna Cream", format hex
}

// item dekorasi yang sudah dipilih user beserta qty & subtotal
export interface SelectedDekorasiItem {
  id: string;
  nama: string;
  harga: number;
  qty: number;
}

// state lengkap satu kustomisasi kue yang sedang dibuat user
export interface CakeCustomization {
  ukuran: KustomisasiItem | null;
  layer: number;
  baseCake: KustomisasiItem | null;
  tipeCream: KustomisasiItem | null;
  warnaCream: KustomisasiItem | null;
  referensiMode: "url" | "upload";
  referensiUrl: string;
  referensiFile: File | null;
  referensiPreview: string | null;
  toppingId: string | null;
  toppingQty: number;
  lilinId: string | null;
  lilinAngka: string;
  lilinQty: number;
  topperNama: string;
  topperQty: number;
  dekorasiLainnya: string;
  ucapan: string;
  catatan: string;
}
