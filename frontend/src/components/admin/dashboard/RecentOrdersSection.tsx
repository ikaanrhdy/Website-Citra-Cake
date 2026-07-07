import OrderCard from "@/page/admin/orderAdmin/OrderCard";
import type { OrderAdmin } from "@/types/orderAdmin";
import { ChevronDown, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router";

interface Props {
  visibleOrders: OrderAdmin[];
  hasMore: boolean;
  onLoadMore: () => void;
}

const RecentOrdersSection = ({ visibleOrders, hasMore, onLoadMore }: Props) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-base sm:text-lg">Pesanan Terbaru</h2>
        <button
          onClick={() => navigate("/admin/order")}
          className="inline-flex items-center gap-1 text-xs sm:text-sm font-medium text-purple-600 hover:text-purple-700 cursor-pointer"
        >
          Lihat Semua
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="space-y-3">
        {visibleOrders.map((order, i) => (
          <OrderCard key={`${order.id}-${i}`} order={order} index={i} />
        ))}
      </div>

      {hasMore && (
        <button
          onClick={onLoadMore}
          className="w-full flex items-center justify-center gap-1.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-md py-2.5 hover:bg-gray-50 transition cursor-pointer"
        >
          Muat Lebih Banyak
          <ChevronDown className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default RecentOrdersSection;
