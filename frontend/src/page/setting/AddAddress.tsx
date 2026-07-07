import { useNavigate } from "react-router";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { FaFileInvoice } from "react-icons/fa";
import { motion } from "framer-motion";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

const AddAddress = () => {
  const navigate = useNavigate();
  const [label, setLabel] = useState<"rumah" | "kantor">("rumah");

  return (
    <div className="flex flex-col min-h-screen ">
      {/* ================= HEADER ================= */}
      <motion.div
        initial={{ y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center bg-white p-3 md:px-6 border-b sticky top-0 z-10"
      >
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-200 rounded-full transition cursor-pointer"
        >
          <ArrowLeft />
        </button>

        <h2 className="ml-2 font-medium text-sm md:text-lg">Pengaturan Akun</h2>
      </motion.div>

      {/* ================= CONTENT ================= */}
      <div className="flex flex-col gap-8 p-4 md:p-10 max-w-3xl lg:max-w-4xl w-full mx-auto">
        {/* ===== Tempel & Isi Otomatis ===== */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white rounded-2xl p-5 md:p-6 border shadow-sm"
        >
          <div className="flex items-center gap-2 mb-4">
            <FaFileInvoice className="size-5 md:size-6" />
            <span className="font-medium text-sm md:text-base">
              Tempel dan Isi Otomatis
            </span>
          </div>

          <div className="bg-gray-50 border rounded-lg p-3 md:p-4 text-sm md:text-base text-gray-600">
            Tempel atau masukkan informasi, lalu sistem akan mengisi nomor HP
            dan alamat secara otomatis.
          </div>
        </motion.div>

        {/* ===== FORM ALAMAT ===== */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-5 md:p-6 border shadow-sm space-y-5"
        >
          <h3 className="text-sm md:text-base font-semibold">Alamat</h3>

          {/* Nama */}
          <div className="space-y-1.5">
            <label className="text-xs md:text-sm text-gray-500">
              Nama Lengkap
            </label>
            <Input className="md:h-11 md:text-sm" placeholder="Nama penerima" />
          </div>

          {/* Telepon */}
          <div className="space-y-1.5">
            <label className="text-xs md:text-sm text-gray-500">
              Nomor Telepon
            </label>
            <Input className="md:h-11 md:text-sm" placeholder="08xxxxxxxxxx" />
          </div>

          {/* Lokasi */}
          <div className="space-y-1.5">
            <label className="text-xs md:text-sm text-gray-500">
              Provinsi, Kota, Kecamatan, Kode Pos
            </label>
            <button className="w-full flex items-center justify-between border rounded-lg px-3 py-2 md:py-2.5 text-sm md:text-base text-gray-500 hover:bg-gray-50 transition">
              Pilih lokasi
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Jalan */}
          <div className="space-y-1.5">
            <label className="text-xs md:text-sm text-gray-500">
              Nama Jalan, Gedung, No Rumah
            </label>
            <Textarea
              rows={2}
              className="md:text-sm md:leading-relaxed"
              placeholder="Nama jalan, gedung, nomor rumah"
            />
          </div>

          {/* Detail */}
          <div className="space-y-1.5">
            <label className="text-xs md:text-sm text-gray-500">
              Detail Lainnya (opsional)
            </label>
            <Textarea
              rows={2}
              className="md:text-sm md:leading-relaxed"
              placeholder="Blok / Unit / Patokan"
            />
          </div>
        </motion.div>

        {/* ===== PENGATURAN TAMBAHAN ===== */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-2xl p-5 md:p-6 border shadow-sm space-y-5"
        >
          {[
            "Atur sebagai alamat utama",
            "Atur sebagai alamat toko",
            "Atur sebagai alamat pengembalian",
          ].map((text) => (
            <div key={text} className="flex items-center justify-between">
              <span className="text-sm md:text-base">{text}</span>
              <Switch className="cursor-pointer" />
            </div>
          ))}

          {/* ===== Label Rumah / Kantor ===== */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-sm md:text-base">Tandai sebagai</span>

            <div className="flex bg-gray-100 rounded-full p-1 md:p-1.5">
              {["rumah", "kantor"].map((item) => (
                <button
                  key={item}
                  onClick={() => setLabel(item as "rumah" | "kantor")}
                  className={`px-4 md:px-5 py-1.5 md:py-2 text-xs md:text-sm rounded-full transition cursor-pointer
                    ${
                      label === item
                        ? "bg-white shadow font-medium"
                        : "text-gray-500"
                    }
                  `}
                >
                  {item === "rumah" ? "Rumah" : "Kantor"}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ===== SIMPAN ===== */}
        <Button className="w-full md:w-auto md:self-end md:px-8 md:py-2.5 md:text-base cursor-pointer">
          Simpan Alamat
        </Button>
      </div>
    </div>
  );
};

export default AddAddress;
