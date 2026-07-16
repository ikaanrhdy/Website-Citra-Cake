import { Minus, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  TOPPING_OPTIONS,
  LILIN_OPTIONS,
  TOPPER_PRICE_PER_PCS,
} from "@/data/cake/cakeOption";
import type { CakeCustomizationState } from "@/types/cake";

const formatRp = (n: number) => `Rp ${n.toLocaleString("id-ID")}`;

interface Props {
  state: CakeCustomizationState;
}

const DekorasiSection = ({ state }: Props) => {
  const {
    dekorasi,
    setTopping,
    setLilin,
    setLilinDetail,
    toggleTopper,
    setTopperDetail,
    setDekorasiLainnya,
    priceBreakdown,
  } = state;

  const selectedTopping = TOPPING_OPTIONS.find(
    (t) => t.id === dekorasi.topping,
  );
  const selectedLilin = LILIN_OPTIONS.find((l) => l.id === dekorasi.lilin);

  const jumlahLilin =
    dekorasi.lilin === "random" ? 0 : Math.max(dekorasi.lilinJumlah, 1);
  const subtotalTopping = selectedTopping?.price ?? 0;
  const subtotalLilin = (selectedLilin?.price ?? 0) * jumlahLilin;
  const subtotalTopper = dekorasi.topperAktif
    ? TOPPER_PRICE_PER_PCS * Math.max(dekorasi.topperJumlah, 1)
    : 0;

  const handleToppingClick = (id: typeof dekorasi.topping) => {
    setTopping(dekorasi.topping === id ? "random" : id);
  };

  const handleLilinClick = (id: typeof dekorasi.lilin) => {
    if (dekorasi.lilin === id) {
      setLilin("random");
      setLilinDetail(dekorasi.lilinCatatan, 0);
    } else {
      setLilin(id);
      setLilinDetail(dekorasi.lilinCatatan, Math.max(dekorasi.lilinJumlah, 1));
    }
  };

  const handleTopperMinus = () => {
    const next = Math.max(0, dekorasi.topperJumlah - 1);
    setTopperDetail(dekorasi.topperNama, next);
    if (next === 0 && dekorasi.topperAktif) toggleTopper();
  };

  const handleTopperPlus = () => {
    const next = dekorasi.topperJumlah + 1;
    setTopperDetail(dekorasi.topperNama, next);
    if (!dekorasi.topperAktif) toggleTopper();
  };

  const adaDekorasiDipilih =
    dekorasi.topping !== "random" ||
    dekorasi.lilin !== "random" ||
    dekorasi.topperJumlah > 0;

  return (
    <div className="bg-primary/5 rounded-xl p-4 space-y-5">
      <div>
        <h3 className="font-semibold text-sm">Tambah Dekorasi</h3>
        <p className="text-xs text-gray-500">
          (lilin angka/huruf, & topper tambahkan catatan)
        </p>
      </div>

      {/* TOPPING */}
      <div>
        <p className="text-sm font-medium mb-2">Topping</p>
        <div className="grid grid-cols-3 gap-2">
          {TOPPING_OPTIONS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => handleToppingClick(t.id)}
              className={`py-2 rounded text-xs cursor-pointer transition flex flex-col items-center gap-0.5 ${
                dekorasi.topping === t.id
                  ? "bg-primary text-white"
                  : "bg-white border text-gray-700 hover:bg-gray-100"
              }`}
            >
              <span>{t.label}</span>
              <span className="opacity-80">
                {t.price ? formatRp(t.price) : "(free)"}
              </span>
            </button>
          ))}
        </div>

        {/* Catatan muncul otomatis begitu topping "Random" dipilih */}
        {dekorasi.topping === "random" && (
          <div className="mt-2 bg-white border rounded-md p-3 space-y-2">
            <p className="text-xs text-gray-600">
              <span className="font-medium text-primary">Catatan:</span> Topping
              Random tersedia dalam 3 pilihan: permen yupi, marsmallow, oreo,
              atau marie regal. Cantumkan pilihanmu di catatan pesanan, jika
              tidak akan dipilih secara acak.
            </p>
          </div>
        )}
      </div>

      {/* LILIN */}
      <div>
        <p className="text-sm font-medium mb-2">
          Pilih Tipe Lilin <span className="text-gray-400">(Pilih 1)</span>
        </p>
        <div className="grid grid-cols-3 gap-2">
          {LILIN_OPTIONS.map((l) => (
            <button
              key={l.id}
              type="button"
              onClick={() => handleLilinClick(l.id)}
              className={`py-2 rounded text-xs cursor-pointer transition flex flex-col items-center gap-0.5 ${
                dekorasi.lilin === l.id
                  ? "bg-primary text-white"
                  : "bg-white border text-gray-700 hover:bg-gray-100"
              }`}
            >
              <span>{l.label}</span>
              <span className="opacity-80">
                {l.price ? formatRp(l.price) : "(free)"}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* TOPPER */}
      <div>
        <p className="text-sm font-medium mb-2">
          Topper <span className="text-gray-400">(Opsional)</span>
        </p>
        <div className="flex items-center justify-between bg-white border rounded-md px-3 py-2">
          <span className="text-xs">
            Tambah Topper {formatRp(TOPPER_PRICE_PER_PCS)}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleTopperMinus}
              className="p-1 rounded border cursor-pointer hover:bg-gray-100"
            >
              <Minus size={14} />
            </button>
            <span className="text-sm w-4 text-center">
              {dekorasi.topperJumlah}
            </span>
            <button
              type="button"
              onClick={handleTopperPlus}
              className="p-1 rounded border cursor-pointer hover:bg-gray-100"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* DEKORASI LAINNYA */}
      <div>
        <p className="text-sm font-medium mb-2">
          Dekorasi Lainnya <span className="text-gray-400">(Opsional)</span>
        </p>
        <Input
          value={dekorasi.dekorasiLainnya}
          onChange={(e) => setDekorasiLainnya(e.target.value)}
          placeholder="Tambahkan detail aksesori / warna / preferensi lainnya..."
          className="bg-white text-sm"
        />
      </div>

      {/* CATATAN & RINCIAN HARGA DEKORASI */}
      {adaDekorasiDipilih && (
        <div className="bg-white rounded-md border p-3 space-y-3">
          <p className="text-sm font-medium">
            Catatan & Rincian Harga Dekorasi
          </p>

          {dekorasi.lilin !== "random" && (
            <div className="flex items-center gap-2">
              <Input
                value={dekorasi.lilinCatatan}
                onChange={(e) =>
                  setLilinDetail(e.target.value, dekorasi.lilinJumlah)
                }
                placeholder="Cantumkan Angka/huruf (misal: 23)"
                className="text-xs flex-1"
              />
              <div className="flex items-center gap-1 border rounded-md px-2 py-1">
                <button
                  type="button"
                  onClick={() =>
                    setLilinDetail(
                      dekorasi.lilinCatatan,
                      Math.max(0, dekorasi.lilinJumlah - 1),
                    )
                  }
                  className="cursor-pointer"
                >
                  <Minus size={12} />
                </button>
                <span className="text-xs w-4 text-center">
                  {dekorasi.lilinJumlah}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setLilinDetail(
                      dekorasi.lilinCatatan,
                      dekorasi.lilinJumlah + 1,
                    )
                  }
                  className="cursor-pointer"
                >
                  <Plus size={12} />
                </button>
              </div>
            </div>
          )}

          {dekorasi.topperJumlah > 0 && (
            <div className="flex items-center gap-2">
              <Input
                value={dekorasi.topperNama}
                onChange={(e) =>
                  setTopperDetail(e.target.value, dekorasi.topperJumlah)
                }
                placeholder="Nama / tema topper (misal: Doraemon)"
                className="text-xs flex-1"
              />
            </div>
          )}

          <div className="space-y-1 text-xs pt-1 border-t">
            {dekorasi.topping !== "random" && (
              <div className="flex justify-between">
                <span>{selectedTopping?.label}</span>
                <span>{formatRp(subtotalTopping)}</span>
              </div>
            )}
            {dekorasi.lilin !== "random" && (
              <div className="flex justify-between">
                <span>
                  {selectedLilin?.label} x{jumlahLilin}
                </span>
                <span>{formatRp(subtotalLilin)}</span>
              </div>
            )}
            {dekorasi.topperJumlah > 0 && (
              <div className="flex justify-between">
                <span>Topper x{dekorasi.topperJumlah}</span>
                <span>{formatRp(subtotalTopper)}</span>
              </div>
            )}
            <div className="flex justify-between font-semibold pt-1 border-t">
              <span>Total Dekorasi</span>
              <span>{formatRp(priceBreakdown.hargaDekorasi)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DekorasiSection;
