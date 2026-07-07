import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { RiBankLine } from "react-icons/ri";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";

const PaymentDetail = () => {
  const navigate = useNavigate();
  const [isCopied, setIsCopied] = useState(false);

  const VA = "7755 7633 6066 5972 2";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(VA);
      setIsCopied(true);

      toast.success("Nomor VA Berhasil Disalin", {
        description: "Silahkan Lakukan Pembayaran Sesuai Nomor VA Tersebut",
      });

      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      toast.error("Nomor VA Gagal Disalin");
    }
  };

  return (
    <div className="min-h-screen  space-y-4">
      {/* ================= HEADER ================= */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center gap-2 bg-white px-4 py-3 shadow-sm"
      >
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-gray-300 cursor-pointer"
        >
          <ArrowLeft />
        </button>
        <h2 className="font-serif text-lg">Pembayaran</h2>
      </motion.div>

      {/* ================= MOBILE & TABLET CONTENT ================= */}
      <div className="lg:hidden flex flex-col space-y-4">
        {/* TOTAL */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between bg-white px-4 py-3 shadow-sm"
        >
          <h2 className="text-sm font-serif">Total Pembayaran</h2>
          <h2 className="text-xs text-[#F34E4E] font-roboto">Rp. 251.000</h2>
        </motion.div>

        {/* DEADLINE */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="flex items-center justify-between bg-white px-4 py-3 shadow-sm"
        >
          <h2 className="text-sm font-serif">Bayar Dalam</h2>
          <div className="flex flex-col items-end gap-2">
            <p className="text-xs text-[#F34E4E]">23 jam 59 menit 59 detik</p>
            <p className="text-xs font-medium">
              Jatuh Tempo 13 Mei 2025, 00.00
            </p>
          </div>
        </motion.div>

        {/* BANK INFO */}
        <div className="p-5 space-y-4">
          <div className="flex items-center gap-3">
            <RiBankLine size={28} className="text-[#A77551]" />
            <h2 className="font-serif text-gray-400">Transfer Bank Lainya</h2>
          </div>

          <div className="bg-white px-8 py-5 rounded-lg shadow-sm space-y-3">
            <div className="flex justify-between">
              <span className="text-xs text-gray-400">Bank Penerima</span>
              <span className="text-xs text-[#F34E4E]">SeaBank</span>
            </div>

            <p className="text-xs text-gray-400">No. Rek / Virtual Account</p>

            <div className="flex justify-between items-end">
              <h3 className="text-lg text-[#F34E4E]">{VA}</h3>
              <button
                onClick={handleCopy}
                className="text-primary text-xs font-medium cursor-pointer"
              >
                {isCopied ? "Tersalin ✓" : "Salin"}
              </button>
            </div>
          </div>

          <div className="bg-white px-8 py-5 rounded-lg shadow-sm space-y-3">
            <p className="text-xs text-primary">
              Proses verifikasi kurang dari 10 menit setelah pembayaran berhasil
            </p>
            <p className="text-xs">
              Penting: Pastikan kamu mentransfer ke Virtual Account di atas
            </p>
            <p className="text-xs">
              Menerima transfer dari semua Bank termasuk Bank Syariah
            </p>
          </div>
        </div>

        <div className="flex justify-center bg-white py-4">
          <Button className="bg-primary text-white w-3/4">OK</Button>
        </div>
      </div>

      {/* ================= DESKTOP VERSION ================= */}
      <div className="hidden lg:block max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-3 gap-8 mt-6">
          {/* ===== LEFT: SUMMARY ===== */}
          <div className="flex flex-col gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 rounded-xl shadow-sm"
            >
              <p className="text-sm text-gray-400">Total Pembayaran</p>
              <h2 className="text-2xl font-semibold text-[#F34E4E] mt-1">
                Rp. 251.000
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="bg-white p-6 rounded-xl shadow-sm"
            >
              <p className="text-sm text-gray-400">Bayar Dalam</p>
              <p className="text-sm text-[#F34E4E] mt-2">
                23 jam 59 menit 59 detik
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Jatuh tempo 13 Mei 2025, 00.00
              </p>
            </motion.div>
          </div>

          {/* ===== CENTER: VA HERO ===== */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white px-10 py-8 rounded-2xl shadow-md flex flex-col justify-center"
          >
            <div className="flex items-center gap-3 mb-6">
              <RiBankLine size={32} className="text-[#A77551]" />
              <h2 className="text-lg font-serif">Transfer Bank</h2>
            </div>

            <div className="flex justify-between mb-4">
              <span className="text-sm text-gray-400">Bank Penerima</span>
              <span className="text-[#F34E4E] font-medium">SeaBank</span>
            </div>

            <p className="text-xs text-gray-400">No. Rek / Virtual Account</p>

            <h1 className="text-2xl font-semibold text-[#F34E4E] tracking-widest mt-2">
              {VA}
            </h1>

            <Button
              variant="outline"
              onClick={handleCopy}
              className="mt-6 border-primary text-primary hover:bg-primary hover:text-white cursor-pointer"
            >
              {isCopied ? "Tersalin ✓" : "Salin"}
            </Button>
          </motion.div>

          {/* ===== RIGHT: INFO ===== */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-6 rounded-xl shadow-sm space-y-4"
          >
            <p className="text-sm text-primary">
              Proses verifikasi kurang dari 10 menit setelah pembayaran berhasil
            </p>

            <hr />

            <p className="text-sm">
              Pastikan kamu mentransfer ke Virtual Account yang tertera
            </p>

            <p className="text-sm">
              Menerima transfer dari semua Bank termasuk Bank Syariah
            </p>

            <Button className="bg-primary text-white w-full mt-4">OK</Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetail;
