import Link from "next/link";
import Image from "@/components/SiteImage";
import { Hero } from "@/components/home/Hero";
import { StartWith } from "@/components/home/StartWith";
import { ArrowRight } from "@/components/icons";
import styles from "./home.module.css";

export default function HomePage() {
  return <>
    <Hero />
    <StartWith />
    <section className={styles.custom} aria-labelledby="custom-title">
      <div className={styles.customCopy}>
        <h2 id="custom-title">Your mix.<br />Your way.</h2>
        <p>Choose your ingredients. We’ll make your batch.</p>
        <Link href="/customise" className="btn btn--lg">Build your own <ArrowRight /></Link>
      </div>
      <div className={styles.customPhoto}><Image src="/images/commerce/custom-clean-v2.jpg" alt="A bowl of freshly roasted panjiri on a powder-blue table" fill sizes="100vw" /></div>
    </section>
    <section className={styles.transparency} aria-labelledby="ingredients-title">
      <h2 id="ingredients-title">Healthy choices.<br />Clear ingredients.</h2>
      <p>Know the ingredients, portions and allergens before you choose.</p>
      <Link href="/shop/classic-panjiri" className="btn btn--lg">Know your snack <ArrowRight /></Link>
    </section>
  </>;
}
