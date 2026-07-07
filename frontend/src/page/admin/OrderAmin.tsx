import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, X } from "lucide-react";
import useOrderAdminStore from "@/app/store/admin/useOrderAdminStore";
import { statusConfig } from "@/data/orderAdminDummy";
import OrderAdminHeader from "./orderAdmin/OrderAdminHeader";
import OrderStatusFilterGrid from "./orderAdmin/OrderStatusFilterGrid";
import EmptyOrderState from "./orderAdmin/EmptyOrderState";
import OrderCard from "./orderAdmin/OrderCard";

const INITIAL_LIMIT = 5;
const LOAD_MORE_STEP = 5;

const OrderAdmin = () => {
  const {
    search,
    setSearch,
    activeStatus,
    activeOnly,
    setActiveOnly,
    getFilteredOrders,
  } = useOrderAdminStore();
  const filteredOrders = getFilteredOrders();

  const [visibleCount, setVisibleCount] = useState(INITIAL_LIMIT);

  const [prevFilterKey, setPrevFilterKey] = useState(
    `${search}-${activeStatus}-${activeOnly}`,
  );
  const currentFilterKey = `${search}-${activeStatus}-${activeOnly}`;

  if (currentFilterKey !== prevFilterKey) {
    setPrevFilterKey(currentFilterKey);
    setVisibleCount(INITIAL_LIMIT);
  }

  const visibleOrders = filteredOrders.slice(0, visibleCount);
  const hasMore = visibleCount < filteredOrders.length;

  const sectionTitle = activeOnly
    ? "Pesanan Aktif"
    : activeStatus
      ? `Pesanan ${statusConfig[activeStatus].label}`
      : "Semua Pesanan";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      <OrderAdminHeader search={search} onSearchChange={setSearch} />

      {activeOnly ? (
        <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-md px-3 py-2">
          <span className="text-sm font-medium text-blue-700">
            Menampilkan Pesanan Aktif saja
          </span>
          <button
            onClick={() => setActiveOnly(false)}
            className="flex items-center gap-1 text-xs font-medium text-blue-700 hover:underline cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            Lihat Semua
          </button>
        </div>
      ) : (
        <OrderStatusFilterGrid />
      )}

      <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
        <h2 className="font-semibold text-sm text-gray-800">
          {sectionTitle} ({filteredOrders.length} pesanan)
        </h2>

        {filteredOrders.length === 0 ? (
          <EmptyOrderState />
        ) : (
          <>
            <div className="space-y-3">
              {visibleOrders.map((order, i) => (
                <OrderCard key={`${order.id}-${i}`} order={order} index={i} />
              ))}
            </div>

            {hasMore && (
              <button
                onClick={() =>
                  setVisibleCount((prev) =>
                    Math.min(prev + LOAD_MORE_STEP, filteredOrders.length),
                  )
                }
                className="w-full flex items-center justify-center gap-1.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-md py-2.5 hover:bg-gray-50 transition cursor-pointer"
              >
                Muat Lebih Banyak ({filteredOrders.length - visibleCount}{" "}
                lainnya)
                <ChevronDown className="w-4 h-4" />
              </button>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
};

export default OrderAdmin;
