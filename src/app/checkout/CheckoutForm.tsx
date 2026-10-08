"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { resolveLines, useCart, useHydrated } from "@/lib/cart";
import { formatINR, SHIPPING_OPTIONS, shippingCost } from "@/lib/money";
import { applyCoupon, stateFromPincode, type CouponResult } from "@/lib/pricing";
import { validateCheckout, validateField, type CheckoutErrors, type CheckoutValues } from "@/lib/validation";
import { batchLabel } from "@/lib/describe";
import { track } from "@/lib/analytics";
import { useOrders, useSession, type Order } from "@/lib/stores";
import { indianStates } from "@/data/content";
import { productImages } from "@/data/images";
import { OrderSummary } from "@/components/OrderSummary";
import { SmartImage } from "@/components/SmartImage";
import { CheckIcon, LockIcon } from "@/components/icons";
import styles from "./checkout.module.css";

const initial: CheckoutValues = {
  email: "",
  phone: "",
  fullName: "",
  address1: "",
  address2: "",
  city: "",
  state: "",
  pincode: "",
  shipping: "standard",
  payment: "demo",
  notes: "",
};

const labels: Record<keyof CheckoutValues, string> = {
  email: "Email",
  phone: "Mobile number",
  fullName: "Full name",
  address1: "Flat, house no., building, street",
  address2: "Area, landmark (optional)",
  city: "City / town",
  state: "State / UT",
  pincode: "PIN code",
  shipping: "Delivery",
  payment: "Payment",
  notes: "Delivery instructions (optional)",
};

