import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowLeft, PlusCircle } from "lucide-react";
import { Link, useNavigate } from "react-router";

/* ================= ANIMATION ================= */

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

const hover = {
  hover: { scale: 1.02 },
  tap: { scale: 0.98 },
};

/* ================= COMPONENT ================= */

const SettingAddress = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-2 min-h-screen bg-gray-50">
      {/* ================= HEADER ================= */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex bg-white p-3 md:px-6 items-center border-b sticky top-0 z-10"
      >
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-200 rounded-full transition cursor-pointer"
        >
          <ArrowLeft />
        </button>
        <h2 className="ml-2 font-medium text-sm md:text-base">Alamat Saya</h2>
      </motion.div>

      {/* ================= TITLE ================= */}
      <div className="px-5 md:px-8 lg:px-12 py-2">
        <h2 className="text-gray-600 text-sm">Alamat</h2>
      </div>

      {/* ================= ADDRESS LIST ================= */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className=" grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 px-5 md:px-8 lg:px-12
        "
      >
        {/* ================= ADDRESS CARD ================= */}
        {[1, 2].map((_, i) => (
          <motion.div
            key={i}
            variants={item}
            whileHover="hover"
            whileTap="tap"
            className="bg-white rounded-lg shadow-sm border"
          >
            <motion.div
              variants={hover}
              className="flex flex-col px-5 py-4 gap-3 h-full"
            >
              <div className="flex flex-wrap gap-2">
                <h2 className="font-medium font-serif text-xs">
                  Ika Nur Hidayati
                </h2>
                <span className="text-gray-400 text-xs">
                  | (+62) 895-1234-5678
                </span>
              </div>

              <div className="text-gray-500 text-xs leading-relaxed">
                <p>Jl. Al-Barokah, .......</p>
                <p>Rawalo, Jawa Timur, Indonesia</p>
              </div>

              <Button
                size="sm"
                className="mt-auto w-fit bg-purple-100 text-primary hover:bg-purple-200"
              >
                Alamat saya
              </Button>
            </motion.div>
          </motion.div>
        ))}

        {/* ================= ADD ADDRESS ================= */}
        <motion.div
          variants={item}
          whileHover="hover"
          whileTap="tap"
          className="bg-white border-dashed border-2 rounded-lg"
        >
          <Link
            to="/profile/settings/account/add"
            className="flex flex-col items-center justify-center gap-2 py-10 h-full text-primary"
          >
            <PlusCircle size={28} />
            <span className="text-sm font-medium">Tambah Alamat Baru</span>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SettingAddress;
