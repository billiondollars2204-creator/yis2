"use client";

import Link from "next/link";
import { useVariant } from "@/lib/experiments";
import { track } from "@/lib/analytics";
import { ArrowRight } from "../icons";

/** Hero CTAs. The primary label is an A/B test (see src/lib/experiments.ts). */
export function HeroActions() {
  const v = useVariant("hero-cta");
  return (
    <>
      <Link href="/shop" className="btn btn--lg" onClick={() => track("select_promotion", { promotion_id: "hero", creative: v })}>
        {v === "shop-all" ? "Shop all products" : "Shop bestsellers"} <ArrowRight />
      </Link>
      <Link href="/customise" className="btn btn--lg btn--outline">
        Build a custom batch
      </Link>
    </>
  );
}
