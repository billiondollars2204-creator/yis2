"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { categories, fromPrice, products, searchText } from "@/data/products";
import { productImages } from "@/data/images";
import { filterProducts } from "@/lib/catalog";
import { formatINR } from "@/lib/money";
import { track } from "@/lib/analytics";
import { useDialog } from "@/lib/useDialog";
import { SmartImage } from "./SmartImage";
import { CloseIcon, SearchIcon } from "./icons";
import styles from "./SearchDialog.module.css";

const popular = ["panjiri", "pinni", "almond", "gond", "gift box", "jaggery"];

export function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = useDialog(open, onClose);
  const router = useRouter();
  const [q, setQ] = useState("");
  const term = q.trim();
  const results = term ? filterProducts(products, { q: term }, searchText) : [];

  function go(t: string) {
    if (!t) return;
    track("search", { search_term: t, results: filterProducts(products, { q: t }, searchText).length });
    onClose();
    router.push(`/shop?q=${encodeURIComponent(t)}`);
  }

  return (
    <dialog ref={ref} className="sheet sheet--top" aria-label="Search">
      <div className={`container ${styles.inner}`}>
        <form
          role="search"
          className={styles.form}
          onSubmit={(e) => {
            e.preventDefault();
            go(term);
          }}
        >
          <SearchIcon className={styles.icon} />
          <label htmlFor="site-search" className="visually-hidden">
            Search products and ingredients
          </label>
          <input
            id="site-search"
            type="search"
            autoFocus
            autoComplete="off"
            enterKeyHint="search"
            className={styles.input}
            placeholder="Search panjiri, pinni, almonds…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-describedby="search-status"
          />
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close search">
            <CloseIcon />
          </button>
        </form>

        <p id="search-status" className="visually-hidden" aria-live="polite">
          {term ? `${results.length} products found` : ""}
        </p>

        {term ? (
          results.length ? (
            <div className={styles.results}>
              <ul className={styles.list}>
                {results.slice(0, 6).map((p) => (
                  <li key={p.slug}>
                    <Link href={`/shop/${p.slug}`} className={styles.result} onClick={onClose}>
                      <SmartImage image={productImages(p)[0]} sizes="56px" ratio="1 / 1" decorative quiet className={styles.thumb} />
                      <span>
                        <strong>{p.name}</strong>
                        <span className="muted small">
                          {categories.find((c) => c.slug === p.category)?.name} · from {formatINR(fromPrice(p))}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              <button type="button" className="more" onClick={() => go(term)} style={{ border: 0, background: "none", cursor: "pointer", font: "inherit" }}>
                See all {results.length} results for “{term}”
              </button>
            </div>
          ) : (
            <div className={styles.empty}>
              <p>
                <strong>No products match “{term}”.</strong> Try a product name or an ingredient like “almond”.
              </p>
            </div>
          )
        ) : (
          <div className={styles.idle}>
            <div>
              <p className={styles.label}>Popular searches</p>
              <ul className={styles.chips}>
                {popular.map((p) => (
                  <li key={p}>
                    <button type="button" className="chip" onClick={() => setQ(p)}>
                      {p}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        )}
      </div>
    </dialog>
  );
}
