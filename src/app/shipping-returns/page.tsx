import type { Metadata } from "next";
import Link from "next/link";
import { FREE_SHIPPING_THRESHOLD, formatINR, SHIPPING_OPTIONS } from "@/lib/money";
import { COD } from "@/lib/pricing";
import { Placeholder } from "@/components/Placeholder";
import { Breadcrumbs } from "@/components/ui";
import styles from "../content.module.css";

export const metadata: Metadata = {
  title: "Shipping & returns",
  description: "Delivery times and charges, cash on delivery, replacements, cancellations and refunds.",
  alternates: { canonical: "/shipping-returns" },
};

export default function ShippingPage() {
  return (
    <div className="container">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/support", label: "Help" }, { label: "Shipping & returns" }]} />
      <header className={styles.head}>
        <h1>Shipping &amp; returns</h1>
        <p className="muted">
          <Placeholder note="final policy text from the business">This policy is a draft and will be confirmed before launch.</Placeholder>
        </p>
      </header>
      <div className="prose" style={{ paddingBottom: "var(--sp-6)" }}>
        <h2 id="delivery">Delivery</h2>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "var(--fs-14)" }}>
          <thead>
            <tr style={{ textAlign: "left", borderBottom: "2px solid var(--ink)" }}>
              <th style={{ padding: 8 }}>Option</th>
              <th style={{ padding: 8 }}>Time</th>
              <th style={{ padding: 8 }}>Charge</th>
            </tr>
          </thead>
          <tbody>
            {SHIPPING_OPTIONS.map((o) => (
              <tr key={o.id} style={{ borderBottom: "1px solid var(--line)" }}>
                <td style={{ padding: 8 }}>{o.label}</td>
                <td style={{ padding: 8 }}>{o.eta}</td>
                <td style={{ padding: 8 }}>
                  {formatINR(o.price)}
                  {o.id === "standard" && `, free over ${formatINR(FREE_SHIPPING_THRESHOLD)}`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <ul>
          <li>Standard orders are packed within 1–2 working days; custom batches are cooked to order and dispatch in 3–4.</li>
          <li>Cash on delivery is available on eligible PIN codes for orders up to {formatINR(COD.maxOrder)}.</li>
          <li>Jars are sealed and packed in recyclable padding.</li>
          <li>
            <Placeholder note="serviceable regions">We aim to deliver across India; some remote PIN codes may take longer.</Placeholder>
          </li>
        </ul>

        <h2 id="returns">Damaged, wrong or missing items</h2>
        <p>
          For change-of-mind returns, opened food cannot be accepted. For damaged, defective, unsafe, expired, incorrect or incomplete items, contact us promptly. Our proposed reporting window is{" "}
          <Placeholder note="confirm window">48 hours</Placeholder> with photos where available. This proposed window does not limit your statutory rights. Replacement/refund eligibility, delayed-delivery remedies and the final process must be confirmed before launch.
        </p>

        <h2 id="cancel">Cancellations</h2>
        <p>Standard orders can be cancelled until they’re packed. Cancellation of custom batches after cooking begins will be governed by the final policy and applicable consumer rights.</p>

        <h2 id="refunds">Refunds</h2>
        <p>
          Approved refunds go back to your original payment method within <Placeholder note="confirm with payment provider">5–7 working days</Placeholder>. COD refunds are
          paid by UPI or bank transfer.
        </p>

        <h2>Questions</h2>
        <p>
          <Link href="/contact" className="link">
            Contact us
          </Link>{" "}
          with your order number and we’ll help.
        </p>
      </div>
    </div>
  );
}
