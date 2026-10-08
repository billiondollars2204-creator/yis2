"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { categories } from "@/data/products";
import { ArrowRight, ChevronDown } from "./icons";
import styles from "./SiteHeader.module.css";

export function ShopNavigation() {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setOpen(false); trigger.current?.focus(); }
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, [open]);

  return <div ref={root} className={styles.shopNavigation} onBlur={event => {
    if (!event.currentTarget.contains(event.relatedTarget as Node)) setOpen(false);
  }}>
    <button ref={trigger} type="button" className={styles.shopTrigger} aria-expanded={open}
      aria-controls="shop-navigation" onClick={() => setOpen(!open)}>
      Shop snacks <ChevronDown />
    </button>
    <div id="shop-navigation" className={styles.shopPanel} hidden={!open}>
      <div className={styles.shopIntro}>
        <p>FIND YOUR CHAI COMPANION</p>
        <strong>A little nutty.<br />A lot to love.</strong>
        <Link href="/shop" onClick={() => setOpen(false)}>Shop all snacks <ArrowRight /></Link>
      </div>
      <div className={styles.shopLinks}>
        {categories.map(category => <Link key={category.slug} href={`/shop?category=${category.slug}`} onClick={() => setOpen(false)}>
          <span>{category.name}</span><span lang="hi" className="hindi">{category.hindi}</span>
        </Link>)}
        <Link href="/customise" onClick={() => setOpen(false)}>Build your own <ArrowRight /></Link>
      </div>
    </div>
  </div>;
}
