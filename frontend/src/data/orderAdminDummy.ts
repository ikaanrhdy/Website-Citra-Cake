import {
  Clock,
  Truck,
  Package,
  CircleX,
  CheckCircle,
  Upload,
  ThumbsUp,
  Eye,
} from "lucide-react";
import type {
  OrderStatusKey,
  ActionButtonAdmin,
  OrderAdmin,
} from "@/types/orderAdmin";

// ================= STATUS CONFIG =================
export const statusConfig: Record<
  OrderStatusKey,
  {
    label: string;
    icon: ActionButtonAdmin["icon"];
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
export const actionButtons: Record<string, ActionButtonAdmin> = {
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
  UploadBukti: {
    label: "Upload Bukti",
    icon: Upload,
    textClass: "text-gray-700",
    bgClass: "bg-white",
    borderClass: "border-gray-300",
  },
  Selesai: {
    label: "Selesai",
    icon: CheckCircle,
    textClass: "text-white",
    bgClass: "bg-primary",
    borderClass: "border-primary",
  },
  Terima: {
    label: "Terima",
    icon: ThumbsUp,
    textClass: "text-blue-600",
    bgClass: "bg-blue-50",
    borderClass: "border-blue-200",
  },
  Kembalikan: {
    label: "Kembalikan",
    icon: CircleX,
    textClass: "text-orange-600",
    bgClass: "bg-orange-50",
    borderClass: "border-orange-200",
  },
  ReviewPengajuan: {
    label: "Review Pengajuan",
    icon: Eye,
    textClass: "text-white",
    bgClass: "bg-orange-500",
    borderClass: "border-orange-500",
  },
};

// urutan status yang dipakai buat render grid badge (dashboard & order page sama-sama pakai ini)
export const STATUS_LIST: OrderStatusKey[] = [
  "Menunggu",
  "Diproses",
  "Dikirim",
  "Sampai",
  "Selesai",
  "Dibatalkan",
  "Dikembalikan",
];

// ================= DATA DUMMY ORDERS (satu-satunya source) =================
// NOTE: productId di-mapping ke id di productAdmin.ts
// "1" = Black Forest Cake, "2" = Red Velvet Cake, "3" = Brownies
// "Chocolate Brownies" di-map sementara ke id "3" (Brownies) - cek lagi apa emang produk yang sama
// "Tiramisu Cake" belum ada di productAdmin.ts, jadi belum ada productId-nya
export const ordersAdmin: OrderAdmin[] = [
  {
    id: "ORD001",
    date: "8/2/2026",
    status: "Menunggu",
    total: "Rp 330.000",
    totalValue: 330000,
    customer: { name: "Budi Santoso", phone: "081223344556" },
    delivery: { date: "10/4/2026" },
    items: [
      { name: "Black Forest Cake", qty: 1, productId: "1" },
      { name: "Chocolate Brownies", qty: 2, productId: "3" },
    ],
    note: "Mohon dikirim pagi hari",
    statusInfo: "Pesanan Menunggu - konfirmasi Pembayaran oleh pembeli",
    actions: [actionButtons.Proses, actionButtons.Tolak],
  },
  {
    id: "ORD002",
    date: "8/2/2026",
    status: "Diproses",
    total: "Rp 330.000",
    totalValue: 330000,
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
    id: "ORD003",
    date: "8/2/2026",
    status: "Dikirim",
    total: "Rp 330.000",
    totalValue: 330000,
    customer: { name: "Budi Santoso", phone: "081223344556" },
    delivery: { date: "10/4/2026" },
    items: [
      { name: "Black Forest Cake", qty: 1, productId: "1" },
      { name: "Chocolate Brownies", qty: 2, productId: "3" },
    ],
    note: "Mohon dikirim pagi hari",
    statusInfo: "Pesanan Dikirim - Pesanan sedang menuju alamat pembeli",
    actions: [actionButtons.Dikirim, actionButtons.Sampai],
  },
  {
    id: "ORD004",
    date: "7/2/2026",
    status: "Sampai",
    total: "Rp 200.000",
    totalValue: 200000,
    customer: { name: "Siti Aminah", phone: "081223344556" },
    delivery: { date: "8/2/2026" },
    items: [{ name: "Red Velvet Cake", qty: 1, productId: "2" }],
    timeline: {
      icon: CheckCircle,
      title: "Pesanan Sudah Sampai",
      time: "8/2/2026, 14.52.17",
      description: "Menunggu konfirmasi dari pembeli...",
      textClass: "text-blue-700",
      bgClass: "bg-blue-50",
      borderClass: "border-blue-200",
    },
    statusInfo: "Pesanan sampai - Menunggu konfirmasi oleh pembeli",
    actions: [actionButtons.UploadBukti, actionButtons.Selesai],
  },
  {
    id: "ORD005",
    date: "3/2/2026",
    status: "Selesai",
    total: "Rp 560.000",
    totalValue: 560000,
    customer: { name: "Dewi Lestari", phone: "081990011223" },
    delivery: { date: "10/4/2026" },
    items: [
      { name: "Black Forest Cake", qty: 2, productId: "1" },
      { name: "Red Velvet Cake", qty: 1, productId: "2" },
    ],
    timeline: {
      icon: CheckCircle,
      title: "Pesanan Selesai",
      time: "8/2/2026, 14.52.17",
      description: "Pesanan sudah sampai dan diterima...",
      textClass: "text-green-700",
      bgClass: "bg-green-50",
      borderClass: "border-green-200",
    },
    statusInfo: "Pesanan selesai - Pembeli sudah konfirmasi",
    actions: [],
  },

  // ============= DIBATALKAN — Menunggu Review =============
  {
    id: "ORD006",
    date: "3/2/2026",
    status: "Dibatalkan",
    total: "Rp 560.000",
    totalValue: 560000,
    customer: { name: "Dewi Lestari", phone: "081990011223" },
    delivery: { date: "9/4/2026" },
    items: [
      { name: "Black Forest Cake", qty: 2, productId: "1" },
      { name: "Red Velvet Cake", qty: 1, productId: "2" },
    ],
    variantInfo: "Ukuran: Small (20cm) | Varian: Classic",
    cancelRequest: {
      status: "menunggu",
      diajukan: "6/4/2026, 00.58.51",
      alasan: "Berubah pikiran, sudah pesan di tempat lain",
    },
    statusInfo: "Permintaan pembatalan oleh pembeli",
    actions: [actionButtons.Terima, actionButtons.Tolak],
  },

  // ============= DIBATALKAN — Ditolak =============
  {
    id: "ORD007",
    date: "4/2/2026",
    status: "Dibatalkan",
    total: "Rp 400.000",
    totalValue: 400000,
    customer: { name: "Rina Marlina", phone: "081556677889" },
    delivery: { date: "7/4/2026" },
    items: [{ name: "Black Forest Cake", qty: 2, productId: "1" }],
    variantInfo: "Ukuran: Medium (25cm) | Varian: Original",
    cancelRequest: {
      status: "ditolak",
      diajukan: "13/4/2026, 00.58.51",
      alasan: "Berubah pikiran, sudah pesan di tempat lain",
      direview: "13/4/2026, 09.20.00",
      catatanAdmin:
        "Maaf, pembatalan tidak dapat diproses karena pesanan sudah masuk tahap produksi.",
    },
    statusInfo: "Permintaan pembatalan ditolak",
    actions: [],
  },

  // ============= DIBATALKAN — Diterima =============
  {
    id: "ORD008",
    date: "2/2/2026",
    status: "Dibatalkan",
    total: "Rp 275.000",
    totalValue: 275000,
    customer: { name: "Hendra Gunawan", phone: "081667788990" },
    delivery: { date: "5/4/2026" },
    items: [{ name: "Red Velvet Cake", qty: 1, productId: "2" }],
    variantInfo: "Ukuran: Small (20cm) | Varian: Classic",
    cancelRequest: {
      status: "diterima",
      diajukan: "13/4/2026, 00.58.51",
      alasan: "Salah pilih tanggal pengiriman",
      direview: "13/4/2026, 10.05.00",
      catatanAdmin:
        "Disetujui. Pesanan dibatalkan dan dana akan dikembalikan dalam 3-5 hari kerja.",
    },
    statusInfo: "Permintaan pembatalan diterima - pesanan dibatalkan",
    actions: [],
  },

  // ============= DIKEMBALIKAN — Menunggu Review =============
  {
    id: "ORD009",
    date: "3/2/2026",
    status: "Dikembalikan",
    total: "Rp 560.000",
    totalValue: 560000,
    customer: { name: "Dewi Lestari", phone: "081334455221" },
    delivery: { date: "6/4/2026" },
    variantInfo: "Varian: Dark Chocolate",
    items: [
      { name: "Black Forest Cake", qty: 2, productId: "1" },
      { name: "Red Velvet Cake", qty: 1, productId: "2" },
    ],
    refundRequest: {
      status: "menunggu",
      diajukan: "9/6/2026, 06.46.05",
      alasan: "Produk tidak sesuai",
      catatanPembeli:
        "Brownies keras dan tidak sesuai ekspektasi. Sepertinya sudah basi.",
    },
    statusInfo: "Permintaan pengembalian dana oleh pembeli",
    actions: [
      actionButtons.ReviewPengajuan,
      actionButtons.Tolak,
      actionButtons.Kembalikan,
    ],
  },

  // ============= DIKEMBALIKAN — Ditolak =============
  {
    id: "ORD010",
    date: "3/2/2026",
    status: "Dikembalikan",
    total: "Rp 560.000",
    totalValue: 560000,
    customer: { name: "Dewi Lestari", phone: "081334455221" },
    delivery: { date: "6/4/2026" },
    variantInfo: "Varian: Dark Chocolate",
    items: [
      { name: "Black Forest Cake", qty: 2, productId: "1" },
      { name: "Red Velvet Cake", qty: 1, productId: "2" },
    ],
    refundRequest: {
      status: "ditolak",
      diajukan: "8/6/2026, 04.46.05",
      alasan: "Berubah pikiran",
      catatanPembeli: "Saya pikir suka rasanya, mau refund",
      direview: "8/6/2026, 10.46.05",
      catatanAdmin:
        "Maaf, pengembalian dana tidak dapat diproses karena produk sudah diterima dalam kondisi baik dan alasan tidak sesuai kebijakan pengembalian kami.",
    },
    statusInfo: "Permintaan pengembalian dana ditolak",
    actions: [actionButtons.Tolak],
  },

  // ============= DIKEMBALIKAN — Disetujui =============
  {
    id: "ORD011",
    date: "3/2/2026",
    status: "Dikembalikan",
    total: "Rp 560.000",
    totalValue: 560000,
    customer: { name: "Dewi Lestari", phone: "081334455221" },
    delivery: { date: "6/4/2026" },
    variantInfo: "Varian: Dark Chocolate",
    items: [
      { name: "Black Forest Cake", qty: 2, productId: "1" },
      { name: "Red Velvet Cake", qty: 1, productId: "2" },
    ],
    refundRequest: {
      status: "disetujui",
      diajukan: "7/6/2026, 16.46.05",
      alasan: "Kue rusak saat pengiriman",
      catatanPembeli:
        "Kue datang dalam kondisi rusak, cream berantakan dan bentuk tidak utuh.",
      direview: "8/6/2026, 00.46.05",
      catatanAdmin:
        "Disetujui. Mohon maaf atas ketidaknyamanannya. Dana akan dikembalikan dalam 3-5 hari kerja.",
    },
    statusInfo: "Permintaan pengembalian dana disetujui",
    actions: [actionButtons.Kembalikan],
  },

  {
    id: "ORD012",
    date: "5/2/2026",
    status: "Dikembalikan",
    total: "Rp 150.000",
    totalValue: 150000,
    customer: { name: "Andi Wijaya", phone: "081334455667" },
    delivery: { date: "6/2/2026" },
    // "Tiramisu Cake" belum ada di productAdmin.ts, belum bisa di-mapping ke productId
    items: [{ name: "Tiramisu Cake", qty: 1 }],
    statusInfo: "Dana telah dikembalikan ke pembeli",
    actions: [],
  },
];

// dummy 30 hari data penjualan (cuma dipakai owner di dashboard, bukan dari order)
export const salesData = [
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
