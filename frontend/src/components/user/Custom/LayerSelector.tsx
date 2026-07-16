import { LAYER_OPTIONS } from "@/data/cake/cakeOption";
import type { CakeCustomizationState, LayerCount } from "@/types/cake";
import UkuranSelector from "./UkuranSelector";

interface Props {
  state: CakeCustomizationState;
}

const LayerSelector = ({ state }: Props) => {
  const { layer, setLayer } = state;

  return (
    <div className="bg-primary/5 rounded-xl p-4 space-y-3">
      <div className="space-y-2">
        <h3 className="font-semibold text-sm">
          Pilih Layer Cake <span className="text-red-500">*</span>
        </h3>
        <div className="grid grid-cols-4 gap-2">
          {LAYER_OPTIONS.map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setLayer(l as LayerCount)}
              className={`py-2 rounded text-sm cursor-pointer transition ${
                layer === l
                  ? "bg-primary text-white"
                  : "bg-white border text-gray-700 hover:bg-gray-100"
              }`}
            >
              {l} Layer
            </button>
          ))}
        </div>
      </div>

      {/* Otomatis muncul 1 pilihan ukuran per layer, sesuai jumlah layer yang dipilih */}
      {layer && (
        <div className="space-y-3">
          {Array.from({ length: layer }).map((_, index) => (
            <UkuranSelector key={index} state={state} layerIndex={index} />
          ))}
        </div>
      )}
    </div>
  );
};

export default LayerSelector;
