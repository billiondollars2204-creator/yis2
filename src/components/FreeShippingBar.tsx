import { FREE_SHIPPING_THRESHOLD, formatINR } from "@/lib/money";
import { TruckIcon } from "./icons";

export function FreeShippingBar({ subtotal }: { subtotal: number }) {
  const left = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const pct = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
  return (
    <div style={{ fontSize: "var(--fs-14)" }}>
      <p style={{ display: "flex", alignItems: "center", gap: 8, margin: "0 0 8px" }}>
        <span style={{ display: "inline-flex", width: 20, height: 20, flex: "none" }}>
          <TruckIcon />
        </span>
        {left > 0 ? (
          <span>
            Add <strong className="num">{formatINR(left)}</strong> more for free delivery
          </span>
        ) : (
          <strong style={{ color: "var(--peacock)" }}>You’ve unlocked free delivery</strong>
        )}
      </p>
      <div
        role="progressbar"
        aria-label="Progress to free delivery"
        aria-valuemin={0}
        aria-valuemax={FREE_SHIPPING_THRESHOLD}
        aria-valuenow={Math.min(subtotal, FREE_SHIPPING_THRESHOLD)}
        style={{ height: 6, borderRadius: 99, background: "var(--line)", overflow: "hidden" }}
      >
        <span style={{ display: "block", height: "100%", width: `${pct}%`, background: left ? "var(--marigold)" : "var(--peacock)", transition: "width 500ms var(--ease)" }} />
      </div>
    </div>
  );
}
