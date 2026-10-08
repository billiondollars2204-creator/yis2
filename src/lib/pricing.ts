/**
 * Pricing rules that aren't tied to one product. Pure, so they can be tested.
 * PLACEHOLDER — every number here is a business decision awaiting confirmation.
 */
export const SUBSCRIPTION = {
  discountPct: 10,
  /** Delivery intervals offered, in weeks. */
  intervals: [2, 4, 6],
  defaultInterval: 4,
};

export type Plan = { every: number };

export function subscriptionPrice(price: number): number {
  return Math.round(price * (1 - SUBSCRIPTION.discountPct / 100));
}

export function unitPriceFor(price: number, plan?: Plan): number {
  return plan ? subscriptionPrice(price) : price;
}

/** Coupon codes accepted at checkout. Empty codes list = coupon box hidden. PLACEHOLDER. */
export const COUPONS: Record<string, { pct: number; min: number; label: string }> = {
  WELCOME10: { pct: 10, min: 499, label: "10% off your first order" },
};

export type CouponResult = { ok: true; code: string; discount: number; label: string } | { ok: false; error: string };

export function applyCoupon(raw: string, subtotal: number): CouponResult {
  const code = raw.trim().toUpperCase();
  if (!code) return { ok: false, error: "Enter a code." };
  const c = COUPONS[code];
  if (!c) return { ok: false, error: "That code isn’t valid. Check the spelling and try again." };
  if (subtotal < c.min) return { ok: false, error: `This code needs an order of at least ₹${c.min}.` };
  return { ok: true, code, discount: Math.round((subtotal * c.pct) / 100), label: c.label };
}

/** PLACEHOLDER cash-on-delivery rules. */
export const COD = { fee: 0, maxOrder: 5000 };

/** Suggests a state from the first digits of an Indian PIN code (postal circles). The shopper can change it. */
export function stateFromPincode(pin: string): string | undefined {
  if (!/^[1-9]\d{5}$/.test(pin)) return undefined;
  const p = Number(pin.slice(0, 2));
  const p3 = Number(pin.slice(0, 3));
  if (p === 11) return "Delhi";
  if (p3 === 160) return "Chandigarh";
  if (p >= 12 && p <= 13) return "Haryana";
  if (p >= 14 && p <= 16) return "Punjab";
  if (p === 17) return "Himachal Pradesh";
  if (p >= 18 && p <= 19) return "Jammu and Kashmir";
  if (p >= 20 && p <= 28) return (p3 >= 246 && p3 <= 249) || p3 === 263 ? "Uttarakhand" : "Uttar Pradesh";
  if (p >= 30 && p <= 34) return "Rajasthan";
  if (p >= 36 && p <= 39) return "Gujarat";
  if (p >= 40 && p <= 44) return p3 === 403 ? "Goa" : "Maharashtra";
  if (p >= 45 && p <= 48) return "Madhya Pradesh";
  if (p === 49) return "Chhattisgarh";
  if (p === 50) return "Telangana";
  if (p >= 51 && p <= 53) return "Andhra Pradesh";
  if (p >= 56 && p <= 59) return "Karnataka";
  if (p >= 60 && p <= 64) return "Tamil Nadu";
  if (p >= 67 && p <= 69) return "Kerala";
  if (p >= 70 && p <= 74) return "West Bengal";
  if (p >= 75 && p <= 77) return "Odisha";
  if (p === 78) return "Assam";
  if (p >= 80 && p <= 85) return p3 >= 814 && p3 <= 835 ? "Jharkhand" : "Bihar";
  return undefined;
}
