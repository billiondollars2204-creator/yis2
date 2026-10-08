"use client";


import { useEffect, useId, useRef, useState } from "react";
import { stockLabel, type Product } from "@/data/products";
import { useCart, useCartUI, MAX_QTY } from "@/lib/cart";
import { formatINR } from "@/lib/money";

import { per100g } from "@/lib/units";
import { track } from "@/lib/analytics";

import { PincodeCheck } from "./PincodeCheck";

import { CheckIcon, MinusIcon, PlusIcon } from "./icons";
import styles from "./ProductBuy.module.css";

export function ProductBuy({ product }: { product: Product }) {
  const uid = useId();
  const add = useCart((s) => s.add);
  const openCart = useCartUI((s) => s.setOpen);
  const first = product.variants.find((v) => v.stock !== "out_of_stock") ?? product.variants[0];
  const [variantId, setVariantId] = useState(first.id);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [status, setStatus] = useState("");
  const [bar, setBar] = useState(false);
  const actions = useRef<HTMLDivElement>(null);

  const variant = product.variants.find((v) => v.id === variantId) ?? first;
  const soldOut = variant.stock === "out_of_stock";
  const unit = variant.price;
  const total = unit * qty;

  useEffect(() => {
    track("view_item", { item_id: product.slug, item_name: product.name, item_category: product.category, value: first.price, currency: "INR" });
  }, [product.slug, product.name, product.category, first.price]);

  useEffect(() => {
    const el = actions.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setBar(!e.isIntersecting && e.boundingClientRect.top < 0));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!added) return;
    const t = setTimeout(() => setAdded(false), 2000);
    return () => clearTimeout(t);
  }, [added]);

  function doAdd(): boolean {
    if (soldOut) return false;
    add(product.slug, variant.id, qty);
    track("add_to_cart", { item_id: product.slug, variant: variant.id, quantity: qty, value: total, currency: "INR" });
    setStatus(`Added ${qty} × ${product.name}, ${variant.label}.`);
    setAdded(true);
    return true;
  }

  const addLabel = added ? "Added to cart" : soldOut ? "Sold out" : "Add to bag";

  return (
    <div className={styles.buy}>
      <div className={styles.price}>
        <strong>{formatINR(unit)}</strong>
        <span>MRP incl. all taxes{product.kind !== "bundle" && <> · {formatINR(per100g(unit, variant.grams))}/100 g</>}</span>
      </div>

      {product.variants.length > 1 && (
        <fieldset className={styles.group}>
          <legend className="label">
            Choose your pack
          </legend>
          <div className={styles.sizes}>
            {product.variants.map((v) => (
              <label key={v.id} className="choice">
                <input
                  type="radio"
                  name={`${uid}-size`}
                  checked={v.id === variantId}
                  disabled={v.stock === "out_of_stock"}
                  onChange={() => {
                    setVariantId(v.id);
                    track("select_variant", { item_id: product.slug, variant: v.id });
                  }}
                />
                <span className={styles.size}>
                  <strong>{v.label}</strong>

                </span>
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <div className={styles.actions} ref={actions}>
        <div className="stepper" role="group" aria-label="Quantity">
          <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={qty <= 1} aria-label="Decrease quantity">
            <MinusIcon />
          </button>
          <output aria-live="polite">{qty}</output>
          <button type="button" onClick={() => setQty((q) => Math.min(MAX_QTY, q + 1))} disabled={qty >= MAX_QTY} aria-label="Increase quantity">
            <PlusIcon />
          </button>
        </div>
        <button type="button" className={`btn btn--lg ${added ? "btn--success" : ""}`} disabled={soldOut} onClick={() => doAdd() && setTimeout(() => openCart(true), 300)}>
          {added && <CheckIcon />}
          {addLabel}

        </button>

      </div>

      {(soldOut || variant.stock === "low_stock" || qty > 1) && <p className={styles.stock}>{soldOut || variant.stock === "low_stock" ? stockLabel[variant.stock] : ""}{qty > 1 && <> {qty} packs · {formatINR(total)} total</>}</p>}
      <details className="acc"><summary>Delivery & returns</summary><div className="acc-body"><PincodeCheck /><p><a href="/shipping-returns">Shipping and returns policy</a></p></div></details>

      <div className="visually-hidden" role="status" aria-live="polite">
        {status}
      </div>

      <div className={styles.bar} data-show={(bar && !soldOut) || undefined} aria-hidden={!bar}>
        <div className={`container ${styles.barInner}`}>
          <span className={styles.barName}>
            {product.name} <span className="muted">· {variant.label}</span>
          </span>
          <button type="button" tabIndex={bar ? 0 : -1} className={`btn ${added ? "btn--success" : ""}`} onClick={() => doAdd() && setTimeout(() => openCart(true), 300)}>
            {added ? "Added" : `Add to bag · ${formatINR(total)}`}
          </button>
        </div>
      </div>
    </div>
  );
}
