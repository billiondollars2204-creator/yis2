"use client";

import Link from "next/link";

/** Route-level error boundary: friendly message, retry, and a way out. */
export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="container" style={{ display: "grid", justifyItems: "center", gap: 12, padding: "var(--sp-9) 0", textAlign: "center" }} role="alert">
      <h1>Something went wrong</h1>
      <p className="muted">Your cart is safe. Try again, or contact us if it keeps happening.</p>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
        <button type="button" className="btn" onClick={reset}>
          Try again
        </button>
        <Link href="/contact" className="btn btn--outline">
          Contact us
        </Link>
      </div>
    </div>
  );
}
