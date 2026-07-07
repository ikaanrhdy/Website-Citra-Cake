import { useLocation, useNavigate } from "react-router";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import UploadBuktiPembayaran from "@/components/user/UploadBuktiPembayaran";

export type RincianPesananState = {
  orderId: string;
  status: string;
  alamat: string;
  nama: string;
  telepon: string;
  tanggalPemesanan: string;
  tanggalPengiriman: string;
  catatan?: string;
  product: {
    title: string;
    image: string;
    ukuran: string;
    price: number;
    qty: number;
    baseCake: string;
    tipeCream: string;
    warnaCream: string;
    layer: number | string;
    topping: string;
    lilin: string;
    ucapan: string;
    desain: string;
  };
  subtotalPengiriman: number;
  biayaLayanan: number;
};

const formatRp = (n: number) => `Rp ${n.toLocaleString("id-ID")}`;

const RincianPesananPage = () => {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const navigate = useNavigate();
  const { state } = useLocation() as { state: RincianPesananState | null };

  if (!state) {
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
    subtotalPengiriman,
    biayaLayanan,
  } = state;

  const totalProduk = product.price * product.qty;
  const totalPembayaran = totalProduk + subtotalPengiriman + biayaLayanan;

  const handleUploadSubmit = (data: {
    orderId: string;
    file: File;
    note: string;
  }) => {
    console.log("Upload bukti sampai:", data);
    // TODO: panggil API upload di sini
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
        <h2 className="font-semibold text-base md:text-lg">Pesanan {status}</h2>
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
                <p className="text-xs text-gray-400">Uk. {product.ukuran}</p>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-sm md:text-base font-semibold">
                    {formatRp(product.price)}
                  </p>
                  <p className="text-xs text-gray-500">x{product.qty}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 pt-2 border-t border-purple-100">
              <DetailRow label="Base Cake" value={product.baseCake} />
              <DetailRow label="Tipe cream" value={product.tipeCream} />
              <DetailRow label="Warna Cream" value={product.warnaCream} />
              <DetailRow label="Layer" value={String(product.layer)} />
              <DetailRow label="Topping" value={product.topping} />
              <DetailRow label="Lilin" value={product.lilin} />
              <DetailRow label="Ucapan" value={product.ucapan} />
              <DetailRow label="Desain" value={product.desain} />
            </div>

            <div className="flex flex-col gap-1.5 pt-2 border-t border-purple-100">
              <TotalRow label="Total `1 Produk" value={formatRp(totalProduk)} />
              <TotalRow
                label="Subtotal Pengiriman"
                value={formatRp(subtotalPengiriman)}
              />
              <TotalRow label="Biaya Layanan" value={formatRp(biayaLayanan)} />
              <TotalRow
                label="Total Pembayaran"
                value={formatRp(totalPembayaran)}
                bold
              />
            </div>
          </motion.div>

          {/* ACTIONS */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 gap-2 md:gap-3"
          >
            <Button className="text-gray-800 bg-white border border-gray-300 w-full cursor-pointer hover:text-white">
              Rincian Pesanan
            </Button>
            <Button className="text-primary bg-purple-50 w-full cursor-pointer hover:text-white">
              Batalkan Pesanan
            </Button>
            <Button className="text-primary bg-white border border-primary w-full cursor-pointer hover:text-white">
              Ubah Pembayaran
            </Button>
            <Button
              onClick={() => setIsUploadOpen(true)}
              className="bg-primary text-white w-full cursor-pointer text-xs sm:text-sm"
            >
              Upload Bukti
            </Button>
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
          variant: `${product.warnaCream}`,
          qty: product.qty,
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
  <div className="flex justify-between items-center text-sm">
    <span className="text-gray-500">{label}</span>
    <span className="text-gray-800 font-medium text-right">{value}</span>
  </div>
);

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between items-center text-xs md:text-sm">
    <span className="text-gray-700">{label}</span>
    <span className="text-primary">{value}</span>
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
