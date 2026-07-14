  // src/app/store/useOrderStore.ts
  import { create } from "zustand";
  import { product } from "@/data/product";
  import type { products } from "@/types/data";

  /* ================= TYPES ================= */

  export type OrderStatus =
    | "Belum Bayar"
    | "Diproses"
    | "Dikirim"
    | "Selesai"
    | "Pengembalian Selesai"
    | "Dibatalkan";

  export type ReturnOutcome = "Selesai" | "Dibatalkan" | "Ditolak";

  export interface TrackingStep {
    title: string;
    desc: string;
    date: string;
    iconKey: "truck" | "mapPin" | "packageCheck" | "home";
  }

  export interface ReturnDetail {
    id: string;
    reason: string;
    proofFile: File | null;
    proofPreview: string | null;
    note: string;
    createdAt: number;
    outcome: ReturnOutcome;
  }

  // Detail penilaian/review yg dikasih user buat order yg udah "Selesai"
  export interface PenilaianDetail {
    id: string;
    rating: number; // 1-5
    review: string;
    createdAt: number;
  }

  export interface Order {
    id: string;
    orderId: string;
    status: OrderStatus;
    product: products;
    qty: number;
    variant: string;
    alamat: string;
    nama: string;
    telepon: string;
    tanggalPemesanan: string;
    tanggalPengiriman: string;
    catatan: string;
    eta?: { date: string; time: string };
    tracking?: TrackingStep[];
    buktiUrl?: string;
    catatanUpload?: string;
    returnDetail?: ReturnDetail;
    penilaian?: PenilaianDetail;
  }

  interface OrderState {
    orders: Order[];

    // selectors
    getByStatus: (status: OrderStatus) => Order[];
    getByOrderId: (orderId: string) => Order | undefined;
    isReturned: (orderId: string) => boolean;
    getReturnDetail: (orderId: string) => ReturnDetail | undefined;
    isRated: (orderId: string) => boolean;
    getPenilaian: (orderId: string) => PenilaianDetail | undefined;

    // actions
    cancelOrder: (orderId: string) => void;
    updateStatus: (orderId: string, status: OrderStatus) => void;
    submitBuktiPembayaran: (
      orderId: string,
      payload: { buktiUrl?: string; catatan?: string },
    ) => void;
    requestReturn: (
      orderId: string,
      detail: Omit<ReturnDetail, "id" | "createdAt" | "outcome"> & {
        outcome?: ReturnOutcome;
      },
    ) => void;
    updateReturnOutcome: (orderId: string, outcome: ReturnOutcome) => void;
    submitPenilaian: (
      orderId: string,
      payload: { rating: number; review: string },
    ) => void;
  }

  /* ================= DUMMY DATA ================= */

  const defaultTracking: TrackingStep[] = [
    {
      title: "Sedang Diantar",
      desc: "Kurir sedang mengantarkan pesanan",
      date: "18 Des 2025 • 09:10",
      iconKey: "truck",
    },
    {
      title: "Tiba di Kota Tujuan",
      desc: "Paket tiba di gudang kota tujuan",
      date: "17 Des 2025 • 22:41",
      iconKey: "mapPin",
    },
    {
      title: "Diserahkan ke Kurir",
      desc: "Paket telah diserahkan ke ekspedisi",
      date: "17 Des 2025 • 11:02",
      iconKey: "packageCheck",
    },
    {
      title: "Dikemas",
      desc: "Penjual sedang menyiapkan pesanan",
      date: "17 Des 2025 • 09:30",
      iconKey: "home",
    },
  ];

  const baseOrder = (
    p: products,
    overrides: Partial<Order> & Pick<Order, "orderId" | "status">,
  ): Order => ({
    id: p.id,
    product: p,
    qty: 1,
    variant: "Putih, Merah",
    alamat: "Jl. Al-barokah, Desa Sidamulih",
    nama: "Budi Santoso",
    telepon: "081778899001",
    tanggalPemesanan: "8/4/2026",
    tanggalPengiriman: "10/4/2026",
    catatan: "Mohon dikirim pagi!",
    ...overrides,
  });

  const makeReturnDetail = (
    outcome: ReturnOutcome,
    reason: string,
  ): ReturnDetail => ({
    id: crypto.randomUUID(),
    reason,
    proofFile: null,
    proofPreview: null,
    note: "",
    createdAt: Date.now(),
    outcome,
  });

  const initialOrders: Order[] = [
    baseOrder(product[0], { orderId: "ORD004", status: "Belum Bayar" }),
    baseOrder(product[1], { orderId: "ORD005", status: "Diproses" }),
    baseOrder(product[2], {
      orderId: "ORD006",
      status: "Dikirim",
      eta: { date: "18 Des 2025", time: "18:00 - 21:00" },
      tracking: defaultTracking,
    }),
    ...product
      .slice(0, 5)
      .map((p, i) => baseOrder(p, { orderId: `ORD10${i}`, status: "Selesai" })),

    baseOrder(product[0], {
      orderId: "ORD200",
      status: "Pengembalian Selesai",
      returnDetail: makeReturnDetail("Selesai", "Produk tidak sesuai pesanan"),
    }),
    baseOrder(product[1], {
      orderId: "ORD201",
      status: "Pengembalian Selesai",
      returnDetail: makeReturnDetail("Dibatalkan", "Salah pilih varian"),
    }),
    baseOrder(product[2], {
      orderId: "ORD202",
      status: "Pengembalian Selesai",
      returnDetail: makeReturnDetail("Ditolak", "Bukti kerusakan tidak jelas"),
    }),

    ...product.slice(0, 5).map((p, i) =>
      baseOrder(p, {
        orderId: `ORD30${i}`,
        status: "Dibatalkan",
      }),
    ),
  ];

  /* ================= STORE ================= */

  export const useOrderStore = create<OrderState>((set, get) => ({
    orders: initialOrders,

    /* ---------- selectors ---------- */

    getByStatus: (status) => get().orders.filter((o) => o.status === status),

    getByOrderId: (orderId) => get().orders.find((o) => o.orderId === orderId),

    isReturned: (orderId) => {
      const order = get().orders.find((o) => o.orderId === orderId);
      return !!order?.returnDetail;
    },

    getReturnDetail: (orderId) =>
      get().orders.find((o) => o.orderId === orderId)?.returnDetail,

    isRated: (orderId) => {
      const order = get().orders.find((o) => o.orderId === orderId);
      return !!order?.penilaian;
    },

    getPenilaian: (orderId) =>
      get().orders.find((o) => o.orderId === orderId)?.penilaian,

    /* ---------- actions ---------- */

    cancelOrder: (orderId) =>
      set((state) => ({
        orders: state.orders.map((o) =>
          o.orderId === orderId ? { ...o, status: "Dibatalkan" } : o,
        ),
      })),

    updateStatus: (orderId, status) =>
      set((state) => ({
        orders: state.orders.map((o) =>
          o.orderId === orderId ? { ...o, status } : o,
        ),
      })),

    submitBuktiPembayaran: (orderId, payload) =>
      set((state) => ({
        orders: state.orders.map((o) =>
          o.orderId === orderId
            ? {
                ...o,
                status: "Diproses",
                buktiUrl: payload.buktiUrl,
                catatanUpload: payload.catatan,
              }
            : o,
        ),
      })),

    requestReturn: (orderId, detail) =>
      set((state) => ({
        orders: state.orders.map((o) =>
          o.orderId === orderId
            ? {
                ...o,
                status: "Pengembalian Selesai",
                returnDetail: {
                  ...detail,
                  id: crypto.randomUUID(),
                  createdAt: Date.now(),
                  outcome: detail.outcome ?? "Selesai",
                },
              }
            : o,
        ),
      })),

    updateReturnOutcome: (orderId, outcome) =>
      set((state) => ({
        orders: state.orders.map((o) =>
          o.orderId === orderId && o.returnDetail
            ? { ...o, returnDetail: { ...o.returnDetail, outcome } }
            : o,
        ),
      })),

    submitPenilaian: (orderId, payload) =>
      set((state) => ({
        orders: state.orders.map((o) =>
          o.orderId === orderId
            ? {
                ...o,
                penilaian: {
                  id: crypto.randomUUID(),
                  rating: payload.rating,
                  review: payload.review,
                  createdAt: Date.now(),
                },
              }
            : o,
        ),
      })),
  }));
