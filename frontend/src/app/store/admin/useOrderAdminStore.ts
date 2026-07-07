import { create } from "zustand";
import { ordersAdmin } from "@/data/orderAdminDummy";
import type { OrderAdmin, OrderStatusKey } from "@/types/orderAdmin";
import { ACTIVE_ORDER_STATUSES } from "@/constants/orderAdmin";

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
  updateOrderStatus: (id: string, status: OrderStatusKey) => void;
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

  updateOrderStatus: (id, status) =>
    set((state) => ({
      orders: state.orders.map((o) => (o.id === id ? { ...o, status } : o)),
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
