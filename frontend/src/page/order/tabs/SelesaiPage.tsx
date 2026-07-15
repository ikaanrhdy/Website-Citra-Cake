import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { useOrderStore } from "@/app/store/useOrderStore";
import { useShallow } from "zustand/react/shallow";
import PenilaianModal from "@/components/user/PenilaianModal";

const SelesaiPage = () => {
  const orders = useOrderStore(useShallow((s) => s.getByStatus("Selesai")));
  const navigate = useNavigate();
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);

  const activeOrder = orders.find((o) => o.orderId === activeOrderId);

  if (orders.length === 0) {
    return (
      <p className="text-center text-gray-500 py-10">
        Tidak ada pesanan selesai.
      </p>
    );
  }

  return (
    <>
      <motion.div
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0 },
          show: { opacity: 1, transition: { staggerChildren: 0.08 } },
        }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-6 lg:gap-8"
      >
        {orders.map((order) => {
          const sudahDinilai = !!order.penilaian;

          return (
            <motion.div
              key={order.orderId}
              variants={{
                hidden: { opacity: 0, y: 16 },
                show: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="flex flex-col gap-4 p-5 bg-white border border-gray-300 rounded-lg overflow-hidden md:p-6 lg:p-7"
            >
              <div className="flex justify-between items-center gap-2">
                <h4 className="text-sm font-semibold truncate">
                  Custom Citra Cake
                </h4>
                <p className="text-primary text-sm font-semibold shrink-0">
                  Selesai
                </p>
              </div>

              {/* PRODUCT: grid kiri-kanan, ratio 1/3 gambar - 2/3 detail */}
              <div className="grid grid-cols-3 gap-3 md:gap-4">
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
                    <h2 className="text-sm font-medium truncate">
                      {order.product.title}
                    </h2>
                    <p className="text-[10px] text-gray-400">{order.variant}</p>
                  </div>

                  {/* ROW BAWAH: qty & harga */}
                  <div className="flex flex-col justify-end items-end gap-1 text-right">
                    <p className="text-xs">x{order.qty}</p>
                    <p className="text-xs font-medium">
                      Rp {order.product.price.toLocaleString("id-ID")}
                    </p>
                    <p className="text-xs md:text-base text-gray-600">
                      Total {order.qty} produk {""}
                      Rp {""}
                      {(order.product.price * order.qty).toLocaleString(
                        "id-ID",
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap justify-end gap-2">
                <Button
                  variant="ghost"
                  className=" text-primary border border-[#D8DADC] p-5 cursor-pointer text-xs md:text-sm md:py-4"
                  onClick={() => setActiveOrderId(order.orderId)}
                >
                  {sudahDinilai ? "Lihat Penilaian" : "Nilai"}
                </Button>

                <Button
                  className="bg-purple-50 text-primary w-fit text-xs md:text-sm md:px-6 md:py-4 hover:text-white cursor-pointer"
                  onClick={() =>
                    navigate("/checkout", {
                      state: {
                        buyNow: true,
                        items: [
                          {
                            id: order.product.id,
                            title: order.product.title,
                            image: order.product.image,
                            price: order.product.price,
                            qty: order.qty,
                            ukuran: order.variant,
                          },
                        ],
                        alamat: order.alamat,
                        telepon: order.telepon,
                        tanggalKirim: order.tanggalPengiriman,
                      },
                    })
                  }
                >
                  Beli Lagi
                </Button>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {activeOrder && (
        <PenilaianModal
          open={!!activeOrderId}
          onOpenChange={(open) => !open && setActiveOrderId(null)}
          orderId={activeOrder.orderId}
          productTitle={activeOrder.product.title}
          existing={activeOrder.penilaian}
        />
      )}
    </>
  );
};

export default SelesaiPage;
