import { useState } from "react";
import useOrderAdminStore from "@/app/store/admin/useOrderAdminStore";
import { statusConfig, STATUS_LIST } from "@/data/orderAdminDummy";

const INITIAL_LIMIT = 3;
const LOAD_MORE_STEP = 3;

export function useAdminDashboardData() {
  const {
    getActiveOrdersCount,
    getMonthlyRevenue,
    getStatusCount,
    getRecentOrders,
  } = useOrderAdminStore();

  const allRecentOrders = getRecentOrders();

  const [visibleCount, setVisibleCount] = useState(INITIAL_LIMIT);
  const visibleOrders = allRecentOrders.slice(0, visibleCount);
  const hasMore = visibleCount < allRecentOrders.length;

  const loadMore = () =>
    setVisibleCount((prev) =>
      Math.min(prev + LOAD_MORE_STEP, allRecentOrders.length),
    );

  const statList = STATUS_LIST.map((status) => {
    const st = statusConfig[status];
    return {
      status,
      label: st.label,
      count: getStatusCount(status),
      textClass: st.textClass,
      bgClass: st.bgClass,
      borderClass: st.borderClass,
    };
  });

  return {
    monthlyRevenue: getMonthlyRevenue(),
    activeOrdersCount: getActiveOrdersCount(),
    statList,
    visibleOrders,
    hasMore,
    loadMore,
  };
}
