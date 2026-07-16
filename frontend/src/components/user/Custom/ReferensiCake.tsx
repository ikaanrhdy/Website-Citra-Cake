import { useState } from "react";
import { Link2, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { CakeCustomizationState } from "@/types/cake";
interface Props {
  state: CakeCustomizationState;
}

const ReferensiCake = ({ state }: Props) => {
  const { referensi, setReferensiUrl, setReferensiFile } = state;
  const [mode, setMode] = useState<"url" | "upload">("url");

  const handleFileChange = (file: File | null) => {
    if (!file) {
      setReferensiFile(null);
      setReferensiUrl("");
      return;
    }
    setReferensiFile(file.name);
    setReferensiUrl(URL.createObjectURL(file));
  };

  return (
    <div className="bg-primary/5 rounded-xl p-4 space-y-3">
      <h3 className="font-semibold text-sm">
        Referensi Cake <span className="text-gray-400">(Opsional)</span>
      </h3>

      <div className="flex bg-white rounded-md border p-1 gap-1">
        <button
          type="button"
          onClick={() => setMode("url")}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded text-sm cursor-pointer transition ${
            mode === "url"
              ? "bg-primary text-white"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <Link2 size={14} /> URL Link
        </button>
        <button
          type="button"
          onClick={() => setMode("upload")}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded text-sm cursor-pointer transition ${
            mode === "upload"
              ? "bg-primary text-white"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <Upload size={14} /> Upload File
        </button>
      </div>

      {mode === "url" ? (
        <Input
          value={referensi.url}
          onChange={(e) => setReferensiUrl(e.target.value)}
          placeholder="https://example.com/image.jpg"
          className="bg-white text-sm"
        />
      ) : (
        <label className="flex flex-col items-center justify-center gap-1 bg-white border-2 border-dashed rounded-md py-6 cursor-pointer text-center">
          <Upload className="w-5 h-5 text-gray-400" />
          <span className="text-xs text-gray-500">
            {referensi.fileName
              ? referensi.fileName
              : "Klik untuk upload gambar"}
          </span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
          />
        </label>
      )}

      <p className="text-xs text-primary bg-white border border-primary/20 rounded-md p-3">
        <span className="font-medium">Cara pakai:</span> Upload atau tempel link
        foto kue yang ingin kamu jadikan referensi. Gambar akan tampil di
        preview di atas bersama ilustrasi kue kamu, sehingga penjual bisa
        melihat dengan jelas kue yang kamu inginkan.
      </p>
    </div>
  );
};

export default ReferensiCake;
