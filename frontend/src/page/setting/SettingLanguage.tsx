import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { ArrowLeft, Check } from "lucide-react";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const item = {
  hidden: { y: 12, opacity: 0 },
  show: { y: 0, opacity: 1 },
};

const SettingLanguage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* ================= HEADER ================= */}
      <motion.div
        initial={{ y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center justify-between bg-white p-3 md:px-6 border-b sticky top-0 z-10"
      >
        <div className="flex gap-2 items-center">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-200 rounded-full transition cursor-pointer"
          >
            <ArrowLeft />
          </button>

          <h2 className="font-medium text-sm md:text-lg">Pengaturan Akun</h2>
        </div>

        <button className="text-primary text-sm md:text-base font-medium pr-2 hover:opacity-80 transition">
          Selesai
        </button>
      </motion.div>

      {/* ================= CONTENT ================= */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="flex flex-col gap-6 px-4 md:px-10 py-6 max-w-3xl lg:max-w-4xl w-full mx-auto"
      >
        {/* ===== Bahasa Utama ===== */}
        <motion.div variants={item}>
          <h3 className="text-gray-600 text-sm md:text-base font-medium mb-2">
            Bahasa Utama
          </h3>

          <div className="bg-white rounded-2xl border shadow-sm">
            <button className="w-full flex items-center justify-between px-5 py-3 md:py-4 hover:bg-gray-50 transition">
              <span className="font-medium text-sm md:text-base">
                Bahasa Indonesia
              </span>
              <Check size={22} className="text-primary" />
            </button>
          </div>
        </motion.div>

        {/* ===== Bahasa Lainnya ===== */}
        <motion.div variants={item}>
          <h3 className="text-gray-600 text-sm md:text-base font-medium">
            Bahasa Lainnya
          </h3>
          <p className="text-[10px] md:text-xs text-gray-400 mt-1">
            Bahasa ini diterjemahkan secara otomatis oleh layanan pihak ketiga
          </p>

          <div className="bg-white rounded-2xl border shadow-sm mt-3">
            <button className="w-full flex items-center justify-between px-5 py-3 md:py-4 hover:bg-gray-50 transition cursor-pointer">
              <span className="font-medium text-sm md:text-base">English</span>
            </button>

            <button className="w-full flex items-center justify-between px-5 py-3 md:py-4 hover:bg-gray-50 transition border-t cursor-pointer">
              <span className="font-medium text-sm md:text-base">
                Bahasa Indonesia
              </span>
            </button>
          </div>
        </motion.div>

        {/* ===== LOGO ===== */}
        <motion.div
          variants={item}
          className="flex justify-center pt-10 md:pt-16"
        >
          <motion.img
            src="/logo/logo.png"
            alt="logo"
            className="w-40 h-40 md:w-56 md:h-56 opacity-90"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SettingLanguage;
