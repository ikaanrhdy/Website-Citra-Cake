import {
  BASE_CAKE_OPTIONS,
  TIPE_CREAM_OPTIONS,
  WARNA_CREAM_OPTIONS,
} from "@/data/cake/cakeOption";
import type { CakeCustomizationState } from "@/types/cake";

const formatRp = (n: number) => `Rp ${n.toLocaleString("id-ID")}`;

interface Props {
  state: CakeCustomizationState;
}

const DropdownPilihan = ({ state }: Props) => {
  const {
    baseCake,
    setBaseCake,
    tipeCream,
    setTipeCream,
    warnaCream,
    setWarnaCream,
  } = state;

  return (
    <div className="bg-primary/5 rounded-xl p-4 space-y-4">
      <div>
        <label className="text-sm font-semibold">
          Pilih Base Cake <span className="text-red-500">*</span>
        </label>
        <select
          value={baseCake ?? ""}
          onChange={(e) => setBaseCake(e.target.value)}
          className="mt-1 w-full bg-white border rounded-md px-3 py-2 text-sm cursor-pointer"
        >
          <option value="">Pilih base cake...</option>
          {BASE_CAKE_OPTIONS.map((b) => (
            <option key={b.id} value={b.id}>
              {b.label} {b.price ? `(+${formatRp(b.price)})` : "(Gratis)"}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-sm font-semibold">
          Tipe Cream <span className="text-red-500">*</span>
        </label>
        <select
          value={tipeCream ?? ""}
          onChange={(e) => setTipeCream(e.target.value)}
          className="mt-1 w-full bg-white border rounded-md px-3 py-2 text-sm cursor-pointer"
        >
          <option value="">Pilih tipe cream...</option>
          {TIPE_CREAM_OPTIONS.map((t) => (
            <option key={t.id} value={t.id}>
              {t.label} {t.price ? `(+${formatRp(t.price)})` : "(Gratis)"}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-sm font-semibold">
          Pilih Warna Cream <span className="text-red-500">*</span>
        </label>
        <select
          value={warnaCream ?? ""}
          onChange={(e) => setWarnaCream(e.target.value)}
          className="mt-1 w-full bg-white border rounded-md px-3 py-2 text-sm cursor-pointer"
        >
          <option value="">Pilih warna cream...</option>
          {WARNA_CREAM_OPTIONS.map((w) => (
            <option key={w.id} value={w.id}>
              {w.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default DropdownPilihan;
