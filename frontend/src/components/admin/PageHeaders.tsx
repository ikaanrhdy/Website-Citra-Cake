import { Menu } from "lucide-react";
import type { ReactNode } from "react";

type Props = {
  title: string;
  subtitle?: string;
  onOpenSidebar?: () => void;
  action?: ReactNode; // contoh: tombol "Tambah Produk"
};

const AdminPageHeader = ({ title, subtitle, onOpenSidebar, action }: Props) => {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="flex items-start gap-2 min-w-0">
        <button
          onClick={onOpenSidebar}
          className="p-2 hover:bg-gray-100 rounded-full transition cursor-pointer shrink-0 lg:hidden"
        >
          <Menu size={20} />
        </button>

        <div className="min-w-0">
          <h1 className="font-bold text-lg sm:text-xl truncate">{title}</h1>
          {subtitle && (
            <p className="text-xs sm:text-sm text-muted-foreground truncate">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};

export default AdminPageHeader;
