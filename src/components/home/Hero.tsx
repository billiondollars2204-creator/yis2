import { assetPath } from "@/lib/asset-path";
import Link from "next/link";
import { getImageProps } from "next/image";
import styles from "./Hero.module.css";
import { ArrowRight } from "../icons";

export function Hero() {
  const common = {
    alt: "Handmade pinni on a steel plate, panjiri and a glass of chai",
    sizes: "100vw",
    loading: "eager" as const,
    fetchPriority: "high" as const,
  };
  const { props: desktop } = getImageProps({
    ...common, src: assetPath("/images/butter/hero-proportions-v2.jpg"), width: 1932, height: 814,
  });
  const { props: mobile } = getImageProps({
    ...common, src: assetPath("/images/butter/hero-mobile-v2.jpg"), width: 1122, height: 1402,
  });
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.media}>
        <picture>
          <source media="(max-width: 699px)" srcSet={mobile.srcSet ?? mobile.src} sizes="100vw" />
          <img {...desktop} className={styles.photo} />
        </picture>
      </div>
      <div className={styles.copy}>
        <h1 id="hero-title"><span>Your chai has</span><span>company.</span></h1>
        <p className={styles.sub}>Pinni, panjiri and nutty everyday favourites.</p>
        <Link href="/shop" className={styles.cta}>
          Shop snacks
          <ArrowRight />
        </Link>
      </div>
    </section>
  );
}
