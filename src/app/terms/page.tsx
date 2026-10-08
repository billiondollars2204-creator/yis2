import type { Metadata } from "next";
import Link from "next/link";
import { Placeholder } from "@/components/Placeholder";
import { Breadcrumbs } from "@/components/ui";
import { site } from "@/lib/site";
import styles from "../content.module.css";

export const metadata: Metadata = {
  title: "Terms of use",
  description: `The terms that apply when you shop with ${site.name}.`,
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <div className="container">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/support", label: "Help" }, { label: "Terms of use" }]} />
      <header className={styles.head}>
        <h1>Terms of use</h1>
        <p className="muted">
          <Placeholder note="legal review before launch">Draft terms, to be confirmed before launch.</Placeholder>
        </p>
      </header>
      <div className="prose" style={{ paddingBottom: "var(--sp-6)" }}>
        <h2>Who we are</h2>
        <p>
          {site.name} (<Placeholder note="legal entity name and registered address">legal entity and address to be added</Placeholder>) sells homemade food products through this website. Business, licensing and grievance details are listed on our contact page. All are pending confirmation in this preview.
        </p>
        <h2>Orders and prices</h2>
        <ul>
          <li>Displayed prices are in Indian rupees and include applicable taxes. Prices and tax treatment must be confirmed before launch. This preview does not accept payments or place real orders.</li>
          <li>We may cancel and fully refund an order if an item is unavailable or a price was shown in error.</li>
          <li>Custom-batch cancellation after preparation starts will follow the final published policy and applicable consumer rights. See shipping &amp; returns for the draft process.</li>
        </ul>
        <h2>Food information</h2>
        <p>
          Our products are traditional foods, not medicines. Descriptions of how families use them are cultural context, not health claims. Please check the ingredients and allergens (products may contain nuts, milk/ghee and gluten) and ask your doctor if you’re pregnant, nursing or have a medical condition.
        </p>
        <h2>Delivery, damage and refunds</h2>
        <p>
          See <Link href="/shipping-returns">shipping &amp; returns</Link>.
        </p>
        <h2>Using this site</h2>
        <p>Content and photography belong to {site.name}. Don’t misuse the site, place fraudulent orders or abuse coupons. We may suspend accounts that do.</p>
        <h2>Disputes</h2>
        <p>
          These terms are governed by Indian law. Please use our <Link href="/contact">customer-care and grievance contacts</Link>. Courts at <Placeholder note="city">your city</Placeholder> have jurisdiction.
        </p>
      </div>
    </div>
  );
}
