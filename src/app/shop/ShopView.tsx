"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { categories, getCategory, products, searchText } from "@/data/products";
import { benefits, benefitTitle } from "@/data/content";
import { filterProducts, priceBands, sortOptions, type PriceBand, type SortKey } from "@/lib/catalog";
import { track } from "@/lib/analytics";
import { useDialog } from "@/lib/useDialog";
import { ProductCard } from "@/components/ProductCard";
import { Breadcrumbs } from "@/components/ui";
import { CloseIcon, FilterIcon } from "@/components/icons";
import styles from "./shop.module.css";

export function ShopViewLive() {
  return <ShopView query={useSearchParams().toString()} />;
}

type Patch = Record<string, string | null>;

function Filters({ sp, update }: { sp: URLSearchParams; update: (p: Patch) => void }) {
  const toggle = (k: string, v: string) => update({ [k]: sp.get(k) === v ? null : v });
  return (
    <div className={styles.filters}>
      <fieldset>
        <legend>Category</legend>
        {categories.map((c) => (
          <label key={c.slug} className="check">
            <input type="radio" name="category" checked={sp.get("category") === c.slug} onChange={() => update({ category: c.slug })} />
            {c.name}
            <span className={styles.count}>{products.filter((p) => p.category === c.slug).length}</span>
          </label>
        ))}
        {sp.get("category") && (
          <button type="button" className={styles.reset} onClick={() => update({ category: null })}>
            All categories
          </button>
        )}
      </fieldset>
      <fieldset>
        <legend>Price</legend>
        {priceBands.map((b) => (
          <label key={b.value} className="check">
            <input type="checkbox" checked={sp.get("price") === b.value} onChange={() => toggle("price", b.value)} />
            {b.label}
          </label>
        ))}
      </fieldset>
      <fieldset>
        <legend>Options</legend>
        <label className="check">
          <input type="checkbox" checked={sp.get("custom") === "1"} onChange={() => toggle("custom", "1")} />
          Customisable recipe
        </label>
        <label className="check">
          <input type="checkbox" checked={sp.get("stock") === "1"} onChange={() => toggle("stock", "1")} />
          In stock only
        </label>
      </fieldset>
    </div>
  );
}

export function ShopView({ query }: { query: string }) {
  const router = useRouter();
  const sp = new URLSearchParams(query);
  const category = sp.get("category") || undefined;
  const need = sp.get("need") || undefined;
  const q = sp.get("q")?.trim() || undefined;
  const price = (sp.get("price") as PriceBand) || undefined;
  const inStock = sp.get("stock") === "1";
  const custom = sp.get("custom") === "1";
  const sortParam = sp.get("sort") as SortKey | null;
  const sort: SortKey = sortOptions.some((o) => o.value === sortParam) ? (sortParam as SortKey) : "featured";
  const cat = category ? getCategory(category) : undefined;
  const list = filterProducts(products, { category, need, q, price, inStock, custom, sort }, searchText);
  const [sheet, setSheet] = useState(false);
  const ref = useDialog(sheet, () => setSheet(false));
  const first = useRef(true);

  useEffect(() => {
    track("view_item_list", { item_list_id: category ?? "all", need, search_term: q, results: list.length });
    if (!first.current) document.getElementById("results")?.focus({ preventScroll: true });
    first.current = false;
    // Runs when the URL query changes.
  }, [query]);

  function href(patch: Patch) {
    const next = new URLSearchParams(query);
    for (const [k, v] of Object.entries(patch)) v ? next.set(k, v) : next.delete(k);
    const s = next.toString();
    return s ? `/shop?${s}` : "/shop";
  }
  const update = (patch: Patch) => router.replace(href(patch), { scroll: false });

  const active = [
    q && { key: "q", label: `“${q}”` },
    cat && { key: "category", label: cat.name },
    need && { key: "need", label: benefits.find((b) => b.slug === need)?.occasion ?? benefitTitle[need as keyof typeof benefitTitle] },
    price && { key: "price", label: priceBands.find((b) => b.value === price)?.label },
    custom && { key: "custom", label: "Customisable" },
    inStock && { key: "stock", label: "In stock" },
  ].filter(Boolean) as { key: string; label: string }[];

  const title = q ? `Results for “${q}”` : (cat?.name ?? "Shop all");

  return (
    <div className="container">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, ...(cat ? [{ href: "/shop", label: "Shop" }, { label: cat.name }] : [{ label: "Shop" }])]} />
      <header className={styles.head}>
        <h1>
          {title}
        </h1>
        <p className="muted">{q ? `${list.length} ${list.length === 1 ? "product matches" : "products match"} your search.` : (cat?.blurb ?? "Find your everyday favourite.")}</p>
      </header>

      <nav className={styles.categories} aria-label="Snack categories">
        <Link href={href({category:null})} aria-current={!category ? "page" : undefined} scroll={false}>All snacks</Link>
        {categories.map(c => <Link key={c.slug} href={href({category:c.slug})} aria-current={category===c.slug ? "page" : undefined} scroll={false}>{c.name}</Link>)}
      </nav>
      <div className={styles.layout}>

        <div>
          <div className={styles.toolbar}>
            <button type="button" className={`btn btn--outline btn--sm ${styles.filterBtn}`} onClick={() => setSheet(true)}>
              <FilterIcon /> Filters{active.length ? ` (${active.length})` : ""}
            </button>
            <p className={styles.result} id="results" tabIndex={-1} aria-live="polite">
              {list.length} {list.length === 1 ? "product" : "products"}
            </p>
            <label className={styles.sort}>
              <span>Sort</span>
              <select aria-label="Sort products" className="select" value={sort} onChange={(e) => update({ sort: e.target.value === "featured" ? null : e.target.value })}>
                {sortOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {active.length > 0 && (
            <div className={styles.active}>
              {active.map((a) => (
                <button key={a.key} type="button" className="chip" onClick={() => update({ [a.key]: null })} aria-label={`Remove filter ${a.label}`}>
                  {a.label} <CloseIcon />
                </button>
              ))}
              <Link href="/shop" className={styles.clear} scroll={false}>
                Clear all
              </Link>
            </div>
          )}

          {list.length ? (
            <div className="grid-products">
              {list.map((p, i) => (
                <ProductCard key={p.slug} product={p} preload={i < 2} />
              ))}
            </div>
          ) : (
            <div className={styles.empty}>
              <h2>No products match</h2>
              <p className="muted">Try removing a filter{q ? " or searching for an ingredient like “almond”" : ""}.</p>
              <Link href="/shop" className="btn">
                Show all products
              </Link>
            </div>
          )}
        </div>
      </div>

      <dialog ref={ref} className="sheet sheet--bottom" aria-label="Filters">
        <div className="sheet-head">
          <h2>Filters</h2>
          <button type="button" className="icon-btn" onClick={() => setSheet(false)} aria-label="Close filters">
            <CloseIcon />
          </button>
        </div>
        <div className={styles.sheetBody}>
          <Filters sp={sp} update={update} />
        </div>
        <div className={styles.sheetFoot}>
          <Link href="/shop" className="btn btn--ghost" scroll={false}>
            Clear all
          </Link>
          <button type="button" className="btn" onClick={() => setSheet(false)}>
            Show {list.length} {list.length === 1 ? "product" : "products"}
          </button>
        </div>
      </dialog>
    </div>
  );
}
