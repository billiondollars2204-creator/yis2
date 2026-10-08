"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { products } from "@/data/products";
import { resolveLines, useCart, useCartUI, useHydrated } from "@/lib/cart";
import { formatINR } from "@/lib/money";
import { useDialog } from "@/lib/useDialog";
import { CartLines } from "./CartLines";
import { FreeShippingBar } from "./FreeShippingBar";
import { ProductMini } from "./ProductMini";
import { CloseIcon, LockIcon } from "./icons";
import styles from "./CartDrawer.module.css";

export function CartDrawer() {
  const open = useCartUI((s) => s.open);
  const setOpen = useCartUI((s) => s.setOpen);
  const raw = useCart((s) => s.lines);
  const hydrated = useHydrated();
  const pathname = usePathname();
  const ref = useDialog(open, () => setOpen(false));
  const lines = hydrated ? resolveLines(raw) : [];
  const subtotal = lines.reduce((n, l) => n + l.lineTotal, 0);
  const count = lines.reduce((n, l) => n + l.qty, 0);
  const inCart = new Set(lines.map((l) => l.slug));
  const suggestion = products.find((p) => p.featured && !inCart.has(p.slug) && p.kind !== "bundle");
  const close = () => setOpen(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname, setOpen]);

  return (
    <dialog ref={ref} className="sheet sheet--right" aria-labelledby="drawer-title">
      <div className={styles.wrap}>
        <div className="sheet-head">
          <h2 id="drawer-title">
            Your cart <span className={styles.count}>({count})</span>
          </h2>
          <button type="button" className="icon-btn" onClick={close} aria-label="Close cart">
            <CloseIcon />
          </button>
        </div>
        {lines.length === 0 ? (
          <div className={styles.empty}>
            <p className="display" style={{ fontSize: "var(--fs-24)", margin: 0 }}>
              Your cart is empty
            </p>
            <p className="muted">Our bestsellers are a good place to start.</p>
            <Link href="/shop" className="btn" onClick={close}>
              Shop bestsellers
            </Link>
          </div>
        ) : (
          <>
            <div className={styles.ship}>
              <FreeShippingBar subtotal={subtotal} />
            </div>
            <div className={styles.body}>
              <CartLines lines={lines} onNavigate={close} compact />

            </div>
            <footer className={styles.foot}>
              <p className={styles.subtotal}>
                <span>Subtotal</span>
                <strong className="num">{formatINR(subtotal)}</strong>
              </p>
              <p className="muted small" style={{ margin: 0 }}>
                Taxes included. Delivery and coupons at checkout.
              </p>
              <Link href="/checkout" className="btn btn--lg btn--block" onClick={close}>
                <LockIcon /> Checkout
              </Link>
              <Link href="/cart" className={styles.view} onClick={close}>
                View bag
              </Link>
            </footer>
          </>
        )}
      </div>
    </dialog>
  );
}
