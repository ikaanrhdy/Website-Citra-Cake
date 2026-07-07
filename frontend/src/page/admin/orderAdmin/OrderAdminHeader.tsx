import { Search, SlidersHorizontal, Menu } from "lucide-react";
import { useOutletContext } from "react-router";
import type { AdminLayoutContext } from "@/layout/AdminLayout";

type Props = {
  search: string;
  onSearchChange: (v: string) => void;
};

const OrderAdminHeader = ({ search, onSearchChange }: Props) => {
  const { onOpenSidebar } = useOutletContext<AdminLayoutContext>();

  return (
    <div className="space-y-3">
      <div className="flex items-start gap-3">
        {/* Hamburger — cuma muncul di mobile/tablet */}
        <button
          onClick={onOpenSidebar}
          className="p-2 -ml-2 mt-0.5 hover:bg-gray-100 rounded-full transition cursor-pointer lg:hidden shrink-0"
        >
          <Menu size={20} />
        </button>

        <div>
          <h1 className="font-bold text-lg sm:text-xl">Pesanan Masuk</h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Kelola dan tracking pesanan pelanggan yang masuk dari aplikasi
          </p>
        </div>
      </div>

      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cari nama pelanggan atau produk..."
          className="w-full pl-9 pr-3 py-2 rounded-md border bg-background text-sm"
        />
      </div>

      <button className="flex items-center gap-2 px-3 py-2 rounded-md border bg-background text-sm text-muted-foreground hover:bg-gray-50 transition cursor-pointer">
        <SlidersHorizontal className="w-4 h-4" />
        Filter
      </button>
    </div>
  );
};

export default OrderAdminHeader;
