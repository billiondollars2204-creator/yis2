"use client";

import { useEffect, useState } from "react";

export type Consent = "granted" | "denied" | null;
const KEY = "iw-consent";
const EVENT = "iw:consent";

export function readConsent(): Consent {
  if (typeof window === "undefined") return null;
  const v = localStorage.getItem(KEY);
  return v === "granted" || v === "denied" ? v : null;
}

export function setConsent(v: Consent) {
  if (v) localStorage.setItem(KEY, v);
  else localStorage.removeItem(KEY);
  window.dispatchEvent(new CustomEvent(EVENT, { detail: v }));
}

/** Current analytics consent; `undefined` until read on the client. */
export function useConsent(): Consent | undefined {
  const [c, setC] = useState<Consent | undefined>(undefined);
  useEffect(() => {
    setC(readConsent());
    const on = () => setC(readConsent());
    window.addEventListener(EVENT, on);
    window.addEventListener("storage", on);
    return () => {
      window.removeEventListener(EVENT, on);
      window.removeEventListener("storage", on);
    };
  }, []);
  return c;
}
