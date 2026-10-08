"use client";

import Link from "next/link";
import { useEffect } from "react";
import { products } from "@/data/products";
import { resolveLines, useCart, useHydrated } from "@/lib/cart";
import { track } from "@/lib/analytics";
import { CartLines } from "@/components/CartLines";
import { FreeShippingBar } from "@/components/FreeShippingBar";
import { OrderSummary } from "@/components/OrderSummary";
import { ProductCard } from "@/components/ProductCard";
import { Breadcrumbs } from "@/components/ui";
import { GiftIcon, LockIcon } from "@/components/icons";
import styles from "./cart.module.css";

export function CartView() {
  const hydrated = useHydrated();
  const raw = useCart((s) => s.lines);
  const giftNote = useCart((s) => s.giftNote);
  const setGiftNote = useCart((s) => s.setGiftNote);
  const lines = hydrated ? resolveLines(raw) : [];
  const subtotal = lines.reduce((n, l) => n + l.lineTotal, 0);
  const savings = lines.reduce((n, l) => n + (l.listPrice - l.unitPrice) * l.qty, 0);
  const inCart = new Set(lines.map((l) => l.slug));
  const suggestions = products.filter((p) => p.featured && !inCart.has(p.slug)).slice(0, 4);

  useEffect(() => {
    if (hydrated) track("view_cart", { value: subtotal, currency: "INR", items: lines.length });
    // Once per visit.
  }, [hydrated]);

  return (
    <div className="container">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Cart" }]} />
      <h1 className={styles.title}>Your cart</h1>

      {!hydrated ? (
        <div aria-busy="true" style={{ display: "grid", gap: 12 }}>
          <span className="skeleton" style={{ height: 96 }} />
          <span className="skeleton" style={{ height: 96 }} />
        </div>
      ) : lines.length === 0 ? (
        <div className={styles.empty}>
          <p className="display" style={{ fontSize: "var(--fs-24)" }}>
            Your cart is empty
          </p>
          <p className="muted">Start with a bestseller, or build a custom batch.</p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
            <Link href="/shop" className="btn">
              Shop bestsellers
            </Link>

          </div>
        </div>
      ) : (
        <div className={styles.layout}>
          <div>
            <div className={styles.ship}>
              <FreeShippingBar subtotal={subtotal} />
            </div>
            <CartLines lines={lines} />
            <details className={styles.gift}><summary>Add a gift note</summary>
              <label htmlFor="gift-note" className="label">
                <GiftIcon /> Sending a gift? Add a note
              </label>
              <textarea
                id="gift-note"
                className="textarea"
                rows={2}
                maxLength={200}
                value={giftNote}
                onChange={(e) => setGiftNote(e.target.value)}
                placeholder="Your message (optional)"
              />
            </details>
          </div>
          <aside className={styles.aside}>
            <OrderSummary lines={lines} subtotal={subtotal + savings} savings={savings} shipping={null}>
              <Link href="/checkout" className="btn btn--lg btn--block">
                <LockIcon /> Checkout
              </Link>

            </OrderSummary>
            <Link href="/shop" className="more" style={{ justifySelf: "center" }}>
              Continue shopping
            </Link>
          </aside>
        </div>
      )}

      {hydrated && !lines.length && suggestions.length > 0 && (
        <section className="section" aria-labelledby="sugg-title">
          <h2 id="sugg-title" style={{ fontSize: "var(--fs-24)" }}>
            {lines.length ? "You might also like" : "Bestsellers"}
          </h2>
          <div className="grid-products">
            {suggestions.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
