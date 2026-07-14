import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { useOrderStore } from "@/app/store/useOrderStore";
import { useShallow } from "zustand/react/shallow";

const Diproses = () => {
  const orders = useOrderStore(useShallow((s) => s.getByStatus("Diproses")));
  const navigate = useNavigate();

  if (orders.length === 0) {
    return (
      <p className="text-center text-gray-500 py-10">
        Tidak ada pesanan diproses.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2 md:gap-6 lg:gap-8">
      {orders.map((order) => (
        <motion.div
          key={order.orderId}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="flex flex-col gap-4 p-5 bg-white border border-gray-300 rounded-lg overflow-hidden md:p-8 
          md:max-w-5xl md:mx-auto lg:p-10 lg:max-w-6xl"
        >
          <div className="flex justify-between items-center gap-2">
            <h4 className="text-sm md:text-lg font-semibold truncate">
              Custom Citra Cake
            </h4>
            <p className="text-primary text-sm md:text-lg font-semibold shrink-0">
              Diproses
            </p>
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
                <h2 className="text-sm md:text-lg font-medium truncate">
                  {order.product.title}
                </h2>
                <p className="text-[10px] md:text-sm text-gray-400">
                  {order.variant}
                </p>
              </div>

              {/* ROW BAWAH: qty & harga */}
              <div className="flex flex-col justify-end items-end gap-2 text-right">
                <p className="text-xs md:text-base">x{order.qty}</p>
                <p className="text-xs md:text-base font-medium">
                  Rp {order.product.price.toLocaleString("id-ID")}
                </p>
                <p className="text-xs md:text-base text-gray-600">
                  Total {order.qty} produk {""}
                  Rp {""}
                  {(order.product.price * order.qty).toLocaleString("id-ID")}
                </p>
              </div>
            </div>
          </div>

          {/* Bukti Pembayaran yang sudah diupload */}
          {order.buktiUrl && (
            <div className="flex gap-3 p-3 rounded-lg bg-purple-50 border border-purple-100">
              <img
                src={order.buktiUrl}
                alt="Bukti pembayaran"
                className="w-14 h-14 rounded object-cover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs md:text-sm font-medium text-gray-800">
                  Bukti pembayaran terkirim
                </p>
                {order.catatanUpload && (
                  <p className="text-[11px] md:text-xs text-gray-500 truncate mt-0.5">
                    Catatan: {order.catatanUpload}
                  </p>
                )}
              </div>
            </div>
          )}

          <Button
            onClick={() =>
              navigate(`/rincian-pesanan/${order.orderId}`, {
                state: { order },
              })
            }
            className="bg-purple-50 text-gray-800 md:text-base md:py-6 lg:py-7 cursor-pointer"
          >
            Cake sedang diproses!
          </Button>
          <p className="text-xs md:text-sm text-gray-600 italic text-center">
            Pesanan sudah di proses pembuatan tidak bisa di batalkan!
          </p>
        </motion.div>
      ))}
    </div>
  );
};

export default Diproses;
