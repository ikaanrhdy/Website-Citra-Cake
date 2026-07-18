import { useNavigate, useParams } from "react-router";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin } from "lucide-react";
import useOrderAdminStore from "@/app/store/admin/useOrderAdminStore";
import useAuthStore from "@/app/store/auth";
import NotFoundState from "@/components/common/NotFoundState";
import { product as productList } from "@/data/productAdmin";
import type { OrderAdmin } from "@/types/orderAdmin";
import { useState } from "react";
import UploadBuktiSampaiAdmin from "@/components/admin/UploadBuktiSampaiAdmin"; // sesuaikan path

const formatRp = (n: number) => `Rp ${n.toLocaleString("id-ID")}`;

/* ================= HELPERS ================= */

const getPageTitle = (order: OrderAdmin) => {
  if (order.status === "Dibatalkan" && order.cancelRequest) {
    if (order.cancelRequest.status === "menunggu")
      return "Pengajuan Pembatalan";
    if (order.cancelRequest.status === "ditolak")
      return "Pengajuan Pembatalan Ditolak";
    if (order.cancelRequest.status === "diterima")
      return "Pengajuan Pembatalan Diterima";
  }

  if (order.status === "Dikembalikan" && order.refundRequest) {
    if (order.refundRequest.status === "menunggu")
      return "Pengajuan Pengembalian";
    if (order.refundRequest.status === "ditolak")
      return "Pengajuan Pengembalian Ditolak";
    if (order.refundRequest.status === "disetujui")
      return "Pengajuan Pengembalian Disetujui";
  }

  const titleMap: Partial<Record<OrderAdmin["status"], string>> = {
    Menunggu: "Pesanan Menunggu Pembayaran",
    Diproses: "Pesanan Sedang Diproses",
    Dikirim: "Pesanan Sedang Dikirim",
    Sampai: "Pesanan Sampai",
    Selesai: "Pesanan Selesai",
    Dibatalkan: "Pesanan Dibatalkan",
    Dikembalikan: "Pesanan Dikembalikan",
  };

  return titleMap[order.status] ?? `Pesanan ${order.status}`;
};

const parseCustomDesc = (customDesc?: string) => {
  if (!customDesc) return [];
  return customDesc
    .split("|")
    .map((part) => {
      const [label, ...rest] = part.split(":");
      return { label: label?.trim() ?? "", value: rest.join(":").trim() };
    })
    .filter((row) => row.label && row.value);
};

