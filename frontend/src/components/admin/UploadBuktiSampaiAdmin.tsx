import { useState, useRef } from "react";
import { X, Upload } from "lucide-react";

interface UploadBuktiSampaiAdminProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  onSubmit: (data: { file: File; catatan: string }) => void;
}

const UploadBuktiSampaiAdmin = ({
  isOpen,
  onClose,
  orderId,
  onSubmit,
}: UploadBuktiSampaiAdminProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [catatan, setCatatan] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFile = (selected: File | undefined) => {
    if (!selected) return;
    if (!selected.type.match(/image\/(png|jpe?g)/)) return;
    if (selected.size > 5 * 1024 * 1024) return; // max 5MB

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  const handleClose = () => {
    setFile(null);
    setPreview(null);
    setCatatan("");
    onClose();
  };

  const handleUpload = () => {
    if (!file) return;
    onSubmit({ file, catatan });
    handleClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => {
        e.stopPropagation(); // stop bubbling ke card/navigate
        handleClose(); // klik overlay gelap = tutup modal
      }}
    >
      <div
        className="bg-white rounded-xl w-full max-w-sm p-5 space-y-4 shadow-lg"
        onClick={(e) => e.stopPropagation()} // klik di dalam kotak putih gak ikut nutup / navigate
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-lg text-gray-900">
            Upload Bukti Sampai
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* ID Pesanan */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-800">
            ID Pesanan
          </label>
          <div className="bg-gray-100 rounded-md px-3 py-2.5 text-sm text-gray-600">
            {orderId}
          </div>
        </div>

        {/* Upload area */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-800">
            Foto Bukti Sampai <span className="text-red-500">*</span>
          </label>

          <div
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg py-6 px-4 flex flex-col items-center justify-center gap-1.5 cursor-pointer transition ${
              isDragging
                ? "border-primary bg-purple-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <input
              ref={inputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />

            {preview ? (
              <img
                src={preview}
                alt="Preview bukti"
                className="w-24 h-24 object-cover rounded-md border border-gray-200"
              />
            ) : (
              <>
                <Upload className="w-6 h-6 text-gray-400" />
                <p className="text-sm text-center">
                  <span className="font-semibold text-gray-800">
                    Klik untuk upload
                  </span>{" "}
                  <span className="text-gray-500">atau drag & drop</span>
                </p>
                <p className="text-xs text-gray-400">
                  PNG, JPG, JPEG (Max 5MB)
                </p>
              </>
            )}
          </div>

          <p className="text-xs text-amber-600 flex items-start gap-1">
            💡 Upload foto produk yang sudah diterima pelanggan sebagai bukti
            pengiriman
          </p>
        </div>

        {/* Catatan */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-800">
            Catatan (Opsional)
          </label>
          <textarea
            value={catatan}
            onChange={(e) => setCatatan(e.target.value)}
            placeholder="Contoh: Diterima oleh Ibu Siti, kondisi produk baik"
            rows={3}
            className="w-full border border-gray-200 rounded-md px-3 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-1">
          <button
            onClick={handleClose}
            className="flex-1 border border-gray-200 rounded-md py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition cursor-pointer"
          >
            Batal
          </button>
          <button
            onClick={handleUpload}
            disabled={!file}
            className="flex-1 bg-primary rounded-md py-2.5 text-sm font-medium text-white hover:opacity-90 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadBuktiSampaiAdmin;
