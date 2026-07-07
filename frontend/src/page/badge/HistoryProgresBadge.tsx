import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { ArrowLeft, ShoppingCart } from "lucide-react";

/* ================= MOTION ================= */
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0 },
};

/* ================= DATA (15 ITEM) ================= */
const transactions = Array.from({ length: 15 }).map((_, i) => ({
  id: i + 1,
  type: i % 3 === 0 ? "Pesanan Kustom" : "Pesanan Cake",
  title:
    i % 3 === 0
      ? "Cake Ulang Tahun Uk.20 Vanila"
      : "Black Forest Cake Uk.20 cm",
  date: "13/12/2025 15:45",
  point: i % 3 === 0 ? 10 : 5,
}));

/* ================= PAGE ================= */
const HistoryProgresBadge = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="min-h-screen "
    >
      {/* ================= HEADER ================= */}
      <motion.div
        variants={item}
        className=" flex items-center gap-2 bg-white shadow-sm px-4 py-2 sm:px-6 lg:px-10
        "
      >
        <motion.button
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.05 }}
          onClick={() => navigate(-1)}
          className="hover:bg-gray-200 rounded-full p-2 cursor-pointer"
        >
          <ArrowLeft size={20} />
        </motion.button>

        <h1 className="font-medium text-sm sm:text-base">
          Progres Member Citra
        </h1>
      </motion.div>

      {/* ================= LIST (NO CARD) ================= */}
      <motion.div
        variants={item}
        className="mt-2 divide-y
        "
      >
        <h1 className="pl-4 pb-2 text-gray-600">Transaksi terakhir</h1>
        {transactions.map((trx) => (
          <motion.div
            key={trx.id}
            variants={item}
            whileHover={{ backgroundColor: "#f9fafb" }}
            className=" flex justify-between items-start gap-4 bg-white px-4 py-3 sm:px-6 lg:px-10"
          >
            {/* LEFT */}
            <div className="flex gap-3 min-w-0">
              <div
                className="
                  w-9 h-9 shrink-0
                  rounded-lg
                  bg-primary/10
                  flex items-center justify-center
                "
              >
                <ShoppingCart size={18} className="text-primary" />
              </div>

              <div className="min-w-0">
                <p className="text-xs text-gray-500">{trx.type}</p>

                <p className="text-sm font-medium text-gray-800 truncate max-w-45 sm:max-w-65 md:max-w-90 lg:max-w-130">
                  {trx.title}
                </p>

                <p className="text-xs text-gray-400">{trx.date}</p>
              </div>
            </div>

            {/* RIGHT (POINT) */}
            <div
              className="
                text-sm font-semibold
                text-primary
                whitespace-nowrap
                pt-1
              "
            >
              +{trx.point} Pts
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default HistoryProgresBadge;
