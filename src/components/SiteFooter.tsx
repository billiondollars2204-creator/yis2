import Link from "next/link";
import Image from "@/components/SiteImage";
import { ArrowRight } from "./icons";
import { business } from "@/lib/site";
import styles from "./SiteFooter.module.css";

export function SiteFooter() {
  return <footer className={styles.footer}>
    <div className={styles.panel}>
      <div className={styles.invitation}>
        <h2>Find your next<br />favourite.</h2>
        <p>Pinni, panjiri and nutty everyday favourites.</p>
        <Link className={`btn ${styles.shopButton}`} href="/shop">Shop snacks <ArrowRight /></Link>
      </div>
      <nav className={styles.navigation} aria-label="Footer navigation">
        <div className={styles.group}>
          <h3>Shop</h3>
          <Link href="/shop">All snacks</Link>
          <Link href="/shop?category=pinni">Pinni</Link>
          <Link href="/shop?category=panjiri">Panjiri</Link>
          <Link href="/shop?category=mixes">Mewa mixes</Link>
          <Link href="/customise">Build your own</Link>
        </div>
        <div className={styles.group}>
          <h3>Here to help</h3>
          <Link href="/support">Customer care</Link>
          <Link href="/shipping-returns">Delivery &amp; returns</Link>
          <Link href="/faq">FAQs &amp; ingredients</Link>
          <Link href="/contact">Contact us</Link>
        </div>
        <div className={styles.group}>
          <h3>Immunitywize</h3>
          <Link href="/our-story">Our kitchen</Link>
          <Link href="/contact#business">Business details</Link>
          <Link href="/contact#grievance">Consumer grievances</Link>
          <Link className={styles.logo} href="/" aria-label="Immunitywize home">
            <Image src="/immunitywize-logo.png" alt="" width={1536} height={1024} sizes="(max-width: 699px) 150px, 190px" />
          </Link>
        </div>
      </nav>
    </div>
    {business.fssaiNumber && <p className={styles.licence}>FSSAI licence/registration: {business.fssaiNumber}</p>}
    <div className={styles.bottom}>
      <p>© {new Date().getFullYear()} Immunitywize</p>
      <nav aria-label="Policies"><Link href="/privacy">Privacy policy</Link><Link href="/terms">Terms of use</Link></nav>
    </div>
    <p className={styles.preview}>Design preview · Illustrative food &amp; pricing · Demo checkout</p>
  </footer>;
}
