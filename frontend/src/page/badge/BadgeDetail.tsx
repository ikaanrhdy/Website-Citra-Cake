import { Link, useNavigate } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, Star, Shield, Crown, Gem, Award } from "lucide-react";
import { IoMdHelpCircleOutline } from "react-icons/io";

/* ================= MOTION ================= */
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

/* ================= DATA ================= */
const badges = [
  {
    id: "classic",
    title: "Classic",
    requirement: "0 Pesanan atau 0 Point",
    levelBg: "bg-[linear-gradient(135deg,#5F2C7A_0%,#BC99D8_50%,#5F2C7A_100%)]",
    icon: Star,
    iconColor: "text-slate-600",
    benefits: ["Voucher Gratis Ongkir 2x", "Voucher Discount 5%"],
  },
  {
    id: "silver",
    title: "Silver",
    requirement: "5 Pesanan atau 50 Point",
    levelBg: "bg-[linear-gradient(135deg,#CFD2D3_0%,#9B94A1_50%,#5F2C7A_100%)]",
    icon: Shield,
    iconColor: "text-gray-500",
    benefits: ["Voucher Gratis Ongkir 5x", "Voucher Discount 10%"],
  },
  {
    id: "gold",
    title: "Gold",
    requirement: "20 Pesanan atau 100 Point",
    levelBg: "bg-[linear-gradient(135deg,#9B622C_0%,#EFDBB1_50%,#9B622C_100%)]",
    icon: Crown,
    iconColor: "text-yellow-500",
    benefits: [
      "Voucher Gratis Ongkir 10x",
      "Voucher Discount 20%",
      "Cashback 10%",
    ],
  },
  {
    id: "platinum",
    title: "Platinum",
    requirement: "50 Pesanan atau 200 Point",
    levelBg: "bg-[linear-gradient(135deg,#9A79C3_0%,#BC99D8_50%,#9A79C3_100%)]",
    icon: Gem,
    iconColor: "text-purple-600",
    benefits: [
      "Voucher Gratis Ongkir 25x",
      "Voucher Discount 50%",
      "Cashback 25%",
    ],
  },
];

/* ================= PAGE ================= */
const BadgeDetail = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-8 pb-10 w-full"
    >
      {/* ================= HEADER ================= */}
      <motion.div
        variants={item}
        className="flex bg-white justify-between items-center shadow-sm
        px-4 py-2
        sm:px-6
        lg:px-10"
      >
        <div className="flex gap-2 items-center">
          <motion.button
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate(-1)}
            className="hover:bg-gray-200 rounded-full p-2 cursor-pointer"
          >
            <ArrowLeft size={22} />
          </motion.button>
          <h1 className="font-medium text-sm sm:text-base">
            Rincian Member Citra
          </h1>
        </div>

        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <Link
            to="/help"
            className="rounded-full p-1 text-primary cursor-pointer "
          >
            <IoMdHelpCircleOutline className="w-7 h-7 sm:w-8 sm:h-8" />
          </Link>
        </motion.div>
      </motion.div>

      {/* ================= CARD LEVEL ================= */}
      <motion.section variants={item} className="px-4 sm:px-6 lg:px-10">
        <div className="rounded-2xl p-4 sm:p-6 lg:p-8 bg-[linear-gradient(135deg,#5F2C7A,#873EAD,#AE51E0)]">
          {/* Title */}
          <div className="flex gap-2 justify-center items-center text-white mb-6">
            <h1 className="font-bold font-serif">KRITERIA LEVEL</h1>
            <Award className="w-5 h-5 sm:w-6 sm:h-6 text-[#FF8B00]" />
            <h1 className="font-bold font-serif">Citra Member</h1>
          </div>

          {/* Grid */}
          <div className=" grid gap-4 grid-cols-2 md:grid-cols-4 justify-items-center">
            {badges.map((badge) => (
              <motion.div
                key={badge.id}
                variants={item}
                whileHover={{ y: -8, scale: 1.02 }}
                className={`w-full max-w-40 md:max-w-none rounded-xl p-4 sm:p-5 text-white shadow-md ${badge.levelBg} `}
              >
                <div className="text-center space-y-2">
                  <p className="text-base sm:text-lg font-semibold uppercase">
                    {badge.title}
                  </p>
                  <p className="text-xs sm:text-sm opacity-90 min-h-10">
                    {badge.requirement}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Note */}
          <div className="flex justify-center mt-6 ">
            <h2 className="text-xs sm:text-sm text-center">
              Catatan: Hanya transaksi & pesanan selesai yang <br />
              terhitung dalam progres Citra Member
            </h2>
          </div>
        </div>
      </motion.section>

      {/* ================= BENEFIT ================= */}
      <motion.section
        variants={item}
        className="px-4 sm:px-6 lg:px-10 max-w-7xl mx-auto w-full"
      >
        <div
          className="grid gap-4
          grid-cols-1
          md:grid-cols-2
          xl:grid-cols-4"
        >
          {badges.map((badge) => {
            const Icon = badge.icon;
            return (
              <motion.div
                key={badge.id}
                variants={item}
                whileHover={{ y: -4 }}
                className="rounded-xl p-5 bg-white shadow-sm border"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Icon className={badge.iconColor} size={20} />
                  <h3 className="font-semibold text-gray-800">
                    Benefit {badge.title}
                  </h3>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  {badge.benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <Icon size={14} className={`${badge.iconColor} mt-0.5`} />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.section>
    </motion.div>
  );
};

export default BadgeDetail;
