import { useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { toast } from "sonner";
import type {
  KustomisasiItem,
  KustomisasiTab,
} from "@/app/store/admin/useKustomisasiStore";

interface KustomisasiModalProps {
  tab: KustomisasiTab;
  initialData: KustomisasiItem | null;
  onClose: () => void;
  onSave: (item: KustomisasiItem) => void;
}

export const KustomisasiModal = ({
  tab,
  initialData,
  onClose,
  onSave,
}: KustomisasiModalProps) => {
  const isEdit = !!initialData;
  const isWarnaTab = tab === "Warna Cream";

  const [nama, setNama] = useState(initialData?.nama ?? "");
  const [harga, setHarga] = useState(
    initialData?.harga != null ? String(initialData.harga) : "",
  );
  const [warna, setWarna] = useState(initialData?.warna ?? "#FFFFFF");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!nama.trim()) {
      setError("Nama wajib diisi");
      return;
    }

    const item: KustomisasiItem = {
      id: initialData?.id ?? crypto.randomUUID(),
      nama: nama.trim(),
      harga: harga.trim() === "" ? 0 : Number(harga),
      status: initialData?.status ?? "Tersedia",
      ...(isWarnaTab ? { warna } : {}),
    };

    onSave(item);
    toast.success(
      isEdit
        ? `"${item.nama}" berhasil diperbarui`
        : `"${item.nama}" berhasil ditambahkan`,
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.15 }}
        className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
          <h3 className="text-base font-bold text-gray-900 dark:text-white">
            {isEdit ? "Edit Opsi" : "Tambah Opsi Baru"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {isWarnaTab && (
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">
                Warna (Kode Hex)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={warna}
                  onChange={(e) => setWarna(e.target.value)}
                  className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer"
                />
                <input
                  type="text"
                  value={warna}
                  onChange={(e) => setWarna(e.target.value)}
                  className="flex-1 px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-transparent uppercase"
                  placeholder="#FFFFFF"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">
              Nama
            </label>
            <input
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-transparent"
              placeholder={
                isWarnaTab ? "misal: Merah Muda" : "Masukkan nama opsi"
              }
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">
              Harga Tambahan (Rp)
            </label>
            <input
              type="number"
              value={harga}
              onChange={(e) => setHarga(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-transparent"
              placeholder="0"
            />
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-gray-100 dark:border-gray-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition cursor-pointer"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-lg transition cursor-pointer"
          >
            {isEdit ? "Simpan" : "Tambah"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
