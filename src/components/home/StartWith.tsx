"use client";

import Link from "next/link";
import Image from "@/components/SiteImage";
import { useEffect, useRef, useState } from "react";
import { getProduct, type Product } from "@/data/products";
import { formatINR } from "@/lib/money";
import { ArrowLeft, ArrowRight } from "../icons";
import styles from "./StartWith.module.css";

const picks = [
  { slug: "atta-pinni", image: "pinni" },
  { slug: "classic-panjiri", image: "panjiri" },
  { slug: "everyday-mix", image: "mewa" },
];

function SnackCard({ product, image }: { product: Product; image: string }) {
  const startingPrice = Math.min(...product.variants.map(v => v.price));
  return <article className={styles.card}>
    <Link href={`/shop/${product.slug}`} className={styles.media}>
      <Image src={`/images/vibrant/${image}.jpg`} alt={`${product.name}, served unpackaged`} fill sizes="(max-width: 760px) 82vw, 380px" />
    </Link>
    <div className={styles.cardBody}>
      <h3><Link href={`/shop/${product.slug}`}>{product.name}</Link></h3>
      <p className={styles.startingPrice}><span>From</span><strong>{formatINR(startingPrice)}</strong></p>
      <Link className={styles.choose} href={`/shop/${product.slug}`} aria-label={`Choose your ${product.name} pack`}>Choose your pack <ArrowRight /></Link>
    </div>
  </article>;
}

export function StartWith() {
  const rail = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });
  const update = () => {
    const node = rail.current;
    if (node) setEdges({ start: node.scrollLeft < 4, end: node.scrollLeft + node.clientWidth >= node.scrollWidth - 4 });
  };
  useEffect(() => {
    update();
    const observer = new ResizeObserver(update);
    if (rail.current) observer.observe(rail.current);
    return () => observer.disconnect();
  }, []);
  const move = (direction: number) => {
    const node = rail.current;
    if (!node) return;
    const card = node.firstElementChild as HTMLElement;
    node.scrollBy({ left: direction * (card.offsetWidth + 24), behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };
  return <section id="favourites" className={styles.section} aria-labelledby="start-title">
    <div className={styles.layout}>
      <div className={styles.intro}>
        <h2 id="start-title">Meet your chai companions.</h2>
        <Link href="/shop" className={`btn btn--lg ${styles.shop}`}>Shop all snacks <ArrowRight /></Link>
      </div>
      <div className={styles.browse}>
        <div ref={rail} className={styles.rail} onScroll={update} aria-label="Featured snacks">{picks.map(p => <SnackCard key={p.slug} product={getProduct(p.slug)!} image={p.image} />)}</div>
        <div className={styles.controls}>
          <button onClick={() => move(-1)} disabled={edges.start} aria-label="Previous snacks"><ArrowLeft /></button>
          <button onClick={() => move(1)} disabled={edges.end} aria-label="Next snacks"><ArrowRight /></button>
        </div>
      </div>
    </div>
  </section>;
}
