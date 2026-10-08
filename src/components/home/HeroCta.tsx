"use client";

import Link from "next/link";
import { track } from "@/lib/analytics";
import { ArrowRight } from "../icons";

export function HeroCta() {
  return (
    <Link href="/shop" className="btn btn--lg" onClick={() => track("select_promotion", { promotion_id: "hero", creative: "shop-snacks" })}>
      Shop snacks <ArrowRight />
    </Link>
  );
}
