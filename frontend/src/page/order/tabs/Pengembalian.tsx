import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { useOrderStore, type ReturnOutcome } from "@/app/store/useOrderStore";
import { useShallow } from "zustand/react/shallow";

// Mapping label & teks tombol berdasarkan outcome pengembalian
const outcomeConfig: Record<
  ReturnOutcome,
  { label: string; buttonLabel: string }
> = {
  Selesai: {
    label: "Pengembalian Dana Selesai",
    buttonLabel: "Rincian Pengembalian",
  },
  Dibatalkan: {
    label: "Pengajuan Dibatalkan",
    buttonLabel: "Rincian Pembatalan",
  },
  Ditolak: {
    label: "Pengajuan Ditolak",
    buttonLabel: "Rincian Pengembalian",
  },
};

const Pengembalian = () => {
  const orders = useOrderStore(
    useShallow((s) => s.getByStatus("Pengembalian Selesai")),
  );
  const navigate = useNavigate();

  if (orders.length === 0) {
    return (
      <p className="text-center text-gray-500 py-10">Tidak ada pengembalian.</p>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.08 } },
      }}
      className="flex flex-col gap-4 md:gap-6 lg:gap-8"
    >
      {orders.map((order) => {
        const outcome = order.returnDetail?.outcome ?? "Selesai";
        const config = outcomeConfig[outcome];

        return (
          <motion.div
            key={order.orderId}
            variants={{
              hidden: { opacity: 0, y: 16 },
              show: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="flex flex-col gap-4 p-5 bg-white border border-gray-200 rounded-xl overflow-hidden
            md:p-6 md:max-w-3xl md:mx-auto lg:p-7"
          >
            {/* HEADER */}
            <div className="flex justify-between items-center gap-2">
              <h4 className="text-sm md:text-base font-semibold truncate">
                Citra Cake
              </h4>
              <p className="text-primary text-sm md:text-base font-semibold shrink-0">
                {config.label}
              </p>
            </div>

            {/* PRODUCT: grid kiri-kanan, ratio 1/3 gambar - 2/3 detail */}
            <div className="grid grid-cols-3 gap-3 md:gap-4">
              {/* GAMBAR - 1/3 */}
              <div className="col-span-1 flex items-start justify-center p-1 rounded-lg border border-gray-300 shrink-0">
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
                  <h2 className="text-sm md:text-base font-semibold truncate">
                    {order.product.title}
                  </h2>
                  <p className="text-[11px] md:text-sm text-gray-400">
                    {order.variant}
                  </p>
                  {outcome !== "Selesai" && order.returnDetail?.reason && (
                    <p className="text-[10px] md:text-xs text-gray-500 italic truncate">
                      Alasan: {order.returnDetail.reason}
                    </p>
                  )}
                </div>

                {/* ROW BAWAH: qty & harga */}
                <div className="flex flex-col justify-end items-end gap-2 text-right">
                  <p className="text-xs md:text-sm">x{order.qty}</p>
                  <p className="text-xs md:text-sm font-medium">
                    Rp {order.product.price.toLocaleString("id-ID")}
                  </p>
                  <p className="text-[11px] md:text-xs text-gray-600">
                    Jumlah Pengembalian Dana: Rp{" "}
                    {(order.product.price * order.qty).toLocaleString("id-ID")}
                  </p>
                </div>
              </div>
            </div>

            {/* ACTION */}
            <Button
              onClick={() =>
                navigate(`/rincian-pesanan/${order.orderId}`, {
                  state: { order },
                })
              }
              variant="ghost"
              className="w-full border border-gray-300 bg-white text-gray-800 cursor-pointer text-xs md:text-sm md:py-5 hover:text-white"
            >
              {config.buttonLabel}
            </Button>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default Pengembalian;
