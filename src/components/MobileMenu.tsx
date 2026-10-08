"use client";

import Link from "next/link";
import { categories, productsIn } from "@/data/products";
import { MIN_CUSTOM_GRAMS } from "@/lib/customization";
import { useDialog } from "@/lib/useDialog";
import { ChevronRight, CloseIcon } from "./icons";
import { Toran } from "./ui";
import styles from "./MobileMenu.module.css";

const more = [
  { href: "/account", label: "Account & orders" },
  { href: "/support", label: "Help & support" },
  { href: "/support#track", label: "Demo order lookup" },
  { href: "/our-story", label: "Our story" },
];

export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = useDialog(open, onClose);
  return (
    <dialog ref={ref} className="sheet sheet--left" aria-label="Menu">
      <div className={styles.wrap}>
        <div className="sheet-head">
          <span className={styles.brand}>Immunitywize</span>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close menu">
            <CloseIcon />
          </button>
        </div>
        <Toran />
        <nav aria-label="Mobile" className={styles.body}>
          <p className={styles.label}>Shop</p>
          <ul className={styles.list}>
            <li>
              <Link href="/shop" onClick={onClose}>
                <span>Shop all</span>
                <ChevronRight />
              </Link>
            </li>
            {categories.map((c) => (
              <li key={c.slug}>
                <Link href={`/shop?category=${c.slug}`} onClick={onClose}>
                  <span>
                    {c.name} <span className="hindi">{c.hindi}</span>
                    <small>{productsIn(c.slug).length} products</small>
                  </span>
                  <ChevronRight />
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/customise" className={styles.custom} onClick={onClose}>
            <strong>Make a custom batch</strong>
            <span>Panjiri, pinni or mewa mix — your recipe, from {MIN_CUSTOM_GRAMS} g</span>
          </Link>
          <ul className={styles.more}>
            {more.map((m) => (
              <li key={m.href}>
                <Link href={m.href} onClick={onClose}>
                  {m.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </dialog>
  );
}
