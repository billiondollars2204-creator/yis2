/** ₹ per 100 g, for unit-price display (Baymard: show price per unit when sizes vary). */
export function per100g(price: number, grams: number): number {
  return Math.round((price / grams) * 100);
}

export function formatGrams(g: number): string {
  if (g >= 1000) return `${Number((g / 1000).toFixed(2))} kg`;
  return `${Number(g.toFixed(1))} g`;
}

export function formatShare(share: number): string {
  const pct = share * 100;
  return pct > 0 && pct < 1 ? "<1%" : `${Math.round(pct)}%`;
}
