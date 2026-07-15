import { create } from "zustand";
import type {
  CakeCustomizationState,
  CakeCustomizationFields,
  UkuranCm,
  LayerCount,
  ToppingId,
  LilinId,
} from "@/types/cake";
import {
  calculatePriceBreakdown,
  isCakeCustomizationValid,
} from "@/data/cake/pricingCake";
import { getPreviewSummary } from "@/data/cake/summaryCake";

// Store ini cuma bertugas nyimpen state & manggil logic dari lib/cake.
// Nggak ada kalkulasi harga / validasi yang ditulis langsung di sini.

// PENTING: `ukuran` array, satu slot per layer (index 0 = Layer 1, dst).
// PENTING: `dekorasi.toppingCatatan` diisi user waktu topping = "random".
const initialFields: CakeCustomizationFields = {
  ukuran: [null],
  layer: null,
  baseCake: null,
  tipeCream: null,
  warnaCream: null,
  referensi: { url: "", fileName: null },
  dekorasi: {
    topping: "random",
    toppingCatatan: "",
    lilin: "random",
    lilinCatatan: "",
    lilinJumlah: 1,
    topperAktif: false,
    topperNama: "",
    topperJumlah: 0,
    dekorasiLainnya: "",
  },
  ucapan: "",
  catatanPesanan: "",
};

function deriveFrom(fields: CakeCustomizationFields) {
  return {
    isValid: isCakeCustomizationValid(fields),
    priceBreakdown: calculatePriceBreakdown(fields),
    previewSummary: getPreviewSummary(fields),
  };
}

function getFields(s: CakeCustomizationState): CakeCustomizationFields {
  return {
    ukuran: s.ukuran,
    layer: s.layer,
    baseCake: s.baseCake,
    tipeCream: s.tipeCream,
    warnaCream: s.warnaCream,
    referensi: s.referensi,
    dekorasi: s.dekorasi,
    ucapan: s.ucapan,
    catatanPesanan: s.catatanPesanan,
  };
}

export const useCakeCustomization = create<CakeCustomizationState>((set) => ({
  ...initialFields,
  ...deriveFrom(initialFields),

  // v diisi per-index (per layer)
  setUkuran: (index: number, v: UkuranCm) =>
    set((s) => {
      const ukuran = [...s.ukuran];
      ukuran[index] = v;
      const fields = { ...getFields(s), ukuran };
      return { ukuran, ...deriveFrom(fields) };
    }),

  setLayer: (v: LayerCount) =>
    set((s) => {
      // Pertahankan ukuran yang udah dipilih di slot yang masih ada,
      // slot baru (kalau nambah layer) diisi null dulu
      const ukuran = Array.from({ length: v }, (_, i) => s.ukuran[i] ?? null);
      const fields = { ...getFields(s), layer: v, ukuran };
      return { layer: v, ukuran, ...deriveFrom(fields) };
    }),

  setBaseCake: (v: string) =>
    set((s) => {
      const fields = { ...getFields(s), baseCake: v };
      return { baseCake: v, ...deriveFrom(fields) };
    }),

  setTipeCream: (v: string) =>
    set((s) => {
      const fields = { ...getFields(s), tipeCream: v };
      return { tipeCream: v, ...deriveFrom(fields) };
    }),

  setWarnaCream: (v: string) =>
    set((s) => {
      const fields = { ...getFields(s), warnaCream: v };
      return { warnaCream: v, ...deriveFrom(fields) };
    }),

  setReferensiUrl: (url: string) =>
    set((s) => {
      const referensi = { ...s.referensi, url };
      const fields = { ...getFields(s), referensi };
      return { referensi, ...deriveFrom(fields) };
    }),

  setReferensiFile: (fileName: string | null) =>
    set((s) => {
      const referensi = { ...s.referensi, fileName };
      const fields = { ...getFields(s), referensi };
      return { referensi, ...deriveFrom(fields) };
    }),

  // Kalau pindah dari "random" ke topping lain, catatan otomatis dikosongin
  setTopping: (v: ToppingId) =>
    set((s) => {
      const dekorasi = {
        ...s.dekorasi,
        topping: v,
        toppingCatatan: v === "random" ? s.dekorasi.toppingCatatan : "",
      };
      const fields = { ...getFields(s), dekorasi };
      return { dekorasi, ...deriveFrom(fields) };
    }),

  setToppingCatatan: (v: string) =>
    set((s) => {
      const dekorasi = { ...s.dekorasi, toppingCatatan: v };
      const fields = { ...getFields(s), dekorasi };
      return { dekorasi, ...deriveFrom(fields) };
    }),

  setLilin: (v: LilinId) =>
    set((s) => {
      const dekorasi = { ...s.dekorasi, lilin: v };
      const fields = { ...getFields(s), dekorasi };
      return { dekorasi, ...deriveFrom(fields) };
    }),

  setLilinDetail: (catatan: string, jumlah: number) =>
    set((s) => {
      const dekorasi = {
        ...s.dekorasi,
        lilinCatatan: catatan,
        lilinJumlah: jumlah,
      };
      const fields = { ...getFields(s), dekorasi };
      return { dekorasi, ...deriveFrom(fields) };
    }),

  toggleTopper: () =>
    set((s) => {
      const dekorasi = { ...s.dekorasi, topperAktif: !s.dekorasi.topperAktif };
      const fields = { ...getFields(s), dekorasi };
      return { dekorasi, ...deriveFrom(fields) };
    }),

  setTopperDetail: (nama: string, jumlah: number) =>
    set((s) => {
      const dekorasi = {
        ...s.dekorasi,
        topperNama: nama,
        topperJumlah: jumlah,
      };
      const fields = { ...getFields(s), dekorasi };
      return { dekorasi, ...deriveFrom(fields) };
    }),

  setDekorasiLainnya: (v: string) =>
    set((s) => {
      const dekorasi = { ...s.dekorasi, dekorasiLainnya: v };
      const fields = { ...getFields(s), dekorasi };
      return { dekorasi, ...deriveFrom(fields) };
    }),

  setUcapan: (v: string) =>
    set((s) => {
      const fields = { ...getFields(s), ucapan: v };
      return { ucapan: v, ...deriveFrom(fields) };
    }),

  setCatatanPesanan: (v: string) =>
    set((s) => {
      const fields = { ...getFields(s), catatanPesanan: v };
      return { catatanPesanan: v, ...deriveFrom(fields) };
    }),

  reset: () =>
    set({
      ...initialFields,
      ...deriveFrom(initialFields),
    }),
}));
