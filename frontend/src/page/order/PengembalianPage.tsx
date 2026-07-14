import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { ArrowLeft, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useOrderStore, type Order } from "@/app/store/useOrderStore";
import { toast } from "sonner";

const reasons = [
  "Cake rusak saat diterima",
  "Pesanan tidak sesuai",
  "Rasa/kualitas tidak sesuai",
  "Lainnya",
];

const PengembalianPage = () => {
  const navigate = useNavigate();
  const { orderId: orderIdParam } = useParams();
  const { state } = useLocation() as { state: { order?: Order } | null };

  const getByOrderId = useOrderStore((s) => s.getByOrderId);
  const requestReturn = useOrderStore((s) => s.requestReturn);

  // Prioritas: order dari state (dikirim via navigate), fallback lookup ke store pakai param URL
  const order =
    state?.order ?? (orderIdParam ? getByOrderId(orderIdParam) : undefined);

  const [reason, setReason] = useState("");
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState<{ reason?: string; proof?: string }>({});

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Data pesanan tidak ditemukan
      </div>
    );
  }

  const { product, qty } = order;
  const total = product.price * qty;

  const handleFileChange = (file: File | null) => {
    setProofFile(file);
    setErrors((p) => ({ ...p, proof: undefined }));

    if (file) {
      const reader = new FileReader();
      reader.onload = () => setProofPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setProofPreview(null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileChange(file);
  };

  const handleSubmit = () => {
    const nextErrors: typeof errors = {};
    if (!reason) nextErrors.reason = "Pilih alasan pengembalian";
    if (!proofFile) nextErrors.proof = "Upload bukti foto produk";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    requestReturn(order.orderId, {
      reason,
      proofFile,
      proofPreview,
      note,
    });

    toast.success("Pengajuan pengembalian berhasil dibuat");
    navigate("/pengembalian", { replace: true });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* ================= HEADER ================= */}
      <div className="bg-white border-b px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-gray-100 cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="font-medium">Pengembalian Kue</h2>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="flex-1 space-y-5 p-4 max-w-2xl mx-auto w-full">
        {/* PRODUCT */}
        <div className="bg-primary/5 rounded-lg p-3 flex gap-3">
          <img
            src={product.image}
            alt={product.title}
            className="w-16 h-16 rounded-md object-cover border shrink-0"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium line-clamp-1">{product.title}</p>
            <p className="text-xs text-gray-400">{order.variant}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-xs text-gray-500">x{qty}</p>
            <p className="text-sm font-medium mt-1">
              Rp {product.price.toLocaleString("id-ID")}
            </p>
            <p className="text-xs text-gray-500">
              Total {qty} produk: Rp {total.toLocaleString("id-ID")}
            </p>
          </div>
        </div>

        {/* ALASAN */}
        <div>
          <p className="text-sm font-medium mb-2">
            Alasan Pengembalian <span className="text-red-500">*</span>
          </p>
          <div className="space-y-2">
            {reasons.map((r) => (
              <label
                key={r}
                className={`flex items-center gap-3 bg-white border rounded-md px-3 py-2.5 cursor-pointer transition ${
                  reason === r ? "border-primary" : "border-gray-200"
                }`}
              >
                <input
                  type="radio"
                  name="reason"
                  checked={reason === r}
                  onChange={() => {
                    setReason(r);
                    setErrors((p) => ({ ...p, reason: undefined }));
                  }}
                  className="accent-primary"
                />
                <span className="text-sm">{r}</span>
              </label>
            ))}
          </div>
          {errors.reason && (
            <p className="text-xs text-red-500 mt-1">{errors.reason}</p>
          )}
        </div>

        {/* UPLOAD BUKTI */}
        <div>
          <p className="text-sm font-medium mb-2">
            Upload Bukti <span className="text-red-500">*</span>
          </p>
          <label
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className={`flex flex-col items-center justify-center gap-1 bg-white border-2 border-dashed rounded-md py-10 px-4 cursor-pointer text-center transition ${
              errors.proof ? "border-red-300" : "border-gray-300"
            }`}
          >
            {proofPreview ? (
              <img
                src={proofPreview}
                alt="Bukti"
                className="w-20 h-20 object-cover rounded-md mb-1"
              />
            ) : (
              <Upload className="w-6 h-6 text-gray-400 mb-1" />
            )}
            <p className="text-sm font-medium">
              {proofFile
                ? proofFile.name
                : "Klik untuk upload atau drag & drop"}
            </p>
            <p className="text-xs text-gray-400">PNG, JPG, JPEG (Max 5MB)</p>
            <input
              type="file"
              accept=".png,.jpg,.jpeg"
              className="hidden"
              onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
            />
          </label>
          {errors.proof && (
            <p className="text-xs text-red-500 mt-1">{errors.proof}</p>
          )}
          <p className="text-xs text-gray-400 mt-2">
            Upload bukti berupa foto produk yang ingin dikembalikan sebagai
            pertimbangan pengembalian
          </p>
        </div>

        {/* CATATAN */}
        <div>
          <label className="text-sm font-medium">
            Catatan <span className="text-gray-400">(Opsional)</span>
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Tambah catatan (opsional)"
            rows={3}
            className="mt-1 w-full text-sm bg-white border rounded-md px-3 py-2 resize-none focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* ================= FOOTER ================= */}
      <div className="sticky bottom-0 bg-white border-t px-4 py-4 flex gap-3 max-w-2xl mx-auto w-full">
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          className="flex-1 cursor-pointer"
        >
          Batal
        </Button>
        <Button
          onClick={handleSubmit}
          className="flex-1 bg-primary text-white cursor-pointer"
        >
          Ajukan Pengembalian
        </Button>
      </div>
    </div>
  );
};

export default PengembalianPage;
