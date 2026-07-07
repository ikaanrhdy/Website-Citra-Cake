export interface Tier {
  width: number;
  height: number;
  y: number;
}

export interface Point {
  x: number;
  y: number;
}

const WIDTHS: Record<number, number[]> = {
  1: [180],
  2: [190, 140],
  3: [200, 155, 110],
  4: [205, 170, 135, 100],
};

const HEIGHTS: Record<number, number[]> = {
  1: [80],
  2: [64, 58],
  3: [56, 50, 46],
  4: [48, 44, 42, 40],
};

const PLATE_Y = 250;

/** Geometri tier kue dari bawah ke atas, dipakai PreviewCake untuk menggambar SVG. */
export function getTierGeometry(layerCount: number): Tier[] {
  const w = WIDTHS[layerCount] ?? WIDTHS[1];
  const h = HEIGHTS[layerCount] ?? HEIGHTS[1];
  let cursorY = PLATE_Y;
  const tiers: Tier[] = [];
  for (let i = 0; i < w.length; i++) {
    cursorY -= h[i];
    tiers.push({ width: w[i], height: h[i], y: cursorY });
  }
  return tiers;
}

/** Posisi sebar (topping/lilin) merata di sepanjang permukaan tier paling atas. */
export function getScatterPositions(
  count: number,
  topWidth: number,
  topY: number,
): Point[] {
  if (count <= 0) return [];
  const positions: Point[] = [];
  const margin = topWidth * 0.18;
  const usable = topWidth - margin * 2;
  for (let i = 0; i < count; i++) {
    const t = count === 1 ? 0.5 : i / (count - 1);
    positions.push({
      x: 150 - topWidth / 2 + margin + t * usable,
      y: topY + 6,
    });
  }
  return positions;
}
