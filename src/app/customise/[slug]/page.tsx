import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getProduct } from "@/data/products";
import { CUSTOMISABLE_PRODUCTS, getFormula } from "@/data/formulations";
import { ingredients } from "@/data/ingredients";
import { EMPTY_CUSTOMIZATION, resolveFormula } from "@/lib/customization";
import { formatGrams } from "@/lib/units";
import { Builder } from "@/components/builder/Builder";

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return CUSTOMISABLE_PRODUCTS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) return {};
  return {
    title: `Custom ${p.name}`,
    description: `Set every ingredient in your ${p.name} by the gram: base, nuts, seeds, spices and sweetener. Custom batches from 500 g.`,
    alternates: { canonical: `/customise/${slug}` },
  };
}

export default async function CustomisePage({ params }: Params) {
  const { slug } = await params;
  const product = getProduct(slug);
  const formula = getFormula(slug);
  if (!product || !formula) notFound();
  // Server-rendered house recipe, shown until the interactive builder hydrates.
  const fallback = (
    <div className="container" style={{ paddingBlock: "var(--sp-7)" }}>
      <h1>Custom {product.name}</h1>
      <p className="lead">House recipe per 500 g. Loading the builder…</p>
      <ul>
        {resolveFormula(formula, EMPTY_CUSTOMIZATION)
          .filter((r) => r.grams > 0)
          .map((r) => (
            <li key={r.key}>
              {ingredients[r.pick]?.name}: {formatGrams(r.grams)}
            </li>
          ))}
      </ul>
    </div>
  );
  return (
    <Suspense fallback={fallback}>
      <Builder slug={slug} />
    </Suspense>
  );
}
