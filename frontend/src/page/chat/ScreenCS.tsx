import { product } from "@/data/product";
import { ArrowLeft, UserCircle } from "lucide-react";
import { IoSend } from "react-icons/io5";
import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router";

const ScreenCS = () => {
  const data = product;
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  return (
    <div className="flex flex-col  min-h-screen">
      {/* ===== Header ===== */}
      <div className="flex items-center gap-3 bg-white p-4 shadow-sm">
        <button
          onClick={() => navigate(-1)}
          className="cursor-pointer  hover:bg-gray-400 hover:rounded-full p-2"
        >
          <ArrowLeft />
        </button>

        <UserCircle size={30} />
        <h2 className="text-lg font-medium font-roboto">Citra</h2>
      </div>

      {/* ===== Date ===== */}
      <div className="flex justify-center my-2">
        <p className="text-gray-400 text-xs font-medium">Mei 11, 01:18 siang</p>
      </div>

      {/* ===== Chat Area ===== */}
      <div className="flex flex-col gap-2 flex-1">
        {/* Bubble Left */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-5 max-w-xs md:max-w-md lg:max-w-lg"
        >
          <div className="bg-white px-4 py-3 rounded-lg shadow-sm text-sm md:text-base">
            Hallo ikaa, aku citra
          </div>
        </motion.div>

        {/* Bubble Option */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-5 max-w-xs md:max-w-md lg:max-w-lg"
        >
          <div className="bg-white px-4 py-4 rounded-lg shadow-sm flex flex-col gap-4 text-sm md:text-base">
            <h5 className="font-medium">
              Silahkan pilih topik yang ingin kamu tanyakan:
            </h5>

            <div className="flex flex-col gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i}>
                  <p>Bagaimana Cara Melacak status pengiriman?</p>
                  <div className="border-b border-gray-200 mt-2" />
                </div>
              ))}
            </div>

            <div className="flex justify-center">
              <button className="text-gray-400 hover:text-gray-600 transition">
                Ganti Pertanyaan
              </button>
            </div>
          </div>
        </motion.div>

        {/* Bubble Right */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-5 flex justify-end"
        >
          <div className="bg-[#E4B3FF] px-4 py-3 rounded-lg shadow-sm text-sm md:text-base max-w-xs md:max-w-md lg:max-w-lg">
            Hallo ikaa, aku citra
          </div>
        </motion.div>

        {/* Bubble Left */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-5 max-w-xs md:max-w-md lg:max-w-lg"
        >
          <div className="bg-white px-4 py-3 rounded-lg shadow-sm text-sm md:text-base">
            Ada yang bisa aku bantu?
          </div>
        </motion.div>

        {/* ===== Product Cards ===== */}
        <div className="px-5 mt-2">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4 lg:gap-6"
          >
            {/* Mobile → 2 Card */}
            {data.slice(0, 2).map((item, i) => (
              <div
                key={`m-${i}`}
                className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col md:hidden"
              >
                <div className="aspect-4/3 bg-gray-100">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-3 text-xs flex flex-col gap-1">
                  <p className="font-medium line-clamp-2">{item.title}</p>
                  <p className="text-gray-400">Rp {item.price}</p>
                </div>
              </div>
            ))}

            {/* Tablet & Desktop → 4 Card */}
            {data.slice(0, 4).map((item, i) => (
              <div
                key={`d-${i}`}
                className="hidden md:flex bg-white rounded-lg shadow-sm overflow-hidden flex-col"
              >
                <div className="aspect-4/3 bg-gray-100">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 text-sm flex flex-col gap-1">
                  <p className="font-medium line-clamp-2">{item.title}</p>
                  <p className="text-gray-400">Rp {item.price}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ===== Input Chat ===== */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 bg-white p-3 border-t mt-5"
      >
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ketik pesan..."
          className="flex-1 text-sm md:text-base outline-none placeholder:text-gray-300"
        />
        <button className="text-[#5F2C7A] hover:scale-110 transition">
          <IoSend size={20} />
        </button>
      </motion.div>
    </div>
  );
};

export default ScreenCS;
