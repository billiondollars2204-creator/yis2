import type { Metadata } from "next";
import Link from "next/link";
import { business } from "@/lib/site";
import { Breadcrumbs } from "@/components/ui";
import { ContactForm } from "./ContactForm";
import styles from "../content.module.css";

export const metadata: Metadata = { title: "Contact & business details", description: "Customer care, business details and consumer grievance contacts for Immunitywize.", alternates: { canonical: "/contact" } };
const pending = "Pending confirmation before launch";
export default function ContactPage() {
  return <div className="container">
    <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/support", label: "Help" }, { label: "Contact" }]} />
    <header className={styles.head}><h1>Contact us</h1><p className="muted">Orders, ingredients or a custom batch — start here.</p></header>
    <div className={styles.split}>
      <aside>
        <h2 style={{fontSize:24}}>Customer care</h2>
        <p>Email: {business.customerEmail ? <a href={`mailto:${business.customerEmail}`}>{business.customerEmail}</a> : pending}</p>
        <p>Phone: {business.customerPhone ? <a href={`tel:${business.customerPhone}`}>{business.customerPhone}</a> : pending}</p>
        <p className="hint">This local preview does not send messages. Use test details only.</p>
        <Link href="/shipping-returns" className="link">Delivery, cancellations & refunds</Link>
      </aside>
      <ContactForm />
    </div>
    <section id="business" className="prose" style={{padding:"48px 0",scrollMarginTop:110}}>
      <h2>Business & licensing details</h2>
      <p>These disclosures must be confirmed before the store accepts real orders.</p>
      <dl>
        <dt><strong>Legal business name</strong></dt><dd>{business.legalName || pending}</dd>
        <dt><strong>Registered/principal business address</strong></dt><dd>{business.registeredAddress || pending}</dd>
        <dt><strong>FSSAI licence/registration number</strong></dt><dd>{business.fssaiNumber || pending}</dd>
        <dt><strong>GSTIN, where applicable</strong></dt><dd>{business.gstin || "Applicability and registration to be confirmed"}</dd>
      </dl>
      <h2 id="grievance">Consumer grievances</h2>
      <dl>
        <dt><strong>Grievance officer</strong></dt><dd>{business.grievanceName || pending}</dd>
        <dt><strong>Designation</strong></dt><dd>{business.grievanceDesignation || pending}</dd>
        <dt><strong>Email</strong></dt><dd>{business.grievanceEmail ? <a href={`mailto:${business.grievanceEmail}`}>{business.grievanceEmail}</a> : pending}</dd>
        <dt><strong>Phone</strong></dt><dd>{business.grievancePhone || pending}</dd>
      </dl>
      <p>Please provide your order reference and a description of the issue. The live grievance process and contact channels will be published before launch.</p>
      <p><Link href="/terms">Terms</Link> · <Link href="/privacy">Privacy policy</Link> · <Link href="/shipping-returns">Delivery & returns</Link></p>
    </section>
  </div>;
}
