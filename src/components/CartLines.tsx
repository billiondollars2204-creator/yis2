"use client";

import Link from "next/link";
import { productImages } from "@/data/images";
import { useCart, MAX_QTY, type ResolvedLine } from "@/lib/cart";
import { formatINR } from "@/lib/money";
import { track } from "@/lib/analytics";
import { batchLabel, describeChanges } from "@/lib/describe";
import { SmartImage } from "./SmartImage";
import { EditIcon, MinusIcon, PlusIcon, RepeatIcon } from "./icons";
import styles from "./CartLines.module.css";

export function CartLines({ lines, onNavigate, compact }: { lines: ResolvedLine[]; onNavigate?: () => void; compact?: boolean }) {
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);

  return (
    <ul className={styles.lines} data-compact={compact || undefined}>
      {lines.map((l) => {
        const href = `/shop/${l.product.slug}`;
        const changes = l.customization ? describeChanges(l.slug, l.customization) : [];
        return (
          <li key={l.key} className={styles.line}>
            <Link href={href} className={styles.thumb} tabIndex={-1} aria-hidden="true" onClick={onNavigate}>
              <SmartImage image={productImages(l.product)[0]} sizes="88px" ratio="1 / 1" decorative quiet caption={l.product.hindi} />
            </Link>
            <div className={styles.info}>
              <div className={styles.top}>
                <h3 className={styles.name}>
                  <Link href={href} onClick={onNavigate}>
                    {l.product.name}
                  </Link>
                </h3>
                <p className={`${styles.total} num`}>
                  {l.unitPrice < l.listPrice && <s className="muted">{formatINR(l.listPrice * l.qty)}</s>} {formatINR(l.lineTotal)}
                </p>
              </div>
              <p className={styles.meta}>
                {l.customization ? `Custom batch · ${batchLabel(l.variant.grams, 1)}` : l.variant.label} · {formatINR(l.unitPrice)} each
              </p>
              {l.plan && (
                <p className={styles.sub}>
                  <RepeatIcon /> Delivered every {l.plan.every} weeks · subscription price
                </p>
              )}
              {l.customization && (
                <details className={styles.custom}><summary>Custom recipe details</summary>
                  {changes.length ? (
                    <ul aria-label="Changes from the house recipe, per 500 g">
                      {changes.map((c) => (
                        <li key={c.key} data-kind={c.kind}>
                          <strong>{c.label}</strong> {c.detail}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>House recipe</p>
                  )}
                  {l.customization.note && <p>Note: “{l.customization.note}”</p>}
                  {l.unitExtra > 0 && <p>Includes {formatINR(l.unitExtra)} per batch for extra ingredients</p>}
                  <Link href={`/customise/${l.slug}?edit=${encodeURIComponent(l.key)}`} className={styles.edit} onClick={onNavigate}>
                    <EditIcon /> Edit recipe
                  </Link>
                </details>
              )}
              <div className={styles.controls}>
                <div className="stepper" role="group" aria-label={`Quantity for ${l.product.name}`}>
                  <button type="button" onClick={() => setQty(l.key, l.qty - 1)} disabled={l.qty <= l.minQty} aria-label={`Decrease quantity of ${l.product.name}`}>
                    <MinusIcon />
                  </button>
                  <output aria-live="polite">{l.qty}</output>
                  <button type="button" onClick={() => setQty(l.key, l.qty + 1)} disabled={l.qty >= MAX_QTY} aria-label={`Increase quantity of ${l.product.name}`}>
                    <PlusIcon />
                  </button>
                </div>
                <button
                  type="button"
                  className={styles.remove}
                  onClick={() => {
                    remove(l.key);
                    track("remove_from_cart", { item_id: l.slug, variant: l.variantId });
                  }}
                >
                  Remove<span className="visually-hidden"> {l.product.name}</span>
                </button>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
