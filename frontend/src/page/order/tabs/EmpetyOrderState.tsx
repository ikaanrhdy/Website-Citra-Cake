// components/EmptyOrderState.tsx
import { ShoppingBag } from "lucide-react";
import { Link } from "react-router";

const EmptyOrderState = ({
  title = "Belum Ada Pesanan Aktif",
  description = "Anda belum memiliki pesanan yang sedang diproses. Mulai berbelanja sekarang!",
}: {
  title?: string;
  description?: string;
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 px-6">
      <div className="w-16 h-16 rounded-full border-2 border-primary flex items-center justify-center mb-5">
        <ShoppingBag className="text-primary w-7 h-7" />
      </div>

      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-gray-500 text-sm mb-6 max-w-xs">{description}</p>

      <Link to="/home">
        <button className="bg-primary text-white px-6 py-2.5 rounded-lg font-medium hover:opacity-90 transition cursor-pointer">
          Mulai Belanja
        </button>
      </Link>
    </div>
  );
};

export default EmptyOrderState;
