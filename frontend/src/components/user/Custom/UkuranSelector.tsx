import { UKURAN_OPTIONS } from "@/data/cake/cakeOption";
import type { CakeCustomizationState, UkuranCm } from "@/types/cake";

interface Props {
  state: CakeCustomizationState;
  layerIndex: number; // 0 = Layer 1, 1 = Layer 2, dst
}

// Label deskripsi tiap layer berdasarkan tingkatnya —
// tingkat 1 = dasar, tingkat terakhir = puncak, tengah-tengah cuma "Tingkat N"
const LAYER_LABELS = [
  "Tingkat 1 — Dasar",
  "Tingkat 2",
  "Tingkat 3",
  "Tingkat 4 — Puncak",
];

const getLayerDescription = (layerIndex: number) => {
  return LAYER_LABELS[layerIndex] ?? `Tingkat ${layerIndex + 1}`;
};

const UkuranSelector = ({ state, layerIndex }: Props) => {
  const { ukuran, setUkuran } = state;
  console.log("UkuranSelector render", layerIndex, ukuran?.[layerIndex]);
  const selected = ukuran?.[layerIndex] ?? null;
  console.log("UkuranSelector render selected:", layerIndex, selected);

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">
        Pilih Ukuran Layer {layerIndex + 1}
        <span className="text-red-500">*</span>{" "}
        <span className="italic font-normal">
          ({getLayerDescription(layerIndex)})
        </span>
      </p>
      <div className="grid grid-cols-4 gap-2">
        {UKURAN_OPTIONS.map((u) => (
          <button
            key={u}
            type="button"
            onClick={() => setUkuran(layerIndex, u as UkuranCm)}
            className={`py-1.5 rounded text-xs cursor-pointer transition ${
              selected === u
                ? "bg-primary text-white"
                : "bg-white border text-gray-700 hover:bg-gray-100"
            }`}
          >
            {u}
          </button>
        ))}
      </div>
    </div>
  );
};

export default UkuranSelector;
