import { useState } from "react";

// shadCN
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router";
import { useProductStore } from "@/app/store/useProduct";

const ITEMS_PER_PAGE = 6;

// ===== FRAMER MOTION VARIANTS =====
const fadeUp = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1 },
};

const staggerGrid = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

const Product = () => {
  const [page, setPage] = useState(0);
  const { data } = useProductStore();

  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);

  const paginatedProducts = data.slice(
    page * ITEMS_PER_PAGE,
    (page + 1) * ITEMS_PER_PAGE
  );

  return (
    <div className="w-full px-4 py-6 space-y-6">
      <h1 className="text-xl md:text-2xl font-bold text-center">
        All Products
      </h1>

      {/* ===== GRID ===== */}
      <motion.div
        variants={staggerGrid}
        key={page}
        animate="show"
        className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
      >
        {paginatedProducts.map((item) => (
          <Link to={`/product/${item.id}`} key={item.id}>
            <motion.div variants={fadeUp} whileHover={{ scale: 1.03 }}>
              <Card className="rounded-xl shadow-md cursor-pointer">
                <CardContent className="p-2">
                  <div className="w-full aspect-square rounded-md overflow-hidden bg-gray-100">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </CardContent>

                <CardFooter className="flex flex-col items-start gap-1 px-2 pb-3">
                  <h2 className="text-xs md:text-sm font-semibold line-clamp-2">
                    {item.title}
                  </h2>
                  <p className="text-xs md:text-sm font-medium text-primary">
                    Rp {item.price.toLocaleString("id-ID")}
                  </p>
                </CardFooter>
              </Card>
            </motion.div>
          </Link>
        ))}
      </motion.div>

      {/* ===== PAGINATION ===== */}
      <div className="flex justify-center items-center gap-4 pt-4 ">
        <Button
          variant="outline"
          size="sm"
          disabled={page === 0}
          onClick={() => setPage((p) => p - 1)}
          className="cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4 " />
          Prev
        </Button>

        <span className="text-sm font-medium">
          {page + 1} / {totalPages}
        </span>

        <Button
          variant="outline"
          size="sm"
          disabled={page + 1 >= totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="cursor-pointer"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default Product;
