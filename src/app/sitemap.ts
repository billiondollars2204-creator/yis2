export const dynamic = "force-static";
import type { MetadataRoute } from "next";
import { products } from "@/data/products";
import { CUSTOMISABLE_PRODUCTS } from "@/data/formulations";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/shop", "/customise", "/our-story", "/support", "/faq", "/shipping-returns", "/contact", "/privacy", "/terms"];
  return [
    ...pages.map((p) => ({ url: `${site.url}${p}`, changeFrequency: "weekly" as const, priority: p === "" ? 1 : 0.7 })),
    ...products.map((p) => ({ url: `${site.url}/shop/${p.slug}`, changeFrequency: "weekly" as const, priority: 0.8 })),
    ...CUSTOMISABLE_PRODUCTS.map((s) => ({ url: `${site.url}/customise/${s}`, changeFrequency: "monthly" as const, priority: 0.6 })),
  ];
}
