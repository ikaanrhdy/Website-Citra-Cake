import { Button } from "@/components/ui/button";
import { product } from "@/data/product";
import { motion } from "motion/react";
import { Link } from "react-router";
import { useReturnStore } from "@/app/store/useReturnStore";

const SelesaiPage = () => {
  const data = product;
  const isReturned = useReturnStore((s) => s.isReturned);

  // sembunyikan item yang sudah diajukan pengembalian
  const visibleData = data.slice(0, 5).filter((item) => !isReturned(item.id));

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: { staggerChildren: 0.08 },
        },
      }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-6 lg:gap-8"
    >
      {visibleData.map((item) => (
        <motion.div
          key={item.id}
          variants={{
            hidden: { opacity: 0, y: 16 },
            show: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className=" flex flex-col gap-4 p-5 bg-white border border-gray-300 rounded-lg md:p-6 lg:p-7"
        >
          {/* ================= HEADER ================= */}
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-semibold">Custom Citra Cake</h4>
            <p className="text-primary text-sm font-semibold">Selesai</p>
          </div>

          {/* ================= PRODUCT ================= */}
          <div className="flex justify-between gap-4">
            <div className="flex gap-3">
              {/* IMAGE */}
              <div className="shrink-0 p-1 rounded border border-gray-300">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-20 h-20 md:w-24 md:h-24 lg:w-24 lg:h-24 rounded object-cover"
                />
              </div>

              {/* INFO */}
              <div className="flex flex-col justify-center gap-1">
                <h2 className="text-sm font-medium">{item.title}</h2>
                <p className="text-[10px] text-gray-400">Putih, Merah</p>
              </div>
            </div>

            {/* PRICE */}
            <div className="flex flex-col items-end justify-center gap-1">
              <p className="text-xs">x1</p>
              <p className="text-xs font-medium">Rp {item.price}</p>
              <p className="text-xs text-gray-600">
                Total 1 Produk: Rp {item.price}
              </p>
            </div>
          </div>

          {/* ================= ACTION ================= */}
          <div className="flex flex-wrap justify-end gap-2">
            <Button
              asChild
              variant="ghost"
              className="bg-red-50 text-red-500 cursor-pointer text-xs md:text-sm md:py-4"
            >
              <Link to={`/pengembalian/${item.id}`} state={{ item, qty: 1 }}>
                Ajukan Pengembalian
              </Link>
            </Button>
            <Button
              variant="ghost"
              className="bg-gray-100 text-gray-600  cursor-pointer text-xs md:text-sm md:py-4"
            >
              Lihat Penilaian
            </Button>

            <Button className="bg-purple-50 text-primary w-fit text-xs md:text-sm md:px-6 md:py-4 hover:text-white cursor-pointer">
              Beli Lagi
            </Button>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default SelesaiPage;
