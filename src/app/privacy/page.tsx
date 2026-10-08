import type { Metadata } from "next";
import Link from "next/link";
import { Placeholder } from "@/components/Placeholder";
import { Breadcrumbs } from "@/components/ui";
import { site } from "@/lib/site";
import styles from "../content.module.css";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: `How ${site.name} collects, uses and protects your personal data.`,
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <div className="container">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/support", label: "Help" }, { label: "Privacy policy" }]} />
      <header className={styles.head}>
        <h1>Privacy policy</h1>
        <p className="muted">
          <Placeholder note="legal review before launch">Draft policy; business practices, providers and applicable data-protection requirements must be confirmed before launch.</Placeholder>
        </p>
      </header>
      <div className="prose" style={{ paddingBottom: "var(--sp-6)" }}>
        <h2>This local preview</h2>
        <p>This preview keeps your cart, saved items, demo sign-in and any demo order details in this browser. A demo order can include the name, contact details and address you enter. No payment, real order, customer-care message or order email is sent. Avoid entering sensitive personal details while testing.</p>
        <h2>What the live store will collect</h2>
        <ul>
          <li><strong>Order details:</strong> name, phone, email, delivery address and PIN code, so we can cook, pack and deliver your order.</li>
          <li><strong>Payment status:</strong> payments are handled by our payment provider. We never see or store your card, UPI PIN or bank details.</li>
          <li><strong>Account and preferences:</strong> saved items and custom-batch recipes.</li>
          <li><strong>Usage data:</strong> any analytics used after launch will be disclosed with a consent choice.</li>
        </ul>
        <h2>How we use it</h2>
        <p>To fulfil and support orders and send delivery updates. Optional marketing and analytics practices must be confirmed before launch.</p>
        <h2>Who we share it with</h2>
        <p>Payment, delivery, messaging and hosting providers for a live store have not been selected or disclosed yet. This preview does not send demo orders to those services.</p>
        <h2>Cookies</h2>
        <p>Browser storage keeps your cart, demo sign-in, saved items and demo orders on this device. No analytics service is connected in this preview. A live store will need its own accurate cookie notice and preference controls if optional analytics are added.</p>
        <h2>How long we keep it</h2>
        <p>Retention periods for order records, support requests and marketing preferences must be confirmed with the business and its advisers before launch. Data should be kept only as needed for its stated purpose and applicable obligations.</p>
        <h2>Your rights</h2>
        <p>You can ask to see, correct or delete your data, withdraw consent, or nominate someone to act for you. Use the <Link href="/contact">privacy and customer-care contact</Link>; the live request process and response timelines will be published before launch.</p>
        <h2>Grievance officer</h2>
        <p><Link href="/contact#grievance">Grievance officer and contact details</Link> — pending confirmation before launch.</p>
        <p>
          See also our <Link href="/terms">terms of use</Link> and <Link href="/shipping-returns">shipping &amp; returns</Link>.
        </p>
      </div>
    </div>
  );
}
