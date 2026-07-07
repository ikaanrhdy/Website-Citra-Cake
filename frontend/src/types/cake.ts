export type UkuranCm = 12 | 18 | 20 | 25 | 30 | 35 | 40 | 45 | 50 | 55;
export type LayerCount = 1 | 2 | 3 | 4;

export interface SelectOption {
  id: string;
  label: string;
  price?: number;
}

export interface WarnaCreamOption extends SelectOption {
  base: string; // warna fill utama kue (hex)
  drip: string; // warna aksen drip/frosting (hex)
}

export type ToppingId = "random" | "freshFruit" | "sprinkles";

export type LilinId =
  | "random"
  | "angkaGold"
  | "hurufGold"
  | "spiral5"
  | "angkaSilver"
  | "hurufSilver";

export interface ReferensiCake {
  url: string;
  fileName: string | null;
}

export interface DekorasiState {
  topping: ToppingId;
  lilin: LilinId;
  lilinCatatan: string; // misal isi angka/huruf yang diminta
  lilinJumlah: number;
  topperAktif: boolean;
  topperNama: string;
  topperJumlah: number;
  dekorasiLainnya: string;
}

export interface CakeCustomizationFields {
  ukuran: UkuranCm | null;
  layer: LayerCount | null;
  baseCake: string | null;
  tipeCream: string | null;
  warnaCream: string | null;
  referensi: ReferensiCake;
  dekorasi: DekorasiState;
  ucapan: string;
  catatanPesanan: string;
}

export interface PriceBreakdown {
  hargaDasar: number;
  hargaLayer: number;
  hargaBaseCake: number;
  hargaDekorasi: number;
  total: number;
}

export interface PreviewSummary {
  layerLabel: string;
  baseCakeLabel: string;
  tipeCreamLabel: string;
  warnaCreamLabel: string;
}

export interface CakeCustomizationDerived {
  isValid: boolean;
  priceBreakdown: PriceBreakdown;
  previewSummary: PreviewSummary;
}

export interface CakeCustomizationActions {
  setUkuran: (v: UkuranCm) => void;
  setLayer: (v: LayerCount) => void;
  setBaseCake: (v: string) => void;
  setTipeCream: (v: string) => void;
  setWarnaCream: (v: string) => void;
  setReferensiUrl: (url: string) => void;
  setReferensiFile: (fileName: string | null) => void;
  setTopping: (v: ToppingId) => void;
  setLilin: (v: LilinId) => void;
  setLilinDetail: (catatan: string, jumlah: number) => void;
  toggleTopper: () => void;
  setTopperDetail: (nama: string, jumlah: number) => void;
  setDekorasiLainnya: (v: string) => void;
  setUcapan: (v: string) => void;
  setCatatanPesanan: (v: string) => void;
  reset: () => void;
}

export interface CakeCustomizationState
  extends
    CakeCustomizationFields,
    CakeCustomizationDerived,
    CakeCustomizationActions {}
