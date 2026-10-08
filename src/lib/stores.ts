"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CheckoutValues } from "./validation";

/** Saved products ("wishlist"), kept on this device. */
export const useSaved = create<{ slugs: string[]; toggle: (slug: string) => void }>()(
  persist(
    (set) => ({
      slugs: [],
      toggle: (slug) => set((s) => ({ slugs: s.slugs.includes(slug) ? s.slugs.filter((x) => x !== slug) : [slug, ...s.slugs] })),
    }),
    { name: "iw-saved-v1" },
  ),
);

export type OrderLine = { name: string; detail: string; qty: number; total: number; slug: string; subscription?: number };
export type Order = {
  id: string;
  placedAt: string;
  lines: OrderLine[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  payment: string;
  address: Pick<CheckoutValues, "fullName" | "address1" | "address2" | "city" | "state" | "pincode" | "phone" | "email">;
};

/**
 * Orders placed on this device. DEMO ONLY: until a commerce backend exists,
 * checkout records orders locally so the account and tracking pages work.
 */
export const useOrders = create<{ orders: Order[]; add: (o: Order) => void }>()(
  persist((set) => ({ orders: [], add: (o) => set((s) => ({ orders: [o, ...s.orders].slice(0, 20) })) }), { name: "iw-orders-v1" }),
);

/** DEMO sign-in session (no backend): stores the mobile number only. */
export const useSession = create<{ phone: string | null; signIn: (phone: string) => void; signOut: () => void }>()(
  persist((set) => ({ phone: null, signIn: (phone) => set({ phone }), signOut: () => set({ phone: null }) }), { name: "iw-session-v1" }),
);
