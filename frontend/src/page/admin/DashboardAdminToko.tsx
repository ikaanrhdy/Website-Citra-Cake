import { motion } from "framer-motion";
import { useNavigate, useOutletContext } from "react-router";
import { ShoppingBag } from "lucide-react";
import type { AdminLayoutContext } from "@/layout/AdminLayout";
import AdminPageHeader from "@/components/admin/PageHeaders";
import StatsGrid from "@/components/admin/dashboard/StatsGrid";
import RecentOrdersSection from "@/components/admin/dashboard/RecentOrdersSection";
import { useAdminDashboardData } from "@/hooks/useAdminDashboardData";
import useOrderAdminStore from "@/app/store/admin/useOrderAdminStore";

interface Props {
  name?: string | null;
}

const DashboardAdminToko = ({ name }: Props) => {
  const navigate = useNavigate();
  const { onOpenSidebar } = useOutletContext<AdminLayoutContext>();
  const setActiveOnly = useOrderAdminStore((s) => s.setActiveOnly);
  const setActiveStatus = useOrderAdminStore((s) => s.setActiveStatus);

  const { activeOrdersCount, statList, visibleOrders, hasMore, loadMore } =
    useAdminDashboardData();

  const goToActiveOrders = () => {
    setActiveOnly(true);
    navigate("/admin/order");
  };

  // klik salah satu status di grid -> filter berdasarkan status itu
  const goToStatusOrders = (status: (typeof statList)[number]["status"]) => {
    setActiveStatus(status);
    navigate("/admin/order");
  };

  const stats = [
    {
      title: "Pesanan Aktif",
      value: String(activeOrdersCount),
      icon: ShoppingBag,
      color: "text-blue-700",
      bg: "bg-blue-500/20",
      onClick: goToActiveOrders,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4 sm:space-y-6"
    >
      <AdminPageHeader
        title="Dashboard"
        subtitle={`Overview pesanan dan penjualan bulan ini${name ? ` · Halo, ${name}` : ""}`}
        onOpenSidebar={onOpenSidebar}
      />

      <StatsGrid stats={stats} />

      <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-2 sm:gap-3">
        {statList.map((item) => (
          <button
            key={item.status}
            onClick={() => goToStatusOrders(item.status)}
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

      <RecentOrdersSection
        visibleOrders={visibleOrders}
        hasMore={hasMore}
        onLoadMore={loadMore}
      />
    </motion.div>
  );
};

export default DashboardAdminToko;
