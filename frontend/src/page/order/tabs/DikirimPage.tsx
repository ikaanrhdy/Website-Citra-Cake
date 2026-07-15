import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router";
import { useOrderStore } from "@/app/store/useOrderStore";
import { useShallow } from "zustand/react/shallow";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

const DikirimPage = () => {
  const orders = useOrderStore(useShallow((s) => s.getByStatus("Dikirim")));
  const navigate = useNavigate();
  const location = useLocation();
  const { updateStatus, requestReturn } = useOrderStore();

  // State untuk confirmation dialog
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  // State untuk return dialog
  const [returnDialogOpen, setReturnDialogOpen] = useState(false);
  const [selectedOrderIdForReturn, setSelectedOrderIdForReturn] = useState<
    string | null
  >(null);
  const [returnReason, setReturnReason] = useState("");
  const [returnNote, setReturnNote] = useState("");

  const selectedOrder = orders.find((o) => o.orderId === selectedOrderId);
  const selectedOrderReturn = orders.find(
    (o) => o.orderId === selectedOrderIdForReturn,
  );

  const handleConfirmOrder = () => {
    if (selectedOrderId) {
      updateStatus(selectedOrderId, "Selesai");
      setConfirmDialogOpen(false);
      setSelectedOrderId(null);
    }
  };

  const handleRequestReturn = () => {
    if (selectedOrderIdForReturn && returnReason.trim()) {
      requestReturn(selectedOrderIdForReturn, {
        reason: returnReason,
        proofFile: null,
        proofPreview: null,
        note: returnNote,
      });
      setReturnDialogOpen(false);
      setSelectedOrderIdForReturn(null);
      setReturnReason("");
      setReturnNote("");
    }
  };

  if (orders.length === 0) {
    return (
      <p className="text-center text-gray-500 py-10">
        Tidak ada pesanan dikirim.
      </p>
    );
  }

  return (
    <>
      {/* SECTION 1: Dikirim */}
      <div className="mb-2 md:mb-12">
        <h3 className="text-lg md:text-xl font-semibold mb-4 md:mb-6 text-gray-800"></h3>
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
                  Dikirim
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
                    <p className="text-xs md:text-sm text-gray-400">
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
                      {(order.product.price * order.qty).toLocaleString(
                        "id-ID",
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <Button className="bg-purple-50 text-gray-800 md:text-base md:py-6 cursor-pointer hover:text-white">
                Cake sedang dikirim!
              </Button>

              {/* Row 1: Rincian Pesanan & Riwayat Pengiriman */}
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={() =>
                    navigate(`/rincian-pesanan/${order.orderId}`, {
                      state: { order, backgroundLocation: location },
                    })
                  }
                  variant="ghost"
                  className="bg-white border border-gray-300 text-gray-800 w-full md:text-base md:py-6 cursor-pointer hover:text-white"
                >
                  Rincian Pesanan
                </Button>
                <Button
                  onClick={() => navigate("/order/tracking", { state: order })}
                  className="bg-purple-50 text-primary w-full md:text-base md:py-6 cursor-pointer hover:text-white"
                >
                  Riwayat Pengiriman
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* SECTION 2: Pesanan Sampai (tanpa heading) */}
      <div className="mb-8 md:mb-12">
        <div className="flex flex-col gap-3 md:gap-4 lg:gap-5">
          {orders.map((order) => (
            <motion.div
              key={`history-${order.orderId}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="flex flex-col gap-2 p-3 md:p-4 bg-white border border-gray-200 rounded-lg"
            >
              {/* Header: Nama Toko & Status */}
              <div className="flex justify-between items-start gap-2">
                <h4 className="text-xs md:text-sm font-semibold text-gray-800 truncate">
                  Custom Citra Cake
                </h4>
                <span className="text-xs md:text-sm font-medium text-primary whitespace-nowrap">
                  Pesanan Sampai
                </span>
              </div>

              {/* Product Info Grid */}
              <div className="grid grid-cols-[60px_1fr] md:grid-cols-[80px_1fr] gap-2 md:gap-3">
                {/* Image - Compact */}
                <div className="flex items-start justify-center p-1 rounded border border-[#E5E7EB] shrink-0">
                  <img
                    src={order.product.image}
                    alt={order.product.title}
                    className="w-full aspect-square rounded object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex flex-col justify-between gap-1 min-w-0">
                  <div>
                    <h5 className="text-xs md:text-sm font-medium text-gray-800 truncate">
                      {order.product.title}
                    </h5>
                    <p className="text-[10px] md:text-xs text-gray-500 truncate">
                      {order.variant}
                    </p>
                  </div>
                  <div className="flex justify-between items-end gap-2">
                    <p className="text-[10px] md:text-xs text-gray-600">
                      x{order.qty}
                    </p>
                    <p className="text-xs md:text-sm font-semibold text-gray-800 text-right">
                      Rp{" "}
                      {(order.product.price * order.qty).toLocaleString(
                        "id-ID",
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 mt-1">
                <Button
                  onClick={() => {
                    setSelectedOrderIdForReturn(order.orderId);
                    setReturnDialogOpen(true);
                  }}
                  variant="ghost"
                  className="h-8 md:h-9 px-2 text-xs md:text-sm border border-gray-300 text-gray-700 hover:text-gray-900"
                >
                  Pengembalian
                </Button>
                <Button
                  onClick={() => {
                    setSelectedOrderId(order.orderId);
                    setConfirmDialogOpen(true);
                  }}
                  className="h-8 md:h-9 px-2 text-xs md:text-sm bg-purple-50 text-primary hover:text-white"
                >
                  Konfirmasi Pesanan
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Konfirmasi Penerimaan Pesanan</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-600">
              Apakah Anda yakin bahwa pesanan{" "}
              <span className="font-semibold">{selectedOrder?.orderId}</span>{" "}
              sudah diterima dengan baik?
            </p>
            <p className="text-xs text-gray-500 mt-3">
              Produk:{" "}
              <span className="font-medium">
                {selectedOrder?.product.title}
              </span>
            </p>
          </div>
          <DialogFooter className="flex gap-2">
            <Button
              variant="ghost"
              className="border border-gray-300"
              onClick={() => setConfirmDialogOpen(false)}
            >
              Batal
            </Button>
            <Button
              className="bg-primary text-white hover:bg-primary/90"
              onClick={handleConfirmOrder}
            >
              Konfirmasi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Return Request Dialog */}
      <Dialog open={returnDialogOpen} onOpenChange={setReturnDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Ajukan Pengembalian</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            {selectedOrderReturn && (
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-600 mb-1">Produk:</p>
                <p className="text-sm font-medium">
                  {selectedOrderReturn.product.title}
                </p>
                <p className="text-xs text-gray-500">
                  Order: {selectedOrderReturn.orderId}
                </p>
              </div>
            )}

            <div>
              <p className="text-sm font-medium mb-2">Alasan Pengembalian *</p>
              <select
                value={returnReason}
                onChange={(e) => setReturnReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Pilih alasan...</option>
                <option value="Produk tidak sesuai pesanan">
                  Produk tidak sesuai pesanan
                </option>
                <option value="Produk rusak/cacat">Produk rusak/cacat</option>
                <option value="Produk tidak sesuai foto">
                  Produk tidak sesuai foto
                </option>
                <option value="Salah pilih varian">Salah pilih varian</option>
                <option value="Alasan lainnya">Alasan lainnya</option>
              </select>
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Catatan Tambahan</p>
              <Textarea
                placeholder="Jelaskan masalah secara detail (opsional)"
                value={returnNote}
                onChange={(e) => setReturnNote(e.target.value)}
                className="text-sm"
              />
            </div>

            <p className="text-xs text-gray-500">
              Anda akan diminta untuk mengupload bukti foto produk di langkah
              berikutnya.
            </p>
          </div>
          <DialogFooter className="flex gap-2">
            <Button
              variant="ghost"
              className="border border-gray-300"
              onClick={() => {
                setReturnDialogOpen(false);
                setReturnReason("");
                setReturnNote("");
              }}
            >
              Batal
            </Button>
            <Button
              className="bg-primary text-white hover:bg-primary/90"
              onClick={handleRequestReturn}
              disabled={!returnReason.trim()}
            >
              Lanjutkan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DikirimPage;
