"use client";

import { useRef, useState } from "react";
import { track } from "@/lib/analytics";

type Errors = Partial<Record<"name" | "email" | "message", string>>;

/** Contact form. PLACEHOLDER: send to the inbox/CRM via a server action. */
export function ContactForm() {
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);
  const ref = useRef<HTMLFormElement>(null);
  if (sent) {
    return (
      <div className="notice notice--info" role="status">
        <p>
          <strong>Demo message checked.</strong> No message was sent. This form will be connected to customer care before launch.
        </p>
      </div>
    );
  }
  const err = (k: keyof Errors) =>
    errors[k] && (
      <p id={`c-${k}-err`} className="error">
        {errors[k]}
      </p>
    );
  return (
    <form
      ref={ref}
      noValidate
      style={{ display: "grid", gap: 16, maxWidth: 560 }}
      onSubmit={(e) => {
        e.preventDefault();
        const d = new FormData(e.currentTarget);
        const next: Errors = {};
        if (String(d.get("name") || "").trim().length < 2) next.name = "Enter your name.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(d.get("email") || "").trim())) next.email = "Enter an email we can reply to.";
        if (String(d.get("message") || "").trim().length < 10) next.message = "Tell us a little more (at least 10 characters).";
        setErrors(next);
        const first = Object.keys(next)[0];
        if (first) return ref.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
        track("contact_submit", { topic: String(d.get("topic")) });
        setSent(true);
      }}
    >
      <div className="field">
        <label htmlFor="c-name">Name</label>
        <input id="c-name" name="name" className="input" autoComplete="name" aria-invalid={!!errors.name || undefined} aria-describedby={errors.name ? "c-name-err" : undefined} />
        {err("name")}
      </div>
      <div className="field">
        <label htmlFor="c-email">Email</label>
        <input id="c-email" name="email" type="email" className="input" autoComplete="email" aria-invalid={!!errors.email || undefined} aria-describedby={errors.email ? "c-email-err" : undefined} />
        {err("email")}
      </div>
      <div className="field">
        <label htmlFor="c-topic">Topic</label>
        <select id="c-topic" name="topic" className="select" defaultValue="order">
          <option value="order">An order</option>
          <option value="custom">A custom batch</option>
          <option value="allergy">Ingredients & allergies</option>
          <option value="gifting">Gifting & bulk orders</option>
          <option value="grievance">A consumer grievance</option>
          <option value="privacy">Privacy or data request</option>
          <option value="other">Something else</option>
        </select>
      </div>
      <div className="field">
        <label htmlFor="c-message">Message</label>
        <textarea id="c-message" name="message" className="textarea" rows={5} aria-invalid={!!errors.message || undefined} aria-describedby={errors.message ? "c-message-err" : undefined} />
        {err("message")}
      </div>
      <button type="submit" className="btn" style={{ justifySelf: "start" }}>
        Check demo message
      </button>
    </form>
  );
}
