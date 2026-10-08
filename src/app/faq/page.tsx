import type { Metadata } from "next";
import Link from "next/link";
import { faqs } from "@/data/content";
import { JsonLd } from "@/components/JsonLd";
import { Breadcrumbs } from "@/components/ui";
import styles from "../content.module.css";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers about our panjiri, pinni and laddus: ingredients, custom batches, delivery and payments.",
  alternates: { canonical: "/faq" },
};

const anchors: Record<string, string> = { "About the food": "food", Customising: "custom", "Orders & delivery": "orders" };

export default function FaqPage() {
  const ld = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.flatMap((g) => g.items.map((i) => ({ "@type": "Question", name: i.q, acceptedAnswer: { "@type": "Answer", text: i.a } }))),
  };
  return (
    <div className="container">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/support", label: "Help" }, { label: "FAQ" }]} />
      <header className={styles.head}>
        <h1>Frequently asked questions</h1>
        <p className="muted">
          Can’t find it? <Link href="/contact" className="link">Ask us</Link>.
        </p>
      </header>
      <div className={styles.split}>
        <nav aria-label="FAQ sections" className={styles.sidenav}>
          {faqs.map((g) => (
            <a key={g.group} href={`#${anchors[g.group] ?? g.group}`} className="chip">
              {g.group}
            </a>
          ))}
        </nav>
        <div style={{ display: "grid", gap: "var(--sp-6)" }}>
          {faqs.map((g) => (
            <section key={g.group} id={anchors[g.group] ?? g.group} aria-labelledby={`h-${anchors[g.group]}`} style={{ scrollMarginTop: 140 }}>
              <h2 id={`h-${anchors[g.group]}`} style={{ fontSize: "var(--fs-24)" }}>
                {g.group}
              </h2>
              {g.items.map((i) => (
                <details key={i.q} className="acc">
                  <summary>{i.q}</summary>
                  <div className="acc-body">
                    <p>{i.a}</p>
                  </div>
                </details>
              ))}
            </section>
          ))}
        </div>
      </div>
      <JsonLd data={ld} />
    </div>
  );
}
