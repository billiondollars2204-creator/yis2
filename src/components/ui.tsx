import Link from "next/link";
import { formatINR } from "@/lib/money";
import { per100g } from "@/lib/units";

/** FSSAI vegetarian symbol: green square outline with a filled circle. */
export function VegMark({ label = true }: { label?: boolean }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "var(--fs-12)", fontWeight: 600, color: "var(--veg)" }}>
      <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden={label} role={label ? undefined : "img"} aria-label={label ? undefined : "Vegetarian"}>
        <rect x="0.75" y="0.75" width="12.5" height="12.5" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="7" cy="7" r="3.2" fill="currentColor" />
      </svg>
      {label && "Vegetarian"}
    </span>
  );
}

/** Decorative printed border band. */
export function Toran({ className }: { className?: string }) {
  return <span className={`toran ${className ?? ""}`} aria-hidden="true" />;
}

export function Breadcrumbs({ items }: { items: { href?: string; label: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="breadcrumbs">
      <ol>
        {items.map((it, i) =>
          it.href && i < items.length - 1 ? (
            <li key={i}>
              <Link href={it.href}>{it.label}</Link>
            </li>
          ) : (
            <li key={i} aria-current="page">
              {it.label}
            </li>
          ),
        )}
      </ol>
    </nav>
  );
}

/** Price with the legally required "inclusive of all taxes" note and optional unit price. */
export function Price({ price, grams, was, size = "md", note = true }: { price: number; grams?: number; was?: number; size?: "md" | "lg"; note?: boolean }) {
  return (
    <span style={{ display: "inline-flex", flexWrap: "wrap", alignItems: "baseline", columnGap: 8 }}>
      <strong className="num" style={{ fontSize: size === "lg" ? "var(--fs-32)" : "var(--fs-18)", fontWeight: 700, lineHeight: 1.1 }}>
        {formatINR(price)}
      </strong>
      {was && was > price && (
        <s className="num muted" style={{ fontSize: "var(--fs-14)" }}>
          <span className="visually-hidden">Was </span>
          {formatINR(was)}
        </s>
      )}
      {grams && <span className="num muted small">({formatINR(per100g(price, grams))}/100 g)</span>}
      {note && <span className="muted" style={{ fontSize: "var(--fs-12)", flexBasis: size === "lg" ? "100%" : undefined }}>MRP incl. of all taxes</span>}
    </span>
  );
}

export function Stars({ label = "No reviews yet" }: { label?: string }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "var(--fs-14)", color: "var(--ink-2)" }}>
      <span aria-hidden="true" style={{ letterSpacing: 2, color: "var(--line-2)" }}>
        ★★★★★
      </span>
      {label}
    </span>
  );
}
