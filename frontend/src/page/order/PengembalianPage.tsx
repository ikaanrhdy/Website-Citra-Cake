import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Upload, X } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router";
import { useOrderStore, type Order } from "@/app/store/useOrderStore";

const RETURN_REASON_OPTIONS = [
  "Cake rusak saat diterima",
  "Pesanan tidak sesuai",
  "Rasa/kualitas tidak sesuai",
  "Lainnya",
];

const PengembalianKuePage = () => {
  const { id: orderId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const requestReturn = useOrderStore((s) => s.requestReturn);
  const getByOrderId = useOrderStore((s) => s.getByOrderId);

  // Prioritas: order dari state (dikirim via navigate), fallback lookup ke
  // store pakai param URL — biar halaman tetap jalan walau diakses langsung
  // lewat URL/refresh (state navigasi bakal hilang di situasi itu).
  const stateOrder = (location.state as { order?: Order } | null)?.order;
  const order = stateOrder ?? (orderId ? getByOrderId(orderId) : undefined);

  const [returnReason, setReturnReason] = useState("");
  const [returnNote, setReturnNote] = useState("");
  const [returnProofFile, setReturnProofFile] = useState<File | null>(null);
  const [returnProofPreview, setReturnProofPreview] = useState<string | null>(
    null,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!returnProofFile) {
      setReturnProofPreview(null);
      return;
    }
    const url = URL.createObjectURL(returnProofFile);
    setReturnProofPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [returnProofFile]);

  const handleProofFile = (file: File | null) => {
    console.log("[Pengembalian] handleProofFile dipanggil dengan:", file);
    if (file) setReturnProofFile(file);
  };

  const handleRemoveProof = () => {
    setReturnProofFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // DEBUG: log tiap kali komponen render, biar kelihatan state terkini &
  // kondisi disabled tombol "Ajukan Pengembalian" apa yang bikin dia mati.
  const isSubmitDisabled = !returnReason.trim() || !returnProofFile;
  console.log("[Pengembalian] render state:", {
    returnReason,
    returnProofFile,
    returnProofPreview,
    isSubmitDisabled,
  });

  const handleSubmit = () => {
    console.log("[Pengembalian] handleSubmit DIPANGGIL. state saat ini:", {
      orderId,
      returnReason,
      returnProofFile,
      returnNote,
    });

    if (!orderId) {
      console.warn("[Pengembalian] BATAL submit: orderId kosong/undefined");
      return;
    }
    if (!returnReason.trim()) {
      console.warn("[Pengembalian] BATAL submit: returnReason masih kosong");
      return;
    }
    if (!returnProofFile) {
      console.warn("[Pengembalian] BATAL submit: returnProofFile masih null");
      return;
    }

    console.log("[Pengembalian] Lolos validasi, memanggil requestReturn...");
    requestReturn(orderId, {
      reason: returnReason,
      proofFile: returnProofFile,
      proofPreview: returnProofPreview,
      note: returnNote,
    });
    console.log("[Pengembalian] requestReturn selesai dipanggil, navigate...");

    // setelah pengajuan, arahkan ke tab status pesanan "Pengembalian"
    // NOTE: value query param harus PERSIS "Pengembalian" (capital P),
    // karena isValidTab() di OrderPage bersifat case-sensitive terhadap array TABS.
    navigate("/order?tab=Pengembalian", { replace: true });
  };

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-20">
        <p className="text-gray-500 text-sm">Pesanan tidak ditemukan.</p>
        <Button onClick={() => navigate(-1)} className="cursor-pointer">
          Kembali
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* HEADER — panah kembali, BUKAN tombol X */}
      <div className="flex items-center gap-3 px-4 py-3 border-b sticky top-0 bg-white z-10 md:px-8">
        <button
          onClick={() => navigate(-1)}
          className="p-1 -ml-1 cursor-pointer"
          aria-label="Kembali"
        >
          <ArrowLeft size={22} />
        </button>
        <h1 className="text-base md:text-lg font-semibold">Pengembalian Kue</h1>
      </div>

      <div className="flex-1 px-4 py-5 md:px-8 md:py-8 max-w-2xl mx-auto w-full">
        <div className="flex flex-col gap-5 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-5">
          {/* Kartu produk — deskripsi produk TIDAK diubah */}
          <div className="p-3 bg-primary/5 rounded-xl border border-primary/10 md:col-span-2">
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-1 flex items-start justify-center p-1 rounded-lg border border-[#D8DADC] shrink-0">
                <img
                  src={order.product.image}
                  alt={order.product.title}
                  className="w-full aspect-square rounded-lg object-cover"
                />
              </div>
              <div className="col-span-2 grid grid-rows-2 gap-1 min-w-0">
                <div className="flex flex-col justify-center gap-0.5 min-w-0">
                  <h2 className="text-sm font-medium truncate">
                    {order.product.title}
                  </h2>
                  <p className="text-[11px] text-gray-400">{order.variant}</p>
                </div>
                <div className="flex flex-col justify-end items-end gap-0.5 text-right">
                  <p className="text-xs">x{order.qty}</p>
                  <p className="text-xs font-medium">
                    Rp {order.product.price.toLocaleString("id-ID")}
                  </p>
                  <p className="text-[11px] text-gray-600">
                    Total {order.qty} produk: Rp{" "}
                    {(order.product.price * order.qty).toLocaleString("id-ID")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Alasan Pengembalian */}
          <div>
            <p className="text-sm font-medium mb-2">
              Alasan Pengembalian <span className="text-red-500">*</span>
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-2">
              {RETURN_REASON_OPTIONS.map((opt) => (
                <label
                  key={opt}
                  className={`flex items-center gap-3 border rounded-lg px-4 py-3 text-sm cursor-pointer transition ${
                    returnReason === opt
                      ? "border-primary bg-primary/5"
                      : "border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="returnReason"
                    value={opt}
                    checked={returnReason === opt}
                    onChange={(e) => setReturnReason(e.target.value)}
                    className="w-4 h-4 accent-primary shrink-0"
                  />
                  {opt}
                </label>
              ))}
            </div>
          </div>

          {/* Upload Bukti */}
          <div>
            <p className="text-sm font-medium mb-2">
              Upload Bukti <span className="text-red-500">*</span>
            </p>

            {returnProofFile && returnProofPreview ? (
              <div className="relative rounded-xl overflow-hidden border border-gray-200 group">
                <img
                  src={returnProofPreview}
                  alt="Bukti pengembalian"
                  className="w-full aspect-4/3 sm:aspect-video md:aspect-4/3 object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemoveProof}
                  className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1.5 hover:bg-black/80 cursor-pointer"
                  aria-label="Hapus foto"
                >
                  <X size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 flex items-end justify-center bg-black/0 group-hover:bg-black/30 transition cursor-pointer"
                >
                  <span className="text-white text-xs font-medium pb-3 opacity-0 group-hover:opacity-100 transition">
                    Klik untuk ganti foto
                  </span>
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  handleProofFile(e.dataTransfer.files?.[0] ?? null);
                }}
                className="border-2 border-dashed border-gray-300 rounded-lg py-8 flex flex-col items-center gap-2 cursor-pointer hover:border-primary transition text-center px-4"
              >
                <Upload size={26} className="text-gray-400" />
                <p className="text-sm font-medium">
                  Klik untuk upload atau drag & drop
                </p>
                <p className="text-xs text-gray-400">
                  PNG, JPG, JPEG (Max 5MB)
                </p>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg"
              className="hidden"
              onChange={(e) => handleProofFile(e.target.files?.[0] ?? null)}
            />
            <p className="text-xs text-gray-500 mt-2">
              Upload bukti berupa foto produk yang ingin dikembalikan sebagai
              pertimbangan pengembalian
            </p>
          </div>

          {/* Catatan */}
          <div className="md:col-span-2">
            <p className="text-sm font-medium mb-2">
              Catatan{" "}
              <span className="text-gray-400 font-normal">(Opsional)</span>
            </p>
            <Textarea
              placeholder="Tambah catatan (opsional)"
              value={returnNote}
              onChange={(e) => setReturnNote(e.target.value)}
              className="text-sm"
            />
          </div>
        </div>
      </div>

      {/* FOOTER ACTION — sticky di bawah, bukan tombol X di pojok */}
      <div className="sticky bottom-0 bg-white border-t p-4 flex gap-2 md:px-8">
        <div className="max-w-2xl mx-auto w-full flex gap-2">
          <Button
            variant="ghost"
            className="flex-1 border border-gray-300 text-gray-800 cursor-pointer"
            onClick={() => navigate(-1)}
          >
            Batal
          </Button>
          <Button
            className="flex-1 bg-primary text-white cursor-pointer hover:bg-primary/90"
            onClick={(e) => {
              console.log("[Pengembalian] Button onClick TERPICU", e);
              handleSubmit();
            }}
            onMouseDown={() =>
              console.log(
                "[Pengembalian] Button onMouseDown (event nyampe ke tombol)",
              )
            }
            disabled={isSubmitDisabled}
          >
            Ajukan Pengembalian
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PengembalianKuePage;
