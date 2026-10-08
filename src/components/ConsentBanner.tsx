"use client";

import Link from "next/link";
import { setConsent, useConsent } from "@/lib/consent";
import styles from "./ConsentBanner.module.css";

/** Asks once for analytics consent. Essential storage (cart, login) never needs it. */
export function ConsentBanner() {
  const consent = useConsent();
  if (consent !== null) return null;
  return (
    <section className={styles.banner} role="region" aria-label="Cookie preferences">
      <p>
        We use essential storage to keep your cart and login working. With your permission, we’ll also use analytics cookies to improve the shop.{" "}
        <Link href="/privacy" className="link">
          Privacy policy
        </Link>
      </p>
      <div className={styles.actions}>
        <button type="button" className="btn btn--dark" onClick={() => setConsent("granted")}>
          Accept
        </button>
        <button type="button" className="btn btn--outline" onClick={() => setConsent("denied")}>
          Essential only
        </button>
      </div>
    </section>
  );
}

/** Footer link that reopens the banner. */
export function CookieSettingsButton() {
  return (
    <button type="button" className={styles.link} onClick={() => setConsent(null)}>
      Cookie settings
    </button>
  );
}
