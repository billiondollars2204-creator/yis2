import { formatINR } from "@/lib/money";
import type { ResolvedLine } from "@/lib/cart";
import styles from "./OrderSummary.module.css";

type Props = {
  lines: ResolvedLine[];
  subtotal: number;
  shipping: number | null;
  discount?: number;
  discountLabel?: string;
  savings?: number;
  children?: React.ReactNode;
  title?: string;
};

export function OrderSummary({ lines, subtotal, shipping, discount = 0, discountLabel, savings = 0, children, title = "Order summary" }: Props) {
  const total = subtotal - savings - discount + (shipping ?? 0);
  const items = lines.reduce((n, l) => n + l.qty, 0);
  return (
    <section className={styles.summary} aria-labelledby="summary-title">
      <h2 id="summary-title" className={styles.title}>
        {title}
      </h2>
      <dl className={styles.rows}>
        <div>
          <dt>
            Items ({items})
          </dt>
          <dd className="num">{formatINR(subtotal)}</dd>
        </div>
        {savings > 0 && (
          <div className={styles.save}>
            <dt>Subscription savings</dt>
            <dd className="num">−{formatINR(savings)}</dd>
          </div>
        )}
        {discount > 0 && (
          <div className={styles.save}>
            <dt>{discountLabel ?? "Discount"}</dt>
            <dd className="num">−{formatINR(discount)}</dd>
          </div>
        )}
        <div>
          <dt>Delivery</dt>
          <dd className="num">{shipping === null ? "Calculated at checkout" : shipping === 0 ? "Free" : formatINR(shipping)}</dd>
        </div>
        <div className={styles.total}>
          <dt>
            Total <span>incl. of all taxes</span>
          </dt>
          <dd className="num">{formatINR(total)}</dd>
        </div>
      </dl>
      {children}
    </section>
  );
}
