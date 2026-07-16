import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Star, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useOrderStore, type PenilaianDetail } from "@/app/store/useOrderStore";
import { useLocation, useNavigate, useParams } from "react-router";

const RATING_LABEL: Record<number, string> = {
  1: "Buruk",
  2: "Kurang",
  3: "Cukup",
  4: "Bagus",
  5: "Sangat Bagus",
};

interface PenilaianPageState {
  productTitle: string;
  productImage: string;
  variant: string;
  qty: number;
  price: number;
  existing?: PenilaianDetail;
}

const PenilaianPage = () => {
  const navigate = useNavigate();
  const { orderId } = useParams<{ orderId: string }>();
  const location = useLocation();

  // Data produk dikirim lewat navigate(path, { state: {...} })
  const state = (location.state ?? {}) as Partial<PenilaianPageState>;
  const {
    productTitle = "",
    productImage = "",
    variant = "",
    qty = 1,
    price = 0,
    existing,
  } = state;

  const submitPenilaian = useOrderStore((s) => s.submitPenilaian);
  const isReadOnly = !!existing;

  const [rating, setRating] = useState(existing?.rating ?? 0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState(existing?.review ?? "");
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Kalau lagi lihat penilaian yang sudah pernah dikirim, pakai foto yang tersimpan di store
  const savedFotoUrl = existing?.fotoUrl ?? null;

  useEffect(() => {
    if (!fotoFile) {
      setFotoPreview(null);
      return;
    }
    const url = URL.createObjectURL(fotoFile);
    setFotoPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [fotoFile]);

  const handleFotoFile = (file: File | null) => {
    if (file) setFotoFile(file);
  };

  const handleRemoveFoto = () => {
    setFotoFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleBack = () => navigate(-1);

  const handleSubmit = () => {
    if (rating === 0 || !fotoFile || !orderId) return;

    // TODO: kalau ada backend, upload fotoFile ke server/storage dulu di sini
    // dan pakai URL hasil upload-nya, bukan object URL lokal (object URL
    // bakal invalid lagi setelah reload/tab ditutup).
    const fotoUrl = URL.createObjectURL(fotoFile);

    submitPenilaian(orderId, { rating, review, fotoUrl });
    navigate(-1);
  };

  const displayedRating = hoverRating || rating;
  const canSubmit = rating > 0 && !!fotoFile;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 flex items-center gap-3 px-4 py-3">
        <button
          type="button"
          onClick={handleBack}
          className="p-1 -ml-1 rounded-full hover:bg-gray-100 cursor-pointer"
          aria-label="Kembali"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-base font-semibold">
          {isReadOnly ? "Penilaian Kamu" : "Beri Penilaian"}
        </h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="flex flex-col gap-5 max-w-md mx-auto">
          {/* Kartu produk */}
          <div className="p-3 bg-primary/5 rounded-xl border border-primary/10">
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-1 flex items-start justify-center p-1 rounded-lg border border-[#D8DADC] shrink-0">
                <img
                  src={productImage}
                  alt={productTitle}
                  className="w-full aspect-square rounded-lg object-cover"
                />
              </div>
              <div className="col-span-2 grid grid-rows-2 gap-1 min-w-0">
                <div className="flex flex-col justify-center gap-0.5 min-w-0">
                  <h2 className="text-sm font-medium truncate">
                    {productTitle}
                  </h2>
                  <p className="text-[11px] text-gray-400">{variant}</p>
                </div>
                <div className="flex flex-col justify-end items-end gap-0.5 text-right">
                  <p className="text-xs">x{qty}</p>
                  <p className="text-xs font-medium">
                    Rp {price.toLocaleString("id-ID")}
                  </p>
                  <p className="text-[11px] text-gray-600">
                    Total {qty} produk: Rp{" "}
                    {(price * qty).toLocaleString("id-ID")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Rating bintang */}
          <div>
            <p className="text-sm font-medium mb-3 text-center">
              Bagaimana kualitas cake ini?
            </p>
            <div className="flex justify-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  disabled={isReadOnly}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => !isReadOnly && setHoverRating(star)}
                  onMouseLeave={() => !isReadOnly && setHoverRating(0)}
                  className={isReadOnly ? "cursor-default" : "cursor-pointer"}
                >
                  <Star
                    size={32}
                    className={
                      star <= displayedRating
                        ? "fill-yellow-400 text-yellow-400"
                        : "fill-gray-200 text-gray-200"
                    }
                  />
                </button>
              ))}
            </div>
            {displayedRating > 0 && (
              <p className="text-xs text-gray-500 text-center mt-1">
                {RATING_LABEL[displayedRating]}
              </p>
            )}
          </div>

          {/* Ceritakan pengalaman */}
          <div>
            <p className="text-sm font-medium mb-2">Ceritakan Pengalamanmu</p>
            <Textarea
              placeholder="Rasa dan tampilan kuenya sesuai pesanan..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
              readOnly={isReadOnly}
              className="min-h-24 resize-none text-sm"
            />
          </div>

          {/* Foto: mode readonly -> tampilkan foto tersimpan */}
          {isReadOnly ? (
            savedFotoUrl && (
              <div>
                <p className="text-sm font-medium mb-2">Foto</p>
                <img
                  src={savedFotoUrl}
                  alt="Foto penilaian"
                  className="w-full aspect-4/3 object-cover rounded-xl border border-gray-200"
                />
              </div>
            )
          ) : (
            <div>
              <p className="text-sm font-medium mb-2">
                Tambahkan Foto <span className="text-red-500">*</span>
              </p>

              {fotoFile && fotoPreview ? (
                <div className="relative rounded-xl overflow-hidden border border-gray-200 group">
                  <img
                    src={fotoPreview}
                    alt="Foto penilaian"
                    className="w-full aspect-4/3 object-cover"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveFoto}
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
                    handleFotoFile(e.dataTransfer.files?.[0] ?? null);
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
                onChange={(e) => handleFotoFile(e.target.files?.[0] ?? null)}
              />
            </div>
          )}
        </div>
      </div>

      {/* Footer aksi */}
      {!isReadOnly && (
        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-4 py-3 flex gap-3 justify-end">
          <Button
            variant="ghost"
            className="cursor-pointer"
            onClick={handleBack}
          >
            Batal
          </Button>
          <Button
            className="bg-primary text-white cursor-pointer"
            disabled={!canSubmit}
            onClick={handleSubmit}
          >
            Kirim Penilaian
          </Button>
        </div>
      )}
    </div>
  );
};

export default PenilaianPage;
