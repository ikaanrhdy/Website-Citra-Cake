import { Link } from "react-router";
import { motion } from "framer-motion";
import type { products } from "@/types/data";

const RelatedProductCard = ({ item }: { item: products }) => {
  const hasDiscount = !!item.discount && item.discount > 0;
  const discountedPrice = hasDiscount
    ? item.price * (1 - (item.discount as number) / 100)
    : item.price;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white rounded-md shadow-md p-2 cursor-pointer flex flex-col"
    >
      <Link to={`/product/${item.id}`} className="flex flex-col gap-1">
        <div className="relative">
          <img
            src={item.image}
            alt={item.title}
            className="w-full aspect-square object-cover rounded-md"
          />
        </div>

        <h4 className="text-xs font-medium mt-1 line-clamp-2">{item.title}</h4>

        {hasDiscount && (
          <span className="text-[10px] text-gray-400 line-through">
            Rp {item.price.toLocaleString("id-ID")}
          </span>
        )}

        <span className="text-xs font-semibold text-primary">
          Rp {discountedPrice.toLocaleString("id-ID")}
        </span>

        {item.status === "Pre-Order" ? (
          <span className="w-fit text-[10px] px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700">
            Pre-Order
          </span>
        ) : hasDiscount ? (
          <span className="w-fit text-[10px] px-2 py-0.5 rounded-full bg-red-100 text-red-500">
            -{item.discount}%
          </span>
        ) : null}
      </Link>
    </motion.div>
  );
};

export default RelatedProductCard;
