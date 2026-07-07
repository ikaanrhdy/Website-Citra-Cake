import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ChevronRight, X } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useState } from "react";

const MotionLink = motion(Link);

const itemHover = {
  hover: { scale: 1.01 },
  tap: { scale: 0.98 },
};

const SettingAccount = () => {
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");

  const openModal = (title: string) => {
    setDialogTitle(title);
    setOpenDialog(true);
  };

  return (
    <div className="flex flex-col relative">
      {/* ================= HEADER ================= */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex bg-white p-3 md:px-6 items-center border-b"
      >
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-200 rounded-full transition cursor-pointer"
        >
          <ArrowLeft />
        </button>
        <h2 className="ml-2 font-medium text-sm md:text-base">
          Pengaturan Akun
        </h2>
      </motion.div>

      {/* ================= AKUN SAYA ================= */}
      <div className="flex px-10 py-5">
        <h2 className="text-gray-600 text-sm">Akun Saya</h2>
      </div>

      <div className="flex flex-col gap-1">
        {/* PROFILE (LINK — NO DIALOG) */}
        <MotionLink
          to="/edit-profile"
          variants={itemHover}
          whileHover="hover"
          whileTap="tap"
          className="flex mx-5 bg-white px-5 py-4"
        >
          <div className="flex w-full justify-between">
            <h2 className="font-medium font-serif text-[15px]">Profile Saya</h2>
            <ChevronRight />
          </div>
        </MotionLink>

        {/* DIALOG ITEMS */}
        {[
          { label: "Username" },
          { label: "No. Handphone" },
          { label: "Email" },
          { label: "Akun Media Sosial" },
        ].map((item, i) => (
          <motion.div
            key={i}
            variants={itemHover}
            whileHover="hover"
            whileTap="tap"
            onClick={() => openModal(item.label)}
            className="flex mx-5 bg-white px-5 py-4 cursor-pointer"
          >
            <div className="flex justify-between w-full">
              <h2 className="font-medium font-serif text-[15px]">
                {item.label}
              </h2>
              <ChevronRight />
            </div>
          </motion.div>
        ))}
      </div>

      {/* ================= KEAMANAN ================= */}
      <div className="flex px-10 py-5">
        <h2 className="text-gray-600 text-sm">Keamanan</h2>
      </div>

      <div className="flex flex-col gap-1">
        {["Ganti Password", "Verifikasi Sidik Jari"].map((label, i) => (
          <motion.div
            key={i}
            variants={itemHover}
            whileHover="hover"
            whileTap="tap"
            onClick={() => openModal(label)}
            className="flex flex-col mx-5 bg-white px-5 py-4 cursor-pointer"
          >
            <div className="flex justify-between">
              <h2 className="font-medium font-serif text-[15px]">{label}</h2>
              <ChevronRight />
            </div>

            {label === "Verifikasi Sidik Jari" && (
              <p className="text-[10px] text-gray-400 mt-1">
                Citra Cake tidak menyimpan sidik jari. <br />
                Data tersimpan di perangkat.
              </p>
            )}
          </motion.div>
        ))}
      </div>

      {/* ================= LOGO ================= */}
      <div className="flex justify-center">
        <img
          src="/logo/logo.png"
          alt="logo"
          className="w-64 h-64 md:w-82 md:h-82 lg:w-102 lg:h-102"
        />
      </div>

      {/* ================= DIALOG ================= */}
      <AnimatePresence>
        {openDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl w-[85%] max-w-sm p-5"
            >
              <div className="flex justify-between items-center mb-3">
                <h2 className="font-medium text-sm">{dialogTitle}</h2>
                <button onClick={() => setOpenDialog(false)}>
                  <X size={18} className="cursor-pointer" />
                </button>
              </div>

              <p className="text-xs text-gray-500">
                Fitur <b>{dialogTitle}</b> akan segera tersedia.
              </p>

              <button
                onClick={() => setOpenDialog(false)}
                className="mt-4 w-full py-2 rounded bg-primary text-white text-sm cursor-pointer"
              >
                Mengerti
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SettingAccount;