const RincianPesananAdmin = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { orders } = useOrderAdminStore();
  const updateOrderStatus = useOrderAdminStore((s) => s.updateOrderStatus);
  const uploadBuktiSampai = useOrderAdminStore((s) => s.uploadBuktiSampai);
  const resolveCancelRequest = useOrderAdminStore(
    (s) => s.resolveCancelRequest,
  );
  const resolveRefundRequest = useOrderAdminStore(
    (s) => s.resolveRefundRequest,
  );
  const finalizeRefund = useOrderAdminStore((s) => s.finalizeRefund);
  const [showUploadBukti, setShowUploadBukti] = useState(false);

  const { role } = useAuthStore();
  const isOwner = role === "owner";

  const order = orders.find((o) => o.id === id);

  /* ===== NOT FOUND STATE ===== */
  if (!order) {
    return (
      <div className="flex flex-col gap-4 p-2 md:p-4 lg:p-6 md:max-w-6xl md:mx-auto">
        <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg p-3 md:p-4">
          <button
            onClick={() => navigate(-1)}
            className="p-1.5 rounded-full hover:bg-gray-100 transition cursor-pointer"
          >
            <ArrowLeft size={20} />
          </button>
          <h2 className="font-semibold text-base md:text-lg">
            Pesanan Tidak Ditemukan
          </h2>
        </div>

        <NotFoundState
          title={`Pesanan ${id ? `"${id}" ` : ""}tidak ditemukan`}
          description="Pesanan mungkin sudah dihapus, atau ID pesanan yang kamu buka tidak valid. Coba buka lagi dari daftar pesanan."
          actionLabel="Kembali ke Daftar Pesanan"
          onAction={() => navigate("/admin/order")}
        />
      </div>
    );
  }

  /* ===== DATA MAPPING ===== */
  const alamat = order.alamat ?? "-";
  const nama = order.customer?.name ?? "-";
  const telepon = order.customer?.phone ?? "-";
  const tanggalPemesanan = order.date ?? "-";
  const tanggalPengiriman = order.delivery?.date ?? "-";
  const catatan = order.note;

  const items = (order.items ?? []).map((item) => {
    const matched = item.productId
      ? productList.find((p) => p.id === item.productId)
      : undefined;

    return {
      ...item,
      image: item.image ?? matched?.image,
      price: item.price ?? matched?.price,
      ukuran: item.ukuran ?? matched?.size?.[0]?.label,
    };
  });

  const showCustomPlaceholder = order.isCustom && items.length === 0;
  const customDescRows = parseCustomDesc(order.customDesc);

  const totalProduk = items.reduce(
    (sum, item) => sum + (item.price ?? 0) * item.qty,
    0,
  );
  const subtotalPengiriman = order.subtotalPengiriman ?? 0;
  const biayaLayanan = order.biayaLayanan ?? 0;
  const totalPembayaran =
    totalProduk > 0
      ? totalProduk + subtotalPengiriman + biayaLayanan
      : undefined;

  const jumlahProduk = items.length > 0 ? items.length : 1;

  const pageTitle = getPageTitle(order);
  const hasProductSection =
    items.length > 0 || showCustomPlaceholder || order.variantInfo;

  const handleActionClick = (actionLabel: string) => {
    if (actionLabel === "Upload Bukti") {
      setShowUploadBukti(true);
      return;
    }

    // ── Order sedang punya pengajuan PEMBATALAN yang menunggu review ──
    if (order.cancelRequest?.status === "menunggu") {
      if (actionLabel === "Terima") {
        resolveCancelRequest(order.id, "diterima");
      } else if (actionLabel === "Tolak") {
        const catatan = window.prompt(
          "Catatan penolakan pembatalan (opsional):",
          "",
        );
        resolveCancelRequest(order.id, "ditolak", catatan ?? undefined);
      }
      return;
    }

    // ── Order sedang punya pengajuan PENGEMBALIAN DANA yang menunggu review ──
    if (order.refundRequest?.status === "menunggu") {
      if (actionLabel === "Review Pengajuan") {
        // sudah di halaman detail, tidak perlu navigasi lagi
        return;
      } else if (actionLabel === "Tolak") {
        const catatan = window.prompt(
          "Catatan penolakan pengembalian dana (opsional):",
          "",
        );
        resolveRefundRequest(order.id, "ditolak", catatan ?? undefined);
      } else if (actionLabel === "Kembalikan") {
        const catatan = window.prompt(
          "Catatan persetujuan pengembalian dana (opsional):",
          "",
        );
        resolveRefundRequest(order.id, "disetujui", catatan ?? undefined);
      }
      return;
    }

    // ── Refund sudah disetujui, tinggal difinalisasi (dana benar2 dikirim) ──
    if (
      order.refundRequest?.status === "disetujui" &&
      actionLabel === "Kembalikan"
    ) {
      finalizeRefund(order.id);
      return;
    }

    // ── PROTEKSI: "Selesai" wajib sudah pernah "Dikirim" DAN ada bukti sampai ──
    if (actionLabel === "Selesai" && !order.dikirimAt) {
      alert("Pesanan ini belum pernah dikirim, tidak bisa ditandai Selesai.");
      return;
    }
    if (actionLabel === "Selesai" && !order.buktiSampai) {
      alert(
        "Upload bukti foto sampai dulu sebelum menandai pesanan ini Selesai.",
      );
      setShowUploadBukti(true);
      return;
    }

    // ── Alur status pesanan normal ──
    switch (actionLabel) {
      case "Proses":
        updateOrderStatus(order.id, "Diproses");
        break;
      case "Dikirim":
        updateOrderStatus(order.id, "Dikirim");
        break;
      case "Sampai":
        updateOrderStatus(order.id, "Sampai");
        break;
      case "Selesai":
        updateOrderStatus(order.id, "Selesai");
        break;
      case "Tolak":
        updateOrderStatus(order.id, "Dibatalkan");
        break;
      default:
        console.warn("Aksi belum ditangani:", actionLabel);
    }
  };

  const handleUploadBuktiSubmit = (data: { file: File; catatan: string }) => {
    // TODO: kalau ada backend, upload data.file ke server/storage dulu di sini
    // dan pakai URL hasil upload-nya, bukan object URL lokal (object URL
    // bakal invalid lagi setelah reload/tab ditutup).
    const fotoUrl = URL.createObjectURL(data.file);
    uploadBuktiSampai(order.id, { fotoUrl, catatan: data.catatan });
    setShowUploadBukti(false);
  };

  return (
    <div className="flex flex-col gap-4 pb-6 p-2 md:p-4 lg:p-6 md:max-w-6xl md:mx-auto bg-white">
      {/* HEADER */}
      <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg p-3 md:p-4">
        <button
          onClick={() => navigate(-1)}
          className="p-1.5 rounded-full hover:bg-gray-100 transition cursor-pointer"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="font-semibold text-base md:text-lg">{pageTitle}</h2>
      </div>

      <div className="flex flex-col md:grid md:grid-cols-5 gap-4 md:items-start">
        {/* KIRI */}
        <div className="flex flex-col gap-4 md:col-span-2">
          {/* ALAMAT + INFO PESANAN (digabung) */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-gray-300 rounded-lg p-4 flex flex-col gap-3"
          >
            {/* Alamat */}
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium text-gray-800">
                Alamat Pengiriman
              </p>
              <div className="flex items-start gap-2">
                <MapPin size={16} className="text-red-500 shrink-0 mt-0.5" />
                <p className="text-sm text-primary">{alamat}</p>
              </div>
            </div>

            <hr className="border-gray-300 w-full" />

            {/* Info Pesanan */}
            <div className="flex flex-col gap-2.5">
              <InfoRow label="Nama" value={nama} />
              <InfoRow label="Nomor Telepon" value={telepon} />
              <InfoRow label="Tanggal Pemesanan" value={tanggalPemesanan} />
              <InfoRow label="Tanggal Pengiriman" value={tanggalPengiriman} />
              <InfoRow label="No. Pesanan" value={order.id} />

              {order.cancelRequest && (
                <InfoRow
                  label="Tgl Pengajuan Pembatalan"
                  value={order.cancelRequest.diajukan}
                />
              )}
              {order.refundRequest && (
                <InfoRow
                  label="Tgl Pengajuan Pengembalian"
                  value={order.refundRequest.diajukan}
                />
              )}
            </div>
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

          {/* BUKTI SAMPAI yang sudah diupload */}
          {order.buktiSampai && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.11 }}
              className="bg-white border border-green-200 rounded-lg p-4 flex flex-col gap-2"
            >
              <p className="text-sm font-medium text-gray-800">Bukti Sampai</p>
              <img
                src={order.buktiSampai.fotoUrl}
                alt="Bukti sampai"
                className="w-full aspect-4/3 object-cover rounded-md border border-gray-200"
              />
              <p className="text-xs text-gray-500">
                Diupload: {order.buktiSampai.uploadedAt}
              </p>
              {order.buktiSampai.catatan && (
                <p className="text-sm text-gray-600 italic">
                  {order.buktiSampai.catatan}
                </p>
              )}
            </motion.div>
          )}

          {/* PENGAJUAN PEMBATALAN (status Dibatalkan) */}
          {order.cancelRequest && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 }}
              className="flex flex-col gap-3"
            >
              <div className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col gap-1.5">
                <p className="text-sm font-medium text-gray-800">
                  Alasan Pembatalan
                </p>
                <p className="text-sm text-gray-500">
                  {order.cancelRequest.alasan}
                </p>
              </div>

              {order.cancelRequest.catatanPembeli && (
                <div className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col gap-1.5">
                  <p className="text-sm font-medium text-gray-800">
                    Catatan Pembeli
                  </p>
                  <p className="text-sm text-gray-500">
                    {order.cancelRequest.catatanPembeli}
                  </p>
                </div>
              )}

              {order.cancelRequest.direview && (
                <div
                  className={`rounded-lg p-4 flex flex-col gap-1.5 border ${
                    order.cancelRequest.status === "ditolak"
                      ? "bg-red-50 border-red-200"
                      : "bg-green-50 border-green-200"
                  }`}
                >
                  <p className="text-xs text-gray-500">
                    Direview: {order.cancelRequest.direview}
                  </p>
                  <p className="text-sm font-medium text-gray-800">
                    Catatan Admin
                  </p>
                  <p className="text-sm text-gray-600">
                    {order.cancelRequest.catatanAdmin}
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {/* PENGAJUAN PENGEMBALIAN (status Dikembalikan) */}
          {order.refundRequest && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 }}
              className="flex flex-col gap-3"
            >
              <div className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col gap-1.5">
                <p className="text-sm font-medium text-gray-800">
                  Alasan Pengembalian
                </p>
                <p className="text-sm text-gray-500">
                  {order.refundRequest.alasan}
                </p>
              </div>

              {order.refundRequest.catatanPembeli && (
                <div className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col gap-1.5">
                  <p className="text-sm font-medium text-gray-800">
                    Catatan Pembeli
                  </p>
                  <p className="text-sm text-gray-500">
                    {order.refundRequest.catatanPembeli}
                  </p>
                </div>
              )}

              {order.refundRequest.direview && (
                <div
                  className={`rounded-lg p-4 flex flex-col gap-1.5 border ${
                    order.refundRequest.status === "ditolak"
                      ? "bg-red-50 border-red-200"
                      : "bg-green-50 border-green-200"
                  }`}
                >
                  <p className="text-xs text-gray-500">
                    Direview: {order.refundRequest.direview}
                  </p>
                  <p className="text-sm font-medium text-gray-800">
                    Catatan Admin
                  </p>
                  <p className="text-sm text-gray-600">
                    {order.refundRequest.catatanAdmin}
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </div>

        {/* KANAN */}
        <div className="flex flex-col gap-4 md:col-span-3 md:sticky md:top-4">
          {/* DESKRIPSI PRODUK */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="flex flex-col gap-3"
          >
            <p className="text-sm font-medium text-gray-800">
              Deskripsi Produk
            </p>

            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              {/* List Produk */}
              {hasProductSection && (
                <div className="flex flex-col">
                  {items.map((item, i) => (
                    <div
                      key={item.name + i}
                      className={`flex gap-3 p-3 ${
                        i < items.length - 1 ? "border-b border-gray-100" : ""
                      }`}
                    >
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 rounded-md object-cover border border-gray-200 shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm md:text-base font-semibold truncate">
                          {item.name}
                        </h3>
                        {item.ukuran && (
                          <p className="text-xs text-gray-400">
                            Uk. {item.ukuran}
                          </p>
                        )}
                        <div className="flex justify-between items-center mt-2">
                          {item.price != null && (
                            <p className="text-sm md:text-base font-semibold">
                              {formatRp(item.price)}
                            </p>
                          )}
                          <p className="text-xs text-gray-500">x{item.qty}</p>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* PLACEHOLDER "CAKE KUSTOM" */}
                  {showCustomPlaceholder && (
                    <div className="p-3">
                      <h3 className="text-sm md:text-base font-semibold truncate">
                        Cake Kustom
                      </h3>
                      <div className="flex justify-between items-center mt-2">
                        <p className="text-sm md:text-base font-semibold">
                          {order.total}
                        </p>
                        <p className="text-xs text-gray-500">x1</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* DETAIL KUSTOM */}
              {customDescRows.length > 0 && (
                <div className="flex flex-col gap-1.5 p-3 border-t border-gray-100">
                  {customDescRows.map((row) => (
                    <div
                      key={row.label}
                      className="flex justify-between items-center text-xs"
                    >
                      <span className="text-gray-500">{row.label}</span>
                      <span className="text-gray-700 font-medium text-right">
                        {row.value}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {order.variantInfo && (
                <p className="text-xs text-gray-600 px-3 pt-2">
                  {order.variantInfo}
                </p>
              )}

              {/* TOTAL */}
              <div className="flex flex-col gap-1.5 p-3 border-t border-gray-100">
                <TotalRow
                  label={`Total ${jumlahProduk} Produk`}
                  value={totalProduk > 0 ? formatRp(totalProduk) : order.total}
                />
                <TotalRow
                  label="Subtotal Pengiriman"
                  value={formatRp(subtotalPengiriman)}
                />
                <TotalRow
                  label="Biaya Layanan"
                  value={formatRp(biayaLayanan)}
                />
                <TotalRow
                  label="Total Pembayaran"
                  value={
                    totalPembayaran != null
                      ? formatRp(totalPembayaran)
                      : order.total
                  }
                  bold
                />
              </div>
            </div>
          </motion.div>
          {/* ACTIONS — hanya untuk role selain owner */}
          {!isOwner && order.actions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-2 flex-wrap"
            >
              {order.actions.map((action) => {
                const ActionIcon = action.icon;
                const isSelesaiLocked =
                  action.label === "Selesai" &&
                  (!order.dikirimAt || !order.buktiSampai);
                return (
                  <button
                    key={action.label}
                    onClick={() => handleActionClick(action.label)}
                    title={
                      isSelesaiLocked
                        ? !order.dikirimAt
                          ? "Pesanan belum pernah dikirim"
                          : "Upload bukti sampai dulu sebelum menandai Selesai"
                        : undefined
                    }
                    className={`inline-flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-md border transition-opacity hover:opacity-80 cursor-pointer ${action.textClass} ${action.bgClass} ${action.borderClass} ${
                      isSelesaiLocked ? "opacity-50" : ""
                    }`}
                  >
                    <ActionIcon className="w-4 h-4" />
                    {action.label}
                  </button>
                );
              })}
            </motion.div>
          )}

          {/* STATUS INFO */}
          {order.statusInfo && (
            <p className="text-xs text-gray-400">{order.statusInfo}</p>
          )}
        </div>
      </div>

      {/* modal — hanya untuk role selain owner */}
      {!isOwner && (
        <UploadBuktiSampaiAdmin
          isOpen={showUploadBukti}
          onClose={() => setShowUploadBukti(false)}
          orderId={order.id}
          onSubmit={handleUploadBuktiSubmit}
        />
      )}
    </div>
  );
};

/* ================= HELPERS UI ================= */

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between items-center text-sm">
    <span className="text-gray-500">{label}</span>
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

export default RincianPesananAdmin;
