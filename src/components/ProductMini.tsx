"use client";

import Link from "next/link";
import type { Product } from "@/data/products";
import { productImages } from "@/data/images";
import { useCart } from "@/lib/cart";
import { formatINR } from "@/lib/money";
import { track } from "@/lib/analytics";
import { SmartImage } from "./SmartImage";
import { PlusIcon } from "./icons";

/** Compact one-line product row with an add button (drawer upsell, cart suggestions). */
export function ProductMini({ product }: { product: Product }) {
  const add = useCart((s) => s.add);
  const v = product.variants.find((x) => x.stock !== "out_of_stock");
  if (!v) return null;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <Link href={`/shop/${product.slug}`} style={{ width: 56, flex: "none", borderRadius: 8, overflow: "hidden" }} tabIndex={-1} aria-hidden="true">
        <SmartImage image={productImages(product)[0]} sizes="56px" ratio="1 / 1" decorative quiet />
      </Link>
      <div style={{ flex: 1, minWidth: 0, fontSize: "var(--fs-14)" }}>
        <Link href={`/shop/${product.slug}`} style={{ fontWeight: 600, textDecoration: "none" }}>
          {product.name}
        </Link>
        <div className="muted num">
          {v.label} · {formatINR(v.price)}
        </div>
      </div>
      <button
        type="button"
        className="btn btn--outline btn--sm"
        onClick={() => {
          add(product.slug, v.id, 1);
          track("add_to_cart", { item_id: product.slug, variant: v.id, quantity: 1, value: v.price, currency: "INR", source: "upsell" });
        }}
        aria-label={`Add ${product.name} ${v.label} to cart`}
      >
        <PlusIcon /> Add
      </button>
    </div>
  );
}
