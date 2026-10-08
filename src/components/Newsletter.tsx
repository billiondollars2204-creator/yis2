"use client";

import { useId, useState } from "react";
import { track } from "@/lib/analytics";
import styles from "./SiteFooter.module.css";

/** Newsletter signup. PLACEHOLDER: connect to an email provider via a server action. */
export function Newsletter() {
  const id = useId();
  const [state, setState] = useState<"idle" | "error" | "done">("idle");
  if (state === "done") {
    return (
      <p className={styles.done} role="status">
        Thank you — you’ll hear from us when the winter batch is ready.
      </p>
    );
  }
  return (
    <form
      className={styles.nlForm}
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        const email = String(new FormData(e.currentTarget).get("email") || "").trim();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return setState("error");
        track("newsletter_signup", { location: "footer" });
        setState("done");
      }}
    >
      <label htmlFor={`${id}-email`} className="visually-hidden">
        Email address
      </label>
      <div className={styles.nlRow}>
        <input
          id={`${id}-email`}
          name="email"
          type="email"
          autoComplete="email"
          placeholder="Your email address"
          className="input"
          aria-invalid={state === "error" || undefined}
          aria-describedby={state === "error" ? `${id}-err` : undefined}
        />
        <button type="submit" className="btn">
          Subscribe
        </button>
      </div>
      {state === "error" && (
        <p id={`${id}-err`} className={styles.nlErr}>
          Enter a valid email address.
        </p>
      )}
    </form>
  );
}
