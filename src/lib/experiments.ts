"use client";

import { useEffect, useState } from "react";
import { track } from "./analytics";

/**
 * Minimal A/B helper: assigns a sticky variant per device and reports exposure
 * to the dataLayer. Replace with your experimentation platform later; keep the
 * same experiment ids so reporting stays continuous.
 */
export const EXPERIMENTS = {
  "hero-cta": ["shop-bestsellers", "shop-all"],
} as const;

type Id = keyof typeof EXPERIMENTS;

export function useVariant<T extends Id>(id: T): (typeof EXPERIMENTS)[T][number] {
  const variants = EXPERIMENTS[id];
  const [v, setV] = useState<(typeof EXPERIMENTS)[T][number]>(variants[0]);
  useEffect(() => {
    const key = `iw-exp-${id}`;
    let chosen = localStorage.getItem(key) as (typeof EXPERIMENTS)[T][number] | null;
    if (!chosen || !(variants as readonly string[]).includes(chosen)) {
      chosen = variants[Math.floor(Math.random() * variants.length)];
      localStorage.setItem(key, chosen);
    }
    setV(chosen);
    track("experiment_exposure", { experiment_id: id, variant: chosen });
  }, [id, variants]);
  return v;
}
