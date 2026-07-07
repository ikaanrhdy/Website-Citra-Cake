import {
  ArrowLeft,
  ChevronRight,
  Crown,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { BsCash } from "react-icons/bs";
import { IoMdHelpCircleOutline } from "react-icons/io";
import { Link, useNavigate } from "react-router";
import { motion } from "framer-motion";

/* ================= ANIMATION ================= */
const item = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0 },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

/* ================= DUMMY VOUCHER ================= */
const vouchers = [
  {
    id: 1,
    title: "2x Gratis Ongkir",
    icon: <Truck />,
    level: "Gold",
    expired: "31 Des 2025",
    minBuy: "Rp50.000",
    claimed: true,
  },
  {
    id: 2,
    title: "Diskon 20%",
    icon: <ShoppingBag />,
    level: "Gold",
    expired: "25 Des 2025",
    minBuy: "Rp75.000",
    claimed: false,
  },
  {
    id: 3,
    title: "Cashback 10%",
    icon: <BsCash />,
    level: "Member",
    expired: "20 Des 2025",
    minBuy: "Rp40.000",
    claimed: false,
  },
];

const BadgeUser = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{ show: { transition: { staggerChildren: 0.08 } } }}
      className="flex flex-col gap-3 pb-10 w-full md:gap-5 lg:gap-6"
    >
      {/* ================= HEADER ================= */}
      <motion.div
        variants={item}
        className="flex bg-white justify-between items-center shadow-sm px-5 py-2 md:px-8 lg:px-10"
      >
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate(-1)}
          className="hover:bg-gray-200 rounded-full p-2 cursor-pointer"
        >
          <ArrowLeft size={26} />
        </motion.button>

        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <Link
            to="/help"
            className="rounded-full p-1 text-primary cursor-pointer"
          >
            <IoMdHelpCircleOutline className="w-8 h-8" />
          </Link>
        </motion.div>
      </motion.div>

      {/* ================= BADGE CARD ================= */}
      <motion.div variants={fadeUp} className="px-5 w-full md:px-8 lg:px-10">
        <div
          className="flex flex-col w-full p-5 gap-3 rounded-xl bg-linear-to-b from-[#EDAF88E0] 
        to-[#714123] shadow-md shadow-black/40 md:p-6 lg:p-7"
        >
          {/* info */}
          <div className="flex justify-between items-start">
            <div className="flex gap-4 items-center">
              <Crown className="text-primary w-10 h-10" />
              <div className="flex flex-col text-sm">
                <span className="font-semibold">Gold Baker</span>
                <span>Ika Nur Hidayati</span>
                <span className="text-primary font-medium">
                  150 Lavender Point
                </span>
              </div>
            </div>

            <Link to="/badge/detail">
              <div className="flex items-center text-xs text-gray-700 cursor-pointer">
                <span>Lihat Semua Level</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </Link>
          </div>

          {/* progress */}
          <div className="flex justify-end text-xs text-gray-800">
            50 point lagi
          </div>

          <div className="w-full h-3 bg-purple-100 rounded-full overflow-hidden">
            <div className="w-1/2 h-full bg-primary rounded-full" />
          </div>

          <div className="flex justify-between text-[10px] text-gray-800">
            <span>Belanja & pertahankan level-mu sebelum 31.12.2025</span>
            <Link to={"/badge/progess/history"}>
              <span className="flex items-center gap-1 cursor-pointer">
                Rincian <ChevronRight className="w-3 h-3" />
              </span>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* ================= VOUCHER ================= */}
      <motion.div
        variants={fadeUp}
        className="px-5 space-y-3 w-full md:px-8 lg:px-10"
      >
        <h3 className="font-semibold text-sm text-gray-800">
          Voucher Spesial Kamu
        </h3>

        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-2">
          {vouchers.map((v) => (
            <motion.div
              key={v.id}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className={`flex bg-white rounded-xl border overflow-hidden ${
                v.claimed && "opacity-70"
              }`}
            >
              {/* ===== LEFT ===== */}
              <div className="w-[35%] flex flex-col justify-center items-center gap-2 p-3 relative md:w-[40%]">
                <div className="w-7 h-7 text-primary">{v.icon}</div>
                <p className="text-xs font-medium text-center leading-tight">
                  {v.title}
                </p>

                <span className="absolute right-0 top-2 bottom-2 border-r-2 border-dashed border-gray-300" />
              </div>

              {/* ===== RIGHT ===== */}
              <div className="flex-1 flex justify-between items-center p-3 gap-3">
                <div className="flex flex-col gap-1 text-[11px] text-gray-600">
                  <span className="px-2 py-0.5 w-fit rounded bg-yellow-100 text-yellow-700 font-medium">
                    Level {v.level}
                  </span>
                  <p>
                    Berlaku sampai{" "}
                    <span className="font-medium">{v.expired}</span>
                  </p>
                  <p>Min. belanja {v.minBuy}</p>
                </div>

                <button
                  disabled={v.claimed}
                  className={`text-[11px] px-3 py-1.5 rounded-full h-fit transition cursor-pointer ${
                    v.claimed
                      ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                      : "bg-primary text-white hover:bg-primary/90"
                  }`}
                >
                  {v.claimed ? "Digunakan" : "Klaim"}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default BadgeUser;
