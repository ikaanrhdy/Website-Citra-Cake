import { Input } from "@/components/ui/input";
import type { CakeCustomizationState } from "@/hooks/useCakeCustomization";

interface Props {
  state: CakeCustomizationState;
}

const UcapanCatatan = ({ state }: Props) => {
  const { ucapan, setUcapan, catatanPesanan, setCatatanPesanan } = state;

  return (
    <div className="space-y-3">
      <div>
        <label className="text-sm font-semibold">Tambah Ucapan</label>
        <Input
          value={ucapan}
          onChange={(e) => setUcapan(e.target.value)}
          placeholder="Happy Birthday, ika!..."
          className="mt-1 bg-white text-sm"
        />
      </div>
      <div>
        <label className="text-sm font-semibold">Catatan Pesanan</label>
        <Input
          value={catatanPesanan}
          onChange={(e) => setCatatanPesanan(e.target.value)}
          placeholder="Tambah catatan tambahan untuk penjual..."
          className="mt-1 bg-white text-sm"
        />
      </div>
    </div>
  );
};

export default UcapanCatatan;
