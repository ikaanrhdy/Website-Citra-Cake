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

const initialFields: CakeCustomizationFields = {
  ukuran: null,
  layer: null,
  baseCake: null,
  tipeCream: null,
  warnaCream: null,
  referensi: { url: "", fileName: null },
  dekorasi: {
    topping: "random",
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

  setUkuran: (v: UkuranCm) =>
    set((s) => {
      const fields = { ...getFields(s), ukuran: v };
      return { ukuran: v, ...deriveFrom(fields) };
    }),

  setLayer: (v: LayerCount) =>
    set((s) => {
      const fields = { ...getFields(s), layer: v };
      return { layer: v, ...deriveFrom(fields) };
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

  setTopping: (v: ToppingId) =>
    set((s) => {
      const dekorasi = { ...s.dekorasi, topping: v };
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

  reset: () => set({ ...initialFields, ...deriveFrom(initialFields) }),
}));

// Biar semua komponen yang sebelumnya `import type { CakeCustomizationState } from "@/hooks/useCakeCustomization"` tetap jalan tanpa ubah import
export type { CakeCustomizationState } from "@/types/cake";
