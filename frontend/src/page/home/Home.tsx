import { Link } from "react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

// icons
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProductStore } from "@/app/store/useProduct";
import { ProductCard } from "@/components/user/ProductCard";

/* ===== VARIANTS ===== */
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const staggerGrid = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardAnim = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1 },
};

const Home = () => {
  const { data, isLoading, getProducts } = useProductStore();

  const [page, setPage] = useState(0);
  const [showAll, setShowAll] = useState(false);

  const ITEMS_PER_PAGE = 6;

  useEffect(() => {
    getProducts();
  }, [getProducts]);

  const paginatedProducts = data.slice(
    page * ITEMS_PER_PAGE,
    (page + 1) * ITEMS_PER_PAGE,
  );

  const displayedProducts = showAll ? data : data.slice(0, 6);

  const newestProducts = [...data]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 6);

  return (
    <motion.div
      initial="hidden"
      animate="show"
      className="flex flex-col w-full min-h-screen space-y-8 px-4 md:px-8 lg:px-16"
    >
      {/* ===== HERO ===== */}
      <motion.div variants={fadeUp} className="flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <h1 className="font-bold text-2xl md:text-3xl lg:text-4xl font-serif">
            Lavender Dreams
          </h1>
          <p className="font-medium font-serif text-primary text-xs md:text-sm">
            Custom Cake Customization studio
          </p>
        </div>

        <div className="flex flex-row gap-5">
          <motion.div whileHover={{ scale: 1.05 }}>
            <Link
              to={"/product/customitation"}
              className="flex px-5 py-3 items-center bg-linear-to-r from-[#5F2C7A] to-[#9A79C3]
              rounded-lg gap-3 text-white shadow-lg shadow-black/50"
            >
              <img
                src="/icon/Kustomisasi.svg"
                alt="icon-kustomisasi"
                className="w-5 h-5"
              />
              <h2 className="text-[12px] font-Inter text-center">
                Start Customization
              </h2>
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* ===== BEST SELLER ===== */}
      <motion.div variants={fadeUp} className="flex flex-col gap-4">
        <h1 className="font-bold font-roboto text-lg md:text-xl">
          Best Seller
        </h1>

        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <motion.div
            variants={staggerGrid}
            key={page}
            animate="show"
            className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4 items-stretch"
          >
            {paginatedProducts.map((item) => (
              <ProductCard
                key={item.id}
                item={item}
                cardAnim={cardAnim}
                hoverEffect="lift"
              />
            ))}
          </motion.div>
        )}

        <div className="flex justify-end gap-3 mt-6">
          {page > 0 && (
            <Button onClick={() => setPage((p) => p - 1)}>
              <ChevronRight className="rotate-180 cursor-pointer" /> Prev
            </Button>
          )}
          {(page + 1) * ITEMS_PER_PAGE < data.length && (
            <Button onClick={() => setPage((p) => p + 1)}>
              Next Cake <ChevronRight />
            </Button>
          )}
        </div>
      </motion.div>

      {/* ===== TERBARU ===== */}
      <motion.div variants={fadeUp} className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="font-bold font-roboto text-lg md:text-xl">Terbaru</h1>
          <Link
            to="/products/terbaru"
            className="text-sm font-medium text-primary hover:underline"
          >
            Lihat Semua
          </Link>
        </div>

        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <motion.div
            variants={staggerGrid}
            animate="show"
            className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4 items-stretch"
          >
            {newestProducts.map((item) => (
              <ProductCard
                key={item.id}
                item={item}
                cardAnim={cardAnim}
                hoverEffect="lift"
              />
            ))}
          </motion.div>
        )}
      </motion.div>

      {/* ===== KATEGORI ===== */}
      <motion.div variants={fadeUp} className="flex flex-col space-y-8">
        <h1 className="font-bold text-xl font-roboto text-center">Kategori</h1>

        <motion.div
          variants={staggerGrid}
          animate="show"
          className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 items-stretch"
        >
          {displayedProducts.map((item) => (
            <ProductCard
              key={item.id}
              item={item}
              cardAnim={cardAnim}
              hoverEffect="scale"
            />
          ))}
        </motion.div>

        {!showAll && data.length > 6 && (
          <div className="flex justify-center">
            <button
              onClick={() => setShowAll(true)}
              className="px-6 py-2 rounded-full bg-primary text-white cursor-pointer"
            >
              Load More Cakes 🍰
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Home;
