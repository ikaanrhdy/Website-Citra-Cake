import { ArrowLeft } from "lucide-react";
import { FaCartShopping } from "react-icons/fa6";
import { Link, useNavigate } from "react-router";
import { useCartStore } from "@/app/store/useCartProduct";
import { Badge } from "@/components/ui/badge";

interface ProductDetailHeaderProps {
  category: string;
  title: string;
}

const ProductDetailHeader = ({ category, title }: ProductDetailHeaderProps) => {
  const navigate = useNavigate();
  const { totalQty } = useCartStore();

  return (
    <div className="flex flex-col gap-3">
      {/* Mobile & Tablet: bar back + cart */}
      <div className=" flex items-center justify-between bg-white shadow-sm p-3 rounded-md sticky top-0 z-30">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-gray-100 transition cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <button
          onClick={() => navigate("/cart")}
          className="relative p-2 rounded-full hover:bg-gray-100 transition cursor-pointer"
        >
          <FaCartShopping className="w-5 h-5 text-primary" />

          {totalQty > 0 && (
            <Badge className="absolute -top-1 -right-1 min-w-4.5 h-4.5 px-1 flex items-center justify-center rounded-full text-[10px] font-bold bg-red-500 text-white border-2 border-white leading-none">
              {totalQty > 99 ? "99+" : totalQty}
            </Badge>
          )}
        </button>
      </div>

      {/* Desktop: breadcrumb */}
      <div className="hidden lg:flex items-center gap-2 text-sm text-gray-500">
        <Link to="/home" className="hover:text-primary transition">
          Home
        </Link>
        <span>/</span>
        <span className="hover:text-primary transition cursor-default">
          {category}
        </span>
        <span>/</span>
        <span className="text-gray-800 font-medium">{title}</span>
      </div>
    </div>
  );
};

export default ProductDetailHeader;
