import {
  BASE_CAKE_OPTIONS,
  TIPE_CREAM_OPTIONS,
  WARNA_CREAM_OPTIONS,
} from "@/data/cake/cakeOption";
import type { CakeCustomizationFields, PreviewSummary } from "@/types/cake";

function labelOf(
  options: Array<{ id: string; label: string }>,
  id: string | null,
  fallback = "-",
): string {
  return options.find((o) => o.id === id)?.label ?? fallback;
}

export function getPreviewSummary(
  fields: CakeCustomizationFields,
): PreviewSummary {
  return {
    layerLabel: fields.layer ? `${fields.layer} Layer` : "- Layer",
    baseCakeLabel: labelOf(BASE_CAKE_OPTIONS, fields.baseCake),
    tipeCreamLabel: labelOf(TIPE_CREAM_OPTIONS, fields.tipeCream),
    warnaCreamLabel: labelOf(WARNA_CREAM_OPTIONS, fields.warnaCream),
  };
}
