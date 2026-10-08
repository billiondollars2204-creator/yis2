import Link from "next/link";
import { isSoldOut, type Product } from "@/data/products";
import { productImages } from "@/data/images";
import { formatINR } from "@/lib/money";
import { SmartImage } from "./SmartImage";
import { ArrowRight } from "./icons";
import styles from "./ProductCard.module.css";

export function ProductCard({ product, preload = false }: { product: Product; preload?: boolean }) {
  const soldOut = isSoldOut(product);
  const available = product.variants.filter(v => v.stock !== "out_of_stock");
  const price = Math.min(...(available.length ? available : product.variants).map(v => v.price));
  return <article className={styles.card}>
    <Link href={`/shop/${product.slug}`} className={styles.link}>
      <div className={styles.media}><SmartImage image={productImages(product)[0]} sizes="(min-width: 960px) 30vw, (min-width: 600px) 45vw, 90vw" ratio="1 / 1" preload={preload} decorative quiet /></div>
      <h3>{product.name}</h3>
      <p>{soldOut ? "Sold out" : <>From <strong>{formatINR(price)}</strong></>}</p>
      <span className={styles.action}>{soldOut ? "View snack" : "Choose your pack"}<ArrowRight /></span>
    </Link>
  </article>;
}
