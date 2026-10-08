"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { getProduct } from "@/data/products";
import { useCart, useCartUI, useHydrated } from "@/lib/cart";
import { useOrders, useSaved, useSession } from "@/lib/stores";
import { formatINR } from "@/lib/money";
import { track } from "@/lib/analytics";
import { ProductCard } from "@/components/ProductCard";
import { Breadcrumbs } from "@/components/ui";
import styles from "../content.module.css";

const tabs = [
  { id: "orders", label: "Orders" },
  { id: "saved", label: "Saved items" },
  { id: "details", label: "Details" },
];

/** DEMO account: sign-in and order history are stored on this device until a commerce backend exists. */
export function AccountView() {
  const params = useSearchParams();
  const tab = tabs.some((t) => t.id === params.get("tab")) ? params.get("tab")! : "orders";
  const hydrated = useHydrated();
  const phone = useSession((s) => s.phone);
  const signIn = useSession((s) => s.signIn);
  const signOut = useSession((s) => s.signOut);
  const orders = useOrders((s) => s.orders);
  const saved = useSaved((s) => s.slugs);
  const add = useCart((s) => s.add);
  const openCart = useCartUI((s) => s.setOpen);
  const [input, setInput] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  if (!hydrated) return <div className="container" style={{ minHeight: "50vh" }} aria-busy="true" />;

  const savedProducts = hydrated ? saved.map((s) => getProduct(s)).filter(Boolean) : [];

  if (!phone && tab !== "saved") {
    return (
      <div className="container">
        <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Account" }]} />
        <div className={`card card--pad ${styles.narrow}`}>
          <h1 style={{ fontSize: "var(--fs-32)" }}>Sign in</h1>
          <p className="muted">Preview your account with test details. No SMS is sent.</p>
          <form
            className={styles.form}
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              const clean = input.replace(/\D/g, "").slice(-10);
              if (!otpSent) {
                if (!/^[6-9]\d{9}$/.test(clean)) return setError("Enter a 10-digit Indian mobile number.");
                setError("");
                setOtpSent(true);
                return;
              }
              if (!/^\d{6}$/.test(otp)) return setError("Enter the 6-digit code.");
              signIn(clean);
              track("login", { method: "otp" });
            }}
          >
            <div className="field">
              <label htmlFor="acc-phone">Mobile number</label>
              <input id="acc-phone" className="input" type="tel" inputMode="tel" autoComplete="tel-national" value={input} onChange={(e) => setInput(e.target.value)} disabled={otpSent} aria-invalid={!!error && !otpSent} aria-describedby="acc-err" />
            </div>
            {otpSent && (
              <div className="field">
                <label htmlFor="acc-otp">6-digit code</label>
                <input id="acc-otp" className="input" inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} aria-invalid={!!error} aria-describedby="acc-err" />
                <p className="hint">Demo: any 6 digits work. SMS isn’t connected yet.</p>
              </div>
            )}
            <p id="acc-err" className="error" role="alert">
              {error}
            </p>
            <button type="submit" className="btn btn--lg">
              {otpSent ? "Verify and sign in" : "Continue in demo"}
            </button>
          </form>
          <p className="small muted" style={{ marginTop: 16 }}>
            No account needed to shop — you can check out as a guest.{" "}
            <Link href="/account?tab=saved" className="link">
              See saved items
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Account" }]} />
      <header className={styles.head}>
        <h1>{phone ? "Your account" : "Saved items"}</h1>
        {phone && (
          <p className="muted">
            Signed in as +91 {phone.slice(0, 5)} {phone.slice(5)} ·{" "}
            <button type="button" className="link" style={{ border: 0, background: "none", padding: 0, cursor: "pointer", font: "inherit" }} onClick={signOut}>
              Sign out
            </button>
          </p>
        )}
      </header>
      <div className={styles.split}>
        {phone && (
          <nav aria-label="Account sections" className={styles.sidenav}>
            {tabs.filter((t) => t.id !== "saved" || savedProducts.length > 0).map((t) => (
              <Link key={t.id} href={`/account?tab=${t.id}`} className="chip" aria-current={tab === t.id ? "page" : undefined}>
                {t.label}
              </Link>
            ))}
          </nav>
        )}
        <div>
          {tab === "orders" &&
            (orders.length ? (
              <div style={{ display: "grid", gap: 16 }}>
                {orders.map((o) => (
                  <article key={o.id} className={styles.order}>
                    <div className={styles.orderHead}>
                      <strong>Order {o.id}</strong>
                      <span className="muted">{new Date(o.placedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                      <strong className="num">{formatINR(o.total)}</strong>
                    </div>
                    <p className="small muted">Demo order saved on this device. No payment was taken or order sent.</p>
                    <ul className={styles.orderLines}>
                      {o.lines.map((l, i) => (
                        <li key={i}>
                          <span>
                            {l.qty} × {l.name} <span className="muted">· {l.detail}</span>
                          </span>
                          <span className="num">{formatINR(l.total)}</span>
                        </li>
                      ))}
                    </ul>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <button
                        type="button"
                        className="btn btn--sm"
                        onClick={() => {
                          for (const l of o.lines) {
                            const p = getProduct(l.slug);
                            const v = p?.variants.find((x) => x.label === l.detail && x.stock !== "out_of_stock");
                            if (p && v) add(p.slug, v.id, l.qty);
                          }
                          openCart(true);
                        }}
                      >
                        Reorder
                      </button>
                      <Link href={`/support?order=${o.id}#track`} className="btn btn--sm btn--outline">
                        View details
                      </Link>
                      <Link href="/contact" className="btn btn--sm btn--ghost">
                        Get help
                      </Link>
                    </div>
                  </article>
                ))}
                <p className="hint">Orders placed on this device (demo). Custom batches can be reordered from the custom-batch builder.</p>
              </div>
            ) : (
              <div className={styles.empty}>
                <strong>No orders yet</strong>
                <p className="muted">Your orders will appear here.</p>
                <Link href="/shop" className="btn">
                  Start shopping
                </Link>
              </div>
            ))}

          {tab === "saved" &&
            (savedProducts.length ? (
              <div className="grid-products">
                {savedProducts.map((p) => (
                  <ProductCard key={p!.slug} product={p!} />
                ))}
              </div>
            ) : (
              <div className={styles.empty}>
                <strong>Nothing saved yet</strong>
                <p className="muted">Previously saved products will appear here.</p>
                <Link href="/shop" className="btn">
                  Browse products
                </Link>
              </div>
            ))}

          {tab === "details" && (
            <div className="card card--pad">
              <h2 style={{ fontSize: "var(--fs-24)" }}>Your details</h2>
              <p className="muted">Mobile: +91 {phone}</p>
              <p className="muted small">Saved addresses and email preferences will appear here once accounts are connected to the commerce backend. (TBC)</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
