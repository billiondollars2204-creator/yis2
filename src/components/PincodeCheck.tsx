"use client";

import { useId, useState } from "react";
import { COD, stateFromPincode } from "@/lib/pricing";
import { SHIPPING_OPTIONS } from "@/lib/money";
import { track } from "@/lib/analytics";
import { PinIcon } from "./icons";

/** Delivery estimate by PIN code. PLACEHOLDER until the courier serviceability API is connected. */
export function PincodeCheck() {
  const id = useId();
  const [pin, setPin] = useState("");
  const [res, setRes] = useState<{ ok: boolean; lines: string[] } | null>(null);
  return (
    <form
      style={{ display: "grid", gap: 8 }}
      onSubmit={(e) => {
        e.preventDefault();
        if (!/^[1-9]\d{5}$/.test(pin)) return setRes({ ok: false, lines: ["Enter a valid 6-digit PIN code."] });
        const st = stateFromPincode(pin);
        track("check_pincode", { pincode_prefix: pin.slice(0, 3) });
        setRes({
          ok: true,
          lines: [
            `Delivers to ${pin}${st ? `, ${st}` : ""} in ${SHIPPING_OPTIONS[0].eta} (standard).`,
            `Cash on delivery for orders up to ₹${COD.maxOrder.toLocaleString("en-IN")}.`,
            "Estimates are placeholders until our courier partner is connected.",
          ],
        });
      }}
    >
      <label htmlFor={`${id}-pin`} className="label" style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ display: "inline-flex", width: 18, height: 18 }}>
          <PinIcon />
        </span>
        Check delivery to your PIN code
      </label>
      <div style={{ display: "flex", gap: 8 }}>
        <input
          id={`${id}-pin`}
          className="input"
          inputMode="numeric"
          autoComplete="postal-code"
          maxLength={6}
          placeholder="e.g. 141002"
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
          aria-describedby={res ? `${id}-res` : undefined}
          style={{ maxWidth: 200 }}
        />
        <button type="submit" className="btn btn--outline">
          Check
        </button>
      </div>
      <div id={`${id}-res`} role="status" aria-live="polite" style={{ fontSize: "var(--fs-14)" }}>
        {res &&
          res.lines.map((l, i) => (
            <p key={i} style={{ margin: 0, color: !res.ok ? "var(--danger)" : i === 2 ? "var(--ink-3)" : i === 0 ? "var(--peacock)" : "var(--ink-2)", fontWeight: i === 0 ? 600 : 400 }}>
              {l}
            </p>
          ))}
      </div>
    </form>
  );
}
