import { BoxIcon, LeafIcon, ScaleIcon, ShieldIcon, TruckIcon, WalletIcon } from "./icons";
import { FREE_SHIPPING_THRESHOLD, formatINR } from "@/lib/money";
import { Placeholder } from "./Placeholder";
import styles from "./TrustStrip.module.css";

const items: { icon: typeof BoxIcon; title: string; text: string; tbc?: string }[] = [
  { icon: ScaleIcon, title: "Every ingredient listed", text: "Full house recipe, by weight" },
  { icon: LeafIcon, title: "Made in small batches", text: "Roasted by hand, packed fresh" },
  { icon: TruckIcon, title: `Free delivery over ${formatINR(FREE_SHIPPING_THRESHOLD)}`, text: "Across India", tbc: "serviceable areas" },
  { icon: WalletIcon, title: "UPI, cards & COD", text: "Pay how you prefer", tbc: "payment provider and COD rules" },
];

/** Trust row. Unconfirmed promises carry a TBC marker until the business confirms them. */
export function TrustStrip({ compact }: { compact?: boolean }) {
  return (
    <ul className={styles.strip} data-compact={compact || undefined}>
      {items.map(({ icon: Icon, title, text, tbc }) => (
        <li key={title}>
          <span className={styles.icon}>
            <Icon />
          </span>
          <span>
            <strong>{title}</strong>
            <span>{tbc ? <Placeholder note={tbc}>{text}</Placeholder> : text}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

export function CheckoutTrust() {
  const list = [
    { icon: ShieldIcon, text: "Secure payment via our payment partner" },
    { icon: BoxIcon, text: "Damaged on arrival? We replace it" },
    { icon: WalletIcon, text: "Cash on delivery on eligible PIN codes" },
  ];
  return (
    <ul className={styles.mini}>
      {list.map(({ icon: Icon, text }) => (
        <li key={text}>
          <Icon /> {text}
        </li>
      ))}
    </ul>
  );
}
