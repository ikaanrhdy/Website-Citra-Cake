import { motion } from "framer-motion";
import {
  ArrowLeft,
  Bot,
  ChevronRight,
  ClipboardList,
  Phone,
} from "lucide-react";
import { Link, useNavigate } from "react-router";

interface Questions {
  id: number;
  question: string;
}

const questions: Questions[] = [
  {
    id: 1,
    question: "[Kustomer Kue] Bagaimana cara order produk?",
  },
  {
    id: 2,
    question:
      "[Pelacakan Pesanan] Bagaimana Cara Mengetahui estimasi waktu pengiriman?",
  },
  {
    id: 3,
    question:
      "[Pelacakan Pesanan] Bagaimana Cara Menghubungi jasa kirim yang didukung untuk melacak pesanan?",
  },
  {
    id: 4,
    question:
      "[Akun Saya] Bagaimana cara mengubah/memperbarui nomor telepon saya?",
  },
  {
    id: 5,
    question:
      "[Customer Service] Bagaimana cara menghubungi Customer Service Citra Cake?",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0 },
};

const ScreenPusatBantuan = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen ">
      {/* ===== HEADER ===== */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center gap-2 bg-white px-4 py-3 shadow-sm
                   md:px-6 lg:px-10"
      >
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-gray-200 cursor-pointer"
        >
          <ArrowLeft />
        </button>
        <h2 className="font-serif text-lg md:text-xl">Pusat Bantuan</h2>
      </motion.div>

      {/* ===== TITLE ===== */}
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center font-medium mt-6
                   md:text-lg lg:text-xl"
      >
        Hallo, apa ada yang bisa dibantu?
      </motion.h2>

      {/* ===== MAIN GRID ===== */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="px-4 mt-6 space-y-6
                   md:grid md:grid-cols-2 md:gap-6 md:space-y-0
                   lg:max-w-6xl lg:mx-auto"
      >
        {/* ===== ORDER CARD ===== */}
        <motion.div
          variants={item}
          className="bg-white p-5 border rounded-lg space-y-4"
        >
          <div className="flex justify-between items-center">
            <h5 className="font-medium text-xs md:text-sm font-serif">
              Butuh Bantuan dengan Pesanan?
            </h5>
            <div className="flex items-center text-gray-500 text-xs">
              ubah pesanan <ChevronRight />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="p-3 border rounded-md">
              <img
                src="/product/1.avif"
                alt="product"
                className="w-20 h-20 object-cover"
              />
            </div>
            <div className="flex flex-col justify-center gap-2">
              <h5 className="text-sm font-medium">Custom Fresh Cake</h5>
              <span className="text-xs text-gray-400">Belum Dibayar</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button className="w-1/2 border rounded-md py-2 flex justify-center items-center gap-2 text-[#F34E4E]">
              <ClipboardList size={14} />
              <span className="text-xs">Batalkan</span>
            </button>
            <button className="w-1/2 border rounded-md py-2 text-xs font-medium">
              Ubah Alamat
            </button>
          </div>
        </motion.div>

        {/* ===== FAQ ===== */}
        <motion.div
          variants={item}
          className="bg-white p-5 border rounded-lg space-y-4"
        >
          <h5 className="font-medium font-serif">FAQ</h5>

          <div className="space-y-3">
            {questions.map((q) => (
              <div key={q.id}>
                <p className="text-sm font-medium">{q.question}</p>
                <div className="border-b mt-2" />
              </div>
            ))}
          </div>

          <div className="flex justify-center">
            <button className="text-sm text-gray-400 hover:text-gray-600">
              Lihat lebih banyak
            </button>
          </div>
        </motion.div>
      </motion.div>

      {/* ===== CONTACT ===== */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="px-4 mt-8
                   lg:max-w-6xl lg:mx-auto"
      >
        <motion.div
          variants={item}
          className="bg-white p-5 border rounded-lg space-y-4"
        >
          <h2 className="text-lg font-medium">HUBUNGI KAMI</h2>

          <div className="flex items-center gap-4">
            <Link to="/chat" className="p-2 rounded-full hover:bg-gray-200">
              <Bot className="text-primary" size={30} />
            </Link>
            <span className="font-serif">Chat dengan Citra</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-2 rounded-full hover:bg-gray-200">
              <Phone className="text-primary" size={26} />
            </div>
            <div>
              <h5 className="font-serif">Telephone Kami</h5>
              <p className="text-xs text-gray-400 mt-1">+62 895 1237 4562</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ScreenPusatBantuan;
