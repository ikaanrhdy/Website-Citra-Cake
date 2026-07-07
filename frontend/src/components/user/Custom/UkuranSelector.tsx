import { UKURAN_OPTIONS } from "@/data/cake/cakeOption";
import type { CakeCustomizationState } from "@/hooks/useCakeCustomization";
import type { UkuranCm } from "@/types/cake";

interface Props {
  state: CakeCustomizationState;
}

const UkuranSelector = ({ state }: Props) => {
  const { ukuran, setUkuran } = state;

  return (
    <div className="bg-primary/5 rounded-xl p-4 space-y-2">
      <h3 className="font-semibold text-sm">
        Pilih Ukuran <span className="text-red-500">*</span>
      </h3>
      <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
        {UKURAN_OPTIONS.map((u) => (
          <button
            key={u}
            type="button"
            onClick={() => setUkuran(u as UkuranCm)}
            className={`py-2 rounded text-sm cursor-pointer transition ${
              ukuran === u
                ? "bg-primary text-white"
                : "bg-white border text-gray-700 hover:bg-gray-100"
            }`}
          >
            {u} cm
          </button>
        ))}
      </div>
    </div>
  );
};

export default UkuranSelector;
