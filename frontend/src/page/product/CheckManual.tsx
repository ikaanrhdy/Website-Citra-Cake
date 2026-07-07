import { product } from "@/data/product";
import type { products } from "@/types/data";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { FaCartShopping } from "react-icons/fa6";
import { Link, useNavigate, useParams } from "react-router";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const Size = ["12", "18", "20", "24", "30", "35", "40", "45", "50", "55"];
const Variant = [
  "Coklat",
  "Vanilla",
  "Red Velvet",
  "Strawberry",
  "2 Mix",
  "3 Mix",
  "Tiramisu",
  "Blueberry",
  "Almond",
  "Black Forest",
  "Pandan",
  "Raspberry",
];

const CheckManual = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const data = product.find((item: products) => item.id === id);

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedVariant, setSelectedVariant] = useState("");
  const [quantity, setQuantity] = useState(1);

  const increase = () => setQuantity((prev) => prev + 1);
  const decrease = () => setQuantity((prev) => Math.max(1, prev - 1));

  if (!data) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex flex-col"
    >
      {/* ================= HEADER ================= */}
      <div className="flex bg-white justify-between px-5 py-3 items-center shadow-sm">
        <button
          onClick={() => navigate(-1)}
          className="hover:bg-gray-300 hover:rounded-full p-2 cursor-pointer"
        >
          <ArrowLeft size={30} />
        </button>

        <Link
          to="/cart"
          className="hover:bg-[#9555b8] hover:rounded-full p-3 cursor-pointer text-primary
           hover:text-white"
        >
          <FaCartShopping size={25} />
        </Link>
      </div>

      {/* ================= IMAGE ================= */}
      <motion.div
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex m-5 bg-white overflow-hidden rounded-md p-5
                   justify-center items-center
                   md:m-8 md:p-8 lg:m-10 lg:p-10"
      >
        <img
          src={data.image}
          alt={data.title}
          className="w-40 h-40 md:w-60 md:h-60 rounded-md object-contain"
        />
      </motion.div>

      {/* ================= SIZE ================= */}
      <div className="flex flex-col gap-2 p-5 md:px-10 lg:px-16">
        <h3 className="font-bold text-lg">Pilih Ukuran</h3>
        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-2 md:gap-3">
          {Size.map((size) => (
            <motion.button
              key={size}
              onClick={() => setSelectedSize(size)}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              className={`text-sm py-2 px-3 rounded shadow-md transition-colors cursor-pointer
                ${
                  selectedSize === size
                    ? "bg-[#5F2C7A] text-white"
                    : "bg-gray-300 text-black hover:bg-gray-400"
                }`}
            >
              {size} cm
            </motion.button>
          ))}
        </div>
      </div>

      {/* ================= VARIANT ================= */}
      <div className="flex flex-col gap-2 p-5 md:px-10 lg:px-16">
        <h3 className="font-bold text-lg">Pilih Varian Rasa</h3>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {Variant.map((variant) => (
            <motion.button
              key={variant}
              onClick={() => setSelectedVariant(variant)}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              className={`text-sm py-2 px-3 rounded shadow-md transition-colors cursor-pointer
                ${
                  selectedVariant === variant
                    ? "bg-[#5F2C7A] text-white"
                    : "bg-gray-300 text-black hover:bg-gray-400"
                }`}
            >
              {variant}
            </motion.button>
          ))}
        </div>
      </div>

      {/* ================= PRICE ================= */}
      <div className="flex flex-col gap-2 p-5 md:px-10 lg:px-16">
        <h3 className="font-bold text-lg">Tambah Ucapan</h3>
        <div className="flex bg-white rounded-md p-5 items-center gap-6 md:gap-10">
          <img
            src={data.image}
            alt={data.title}
            className="w-20 h-20 md:w-32 md:h-32 rounded-md object-contain"
          />
          <h2 className="font-medium text-md md:text-lg">Rp. {data.price}</h2>
        </div>
      </div>

      {/* ================= QUANTITY ================= */}
      <div className="flex flex-row justify-between p-5 md:px-10 lg:px-16">
        <h2 className="font-medium">Jumlah</h2>

        <div className="flex items-center">
          <div
            className="flex items-center border-2 border-gray-300 rounded-md overflow-hidden text-xs 
          md:text-sm md:scale-110 lg:scale-125"
          >
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="px-3 py-1 md:px-4 hover:bg-gray-100 border-r border-gray-300"
              onClick={decrease}
            >
              −
            </motion.button>

            <div className="px-4 py-1 min-w-10 text-center font-medium border-r border-gray-300">
              {quantity}
            </div>

            <motion.button
              whileTap={{ scale: 0.9 }}
              className="px-3 py-1 md:px-4 hover:bg-gray-100"
              onClick={increase}
            >
              +
            </motion.button>
          </div>
        </div>
      </div>

      {/* ================= CTA ================= */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col md:flex-row gap-3 p-5 md:px-10 lg:px-16"
      >
        <Button
          className="bg-[#5F2C7A] text-white w-full md:w-1/2 md:py-6 lg:py-7 text-sm 
        md:text-base transition-transform hover:scale-[1.02]"
        >
          Beli Sekarang
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default CheckManual;
