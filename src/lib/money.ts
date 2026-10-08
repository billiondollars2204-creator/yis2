const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export function formatINR(amount: number): string {
  return inr.format(amount);
}

// PLACEHOLDER shipping rules — replace with the real courier/shipping integration.
export const FREE_SHIPPING_THRESHOLD = 999;
export const SHIPPING_OPTIONS = [
  { id: "standard", label: "Standard delivery", eta: "4–7 working days", price: 79 },
  { id: "express", label: "Express delivery", eta: "2–3 working days", price: 149 },
] as const;

export function shippingCost(subtotal: number, optionId: string): number {
  const opt = SHIPPING_OPTIONS.find((o) => o.id === optionId) ?? SHIPPING_OPTIONS[0];
  if (subtotal === 0) return 0;
  if (opt.id === "standard" && subtotal >= FREE_SHIPPING_THRESHOLD) return 0;
  return opt.price;
}
