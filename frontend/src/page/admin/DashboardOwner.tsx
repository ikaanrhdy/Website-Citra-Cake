import { useState } from "react";
import { motion } from "framer-motion";
import { useOutletContext } from "react-router";
import { TrendingUp, ShoppingBag, X } from "lucide-react";
import type { AdminLayoutContext } from "@/layout/AdminLayout";
import AdminPageHeader from "@/components/admin/PageHeaders";
import StatsGrid from "@/components/admin/dashboard/StatsGrid";
import SalesChart from "@/components/admin/dashboard/SalesChart";
import { salesData } from "@/data/orderAdminDummy";
import { useAdminDashboardData } from "@/hooks/useAdminDashboardData";
import OrderList from "@/components/admin/dashboard/OrderList";
import useOrderAdminStore from "@/app/store/admin/useOrderAdminStore";
import type { OrderStatusKey } from "@/types/orderAdmin";
import { ACTIVE_ORDER_STATUSES } from "@/constants/orderAdmin";

interface Props {
  name?: string | null;
}

const LOAD_MORE_STEP = 12;

type FilterMode =
  | { type: "all" }
  | { type: "active" }
  | { type: "status"; status: OrderStatusKey };

const DashboardOwner = ({ name }: Props) => {
  const { onOpenSidebar } = useOutletContext<AdminLayoutContext>();
  const orders = useOrderAdminStore((s) => s.orders);

  const { monthlyRevenue, activeOrdersCount, statList } =
    useAdminDashboardData();

  // filter lokal buat OrderList di dashboard ini aja, gak pindah halaman
  const [filterMode, setFilterMode] = useState<FilterMode>({ type: "all" });
  const [visibleCount, setVisibleCount] = useState(LOAD_MORE_STEP);

  const applyFilter = (next: FilterMode) => {
    setFilterMode(next);
    setVisibleCount(LOAD_MORE_STEP);
  };

  const filteredOrders =
    filterMode.type === "all"
      ? orders
      : filterMode.type === "active"
        ? orders.filter((o) => ACTIVE_ORDER_STATUSES.includes(o.status))
        : orders.filter((o) => o.status === filterMode.status);

  const visibleOrders = filteredOrders.slice(0, visibleCount);
  const hasMore = visibleCount < filteredOrders.length;

  const listTitle =
    filterMode.type === "all"
      ? "Pesanan Terbaru"
      : filterMode.type === "active"
        ? "Pesanan Aktif"
        : `Pesanan ${filterMode.status}`;

  const stats = [
    {
      title: "Omset Bulan Ini",
      value: `Rp ${monthlyRevenue.toLocaleString("id-ID")}`,
      icon: TrendingUp,
      color: "text-green-700",
      bg: "bg-green-500/20",
    },
    {
      title: "Pesanan Aktif",
      value: String(activeOrdersCount),
      icon: ShoppingBag,
      color: "text-blue-700",
      bg: "bg-blue-500/20",
      onClick: () => applyFilter({ type: "active" }),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4 sm:space-y-6"
    >
      <AdminPageHeader
        title="Dashboard Owner"
        subtitle={`Overview pesanan dan penjualan bulan ini${name ? ` · Halo, ${name}` : ""}`}
        onOpenSidebar={onOpenSidebar}
      />

      <StatsGrid stats={stats} />

      <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-2 sm:gap-3">
        {statList.map((item) => (
          <button
            key={item.status}
            onClick={() => applyFilter({ type: "status", status: item.status })}
            className={`${item.bgClass} ${item.borderClass} border rounded-md p-3 sm:p-4 text-left cursor-pointer hover:opacity-80 transition hover:shadow-sm`}
          >
            <p
              className={`${item.textClass} text-xs sm:text-sm font-medium mb-1 truncate`}
            >
              {item.label}
            </p>
            <p
              className={`${item.textClass} text-lg sm:text-xl font-bold leading-none`}
            >
              {item.count}
            </p>
          </button>
        ))}
      </div>

      <SalesChart data={salesData} />

      {filterMode.type !== "all" && (
        <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-md px-3 py-2">
          <span className="text-sm font-medium text-blue-700">
            Filter aktif: {listTitle}
          </span>
          <button
            onClick={() => applyFilter({ type: "all" })}
            className="flex items-center gap-1 text-xs font-medium text-blue-700 hover:underline cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            Reset
          </button>
        </div>
      )}

      <OrderList
        orders={visibleOrders}
        title={listTitle}
        readOnly
        hasMore={hasMore}
        onLoadMore={() => setVisibleCount((c) => c + LOAD_MORE_STEP)}
      />
    </motion.div>
  );
};

export default DashboardOwner;
