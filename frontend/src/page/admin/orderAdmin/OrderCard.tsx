import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Calendar, Sparkles } from "lucide-react";
import { statusConfig } from "@/data/orderAdminDummy";
import type { OrderAdmin } from "@/types/orderAdmin";
import { useNavigate } from "react-router";
import UploadBuktiSampaiAdmin from "@/components/admin/UploadBuktiSampaiAdmin";
import useOrderAdminStore from "@/app/store/admin/useOrderAdminStore";

const OrderCard = ({
  order,
  index,
  readOnly = false,
}: {
  order: OrderAdmin;
  index: number;
  readOnly?: boolean;
}) => {
  const st = statusConfig[order.status];
  const StatusIcon = st.icon;
  const navigate = useNavigate();

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

  const handleOpenDetail = () => {
    navigate(`/admin/rincian-pesanan/${order.id}`);
  };

  const handleActionClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    actionLabel: string,
  ) => {
    e.stopPropagation();
    if (readOnly) return;

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
        handleOpenDetail();
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
        // Admin menolak pesanan langsung (bukan pengajuan pembatalan pembeli)
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
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      onClick={handleOpenDetail}
      className="bg-white border border-gray-200 rounded-xl p-4 space-y-3 shadow-sm cursor-pointer hover:shadow-md hover:border-purple-300 transition"
    >
      {/* ── Header ── */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm text-gray-900">
            {order.id}
          </span>
          <span className="text-xs text-gray-400">{order.date}</span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border ${st.textClass} ${st.bgClass} ${st.borderClass}`}
          >
            <StatusIcon className="w-3 h-3" />
            {st.label}
          </span>
          <span className="text-sm font-semibold text-gray-900">
            {order.total}
          </span>
        </div>
      </div>

      {/* ── Kustom Badge ── */}
      {order.isCustom && (
        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 border border-purple-300">
          <Sparkles className="w-3 h-3" />
          Kustom
        </span>
      )}

      {/* ── Customer ── */}
      <div className="space-y-1">
        <p className="text-sm font-semibold text-gray-900">
          {order.customer.name}
        </p>
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <Phone className="w-3.5 h-3.5 shrink-0" />
          <span>{order.customer.phone}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <Calendar className="w-3.5 h-3.5 shrink-0" />
          <span>Kirim: {order.delivery.date}</span>
        </div>
      </div>

      {/* ── Items / Custom Desc / Variant Info ── */}
      {order.items && (
        <ul className="space-y-0.5">
          {order.items.map((item) => (
            <li key={item.name} className="text-xs text-gray-600">
              {item.name} × {item.qty}
            </li>
          ))}
        </ul>
      )}
      {order.customDesc && (
        <p className="text-xs text-gray-600 leading-relaxed">
          {order.customDesc}
        </p>
      )}
      {order.variantInfo && (
        <p className="text-xs text-gray-600">{order.variantInfo}</p>
      )}

      {/* ── Note ── */}
      {order.note && (
        <div className="bg-gray-50 rounded-md px-3 py-2 text-xs text-gray-500 italic">
          {order.note}
        </div>
      )}

      {/* ── Bukti Sampai yang sudah diupload ── */}
      {order.buktiSampai && order.status === "Sampai" && (
        <div className="flex gap-2 rounded-md px-3 py-2.5 border bg-green-50 border-green-200">
          <img
            src={order.buktiSampai.fotoUrl}
            alt="Bukti sampai"
            className="w-12 h-12 rounded-md object-cover border border-green-200 shrink-0"
          />
          <div className="min-w-0">
            <p className="text-xs font-semibold text-green-700">
              Bukti sampai sudah diupload
            </p>
            <p className="text-[11px] text-gray-500 mt-0.5">
              {order.buktiSampai.uploadedAt}
            </p>
            {order.buktiSampai.catatan && (
              <p className="text-xs mt-1 text-green-700 italic truncate">
                {order.buktiSampai.catatan}
              </p>
            )}
          </div>
        </div>
      )}

      {/* ── Timeline Info Box (Sampai / Selesai) ── */}
      {order.timeline && (
        <div
          className={`flex gap-2 rounded-md px-3 py-2.5 border ${order.timeline.bgClass} ${order.timeline.borderClass}`}
        >
          <order.timeline.icon
            className={`w-4 h-4 mt-0.5 shrink-0 ${order.timeline.textClass}`}
          />
          <div className="min-w-0">
            <p className={`text-xs font-semibold ${order.timeline.textClass}`}>
              {order.timeline.title}
            </p>
            <p className="text-[11px] text-gray-500 mt-0.5">
              Waktu: {order.timeline.time}
            </p>
            <p className={`text-xs mt-1 ${order.timeline.textClass} italic`}>
              {order.timeline.description}
            </p>
          </div>
        </div>
      )}

      {/* ── Actions ── */}
      {!readOnly && order.actions.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          {order.actions.map((action) => {
            const ActionIcon = action.icon;
            const isSelesaiLocked =
              action.label === "Selesai" &&
              (!order.dikirimAt || !order.buktiSampai);
            return (
              <button
                key={action.label}
                onClick={(e) => handleActionClick(e, action.label)}
                title={
                  isSelesaiLocked
                    ? !order.dikirimAt
                      ? "Pesanan belum pernah dikirim"
                      : "Upload bukti sampai dulu sebelum menandai Selesai"
                    : undefined
                }
                className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md border transition-opacity cursor-pointer hover:opacity-80 ${action.textClass} ${action.bgClass} ${action.borderClass} ${
                  isSelesaiLocked ? "opacity-50" : ""
                }`}
              >
                <ActionIcon className="w-3.5 h-3.5" />
                {action.label}
              </button>
            );
          })}
        </div>
      )}

      {/* ── Cancel Request (status Dibatalkan) ── */}
      {order.cancelRequest && (
        <div
          className={`rounded-md px-3 py-2.5 border ${
            order.cancelRequest.status === "menunggu"
              ? "bg-amber-50 border-amber-200"
              : order.cancelRequest.status === "ditolak"
                ? "bg-red-50 border-red-200"
                : "bg-green-50 border-green-200"
          }`}
        >
          <p
            className={`text-xs font-semibold flex items-center gap-1 ${
              order.cancelRequest.status === "menunggu"
                ? "text-amber-700"
                : order.cancelRequest.status === "ditolak"
                  ? "text-red-700"
                  : "text-green-700"
            }`}
          >
            {order.cancelRequest.status === "menunggu" &&
              "⏱ Pengajuan Pembatalan - Menunggu Review"}
            {order.cancelRequest.status === "ditolak" &&
              "✕ Pengajuan Pembatalan Ditolak"}
            {order.cancelRequest.status === "diterima" &&
              "✓ Pengajuan Pembatalan Diterima"}
          </p>

          <p className="text-[11px] text-gray-500 mt-1">
            Diajukan: {order.cancelRequest.diajukan}
          </p>
          <p className="text-xs mt-1">
            <span className="font-medium">Alasan:</span>{" "}
            {order.cancelRequest.alasan}
          </p>
          {order.cancelRequest.catatanPembeli && (
            <p className="text-xs mt-1">
              <span className="font-medium">Catatan Pembeli:</span>{" "}
              {order.cancelRequest.catatanPembeli}
            </p>
          )}

          {order.cancelRequest.direview && (
            <>
              <hr className="my-2 border-gray-200" />
              <p className="text-[11px] text-gray-500">
                Direview: {order.cancelRequest.direview}
              </p>
              <p className="text-xs mt-1">
                <span className="font-medium">Catatan Admin:</span>{" "}
                {order.cancelRequest.catatanAdmin}
              </p>
            </>
          )}
        </div>
      )}

      {/* ── Refund Request (status Dikembalikan) ── */}
      {order.refundRequest && (
        <div
          className={`rounded-md px-3 py-2.5 border ${
            order.refundRequest.status === "menunggu"
              ? "bg-amber-50 border-amber-200"
              : order.refundRequest.status === "ditolak"
                ? "bg-red-50 border-red-200"
                : "bg-green-50 border-green-200"
          }`}
        >
          <p
            className={`text-xs font-semibold flex items-center gap-1 ${
              order.refundRequest.status === "menunggu"
                ? "text-amber-700"
                : order.refundRequest.status === "ditolak"
                  ? "text-red-700"
                  : "text-green-700"
            }`}
          >
            {order.refundRequest.status === "menunggu" &&
              "⏱ Pengajuan Pengembalian Dana - Menunggu Review"}
            {order.refundRequest.status === "ditolak" &&
              "✕ Pengembalian Dana Ditolak"}
            {order.refundRequest.status === "disetujui" &&
              "✓ Pengembalian Dana Disetujui"}
          </p>

          <p className="text-[11px] text-gray-500 mt-1">
            Diajukan: {order.refundRequest.diajukan}
          </p>
          <p className="text-xs mt-1">
            <span className="font-medium">Alasan:</span>{" "}
            {order.refundRequest.alasan}
          </p>
          {order.refundRequest.catatanPembeli && (
            <p className="text-xs mt-1">
              <span className="font-medium">Catatan Pembeli:</span>{" "}
              {order.refundRequest.catatanPembeli}
            </p>
          )}

          {order.refundRequest.direview && (
            <>
              <hr className="my-2 border-gray-200" />
              <p className="text-[11px] text-gray-500">
                Direview: {order.refundRequest.direview}
              </p>
              <p className="text-xs mt-1">
                <span className="font-medium">Catatan Admin:</span>{" "}
                {order.refundRequest.catatanAdmin}
              </p>
            </>
          )}
        </div>
      )}

      {/* ── Status Info ── */}
      {order.statusInfo && (
        <p className="text-[11px] text-gray-400">{order.statusInfo}</p>
      )}

      {/* ── Modal Upload Bukti Sampai ── */}
      {!readOnly && (
        <UploadBuktiSampaiAdmin
          isOpen={showUploadBukti}
          onClose={() => setShowUploadBukti(false)}
          orderId={order.id}
          onSubmit={handleUploadBuktiSubmit}
        />
      )}
    </motion.div>
  );
};

export default OrderCard;
