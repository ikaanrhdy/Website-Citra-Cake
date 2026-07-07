import { useState, useMemo } from "react";

// shadCN
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
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

// ===== HELPER: format relative time =====
const formatRelativeDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diffDays === 0) return "Hari ini";
  if (diffDays === 1) return "Kemarin";
  if (diffDays < 7) return `${diffDays} hari lalu`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} minggu lalu`;

  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const NewestProduct = () => {
  const [page, setPage] = useState(0);
  const { data } = useProductStore();

  const sortedData = useMemo(() => {
    return [...data].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, [data]);

  const totalPages = Math.ceil(sortedData.length / ITEMS_PER_PAGE);

  const paginatedProducts = sortedData.slice(
    page * ITEMS_PER_PAGE,
    (page + 1) * ITEMS_PER_PAGE,
  );

  return (
    <div className="w-full px-4 py-6 space-y-6">
      {/* ===== HEADER ===== */}
      <div className="flex flex-col items-center gap-1 text-center">
        <div className="flex items-center gap-1.5 text-primary">
          <Sparkles className="w-4 h-4" />
          <span className="text-xs font-medium uppercase tracking-wide">
            Fresh from the oven
          </span>
        </div>
        <h1 className="text-xl md:text-2xl font-bold">Produk Terbaru</h1>
      </div>

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
              <Card className="rounded-xl shadow-sm hover:shadow-md border-gray-100 cursor-pointer transition-shadow duration-200 overflow-hidden pt-0">
                <CardContent className="p-0">
                  <div className="relative w-full aspect-square overflow-hidden bg-gray-100">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />

                    <Badge className="absolute top-2 left-2 bg-primary text-white text-[10px] font-semibold px-2 py-0.5 shadow-sm">
                      Baru
                    </Badge>
                  </div>
                </CardContent>

                <CardFooter className="flex flex-col items-start gap-1 px-3 pb-3 pt-2">
                  <h2 className="text-xs md:text-sm font-semibold line-clamp-2">
                    {item.title}
                  </h2>
                  <p className="text-xs md:text-sm font-medium text-primary">
                    Rp {item.price.toLocaleString("id-ID")}
                  </p>
                  <p className="text-[10px] md:text-xs text-gray-400">
                    {formatRelativeDate(item.createdAt)}
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

export default NewestProduct;
