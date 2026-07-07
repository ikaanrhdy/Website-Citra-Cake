import {
  ArrowLeft,
  PackageCheck,
  Truck,
  MapPin,
  Home,
  Bot,
} from "lucide-react";
import { IoMdHelpCircleOutline } from "react-icons/io";
import { motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router";
import type { JSX } from "react";
import type { products } from "@/types/data";

type TrackingStatus = {
  title: string;
  desc: string;
  date: string;
  icon: JSX.Element;
};

const OrderTrackingPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation() as {
    state: {
      product: products;
      status: string;
      quantity: number;
      total: number;
      eta: {
        date: string;
        time: string;
      };
    };
  };

  if (!state) {
    navigate("/home");
    return null;
  }

  const trackingData: TrackingStatus[] = [
    {
      title: "Sedang Diantar",
      desc: "Kurir sedang mengantarkan pesanan",
      date: "18 Des 2025 • 09:10",
      icon: <Truck size={14} />,
    },
    {
      title: "Tiba di Kota Tujuan",
      desc: "Paket tiba di gudang kota tujuan",
      date: "17 Des 2025 • 22:41",
      icon: <MapPin size={14} />,
    },
    {
      title: "Diserahkan ke Kurir",
      desc: "Paket telah diserahkan ke ekspedisi",
      date: "17 Des 2025 • 11:02",
      icon: <PackageCheck size={14} />,
    },
    {
      title: "Dikemas",
      desc: "Penjual sedang menyiapkan pesanan",
      date: "17 Des 2025 • 09:30",
      icon: <Home size={14} />,
    },
  ];

  return (
    <div className="min-h-screen ">
      {/* ================= HEADER ================= */}
      <div className="sticky top-0 bg-white border-b z-10">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-200 cursor-pointer rounded-full"
            >
              <ArrowLeft className="w-6 h-6 md:w-8 md:h-8" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={"/chat-bot"}
              className="p-2 rounded-full hover:bg-gray-300"
            >
              <Bot className="text-primary w-8 h-8 md:w-10 md:h-10" />
            </Link>
            <Link to={"/help"} className="p-2 rounded-full hover:bg-gray-300">
              <IoMdHelpCircleOutline className="text-primary w-8 h-8 md:w-10 md:h-10" />
            </Link>
          </div>
        </div>
      </div>

      {/* ================= TRACKING HORIZONTAL ================= */}
      <div className="p-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h2 className="font-semibold text-sm sm:text-base mb-4 sm:mb-6">
            Status Pengiriman
          </h2>

          <div className="relative w-full">
            {/* garis */}
            <div className="absolute top-[9px] sm:top-3.5 left-0 w-full h-0.5 sm:h-0.5 bg-gray-200" />
            <div className="absolute top-[9px] sm:top-3.5 left-0 w-2/3 h-0.5 sm:h-0.5 bg-primary" />

            {/* dots */}
            <div className="flex justify-between relative">
              {[
                { title: "Sedang dikirim", active: true },
                { title: "Menuju alamatmu", active: true },
                { title: "Pesanan tiba", active: false },
              ].map((item, index) => (
                <div key={index} className="flex flex-col items-center">
                  <span
                    className={`w-4 h-4 sm:w-6 sm:h-6 rounded-full ${
                      item.active
                        ? "bg-primary"
                        : "bg-white border border-gray-300"
                    }`}
                  />
                  <p
                    className={`mt-1 sm:mt-2 text-[10px] sm:text-xs text-center font-medium ${
                      item.active ? "text-primary" : "text-gray-500"
                    }`}
                  >
                    {item.title}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ================= ORDER CARD ================= */}
      <div className="p-4">
        <div className="bg-white rounded-xl p-4 shadow-sm flex gap-3 sm:gap-4">
          <img
            src={state.product.image}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover"
          />

          <div className="flex flex-col justify-between">
            <div>
              <p className="text-sm sm:text-base font-medium">
                {state.product.title}
              </p>
              <p className="text-xs sm:text-sm text-primary">
                {state.quantity} item
              </p>
            </div>

            <span className="text-xs sm:text-sm font-semibold text-primary">
              {state.status}
            </span>
          </div>
        </div>
      </div>

      {/* ================= RIWAYAT PENGIRIMAN ================= */}
      <div className="p-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h2 className="font-semibold text-sm sm:text-base mb-4">
            Riwayat Pengiriman
          </h2>

          {trackingData.map((item, index) => {
            const isActive = index === 0;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex gap-3 sm:gap-4 relative pb-5"
              >
                {index !== trackingData.length - 1 && (
                  <span
                    className={`absolute left-[11px] sm:left-[15px] top-6 h-full border-l ${
                      isActive
                        ? "border-primary"
                        : "border-dashed border-gray-300"
                    }`}
                  />
                )}

                <div
                  className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center z-10
                  ${
                    isActive
                      ? "bg-primary text-white"
                      : "bg-white border border-gray-300 text-gray-400"
                  }`}
                >
                  {item.icon}
                </div>

                <div className="flex-1">
                  <p
                    className={`text-sm sm:text-base font-medium ${
                      isActive ? "text-primary" : "text-gray-800"
                    }`}
                  >
                    {item.title}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500">
                    {item.desc}
                  </p>
                  <p className="text-[10px] sm:text-xs text-gray-400 mt-0.5">
                    {item.date}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingPage;
