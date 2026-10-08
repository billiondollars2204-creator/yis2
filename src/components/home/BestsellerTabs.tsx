"use client";

import { useState } from "react";
import type { Product } from "@/data/products";

/**
 * Category tabs over a pre-rendered product grid. Cards are server-rendered and
 * passed in as children keyed by category, so switching tabs needs no fetch.
 */
export function BestsellerTabs({ tabs, items }: { tabs: { id: string; label: string }[]; items: { product: Product; node: React.ReactNode }[] }) {
  const [tab, setTab] = useState("all");
  const shown = items.filter((i) => tab === "all" || i.product.category === tab).slice(0, 8);
  return (
    <>
      <div role="tablist" aria-label="Filter bestsellers" style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4, marginBottom: 20, scrollbarWidth: "none" }}>
        {tabs.map((t) => (
          <button key={t.id} type="button" role="tab" className="chip" aria-selected={tab === t.id} aria-controls="bestseller-grid" onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>
      <div id="bestseller-grid" role="tabpanel" className="grid-products" aria-live="polite">
        {shown.map((i) => (
          <div key={i.product.slug}>{i.node}</div>
        ))}
      </div>
    </>
  );
}
