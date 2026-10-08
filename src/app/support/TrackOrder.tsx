"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useOrders } from "@/lib/stores";
import { useHydrated } from "@/lib/cart";
import { formatINR } from "@/lib/money";
import { track } from "@/lib/analytics";
import styles from "../content.module.css";

/** Order lookup. DEMO: searches orders placed on this device; connect to the order API before launch. */
export function TrackOrder() {
  const params = useSearchParams();
  const hydrated = useHydrated();
  const orders = useOrders((s) => s.orders);
  const [id, setId] = useState(params.get("order") ?? "");
  const [query, setQuery] = useState<string | null>(params.get("order"));
  const [error, setError] = useState("");
  const found = hydrated && query ? orders.find((o) => o.id.toLowerCase() === query.toLowerCase()) : undefined;

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <form
        noValidate
        style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", alignItems: "end" }}
        onSubmit={(e) => {
          e.preventDefault();
          if (!id.trim()) return setError("Enter your order number. It starts with IW.");
          setError("");
          setQuery(id.trim());
          track("track_order", { found: orders.some((o) => o.id.toLowerCase() === id.trim().toLowerCase()) });
        }}
      >
        <div className="field">
          <label htmlFor="t-id">Order number</label>
          <input id="t-id" className="input" value={id} onChange={(e) => setId(e.target.value)} placeholder="e.g. IW1A2B3C4" aria-describedby="t-err" />
        </div>
        <button type="submit" className="btn">
          Find demo order
        </button>
      </form>
      <p id="t-err" className="error" role="alert">
        {error}
      </p>
      <div aria-live="polite">
        {query &&
          hydrated &&
          (found ? (
            <div className={styles.order}>
              <div className={styles.orderHead}>
                <strong>Order {found.id}</strong>
                <span className="num">{formatINR(found.total)}</span>
              </div>
              <p className="small muted" style={{ margin: 0 }}>
                Saved on this device as a preview. No payment was taken or parcel dispatched. Delivery details and live tracking will appear here when the store launches.
              </p>
            </div>
          ) : (
            <div className="notice notice--error">
              <p>
                We couldn’t find demo order “{query}” on this device. Preview orders are stored only in the browser where they were created.
              </p>
            </div>
          ))}
      </div>
    </div>
  );
}
