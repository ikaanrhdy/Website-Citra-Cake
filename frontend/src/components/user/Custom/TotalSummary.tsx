import type { CakeCustomizationState } from "@/types/cake";

const formatRp = (n: number) => `Rp ${n.toLocaleString("id-ID")}`;

interface Props {
  state: CakeCustomizationState;
}

const TotalSummary = ({ state }: Props) => {
  const { ukuran, priceBreakdown, previewSummary } = state;
  const { hargaDasar, hargaLayer, hargaBaseCake, hargaDekorasi, total } =
    priceBreakdown;

  return (
    <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 space-y-2">
      <p className="font-semibold text-primary text-sm">
        TOTAL HARGA KUSTOMISASI
      </p>
      <p className="text-2xl font-bold text-primary">{formatRp(total)}</p>

      <div className="space-y-1 text-xs pt-2 border-t">
        <div className="flex justify-between">
          <span>Harga Kue Dasar</span>
          <span>{formatRp(hargaDasar)}</span>
        </div>
        {ukuran && (
          <div className="flex justify-between">
            <span>Ukuran</span>
            <span>{ukuran} cm</span>
          </div>
        )}
        <div className="flex justify-between">
          <span>Tambah Layer</span>
          <span>
            {previewSummary.layerLabel}{" "}
            {hargaLayer > 0 ? `(+${formatRp(hargaLayer)})` : ""}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Base Cake & Cream</span>
          <span>{formatRp(hargaBaseCake)}</span>
        </div>
        <div className="flex justify-between">
          <span>Dekorasi</span>
          <span>{formatRp(hargaDekorasi)}</span>
        </div>
      </div>
    </div>
  );
};

export default TotalSummary;
