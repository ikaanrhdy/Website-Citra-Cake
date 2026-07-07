import { Pencil, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import type { productsAdmin } from "@/types/data";

interface ProductCardProps {
  item: productsAdmin;
  index: number;
  onEdit: (item: productsAdmin) => void;
  onDelete: (id: string) => void;
}

const ProductCard = ({ item, index, onEdit, onDelete }: ProductCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm flex flex-col"
    >
      {/* ── Image ── */}
      <div className="relative">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-40 sm:h-48 object-cover"
        />

        {/* Top-left: Stok / Pre-Order */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {item.isPreOrder ? (
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-orange-500 text-white">
              Pre-Order
            </span>
          ) : item.stock > 0 ? (
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-green-500 text-white">
              Stok: {item.stock}
            </span>
          ) : (
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-red-500 text-white">
              Habis
            </span>
          )}
        </div>

        {/* Top-right: Diskon */}
        <div className="absolute top-2 right-2 flex flex-col gap-1">
          {item.discount && (
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-red-500 text-white">
              -{item.discount}%
            </span>
          )}
          {item.discountFlat && !item.discount && (
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-red-500 text-white">
              -{(item.discountFlat / 1000).toFixed(0)}k
            </span>
          )}
        </div>
      </div>

      {/* ── Body ── */}
      <div className="p-3 sm:p-4 flex flex-col gap-2.5 flex-1">
        {/* Category chip */}
        <span className="inline-block text-xs px-2.5 py-0.5 rounded-full border border-purple-300 text-purple-600 bg-purple-50 w-fit">
          {item.category}
        </span>

        {/* Title */}
        <h2 className="font-bold text-base sm:text-lg text-foreground leading-tight">
          {item.title}
        </h2>

        {/* Description */}
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
          {item.description}
        </p>

        {/* Size & Price per ukuran */}
        <div className="space-y-1">
          {item.size.map((s) => (
            <div
              key={s.label}
              className="flex justify-between items-center text-sm"
            >
              <span className="text-muted-foreground text-xs sm:text-sm">
                {s.label}
              </span>
              <span className="font-bold text-foreground text-xs sm:text-sm">
                Rp {s.price.toLocaleString("id-ID")}
              </span>
            </div>
          ))}
        </div>

        {/* Variants */}
        <div className="flex flex-wrap gap-1.5">
          {item.variant.map((v) => (
            <span
              key={v}
              className="text-xs px-2.5 py-0.5 rounded-full border border-purple-200 text-purple-600 bg-purple-50"
            >
              {v}
            </span>
          ))}
        </div>

        {/* Harga + Aksi */}
        <div className="flex items-end justify-between mt-auto pt-1 border-t border-border">
          <div>
            {item.originalPrice && (
              <p className="text-xs text-muted-foreground line-through">
                Rp {item.originalPrice.toLocaleString("id-ID")}
              </p>
            )}
            <p className="text-base font-bold text-red-500">
              Rp {item.price.toLocaleString("id-ID")}
            </p>
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => onEdit(item)}
              className="p-2 rounded-lg hover:bg-muted transition"
            >
              <Pencil className="w-4 h-4 text-blue-400" />
            </button>
            <button
              onClick={() => onDelete(item.id)}
              className="p-2 rounded-lg hover:bg-red-50 transition"
            >
              <Trash2 className="w-4 h-4 text-red-400" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
