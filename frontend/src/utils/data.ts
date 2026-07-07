export const calculatePriceBySize = (
  basePrice: number,
  sizes: string[],
  selectedSize: string,
  upStep = 10000,
  downStep = 5000
) => {
  if (!sizes.length) return basePrice;

  const shortSizes = [...sizes].sort((a, b) => Number(a) - Number(b));

  const baseIndex =
    shortSizes.length === 1 ? 0 : Math.floor(shortSizes.length / 2);

  const selectedIndex = shortSizes.findIndex((s) => s === selectedSize);

  if (selectedIndex === -1) return basePrice;

  const diff = selectedIndex - baseIndex;

  if (diff > 0) return basePrice + diff * upStep;
  if (diff < 0) return basePrice + diff * downStep;

  return basePrice;
};
