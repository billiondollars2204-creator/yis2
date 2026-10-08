import type { Metadata } from "next";
import Link from "next/link";
import { getProduct, isSoldOut } from "@/data/products";
import { CUSTOMISABLE_PRODUCTS } from "@/data/formulations";
import { productImages } from "@/data/images";
import { formatINR } from "@/lib/money";
import { SmartImage } from "@/components/SmartImage";
import { ArrowRight } from "@/components/icons";
import styles from "./customise.module.css";

export const metadata: Metadata = {
  title: "Build your own — your mix, your way",
  description: "Choose panjiri, pinni or mewa. Adjust the ingredients and review your batch before adding it to your bag. From 500 g.",
  alternates: { canonical: "/customise" },
};

export default function CustomiseIndex() {
  const eligible = CUSTOMISABLE_PRODUCTS.map((slug) => getProduct(slug)!).filter(Boolean);
  return (
    <div className={styles.page}>
      <header className={styles.head}>
        <h1>Your mix. Your way.</h1>
        <p>Pick your snack. Choose your ingredients. We’ll make your batch.</p>
      </header>
      <ul className={styles.list} aria-label="Snacks you can customise">
        {eligible.map((p) => {
          const v500 = p.variants.find((v) => v.grams === 500);
          const soldOut = isSoldOut(p);
          return <li className={styles.card} key={p.slug}>
            <Link href={`/customise/${p.slug}`} className={styles.photo} aria-label={`Customise ${p.name}`}>
              <SmartImage image={productImages(p)[0]} sizes="(max-width: 760px) 90vw, (max-width: 1100px) 45vw, 22vw" ratio="5 / 4" decorative quiet />
            </Link>
            <div className={styles.body}>
              <h2>{p.name}</h2>
              <p>{v500 ? `From ${formatINR(v500.price)} · 500 g` : "From 500 g"}</p>
              {soldOut ? <span className={styles.soldOut}>Sold out</span> : <Link href={`/customise/${p.slug}`} className="btn btn--block">Make it yours <ArrowRight /></Link>}
            </div>
          </li>;
        })}
      </ul>
      <p className={styles.standard}>Prefer our original recipe? <Link href="/shop">Shop ready-made snacks <ArrowRight /></Link></p>
    </div>
  );
}
