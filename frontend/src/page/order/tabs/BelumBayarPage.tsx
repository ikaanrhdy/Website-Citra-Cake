import { Button } from "@/components/ui/button";
import { useShallow } from "zustand/react/shallow";
import UploadBuktiPembayaran from "@/components/user/UploadBuktiPembayaran";
import { motion } from "framer-motion";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useOrderStore, type Order } from "@/app/store/useOrderStore";
import { product } from "@/data/product";

const pageVariant = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const cardVariant = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
};

const rekomendasiContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const rekomendasiItem = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25 },
  },
};

const buttonMotion = {
  hover: { scale: 1.03 },
  tap: { scale: 0.97 },
};

const BelumBayarPage = () => {
  const orders = useOrderStore(useShallow((s) => s.getByStatus("Belum Bayar")));
  const cancelOrder = useOrderStore((s) => s.cancelOrder);
  const submitBuktiPembayaran = useOrderStore((s) => s.submitBuktiPembayaran);
  const rekomendasi = product.slice(1, 7);

  const navigate = useNavigate();
  const location = useLocation();
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);

  const handleLihatRincian = (order: Order) => {
                navigate(`/rincian-pesanan/${order.orderId}`, { state: { order } })
  };

  const handleUbahPembayaran = (order: Order) => {
    navigate("/checkout", {
      state: {
        orderId: order.orderId,
        fromOrder: true,
        items: [
          {
            id: order.product.id,
            title: order.product.title,
            image: order.product.image,
            price: order.product.price,
            qty: order.qty,
          },
        ],
        alamat: order.alamat,
        telepon: order.telepon,
        tanggalKirim: order.tanggalPengiriman,
        catatan: order.catatan,
      },
    });
  };

  const openUpload = (order: Order) => {
    setActiveOrder(order);
    setIsUploadOpen(true);
  };

  const handleUploadSubmit = (data: {
    orderId: string;
    file: File;
    note: string;
  }) => {
    // TODO: upload file ke server/storage dulu, dapetin URL asli
    submitBuktiPembayaran(data.orderId, {
      buktiUrl: URL.createObjectURL(data.file),
      catatan: data.note,
    });
    setIsUploadOpen(false);
    setActiveOrder(null);
  };

  if (orders.length === 0) {
    return (
      <p className="text-center text-gray-500 py-10">Tidak ada pesanan.</p>
    );
  }

  return (
    <>
      <motion.div
        variants={pageVariant}
        initial="hidden"
        animate="show"
        className="flex flex-col gap-4 md:gap-8 lg:gap-10"
      >
        {/* CARD Datanya */}
        {orders.map((order) => (
          <motion.div
            key={order.orderId}
            variants={cardVariant}
            className="flex flex-col gap-4 p-4 sm:p-5 bg-white border border-gray-300 rounded-lg overflow-hidden
            md:p-8 md:max-w-5xl md:mx-auto lg:p-10 lg:max-w-6xl"
          >
            {/* HEADER */}
            <div className="flex justify-between items-center gap-2">
              <h4 className="text-sm md:text-lg font-semibold truncate">
                Custom Citra Cake
              </h4>
              <button
                onClick={() => openUpload(order)}
                className="text-primary text-xs md:text-lg font-semibold shrink-0 cursor-pointer"
              >
                Upload Bukti Pembayaran
              </button>
            </div>

            {/* PRODUCT: grid kiri-kanan, ratio 1/3 gambar - 2/3 detail */}
            <div className="grid grid-cols-3 gap-3 md:gap-8">
              {/* GAMBAR - 1/3 */}
              <div className="col-span-1 flex items-start justify-center p-1 rounded-lg border border-[#D8DADC] shrink-0">
                <img
                  src={order.product.image}
                  alt={order.product.title}
                  className="w-full aspect-square rounded-lg object-cover"
                />
              </div>

              {/* DETAIL - 2/3, atas-bawah pakai grid rows */}
              <div className="col-span-2 grid grid-rows-2 gap-2 min-w-0">
                {/* ROW ATAS: nama produk & variant */}
                <div className="flex flex-col justify-center gap-1 min-w-0">
                  <h2 className="text-xs md:text-lg font-semibold truncate">
                    {order.product.title}
                  </h2>
                  <p className="text-[11px] md:text-sm text-gray-400">
                    {order.variant}
                  </p>
                </div>

                {/* ROW BAWAH: qty & harga */}
                <div className="flex flex-col justify-end items-end gap-1 text-right">
                  <p className="text-xs md:text-base">x{order.qty}</p>
                  <p className="text-xs md:text-base font-medium">
                    Rp {order.product.price.toLocaleString("id-ID")}
                  </p>
                  <p className="text-[11px] md:text-sm text-gray-500">
                    Total 1 produk: Rp{" "}
                    {(order.product.price * order.qty).toLocaleString("id-ID")}
                  </p>
                </div>
              </div>
            </div>

            <motion.div {...buttonMotion} whileHover="hover" whileTap="tap">
              <Button className="bg-purple-50 text-gray-800 text-xs sm:text-sm md:text-base md:py-6 w-full rounded-lg hover:text-white cursor-pointer">
                Ayo Bayar Segera!
              </Button>
            </motion.div>

            <div className="grid grid-cols-2 gap-2 md:gap-3">
              <motion.div {...buttonMotion} whileHover="hover" whileTap="tap">
                <Button
                  onClick={() => handleLihatRincian(order)}
                  className="text-gray-800 bg-white border border-gray-300 w-full rounded-lg md:py-6 cursor-pointer hover:text-white"
                >
                  Rincian Pesanan
                </Button>
              </motion.div>

              <motion.div {...buttonMotion} whileHover="hover" whileTap="tap">
                <Button
                  onClick={() => cancelOrder(order.orderId)}
                  className="text-primary bg-purple-50 w-full rounded-lg md:py-6 cursor-pointer hover:text-white"
                >
                  Batalkan Pesanan
                </Button>
              </motion.div>

              <motion.div {...buttonMotion} whileHover="hover" whileTap="tap">
                <Button
                  onClick={() => handleUbahPembayaran(order)}
                  className="text-primary bg-white border border-primary w-full rounded-lg md:py-6 cursor-pointer hover:text-white"
                >
                  Ubah Pembayaran
                </Button>
              </motion.div>

              <motion.div {...buttonMotion} whileHover="hover" whileTap="tap">
                <Button
                  onClick={() => openUpload(order)}
                  className="bg-primary text-white w-full rounded-lg md:py-6 cursor-pointer text-xs sm:text-sm"
                >
                  Upload Bukti
                </Button>
              </motion.div>
            </div>
          </motion.div>
        ))}
        {/* ================= REKOMENDASI ================= */}
        <motion.div variants={cardVariant} className="flex flex-col gap-3">
          <div className="flex justify-center">
            <h3 className="text-sm md:text-base font-semibold text-gray-700">
              Rekomendasi untuk kamu
            </h3>
          </div>

          <motion.div
            variants={rekomendasiContainer}
            className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-5"
          >
            {rekomendasi.map((item) => (
              <Link to={`/product/${item.id}`} key={item.id}>
                <motion.div
                  key={item.id}
                  variants={rekomendasiItem}
                  whileHover={{ y: -4, scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="bg-white border border-gray-200 rounded-lg p-2 flex flex-col gap-2 
                cursor-pointer hover:shadow-md transition"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full aspect-square rounded object-cover"
                  />
                  <p className="text-[11px] md:text-xs line-clamp-2 text-gray-700">
                    {item.title}
                  </p>
                </motion.div>
              </Link>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>

      <UploadBuktiPembayaran
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        orderId={activeOrder?.orderId ?? ""}
        product={
          activeOrder
            ? {
                title: activeOrder.product.title,
                image: activeOrder.product.image,
                variant: activeOrder.variant,
                qty: activeOrder.qty,
                price: activeOrder.product.price,
                total: activeOrder.product.price * activeOrder.qty,
              }
            : undefined
        }
        onSubmit={handleUploadSubmit}
      />
    </>
  );
};

export default BelumBayarPage;
