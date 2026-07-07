import {
  TrendingUp,
  ShoppingBag,
  Clock,
  Truck,
  Package,
  CircleX,
  CheckCircle,
} from "lucide-react";
import type {
  DashboardStat,
  BadgeData,
  Order,
  StatusKey,
  ActionButton,
  SalesPoint,
} from "@/types/dashboard";

// ================= STATUS CONFIG =================
export const statusConfig: Record<
  StatusKey,
  {
    label: string;
    icon: ActionButton["icon"];
    textClass: string;
    bgClass: string;
    borderClass: string;
  }
> = {
  Menunggu: {
    label: "Menunggu",
    icon: Clock,
    textClass: "text-orange-600",
    bgClass: "bg-orange-100",
    borderClass: "border-orange-300",
  },
  Diproses: {
    label: "Diproses",
    icon: Package,
    textClass: "text-blue-600",
    bgClass: "bg-blue-100",
    borderClass: "border-blue-300",
  },
  Dikirim: {
    label: "Dikirim",
    icon: Truck,
    textClass: "text-purple-600",
    bgClass: "bg-purple-100",
    borderClass: "border-purple-300",
  },
  Sampai: {
    label: "Sampai",
    icon: CheckCircle,
    textClass: "text-blue-600",
    bgClass: "bg-blue-100",
    borderClass: "border-blue-300",
  },
  Selesai: {
    label: "Selesai",
    icon: CheckCircle,
    textClass: "text-green-700",
    bgClass: "bg-green-100",
    borderClass: "border-green-300",
  },
  Dibatalkan: {
    label: "Dibatalkan",
    icon: CircleX,
    textClass: "text-red-600",
    bgClass: "bg-red-100",
    borderClass: "border-red-300",
  },
  Dikembalikan: {
    label: "Dikembalikan",
    icon: CircleX,
    textClass: "text-orange-700",
    bgClass: "bg-orange-100",
    borderClass: "border-orange-300",
  },
};

// ================= ACTION BUTTONS CONFIG =================
export const actionButtons: Record<string, ActionButton> = {
  Proses: {
    label: "Proses",
    icon: Package,
    textClass: "text-blue-600",
    bgClass: "bg-blue-50",
    borderClass: "border-blue-200",
  },
  Dikirim: {
    label: "Dikirim",
    icon: Truck,
    textClass: "text-purple-600",
    bgClass: "bg-purple-50",
    borderClass: "border-purple-200",
  },
  Sampai: {
    label: "Sampai",
    icon: CheckCircle,
    textClass: "text-blue-600",
    bgClass: "bg-blue-50",
    borderClass: "border-blue-200",
  },
  Tolak: {
    label: "Tolak",
    icon: CircleX,
    textClass: "text-red-500",
    bgClass: "bg-red-50",
    borderClass: "border-red-200",
  },
};

// ================= DATA DUMMY =================
export const dashboardStats: DashboardStat[] = [
  {
    title: "Omset Bulan Ini",
    value: "Rp 1.345.000",
    icon: TrendingUp,
    color: "text-green-700",
    bg: "bg-green-500/20",
  },
  {
    title: "Pesanan Aktif",
    value: "3",
    icon: ShoppingBag,
    color: "text-blue-700",
    bg: "bg-blue-500/20",
  },
];

export const badgeData: BadgeData[] = [
  {
    name: "Diproses",
    count: 0,
    textClass: "text-blue-700",
    bgClass: "bg-blue-300/10",
    borderClass: "border-blue-400",
  },
  {
    name: "Dikirim",
    count: 1,
    textClass: "text-purple-700",
    bgClass: "bg-purple-300/10",
    borderClass: "border-purple-400",
  },
  {
    name: "Selesai",
    count: 1,
    textClass: "text-green-700",
    bgClass: "bg-green-300/10",
    borderClass: "border-green-400",
  },
  {
    name: "Dibatalkan",
    count: 0,
    textClass: "text-red-700",
    bgClass: "bg-red-300/20",
    borderClass: "border-red-400",
  },
  {
    name: "Dikembalikan",
    count: 0,
    textClass: "text-orange-700",
    bgClass: "bg-orange-300/20",
    borderClass: "border-orange-400",
  },
];

export const orders: Order[] = [
  {
    id: "ORD004",
    date: "8/2/2026",
    status: "Menunggu",
    total: "Rp 330.000",
    customer: { name: "Budi Santoso", phone: "081778899001" },
    delivery: { date: "12/4/2026" },
    items: [
      { name: "Black Forest Cake", qty: 1 },
      { name: "Chocolate Brownies", qty: 2 },
    ],
    note: "Mohon dikirim pagi hari",
    statusInfo: "Pesanan Menunggu - konfirmasi Pembayaran oleh pembeli",
    actions: [actionButtons.Proses, actionButtons.Tolak],
  },
  {
    id: "ORD004",
    date: "8/2/2026",
    status: "Diproses",
    total: "Rp 330.000",
    isCustom: true,
    customer: { name: "Budi Santoso", phone: "081223344556" },
    delivery: { date: "10/4/2026" },
    customDesc:
      "Ukuran: Small (20cm) | Base Cake: Vanila | Tulisan: Welcome Baby Boy | Desain: Baby shower theme biru",
    note: "Mohon dikirim pagi hari",
    actions: [
      actionButtons.Proses,
      actionButtons.Dikirim,
      actionButtons.Sampai,
    ],
  },
  {
    id: "ORD001",
    date: "8/2/2026",
    status: "Dikirim",
    total: "Rp 330.000",
    customer: { name: "Budi Santoso", phone: "081223344556" },
    delivery: { date: "10/4/2026" },
    items: [
      { name: "Black Forest Cake", qty: 1 },
      { name: "Chocolate Brownies", qty: 2 },
    ],
    note: "Mohon dikirim pagi hari",
    statusInfo: "Pesanan Dikirim - Pesanan sedang menuju alamat pembeli",
    actions: [actionButtons.Dikirim, actionButtons.Sampai],
  },
];

// dummy 30 hari data penjualan (cuma dipakai owner)
export const salesData: SalesPoint[] = [
  { date: "10/1", value: 380000 },
  { date: "12/1", value: 720000 },
  { date: "14/1", value: 250000 },
  { date: "16/1", value: 640000 },
  { date: "18/1", value: 420000 },
  { date: "20/1", value: 600000 },
  { date: "22/1", value: 230000 },
  { date: "24/1", value: 480000 },
  { date: "26/1", value: 200000 },
  { date: "28/1", value: 650000 },
  { date: "30/1", value: 280000 },
  { date: "2/2", value: 700000 },
  { date: "5/2", value: 310000 },
  { date: "8/2", value: 410000 },
];