"use client";

import Link from "next/link";
import Image from "@/components/SiteImage";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { categories, getProduct } from "@/data/products";
import { site } from "@/lib/site";
import { useCart, useCartUI, useHydrated } from "@/lib/cart";
import { useSaved } from "@/lib/stores";
import { FREE_SHIPPING_THRESHOLD, formatINR } from "@/lib/money";
import { MIN_CUSTOM_GRAMS } from "@/lib/customization";
import { SearchDialog } from "./SearchDialog";
import { ShopNavigation } from "./ShopNavigation";
import { MobileMenu } from "./MobileMenu";
import { Toran } from "./ui";
import { BagIcon, HeartIcon, MenuIcon, SearchIcon, UserIcon } from "./icons";
import styles from "./SiteHeader.module.css";

/** Which nav item the current page belongs to (Baymard: highlight the current scope). */
function useScope(): string | null {
  const pathname = usePathname();
  const params = useSearchParams();
  if (pathname.startsWith("/customise")) return "custom";
  if (pathname === "/our-story") return "story";
  if (pathname === "/shop") return params.get("category") ?? (params.toString() ? null : "all");
  if (pathname.startsWith("/shop/")) return getProduct(pathname.split("/")[2] ?? "")?.category ?? null;
  return null;
}

function CategoryNav({ scope }: { scope: string | null }) {
  return (
    <ul className={styles.cats}>
      <li>
        <Link href="/shop" aria-current={scope === "all" ? "page" : undefined}>
          Shop all
        </Link>
      </li>
      {categories.map((c) => (
        <li key={c.slug}>
          <Link href={`/shop?category=${c.slug}`} aria-current={scope === c.slug ? "page" : undefined}>
            {c.name}
            <span className="hindi" lang="hi">
              {c.hindi}
            </span>
          </Link>
        </li>
      ))}
      <li className={styles.sep} aria-hidden="true" />
      <li>
        <Link href="/customise" className={styles.custom} aria-current={scope === "custom" ? "page" : undefined}>
          Custom batch
        </Link>
      </li>
      <li>
        <Link href="/our-story" aria-current={scope === "story" ? "page" : undefined}>
          Our story
        </Link>
      </li>
    </ul>
  );
}

function ScopedNav() {
  return <CategoryNav scope={useScope()} />;
}

export function SiteHeader() {
  const pathname = usePathname();
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);
  const openCart = useCartUI((s) => s.setOpen);
  const hydrated = useHydrated();
  const count = useCart((s) => s.lines.reduce((n, l) => n + l.qty, 0));
  const saved = useSaved((s) => s.slugs.length);
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setMenu(false);
    setSearch(false);
  }
  const shownCount = hydrated ? count : 0;
  const shownSaved = hydrated ? saved : 0;

  return (
    <>
      <header className={`${styles.header} ${styles.referenceHeader}`}>
        <div className={`container ${styles.bar}`}>
          <button type="button" className={`icon-btn ${styles.menuBtn}`} onClick={() => setMenu(true)} aria-label="Open menu">
            <MenuIcon />
          </button>
          <Link href="/" className={styles.logo} aria-label={`${site.name} home`}>
            <Image src="/immunitywize-logo.png" alt="" width={1536} height={1024} priority sizes="(max-width: 699px) 84px, (max-width: 1023px) 96px, 108px" />
          </Link>
          <nav className={styles.primary} aria-label="Main navigation">
            <ShopNavigation key={pathname} />
            <Link href="/customise">Build your own</Link>
            <Link href="/our-story">Our kitchen</Link>
          </nav>
          <button type="button" className={styles.search} onClick={() => setSearch(true)} aria-haspopup="dialog">
            <SearchIcon />
            <span>Search snacks…</span>
          </button>
          <div className={styles.actions}>
            <button type="button" className={`icon-btn ${styles.searchIcon}`} onClick={() => setSearch(true)} aria-label="Search">
              <SearchIcon />
            </button>
            <Link href="/account" className={`icon-btn ${styles.hideSm}`} aria-label="Account">
              <UserIcon />
            </Link>
            <Link href="/account?tab=saved" className={`icon-btn ${styles.hideSm}`} aria-label={`Saved items, ${shownSaved}`}>
              <HeartIcon />
              {shownSaved > 0 && (
                <span className="count-badge" aria-hidden="true">
                  {shownSaved}
                </span>
              )}
            </Link>
            <button type="button" className="icon-btn" onClick={() => openCart(true)} aria-label={`Cart, ${shownCount} ${shownCount === 1 ? "item" : "items"}`}>
              <BagIcon />{<span className={styles.bagLabel}>Bag ({shownCount})</span>}
              {shownCount > 0 && (
                <span key={shownCount} className={`count-badge ${styles.bump}`} aria-hidden="true">
                  {shownCount}
                </span>
              )}
            </button>
          </div>
        </div>
        <nav aria-label="Categories" className={styles.nav}>
          <div className="container">
            <Suspense fallback={<CategoryNav scope={null} />}>
              <ScopedNav />
            </Suspense>
          </div>
        </nav>
      </header>
      <SearchDialog open={search} onClose={() => setSearch(false)} />
      <MobileMenu open={menu} onClose={() => setMenu(false)} />
    </>
  );
}
