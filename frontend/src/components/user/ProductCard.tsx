import { Link } from "react-router";
import { motion, type Variants } from "motion/react";
import type { products } from "@/types/data";

interface ProductCardProps {
  item: products;
  cardAnim: Variants;
  hoverEffect?: "lift" | "scale";
}

export const ProductCard = ({
  item,
  cardAnim,
  hoverEffect = "lift",
}: ProductCardProps) => {
  const hasDiscount = !!item.originalPrice && item.originalPrice > item.price;
  const discountPercent = hasDiscount
    ? Math.round(
        ((item.originalPrice! - item.price) / item.originalPrice!) * 100,
      )
    : 0;

  return (
    <Link to={`/product/${item.id}`} className="block h-full">
      <motion.div
        variants={cardAnim}
        whileHover={hoverEffect === "lift" ? { y: -6 } : { scale: 1.05 }}
        className="flex flex-col h-full bg-white rounded-xl shadow-md p-2.5 sm:p-3 cursor-pointer"
      >
        {/* Image */}
        <div className="w-full aspect-square rounded-lg overflow-hidden bg-gray-100">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="mt-2.5 flex flex-col flex-1 gap-1.5">
          <h2 className="text-sm sm:text-base font-semibold line-clamp-2 min-h-10 leading-snug">
            {item.title}
          </h2>

          {/* Harga */}
          <div className="flex flex-col gap-0.5">
            {hasDiscount && (
              <span className="text-xs text-gray-400 line-through">
                Rp {item.originalPrice!.toLocaleString("id-ID")}
              </span>
            )}
            <p className="text-sm sm:text-base font-bold text-primary">
              Rp {item.price.toLocaleString("id-ID")}
            </p>
          </div>

          {/* Badge area */}
          <div className="mt-auto pt-1.5 min-h-6 flex items-center gap-1.5">
            {item.discountLabel && (
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700">
                {item.discountLabel}
              </span>
            )}
            {hasDiscount && (
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-600">
                -{discountPercent}%
              </span>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  );
};
