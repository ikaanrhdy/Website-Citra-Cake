import { product } from "@/data/product";
import type { products } from "@/types/data";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import { useState } from "react";
import { useCartStore } from "@/app/store/useCartProduct";
import { toast } from "sonner";
import { calculatePriceBySize } from "@/utils/data";
import RelatedProductCard from "@/components/user/productDetail/RelatedProductCard";
import ProductDetailHeader from "@/components/user/productDetail/ProductDetailHeader";

/* ================= RATING ================= */
const RatingStars = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-1">
    {[...Array(5)].map((_, i) => {
      if (rating >= i + 1)
        return <FaStar key={i} className="text-yellow-400" />;
      if (rating >= i + 0.5)
        return <FaStarHalfAlt key={i} className="text-yellow-400" />;
      return <FaRegStar key={i} className="text-gray-300" />;
    })}
  </div>
);

/* ================= PAGE ================= */
const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const data = product.find((item: products) => item.id === id);
  const navigate = useNavigate();
  const addToCart = useCartStore((state) => state.addToCart);

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [page, setPage] = useState(0);

  if (!data) return null;

  const size = data.size || [];

  /* ===== Menu lainnya pagination (grid, per halaman 6 item) ===== */
  const ITEMS_PER_PAGE = 6;
  const otherProducts = product.filter((p) => p.id !== id);
  const displayed = otherProducts.slice(page, page + ITEMS_PER_PAGE);

  const hasDiscount = !!data.discount && data.discount > 0;
  const basePrice = hasDiscount
    ? data.price * (1 - (data.discount as number) / 100)
    : data.price;

  const previewPrice = selectedSize
    ? calculatePriceBySize(basePrice, size, selectedSize)
    : basePrice;

  /* ===== HANDLER: Masukan Keranjang ===== */
  const handleAddToCart = () => {
    if (size.length > 0 && !selectedSize) {
      toast.error("Pilih ukuran terlebih dahulu!");
      return;
    }
    addToCart(data, selectedSize ?? "");
    toast.success("Berhasil masukan ke keranjang!");
  };

  /* ===== HANDLER: Beli Sekarang (langsung ke Checkout, terpisah dari cart) ===== */
  const handleBuyNow = () => {
    if (size.length > 0 && !selectedSize) {
      toast.error("Pilih ukuran terlebih dahulu!");
      return;
    }

    navigate("/checkout", {
      state: {
        buyNow: true,
        items: [
          {
            id: data.id,
            title: data.title,
            image: data.image,
            price: previewPrice,
            qty: 1,
            ukuran: selectedSize ?? undefined,
          },
        ],
        subtotalPengiriman: 0,
        biayaLayanan: 1000,
      },
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-6 px-4 md:px-10 lg:px-16 pb-28 md:pb-10"
    >
      {/* ===== HEADER (mobile bar / desktop breadcrumb) ===== */}
      <ProductDetailHeader category={data.category} title={data.title} />

      {/* ===== IMAGE + INFO (2 kolom mulai dari tablet) ===== */}
      <div className="md:grid md:grid-cols-2 md:gap-10">
        {/* Kolom kiri: gambar (sticky mulai dari tablet) */}
        <div className="md:sticky md:top-6 md:self-start">
          <motion.img
            src={data.image}
            alt={data.title}
            initial={{ scale: 0.97 }}
            animate={{ scale: 1 }}
            className="w-full aspect-square md:aspect-4/3 object-cover rounded-xl shadow-md"
          />
        </div>

        {/* Kolom kanan: info produk */}
        <div className="flex flex-col gap-6 mt-6 md:mt-0">
          {/* ===== INFO ===== */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold">{data.title}</h2>
              {hasDiscount && (
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-red-100 text-red-500 font-medium">
                  -{data.discount}%
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {hasDiscount && (
                <span className="text-xs text-gray-400 line-through">
                  Rp {data.price.toLocaleString("id-ID")}
                </span>
              )}
              <span className="text-base font-semibold text-primary">
                Rp {previewPrice.toLocaleString("id-ID")}
              </span>
            </div>

            <div className="flex items-center gap-2 mt-1">
              <RatingStars rating={data.rating} />
              <span className="text-xs text-gray-500">
                {data.reviews} Reviews
              </span>
            </div>
          </div>

          {/* ===== SIZE ===== */}
          {size.length > 0 && (
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-semibold">Pilih Ukuran</h3>
              <div className="flex gap-2 flex-wrap">
                {size.map((s) => {
                  const active = selectedSize === s;
                  return (
                    <motion.button
                      key={s}
                      whileTap={{ scale: 0.92 }}
                      whileHover={{ scale: 1.05 }}
                      onClick={() =>
                        setSelectedSize((prev) => (prev === s ? null : s))
                      }
                      className={`px-3 py-1.5 rounded-md border text-xs transition cursor-pointer
                        ${
                          active
                            ? "bg-primary text-white border-primary"
                            : "bg-gray-100 text-gray-700 border-gray-200"
                        }`}
                    >
                      {s} cm
                    </motion.button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ===== STATUS ===== */}
          <div className="bg-white rounded-md border p-4 text-sm flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span>Status:</span>
              <span
                className={`font-semibold ${
                  data.status === "Pre-Order"
                    ? "text-yellow-600"
                    : data.status === "Habis"
                      ? "text-red-500"
                      : "text-green-600"
                }`}
              >
                {data.status ?? "Ready Stock"}
              </span>
            </div>
            <div className="text-gray-500 text-xs">
              Pengiriman: 1 – 3 hari kerja
            </div>
          </div>

          {/* ===== DESKRIPSI ===== */}
          <div className="bg-white rounded-md border p-4">
            <h3 className="font-medium mb-1">Deskripsi</h3>
            <p className="text-sm text-gray-600">{data.description}</p>
          </div>

          {/* ===== ACTIONS (tablet & desktop: inline, mobile: fixed di bawah) ===== */}
          <div className="hidden md:flex gap-3">
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleAddToCart}
              className="flex-1 border border-primary text-primary rounded-md py-3 text-sm font-medium hover:bg-purple-50 transition cursor-pointer"
            >
              Masukan Keranjang
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleBuyNow}
              className="flex-1 bg-primary text-white rounded-md py-3 text-sm font-medium hover:bg-[#6B3489] transition cursor-pointer"
            >
              Beli Sekarang
            </motion.button>
          </div>
        </div>
      </div>

      {/* ===== MENU LAINNYA ===== */}
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Menu Lainnya</h2>

        <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
          {displayed.map((item) => (
            <RelatedProductCard key={item.id} item={item} />
          ))}
        </div>

        {otherProducts.length > ITEMS_PER_PAGE && (
          <div className="flex justify-end gap-2">
            <button
              disabled={page === 0}
              onClick={() => setPage((p) => Math.max(0, p - ITEMS_PER_PAGE))}
              className="p-2 bg-primary text-white rounded disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} />
            </button>

            <button
              disabled={page + ITEMS_PER_PAGE >= otherProducts.length}
              onClick={() => setPage((p) => p + ITEMS_PER_PAGE)}
              className="p-2 bg-primary text-white rounded disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      {/* ===== FIXED BOTTOM ACTIONS (mobile aja, tablet ke atas pakai actions inline) ===== */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t p-3 flex gap-3 z-40">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleAddToCart}
          className="flex-1 border border-primary text-primary rounded-md py-3 text-sm font-medium hover:bg-purple-50 transition cursor-pointer"
        >
          Masukan Keranjang
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleBuyNow}
          className="flex-1 bg-primary text-white rounded-md py-3 text-sm font-medium hover:bg-[#6B3489] transition cursor-pointer"
        >
          Beli Sekarang
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ProductDetail;
