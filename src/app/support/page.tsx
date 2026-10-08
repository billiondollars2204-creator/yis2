import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Breadcrumbs } from "@/components/ui";
import { BoxIcon, ChatIcon, ReturnIcon, SlidersIcon, TruckIcon, WalletIcon } from "@/components/icons";
import { TrackOrder } from "./TrackOrder";
import styles from "../content.module.css";

export const metadata: Metadata = {
  title: "Help centre",
  description: "Find a demo order and browse delivery, returns, custom batches, ingredients and contact help.",
  alternates: { canonical: "/support" },
};

const topics = [
  { icon: TruckIcon, title: "Delivery", text: "Where we ship, how long it takes, charges.", href: "/shipping-returns#delivery" },
  { icon: ReturnIcon, title: "Returns & replacements", text: "Damaged or wrong item? What to do.", href: "/shipping-returns#returns" },
  { icon: SlidersIcon, title: "Custom batches", text: "Minimums, lead times, editing a recipe.", href: "/faq#custom" },
  { icon: WalletIcon, title: "Payments & refunds", text: "Planned payment options and refund policy.", href: "/faq#orders" },
  { icon: BoxIcon, title: "Ingredients & allergens", text: "What’s inside, nuts, storage, shelf life.", href: "/faq#food" },
  { icon: ChatIcon, title: "Contact us", text: "Customer care and business details.", href: "/contact" },
];

export default function SupportPage() {
  return (
    <div className="container">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Help centre" }]} />
      <header className={styles.head}>
        <h1>How can we help?</h1>
        <p className="muted">Find help with your order, your ingredients or your custom batch.</p>
      </header>

      <section id="track" className="card card--pad" aria-labelledby="track-title" style={{ marginBottom: "var(--sp-6)", scrollMarginTop: 140 }}>
        <h2 id="track-title" style={{ fontSize: "var(--fs-24)" }}>
          Find a demo order
        </h2>
        <Suspense>
          <TrackOrder />
        </Suspense>
      </section>

      <ul className={styles.cards3} style={{ listStyle: "none", padding: 0, margin: "0 0 var(--sp-7)" }}>
        {topics.map(({ icon: Icon, ...t }) => (
          <li key={t.title}>
            <Link href={t.href} className={styles.topic}>
              <Icon />
              <strong>{t.title}</strong>
              <span>{t.text}</span>
            </Link>
          </li>
        ))}
      </ul>

      <section aria-labelledby="reach" className="section section--cream" style={{ borderRadius: "var(--r-lg)", padding: "var(--sp-6)" }}>
        <h2 id="reach" style={{ fontSize: "var(--fs-24)" }}>
          Still need help?
        </h2>
        <p>Contact customer care for orders, ingredients, privacy requests or a consumer complaint.</p>
        <Link href="/contact" className="btn">Contact us</Link>
        <p className="small muted" style={{ marginTop: 20 }}><Link href="/contact#grievance">Grievance officer & business details</Link> · <Link href="/terms">Terms</Link> · <Link href="/privacy">Privacy</Link></p>
      </section>
    </div>
  );
}
