import type { ComponentType, SVGProps } from "react";

export type IconType = ComponentType<SVGProps<SVGSVGElement>>;

export type OrderStatusKey =
  | "Menunggu"
  | "Diproses"
  | "Dikirim"
  | "Sampai"
  | "Selesai"
  | "Dibatalkan"
  | "Dikembalikan";

export interface OrderItemAdmin {
  productId?: string; // ref ke productsAdmin.id, dipakai buat ambil image/price/size
  name: string;
  qty: number;
  price?: number; // override manual kalau perlu (misal harga saat itu beda dari master)
  image?: string; // override manual kalau perlu
  ukuran?: string; // override manual kalau perlu
}

export interface ActionButtonAdmin {
  label: string;
  icon: IconType;
  textClass: string;
  bgClass: string;
  borderClass: string;
}

export interface OrderTimelineInfo {
  icon: IconType;
  title: string;
  time: string;
  description: string;
  textClass: string;
  bgClass: string;
  borderClass: string;
}

// Sama polanya kayak RefundRequestInfo, tapi buat pengajuan pembatalan pesanan
export interface CancelRequestInfo {
  status: "menunggu" | "ditolak" | "diterima";
  diajukan: string; // tanggal & waktu pengajuan pembatalan
  alasan: string;
  catatanPembeli?: string;
  direview?: string;
  catatanAdmin?: string;
}

export interface OrderAdmin {
  id: string;
  date: string;
  status: OrderStatusKey;
  total: string; // format "Rp 330.000"
  totalValue: number; // angka mentah, dipakai buat hitung omset
  isCustom?: boolean;
  customer: {
    name: string;
    phone: string;
  };
  delivery: {
    date: string;
  };
  alamat?: string;
  items?: OrderItemAdmin[];
  customDesc?: string;
  variantInfo?: string;
  note?: string;
  statusInfo?: string;
  timeline?: OrderTimelineInfo;
  actions: ActionButtonAdmin[];
  refundRequest?: RefundRequestInfo;
  cancelRequest?: CancelRequestInfo;
  subtotalPengiriman?: number;
  biayaLayanan?: number;
}

// dashboard-only types
export interface DashboardStat {
  title: string;
  value: string;
  icon: IconType;
  color: string;
  bg: string;
}

export interface SalesPoint {
  date: string;
  value: number;
}

export interface RefundRequestInfo {
  status: "menunggu" | "ditolak" | "disetujui";
  diajukan: string;
  alasan: string;
  catatanPembeli?: string;
  direview?: string;
  catatanAdmin?: string;
}
