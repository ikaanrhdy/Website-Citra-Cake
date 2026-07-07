import type { AdminRole } from "@/data/adminData";
import { Menu, LogOut } from "lucide-react";

type Props = {
  name: string | null;
  role: AdminRole | null;
  onOpenSidebar?: () => void;
  onLogout: () => void;
};

const DashboardHeader = ({ name, role, onOpenSidebar, onLogout }: Props) => {
  return (
    <div className="flex items-start justify-between gap-2">
      <div className="flex items-start gap-2">
        <button
          onClick={onOpenSidebar}
          className="p-2 hover:bg-gray-100 rounded-full transition cursor-pointer shrink-0"
        >
          <Menu size={20} />
        </button>

        <div>
          <h1 className="font-bold text-lg md:text-2xl lg:text-3xl font-roboto">
            Dashboard {role === "owner" ? "Owner" : "Admin Toko"}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Overview pesanan dan penjualan bulan ini
            {name ? ` · Halo, ${name}` : ""}
          </p>
        </div>
      </div>

      <button
        onClick={onLogout}
        className="flex items-center gap-1 text-xs sm:text-sm font-medium text-red-600 hover:underline cursor-pointer shrink-0"
      >
        <LogOut size={14} />
        Logout
      </button>
    </div>
  );
};

export default DashboardHeader;
