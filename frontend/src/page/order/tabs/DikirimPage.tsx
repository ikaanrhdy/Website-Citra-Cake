import { Button } from "@/components/ui/button";
import { product } from "@/data/product";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";

const DikirimPage = () => {
  const navigate = useNavigate();
  const data = product[0];

  if (!data) return null;

  return (
    <div className="flex flex-col gap-2 md:gap-6 lg:gap-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="flex flex-col gap-4 p-5 bg-white border border-gray-300 rounded-lg md:p-8 
        md:max-w-5xl md:mx-auto lg:p-10 lg:max-w-6xl"
      >
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h4 className="text-sm md:text-lg font-semibold">
            Custom Citra Cake
          </h4>
          <p className="text-primary text-sm md:text-lg font-semibold">
            Dikirim
          </p>
        </div>

        {/* PRODUCT */}
        <div className="flex justify-between gap-4 md:gap-8">
          <div className="flex gap-3 md:gap-6">
            <div className="flex p-1 rounded border border-gray-300">
              <img
                src={data.image}
                alt={data.title}
                className="w-20 h-20 md:w-28 md:h-28 rounded object-cover"
              />
            </div>

            <div className="flex flex-col justify-center gap-1">
              <h2 className="text-sm md:text-lg font-medium">{data.title}</h2>
              <p className="text-xs md:text-sm text-gray-400">Putih, Merah</p>
            </div>
          </div>

          <div className="flex flex-col items-end justify-center gap-2">
            <p className="text-xs md:text-base">x1</p>
            <p className="text-xs md:text-base font-medium">Rp {data.price}</p>
            <p className="text-xs md:text-base text-gray-600">
              Total: Rp {data.price}
            </p>
          </div>
        </div>

        {/* INFO */}
        <Button className="bg-purple-50 text-gray-800 md:text-base md:py-6 cursor-pointer hover:text-white">
          Cake sedang dikirim!
        </Button>

        {/* ACTION */}
        <div className="flex justify-end">
          <Button
            onClick={() =>
              navigate("/order/tracking", {
                state: {
                  product: data,
                  status: "Dikirim",
                  quantity: 1,
                  total: data.price,
                  eta: {
                    date: "18 Des 2025",
                    time: "18:00 - 21:00",
                  },
                },
              })
            }
            className="bg-purple-50 text-primary w-fit md:text-base md:px-8 md:py-6 cursor-pointer hover:text-white"
          >
            Riwayat Pengiriman
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default DikirimPage;
