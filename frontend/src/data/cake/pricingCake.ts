import {
  BASE_CAKE_OPTIONS,
  TIPE_CREAM_OPTIONS,
  WARNA_CREAM_OPTIONS,
  TOPPING_OPTIONS,
  LILIN_OPTIONS,
  TOPPER_PRICE_PER_PCS,
  HARGA_DASAR_PER_UKURAN,
  HARGA_TAMBAH_LAYER,
} from "@/data/cake/cakeOption";
import type { CakeCustomizationFields, PriceBreakdown } from "@/types/cake";

function findPrice(
  options: Array<{ id: string; price?: number }>,
  id: string | null,
): number {
  if (!id) return 0;
  return options.find((o) => o.id === id)?.price ?? 0;
}

export function calculatePriceBreakdown(
  fields: CakeCustomizationFields,
): PriceBreakdown {
  const hargaDasar = fields.ukuran
    ? (HARGA_DASAR_PER_UKURAN[fields.ukuran] ?? 0)
    : 0;

  const hargaLayer = fields.layer ? (fields.layer - 1) * HARGA_TAMBAH_LAYER : 0;

  const hargaBaseCake =
    findPrice(BASE_CAKE_OPTIONS, fields.baseCake) +
    findPrice(TIPE_CREAM_OPTIONS, fields.tipeCream) +
    findPrice(WARNA_CREAM_OPTIONS, fields.warnaCream);

  const { dekorasi } = fields;
  const hargaTopping = findPrice(TOPPING_OPTIONS, dekorasi.topping);
  const jumlahLilin =
    dekorasi.lilin === "random" ? 0 : Math.max(dekorasi.lilinJumlah, 1);
  const hargaLilin = findPrice(LILIN_OPTIONS, dekorasi.lilin) * jumlahLilin;
  const hargaTopper = dekorasi.topperAktif
    ? TOPPER_PRICE_PER_PCS * Math.max(dekorasi.topperJumlah, 1)
    : 0;

  const hargaDekorasi = hargaTopping + hargaLilin + hargaTopper;
  const total = hargaDasar + hargaLayer + hargaBaseCake + hargaDekorasi;

  return { hargaDasar, hargaLayer, hargaBaseCake, hargaDekorasi, total };
}

export function isCakeCustomizationValid(
  fields: CakeCustomizationFields,
): boolean {
  return Boolean(
    fields.ukuran &&
    fields.layer &&
    fields.baseCake &&
    fields.tipeCream &&
    fields.warnaCream,
  );
}
