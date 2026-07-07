import { Package } from "lucide-react";

const EmptyOrderState = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 px-6">
      <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
        <Package className="text-gray-400" size={28} />
      </div>
      <h3 className="font-semibold text-sm text-gray-700 mb-1">
        Tidak ada pesanan yang sesuai dengan filter
      </h3>
      <p className="text-xs text-gray-400 max-w-xs">
        Pesanan dari aplikasi pelanggan akan muncul di sini
      </p>
    </div>
  );
};

export default EmptyOrderState;
