import { useLocation, useNavigate, useParams } from "react-router";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Truck, PackageCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import UploadBuktiPembayaran from "@/components/user/UploadBuktiPembayaran";
import { useOrderStore, type Order } from "@/app/store/useOrderStore";
import { toast } from "sonner";

const formatRp = (n: number) => `Rp ${n.toLocaleString("id-ID")}`;

const RincianPesananPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderId: orderIdParam } = useParams();
  const { state } = location as {
    state: { order?: Order; backgroundLocation?: Location } | null;
  };

  const getByOrderId = useOrderStore((s) => s.getByOrderId);
  const cancelOrder = useOrderStore((s) => s.cancelOrder);
  const submitBuktiPembayaran = useOrderStore((s) => s.submitBuktiPembayaran);

  const [isUploadOpen, setIsUploadOpen] = useState(false);

  // Prioritas: order dari state (dikirim via navigate), fallback lookup ke store pakai param URL
  const order =
    state?.order ?? (orderIdParam ? getByOrderId(orderIdParam) : undefined);

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-20">
        <p className="text-gray-500 text-sm">Data pesanan tidak ditemukan.</p>
        <Button onClick={() => navigate(-1)} className="cursor-pointer">
          Kembali
        </Button>
      </div>
    );
  }

  const {
    orderId,
    status,
    alamat,
    nama,
    telepon,
    tanggalPemesanan,
    tanggalPengiriman,
    catatan,
    product,
    qty,
    variant,
    eta,
    tracking,
    buktiUrl,
    catatanUpload,
    returnDetail,
    penilaian,
  } = order;

  const totalProduk = product.price * qty;

  // Heuristik: paket dianggap "sudah sampai" kalau tracking step teratas nunjukin "Diterima"
  const sudahSampai = tracking?.[0]?.title?.toLowerCase().includes("diterima");

  const handleCancelOrder = () => {
    cancelOrder(orderId);
    toast.success("Pesanan dibatalkan");
    navigate(-1);
  };

  const handleUbahPembayaran = () => {
    navigate("/checkout", {
      state: {
        orderId,
        fromOrder: true,
        items: [
          {
            id: product.id,
            title: product.title,
            image: product.image,
            price: product.price,
            qty,
          },
        ],
        alamat,
        telepon,
        tanggalKirim: tanggalPengiriman,
        catatan,
      },
    });
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
    toast.success("Bukti pembayaran terkirim");
    setIsUploadOpen(false);
  };

  const handleNilai = () => {
    navigate(`/penilaian/${orderId}`, {
      state: {
        productTitle: product.title,
        productImage: product.image,
        variant,
        qty,
        price: product.price,
        existing: penilaian,
      },
    });
  };

  const statusLabel: Record<Order["status"], string> = {
    "Belum Bayar": "Belum Bayar",
    Diproses: "Diproses",
    Dikirim: sudahSampai ? "Sudah Sampai" : "Dikirim",
    Selesai: "Selesai",
    "Pengembalian Selesai": "Pengembalian",
    Dibatalkan: "Dibatalkan",
  };

  return (
    <div className="flex flex-col gap-4 pb-6 p-2 md:p-4 lg:p-6 md:max-w-6xl md:mx-auto">
      {/* HEADER */}
      <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg p-3 md:p-4">
        <button
          onClick={() => navigate(-1)}
          className="p-1.5 rounded-full hover:bg-gray-100 transition cursor-pointer"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="font-semibold text-base md:text-lg">
          Pesanan {statusLabel[status]}
        </h2>
      </div>

      {/* CONTENT: 1 kolom di mobile, 2 kolom di tablet/desktop */}
      <div className="flex flex-col md:grid md:grid-cols-5 gap-4 md:items-start">
        {/* KIRI: Alamat, Info Pesanan, Catatan */}
        <div className="flex flex-col gap-4 md:col-span-2">
          {/* ALAMAT */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-purple-50 rounded-lg p-4 flex flex-col gap-2"
          >
            <p className="text-sm font-medium text-gray-800">
              Alamat Pengiriman
            </p>
            <div className="flex items-start gap-2">
              <MapPin size={16} className="text-red-500 shrink-0 mt-0.5" />
              <p className="text-sm text-primary">{alamat}</p>
            </div>
          </motion.div>

          {/* INFO PESANAN */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col gap-2.5"
          >
            <InfoRow label="Nama" value={nama} />
            <InfoRow label="Nomor Telepon" value={telepon} />
            <InfoRow label="Tanggal Pemesanan" value={tanggalPemesanan} />
            <InfoRow label="Tanggal Pengiriman" value={tanggalPengiriman} />
            <InfoRow label="No. Pesanan" value={orderId} />
          </motion.div>

          {/* CATATAN */}
          {catatan && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col gap-1.5"
            >
              <p className="text-sm font-medium text-gray-800">Catatan</p>
              <p className="text-sm text-gray-500">{catatan}</p>
            </motion.div>
          )}

          {/* TRACKING (khusus Dikirim) */}
          {status === "Dikirim" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 }}
              className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col gap-2"
            >
              <div className="flex items-center gap-2">
                {sudahSampai ? (
                  <PackageCheck size={16} className="text-green-600" />
                ) : (
                  <Truck size={16} className="text-primary" />
                )}
                <p className="text-sm font-medium text-gray-800">
                  {sudahSampai ? "Paket sudah sampai" : "Paket sedang dikirim"}
                </p>
              </div>
              {eta && !sudahSampai && (
                <p className="text-xs text-gray-500">
                  Estimasi tiba: {eta.date}, {eta.time}
                </p>
              )}
              <Button
                onClick={() => navigate("/order/tracking", { state: order })}
                variant="ghost"
                className="w-fit bg-purple-50 text-primary text-xs mt-1 cursor-pointer hover:text-white"
              >
                Riwayat Pengiriman
              </Button>
            </motion.div>
          )}

          {/* BUKTI PEMBAYARAN (khusus Diproses) */}
          {status === "Diproses" && buktiUrl && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 }}
              className="bg-purple-50 border border-purple-100 rounded-lg p-4 flex gap-3"
            >
              <img
                src={buktiUrl}
                alt="Bukti pembayaran"
                className="w-14 h-14 rounded object-cover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800">
                  Bukti pembayaran terkirim
                </p>
                {catatanUpload && (
                  <p className="text-xs text-gray-500 mt-0.5">
                    Catatan: {catatanUpload}
                  </p>
                )}
              </div>
            </motion.div>
          )}

          {/* DETAIL PENGEMBALIAN (khusus Pengembalian Selesai) */}
          {status === "Pengembalian Selesai" && returnDetail && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 }}
              className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col gap-2"
            >
              <p className="text-sm font-medium text-gray-800">
                Detail Pengembalian
              </p>
              <InfoRow label="Status" value={returnDetail.outcome} />
              <InfoRow label="Alasan" value={returnDetail.reason} />
              {returnDetail.note && (
                <InfoRow label="Catatan" value={returnDetail.note} />
              )}
              {returnDetail.proofPreview && (
                <img
                  src={returnDetail.proofPreview}
                  alt="Bukti pengembalian"
                  className="w-20 h-20 rounded-md object-cover border mt-1"
                />
              )}
            </motion.div>
          )}
        </div>

        {/* KANAN: Deskripsi Produk + Total + Actions (sticky di desktop) */}
        <div className="flex flex-col gap-4 md:col-span-3 md:sticky md:top-4">
          {/* DESKRIPSI PRODUK */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-purple-50 rounded-lg p-4 flex flex-col gap-4"
          >
            <p className="text-sm font-medium text-gray-800">
              Deskripsi Produk
            </p>

            <div className="flex gap-3">
              <img
                src={product.image}
                alt={product.title}
                className="w-16 h-16 md:w-20 md:h-20 rounded object-cover border border-gray-200 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h3 className="text-sm md:text-base font-semibold truncate">
                  {product.title}
                </h3>
                <p className="text-xs text-gray-400">{variant}</p>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-sm md:text-base font-semibold">
                    {formatRp(product.price)}
                  </p>
                  <p className="text-xs text-gray-500">x{qty}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1.5 pt-2 border-t border-purple-100">
              <TotalRow
                label={`Total ${qty} Produk`}
                value={formatRp(totalProduk)}
              />
              <TotalRow
                label="Total Pembayaran"
                value={formatRp(totalProduk)}
                bold
              />
            </div>
          </motion.div>

          {/* ACTIONS: beda-beda tergantung status */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col gap-2 md:gap-3"
          >
            {status === "Belum Bayar" && (
              <div className="grid grid-cols-2 gap-2 md:gap-3">
                <Button
                  onClick={handleCancelOrder}
                  className="text-primary bg-purple-50 w-full cursor-pointer hover:text-white"
                >
                  Batalkan Pesanan
                </Button>
                <Button
                  onClick={handleUbahPembayaran}
                  className="text-primary bg-white border border-primary w-full cursor-pointer hover:text-white"
                >
                  Ubah Pembayaran
                </Button>
                <Button
                  onClick={() => setIsUploadOpen(true)}
                  className="bg-primary text-white w-full col-span-2 cursor-pointer text-xs sm:text-sm"
                >
                  Upload Bukti
                </Button>
              </div>
            )}

            {status === "Diproses" && (
              <p className="text-xs text-gray-500 italic text-center">
                Pesanan sudah diproses dan tidak bisa dibatalkan.
              </p>
            )}

            {status === "Selesai" && (
              <div className="grid grid-cols-2 gap-2 md:gap-3">
                {!returnDetail && (
                  <Button
                    onClick={() =>
                      navigate(`/pengembalian/${orderId}`, { state: { order } })
                    }
                    variant="ghost"
                    className="bg-red-50 text-red-500 w-full cursor-pointer"
                  >
                    Ajukan Pengembalian
                  </Button>
                )}
                <Button
                  onClick={handleNilai}
                  className={`w-full cursor-pointer ${
                    !returnDetail ? "" : "col-span-2"
                  } bg-gray-100 text-gray-600 hover:text-white`}
                >
                  {penilaian ? "Lihat Penilaian" : "Nilai"}
                </Button>
              </div>
            )}

            {status === "Dibatalkan" && (
              <p className="text-xs text-gray-500 italic text-center">
                Pesanan ini telah dibatalkan.
              </p>
            )}
          </motion.div>
        </div>
      </div>

      <UploadBuktiPembayaran
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        orderId={orderId}
        product={{
          title: product.title,
          image: product.image,
          variant,
          qty,
          price: product.price,
          total: totalProduk,
        }}
        onSubmit={handleUploadSubmit}
      />
    </div>
  );
};

/* ================= HELPERS ================= */

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between items-center text-sm gap-3">
    <span className="text-gray-500 shrink-0">{label}</span>
    <span className="text-gray-800 font-medium text-right">{value}</span>
  </div>
);

const TotalRow = ({
  label,
  value,
  bold,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) => (
  <div className="flex justify-between items-center text-sm">
    <span className={bold ? "font-semibold text-gray-800" : "text-gray-600"}>
      {label}
    </span>
    <span className={bold ? "font-semibold text-gray-800" : "text-gray-700"}>
      {value}
    </span>
  </div>
);

export default RincianPesananPage;
