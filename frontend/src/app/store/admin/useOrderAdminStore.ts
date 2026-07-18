import { create } from "zustand";
import { ordersAdmin, actionButtons } from "@/data/orderAdminDummy";
import type { OrderAdmin, OrderStatusKey } from "@/types/orderAdmin";
import { ACTIVE_ORDER_STATUSES } from "@/constants/orderAdmin";

// Aksi apa saja yang tersedia setelah order berada di status tertentu.
// Dipakai supaya tombol aksi otomatis ter-update tiap kali status berubah,
// bukan cuma disimpan statis dari data dummy awal.
const getActionsForStatus = (status: OrderStatusKey) => {
  switch (status) {
    case "Menunggu":
      return [actionButtons.Proses, actionButtons.Tolak];
    case "Diproses":
      return [actionButtons.Dikirim, actionButtons.Sampai];
    case "Dikirim":
      return [actionButtons.Sampai];
    case "Sampai":
      return [actionButtons.UploadBukti, actionButtons.Selesai];
    case "Selesai":
    case "Dibatalkan":
    case "Dikembalikan":
    default:
      return [];
  }
};

const nowId = () =>
  new Date().toLocaleString("id-ID", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

interface OrderStoreState {
  orders: OrderAdmin[];
  search: string;
  activeStatus: OrderStatusKey | null;
  activeOnly: boolean; // true = masuk dari kartu "Pesanan Aktif" di dashboard
}

interface OrderStore extends OrderStoreState {
  setSearch: (value: string) => void;
  setActiveStatus: (status: OrderStatusKey | null) => void;
  setActiveOnly: (value: boolean) => void;

  // Alur status pesanan biasa (Menunggu -> Diproses -> Dikirim -> Sampai -> Selesai,
  // atau Menunggu -> Dibatalkan kalau ditolak admin).
  // Mengembalikan true kalau berhasil, false kalau ditolak (mis. mau "Selesai"
  // tapi belum upload bukti sampai).
  updateOrderStatus: (id: string, status: OrderStatusKey) => boolean;

  // Simpan bukti foto + catatan saat paket sudah sampai. Wajib dipanggil
  // sebelum order boleh ditandai "Selesai".
  uploadBuktiSampai: (
    id: string,
    data: { fotoUrl: string; catatan?: string },
  ) => void;

  // Keputusan admin atas pengajuan pembatalan (cancelRequest) dari pembeli
  resolveCancelRequest: (
    id: string,
    decision: "diterima" | "ditolak",
    catatanAdmin?: string,
  ) => void;

  // Keputusan admin atas pengajuan pengembalian dana (refundRequest) dari pembeli
  resolveRefundRequest: (
    id: string,
    decision: "disetujui" | "ditolak",
    catatanAdmin?: string,
  ) => void;

  // Finalisasi setelah refund disetujui: dana sudah benar-benar dikembalikan
  finalizeRefund: (id: string) => void;

  getFilteredOrders: () => OrderAdmin[];
  getStatusCount: (status: OrderStatusKey) => number;
  getActiveOrdersCount: () => number;
  getMonthlyRevenue: () => number;
  getRecentOrders: (limit?: number) => OrderAdmin[];
}

const useOrderAdminStore = create<OrderStore>((set, get) => ({
  orders: ordersAdmin,
  search: "",
  activeStatus: null,
  activeOnly: false,

  setSearch: (search) => set({ search }),

  // pilih status biasa -> keluar dari mode "aktif saja"
  setActiveStatus: (activeStatus) => set({ activeStatus, activeOnly: false }),

  // masuk mode "aktif saja" -> reset filter status biasa
  setActiveOnly: (activeOnly) => set({ activeOnly, activeStatus: null }),

  updateOrderStatus: (id, status) => {
    const order = get().orders.find((o) => o.id === id);
    if (!order) return false;

    // PROTEKSI: order yang masih "Sampai" tidak boleh langsung ditandai
    // "Selesai" sebelum bukti sampai (foto) diupload admin.
    if (status === "Selesai" && !order.buktiSampai) {
      return false;
    }

    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === id
          ? { ...o, status, actions: getActionsForStatus(status) }
          : o,
      ),
    }));
    return true;
  },

  uploadBuktiSampai: (id, data) =>
    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === id
          ? {
              ...o,
              buktiSampai: {
                fotoUrl: data.fotoUrl,
                catatan: data.catatan,
                uploadedAt: nowId(),
              },
            }
          : o,
      ),
    })),

  resolveCancelRequest: (id, decision, catatanAdmin) =>
    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === id && o.cancelRequest
          ? {
              ...o,
              cancelRequest: {
                ...o.cancelRequest,
                status: decision,
                direview: nowId(),
                catatanAdmin,
              },
              statusInfo:
                decision === "diterima"
                  ? "Permintaan pembatalan diterima - pesanan dibatalkan"
                  : "Permintaan pembatalan ditolak",
              actions: [],
            }
          : o,
      ),
    })),

  resolveRefundRequest: (id, decision, catatanAdmin) =>
    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === id && o.refundRequest
          ? {
              ...o,
              refundRequest: {
                ...o.refundRequest,
                status: decision,
                direview: nowId(),
                catatanAdmin,
              },
              statusInfo:
                decision === "disetujui"
                  ? "Permintaan pengembalian dana disetujui"
                  : "Permintaan pengembalian dana ditolak",
              actions:
                decision === "disetujui" ? [actionButtons.Kembalikan] : [],
            }
          : o,
      ),
    })),

  finalizeRefund: (id) =>
    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === id
          ? {
              ...o,
              refundRequest: undefined,
              statusInfo: "Dana telah dikembalikan ke pembeli",
              actions: [],
            }
          : o,
      ),
    })),

  getFilteredOrders: () => {
    const { orders, search, activeStatus, activeOnly } = get();
    const keyword = search.toLowerCase();

    const filtered = orders.filter((order) => {
      const matchStatus = activeOnly
        ? ACTIVE_ORDER_STATUSES.includes(order.status)
        : activeStatus
          ? order.status === activeStatus
          : true;

      const matchSearch =
        order.customer.name.toLowerCase().includes(keyword) ||
        order.id.toLowerCase().includes(keyword) ||
        order.items?.some((i) => i.name.toLowerCase().includes(keyword));

      return matchStatus && matchSearch;
    });

    // pesanan aktif selalu tampil paling atas
    return [...filtered].sort((a, b) => {
      const aActive = ACTIVE_ORDER_STATUSES.includes(a.status) ? 0 : 1;
      const bActive = ACTIVE_ORDER_STATUSES.includes(b.status) ? 0 : 1;
      return aActive - bActive;
    });
  },

  getStatusCount: (status) =>
    get().orders.filter((o) => o.status === status).length,

  getActiveOrdersCount: () =>
    get().orders.filter((o) => ACTIVE_ORDER_STATUSES.includes(o.status)).length,

  getMonthlyRevenue: () =>
    get()
      .orders.filter((o) => o.status === "Selesai")
      .reduce((sum, o) => sum + o.totalValue, 0),

  getRecentOrders: (limit = 12) => get().orders.slice(0, limit),
}));

export default useOrderAdminStore;