export function CheckoutForm() {
  const hydrated = useHydrated();
  const raw = useCart((s) => s.lines);
  const giftNote = useCart((s) => s.giftNote);
  const clear = useCart((s) => s.clear);
  const saveOrder = useOrders((s) => s.add);
  const session = useSession((s) => s.phone);
  const [v, setV] = useState<CheckoutValues>(initial);
  const [errors, setErrors] = useState<CheckoutErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof CheckoutValues, boolean>>>({});
  const [couponInput, setCouponInput] = useState("");
  const [coupon, setCoupon] = useState<CouponResult | null>(null);
  const [placing, setPlacing] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [stateHint, setStateHint] = useState("");
  const summaryRef = useRef<HTMLDivElement>(null);
  const doneRef = useRef<HTMLHeadingElement>(null);

  const lines = hydrated ? resolveLines(raw) : [];
  const subtotal = lines.reduce((n, l) => n + l.lineTotal, 0);
  const savings = lines.reduce((n, l) => n + (l.listPrice - l.unitPrice) * l.qty, 0);
  // Re-check the coupon against the live subtotal so cart changes can't keep a stale discount.
  const live = coupon?.ok ? applyCoupon(coupon.code, subtotal) : null;
  const discount = live?.ok ? live.discount : 0;
  const shipping = shippingCost(subtotal - discount, v.shipping);
  const total = subtotal - discount + shipping;
  const errorKeys = (Object.keys(errors) as (keyof CheckoutValues)[]).filter((k) => errors[k]);

  useEffect(() => {
    if (hydrated && lines.length) track("begin_checkout", { value: subtotal, currency: "INR", items: lines.length });
    if (hydrated && session) setV((x) => (x.phone ? x : { ...x, phone: session }));
    // Once, after the persisted cart loads.
  }, [hydrated]);

  useEffect(() => {
    if (order) doneRef.current?.focus();
  }, [order]);

  function set<K extends keyof CheckoutValues>(k: K, value: string) {
    // The PIN code suggests a state; the shopper can still change it.
    const suggestedState = k === "pincode" && value.length === 6 && !v.state ? stateFromPincode(value) : undefined;
    setV((x) => ({ ...x, [k]: value, ...(suggestedState && !x.state ? { state: suggestedState } : {}) }));
    if (suggestedState) setStateHint(`State set to ${suggestedState} from your PIN code.`);
    if (touched[k]) setErrors((e) => ({ ...e, [k]: validateField(k, value) }));
    if (suggestedState) setErrors((e) => ({ ...e, state: undefined }));
  }

  function blur(k: keyof CheckoutValues) {
    setTouched((t) => ({ ...t, [k]: true }));
    setErrors((e) => ({ ...e, [k]: validateField(k, v[k]) }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const found = validateCheckout(v);
    setErrors(found);
    setTouched(Object.fromEntries(Object.keys(v).map((k) => [k, true])));
    if (Object.keys(found).length) {
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    setPlacing(true);
    track("add_shipping_info", { shipping_tier: v.shipping, value: total, currency: "INR" });
    track("add_payment_info", { payment_type: v.payment, value: total, currency: "INR" });
    // TODO(integration): create the order server-side, hand off to the payment provider
    // (e.g. Razorpay / Cashfree / PayU) and confirm via webhook before showing success.
    await new Promise((r) => setTimeout(r, 800));
    const o: Order = {
      id: `IW${Date.now().toString(36).toUpperCase().slice(-7)}`,
      placedAt: new Date().toISOString(),
      lines: lines.map((l) => ({
        slug: l.slug,
        name: l.product.name,
        detail: l.customization ? `Custom batch · ${batchLabel(l.variant.grams, 1)}` : l.variant.label,
        qty: l.qty,
        total: l.lineTotal,
        subscription: l.plan?.every,
      })),
      subtotal,
      discount,
      shipping,
      total,
      payment: "Demo checkout",
      address: { fullName: v.fullName, address1: v.address1, address2: v.address2, city: v.city, state: v.state, pincode: v.pincode, phone: v.phone, email: v.email },
    };
    track("purchase", { transaction_id: o.id, value: total, shipping, discount, currency: "INR", coupon: live?.ok ? live.code : undefined, payment_type: v.payment });
    saveOrder(o);
    clear();
    setOrder(o);
    setPlacing(false);
    window.scrollTo({ top: 0 });
  }

  if (order) {
    return (
      <div className={`container ${styles.done}`}>
        <span className={styles.doneIcon}>
          <CheckIcon />
        </span>
        <h1 ref={doneRef} tabIndex={-1}>
          Thank you, {order.address.fullName.split(" ")[0]}!
        </h1>
        <p className="lead">
          Order <strong>{order.id}</strong> is a preview · {formatINR(order.total)} · {order.payment}. No confirmation email has been sent.
        </p>
        <div className="notice notice--info" style={{ textAlign: "left" }}>
          <p>Demo mode: no payment was taken and no real order was created. This preview is saved only in this browser.</p>
        </div>
        <div className={styles.doneActions}>
          <Link href={`/support?order=${order.id}#track`} className="btn">
            View demo order
          </Link>
          <Link href="/shop" className="btn btn--ghost">
            Continue shopping
          </Link>
        </div>
      </div>
    );
  }

  if (!hydrated) {
    return (
      <div className="container" aria-busy="true" style={{ paddingTop: 40, display: "grid", gap: 12 }}>
        <span className="skeleton" style={{ width: 200, height: 32 }} />
        <span className="skeleton" style={{ height: 220 }} />
      </div>
    );
  }

  if (!lines.length) {
    return (
      <div className={`container ${styles.done}`}>
        <h1>Your cart is empty</h1>
        <p className="lead">Add something before checking out.</p>
        <Link href="/shop" className="btn">
          Shop bestsellers
        </Link>
      </div>
    );
  }

  const field = (k: keyof CheckoutValues, props: React.InputHTMLAttributes<HTMLInputElement> = {}, hint?: string) => {
    const err = touched[k] ? errors[k] : undefined;
    const ids = [hint && `${k}-hint`, err && `${k}-err`].filter(Boolean).join(" ") || undefined;
    return (
      <div className="field">
        <label htmlFor={k}>{labels[k]}</label>
        <input id={k} name={k} className="input" value={v[k]} onChange={(e) => set(k, e.target.value)} onBlur={() => blur(k)} aria-invalid={err ? true : undefined} aria-describedby={ids} {...props} />
        {hint && (
          <p id={`${k}-hint`} className="hint">
            {hint}
          </p>
        )}
        {err && (
          <p id={`${k}-err`} className="error">
            {err}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="container">
      <header className={styles.head}>
        <h1>Checkout</h1>
        <p className={styles.secure}>
          <LockIcon /> Demo checkout — no payment will be taken
        </p>
      </header>

      <div className={styles.layout}>
        <form onSubmit={submit} noValidate className={styles.form}>
          <div ref={summaryRef} tabIndex={-1} role="alert" hidden={!errorKeys.length} className={`notice notice--error ${styles.errors}`}>
            {errorKeys.length > 0 && (
              <div>
                <p>
                  <strong>Please check {errorKeys.length === 1 ? "this field" : `these ${errorKeys.length} fields`}:</strong>
                </p>
                <ul>
                  {errorKeys.map((k) => (
                    <li key={k}>
                      <a href={`#${k === "shipping" ? `ship-${v.shipping}` : k}`}>{labels[k]}</a> — {errors[k]}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <section className={styles.step} aria-labelledby="s1">
            <h2 id="s1">
              <span>1</span> Contact
            </h2>
            <div className={styles.row2}>
              {field("phone", { type: "tel", autoComplete: "tel-national", inputMode: "tel" })}
              {field("email", { type: "email", autoComplete: "email", inputMode: "email" })}
            </div>
          </section>

          <section className={styles.step} aria-labelledby="s2">
            <h2 id="s2">
              <span>2</span> Delivery address
            </h2>
            {field("fullName", { autoComplete: "name" })}
            <div className={styles.row2}>
              {field("pincode", { autoComplete: "postal-code", inputMode: "numeric", maxLength: 6 })}
              {field("city", { autoComplete: "address-level2" })}
            </div>
            {field("address1", { autoComplete: "address-line1" })}
            <details className="acc"><summary>Add a landmark or delivery note</summary><div className="acc-body">{field("address2", { autoComplete: "address-line2" })}{field("notes", { maxLength: 300 })}</div></details>
            <div className="field">
              <label htmlFor="state">{labels.state}</label>
              <select
                id="state"
                className="select"
                autoComplete="address-level1"
                value={v.state}
                onChange={(e) => set("state", e.target.value)}
                onBlur={() => blur("state")}
                aria-invalid={touched.state && errors.state ? true : undefined}
                aria-describedby={[stateHint && "state-hint", touched.state && errors.state && "state-err"].filter(Boolean).join(" ") || undefined}
              >
                <option value="">Choose…</option>
                {indianStates.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
              {stateHint && (
                <p id="state-hint" className="hint" aria-live="polite">
                  {stateHint}
                </p>
              )}
              {touched.state && errors.state && (
                <p id="state-err" className="error">
                  {errors.state}
                </p>
              )}
            </div>
          </section>

          <section className={styles.step} aria-labelledby="s3">
            <h2 id="s3">
              <span>3</span> Delivery speed
            </h2>
            <fieldset className={styles.options}>
              <legend className="visually-hidden">Delivery option</legend>
              {SHIPPING_OPTIONS.map((o) => {
                const cost = shippingCost(subtotal - discount, o.id);
                return (
                  <label key={o.id} className="choice">
                    <input id={`ship-${o.id}`} type="radio" name="shipping" checked={v.shipping === o.id} onChange={() => set("shipping", o.id)} />
                    <span className={styles.opt}>
                      <strong>{o.label}</strong>
                      <span className="muted small">{o.eta} (TBC)</span>
                      <em className="num">{cost === 0 ? "Free" : formatINR(cost)}</em>
                    </span>
                  </label>
                );
              })}
            </fieldset>
          </section>

          <p className="hint">No payment method is needed for this preview. Your demo order stays in this browser.</p>

          <button type="submit" className="btn btn--lg btn--block" disabled={placing} aria-busy={placing || undefined}>
            <LockIcon /> {placing ? "Creating demo order…" : `Create demo order · ${formatINR(total)}`}
          </button>
          <p className="hint" style={{ textAlign: "center", marginTop: -16 }}>
            For the planned store, read our{" "}
            <Link href="/terms" className="link">
              terms
            </Link>
            ,{" "}
            <Link href="/privacy" className="link">
              privacy policy
            </Link>{" "}
            and{" "}
            <Link href="/shipping-returns" className="link">
              shipping & returns policy
            </Link>
            .
          </p>
        </form>

        <aside className={styles.aside}>
          <details className={styles.mobileSummary}>
            <summary>
              <span>Order ({lines.reduce((n, l) => n + l.qty, 0)} items)</span> <strong className="num">{formatINR(total)}</strong>
            </summary>
            <ul className={styles.items}>
              {lines.map((l) => (
                <li key={l.key}>
                  <span className={styles.thumb}>
                    <SmartImage image={productImages(l.product)[0]} sizes="56px" ratio="1 / 1" decorative quiet />
                    <span className={styles.qty}>{l.qty}</span>
                  </span>
                  <span>
                    <strong>{l.product.name}</strong>
                    <span className="muted small">
                      {l.customization ? `Custom batch · ${batchLabel(l.variant.grams, 1)}` : l.variant.label}
                      {l.plan ? ` · every ${l.plan.every} weeks` : ""}
                    </span>
                  </span>
                  <span className="num">{formatINR(l.lineTotal)}</span>
                </li>
              ))}
            </ul>
            {giftNote && <p className="small muted">Gift note: “{giftNote}”</p>}
          </details>

          <details className="acc"><summary>Have a coupon?</summary><form
            className={styles.coupon}
            onSubmit={(e) => {
              e.preventDefault();
              const r = applyCoupon(couponInput, subtotal);
              setCoupon(r);
              track("apply_coupon", { coupon: couponInput.trim().toUpperCase(), ok: r.ok });
            }}
          >
            <label htmlFor="coupon" className="label">
              Coupon code
            </label>
            <div>
              <input id="coupon" className="input" value={couponInput} onChange={(e) => setCouponInput(e.target.value)} autoCapitalize="characters" aria-describedby="coupon-msg" />
              <button type="submit" className="btn btn--outline">
                Apply
              </button>
            </div>
            <p id="coupon-msg" className={coupon && !coupon.ok ? "error" : "hint"} aria-live="polite">
              {coupon ? (coupon.ok ? (live?.ok ? `${coupon.code} applied — ${coupon.label}.` : `${coupon.code} no longer applies to this order.`) : coupon.error) : ""}
            </p>
          </form></details>

          <OrderSummary lines={lines} subtotal={subtotal + savings} savings={savings} discount={discount} discountLabel={live?.ok ? `Coupon ${live.code}` : undefined} shipping={shipping}>

          </OrderSummary>
        </aside>
      </div>
    </div>
  );
}
