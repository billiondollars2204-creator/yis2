"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/data/products";
import { useCart, useCartUI } from "@/lib/cart";
import { track } from "@/lib/analytics";
import { CheckIcon } from "./icons";

/** Card-level add to cart: smallest available pack, confirms in place, then opens the drawer. */
export function AddButton({ product }: { product: Product }) {
  const add = useCart((s) => s.add);
  const openCart = useCartUI((s) => s.setOpen);
  const [added, setAdded] = useState(false);
  const variant = product.variants.find((v) => v.stock !== "out_of_stock");

  useEffect(() => {
    if (!added) return;
    const t = setTimeout(() => setAdded(false), 1800);
    return () => clearTimeout(t);
  }, [added]);

  if (!variant) {
    return (
      <button type="button" className="btn btn--sm btn--block" disabled>
        Sold out
      </button>
    );
  }
  return (
    <button
      type="button"
      className={`btn btn--sm btn--block ${added ? "btn--success" : "btn--outline"}`}
      aria-label={added ? `${product.name} added to cart` : `Add ${product.name}, ${variant.label}, to cart`}
      onClick={() => {
        add(product.slug, variant.id, 1);
        track("add_to_cart", { item_id: product.slug, variant: variant.id, quantity: 1, value: variant.price, currency: "INR", source: "card" });
        setAdded(true);
        setTimeout(() => openCart(true), 300);
      }}
    >
      {added ? (
        <>
          <CheckIcon /> Added
        </>
      ) : (
        "Add to cart"
      )}
    </button>
  );
}
