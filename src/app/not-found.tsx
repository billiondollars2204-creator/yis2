import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container" style={{ display: "grid", justifyItems: "center", gap: 12, padding: "var(--sp-9) 0", textAlign: "center" }}>
      <p className="eyebrow">Error 404</p>
      <h1>We couldn’t find that page</h1>
      <p className="muted">It may have moved. Try searching, or start from the shop.</p>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
        <Link href="/shop" className="btn">
          Shop all products
        </Link>
        <Link href="/support" className="btn btn--outline">
          Help centre
        </Link>
      </div>
    </div>
  );
}
