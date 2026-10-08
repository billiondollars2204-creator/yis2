import { CUSTOMISABLE_PRODUCTS, formulas } from "./formulations.ts";
import { ingredients } from "./ingredients.ts";
/**
 * PLACEHOLDER CATALOGUE.
 * Prices, stock, ingredients, nutrition and preparation notes are illustrative
 * only. Every field marked TODO must be confirmed by the Immunitywize kitchen
 * before launch. Do not add health claims here without review.
 */
export type StockStatus = "in_stock" | "low_stock" | "out_of_stock";
export type BenefitSlug = "immunity" | "wellness" | "postpartum" | "bone" | "clarity";

export type Category = {
  slug: string;
  name: string;
  /** Devanagari name, shown alongside the English name. */
  hindi: string;
  blurb: string;
  comingSoon?: boolean;
};

export type Variant = {
  id: string;
  label: string;
  grams: number;
  price: number; // INR, PLACEHOLDER
  stock: StockStatus;
};

export type Product = {
  slug: string;
  name: string;
  /** Devanagari name, shown alongside the English name. */
  hindi: string;
  /** "bundle" products are fixed boxes of other products. */
  kind?: "bundle";
  contents?: { slug: string; variant: string; qty: number }[];
  category: string;
  /** One-line descriptor shown on product cards. */
  short: string;
  tagline: string;
  /** PLACEHOLDER merchandising badge. */
  badge?: "Bestseller" | "New" | "Limited";
  description: string;
  /** Traditional-use tags; copy shown with a "not medical advice" note. */
  enjoyedFor: BenefitSlug[];
  ingredients: string[];
  nutrition: { label: string; value: string }[];
  preparation: string;
  storage: string;
  variants: Variant[];
  featured?: boolean;
  /** Derived from CUSTOMISABLE_PRODUCTS in formulations.ts — don't set by hand. */
  customizable?: boolean;
  /** Derived from SUBSCRIBABLE_PRODUCTS below — don't set by hand. */
  subscribable?: boolean;
};

export const categories: Category[] = [
  { slug: "panjiri", name: "Panjiri", hindi: "पंजीरी", blurb: "Roasted wholewheat crumble with nuts and ghee. Eat it by the spoonful or stir it into warm milk." },
  { slug: "pinni", name: "Pinni", hindi: "पिन्नी", blurb: "Hand-pressed rounds of roasted atta, ghee and nuts — the Punjabi winter sweet." },
  { slug: "laddus", name: "Laddus", hindi: "लड्डू", blurb: "Dried fruit and nuts, rolled by hand into small rounds." },
  { slug: "mixes", name: "Dry-fruit mixes", hindi: "मेवा", blurb: "Lightly roasted nuts, seeds and dried fruit for everyday snacking." },
  { slug: "gift-boxes", name: "Gift boxes", hindi: "उपहार", blurb: "Ready-made boxes of our jars for festivals, new babies and winter visits." },
];

// PLACEHOLDER pricing ladder used across products.
const ladder = (base: number, stock: [StockStatus, StockStatus, StockStatus] = ["in_stock", "in_stock", "in_stock"]): Variant[] => [
  { id: "250g", label: "250 g", grams: 250, price: base, stock: stock[0] },
  { id: "500g", label: "500 g", grams: 500, price: Math.round(base * 1.85), stock: stock[1] },
  { id: "1kg", label: "1 kg", grams: 1000, price: Math.round(base * 3.4), stock: stock[2] },
];

const nutritionPlaceholder = [
  { label: "Energy", value: "— kcal" },
  { label: "Protein", value: "— g" },
  { label: "Carbohydrate", value: "— g" },
  { label: "of which sugars", value: "— g" },
  { label: "Fat", value: "— g" },
  { label: "Fibre", value: "— g" },
];


export const products: Product[] = [
  {
    slug: "classic-panjiri",
    hindi: "घर की पंजीरी",
    name: "Ghar ki Panjiri",
    category: "panjiri",
    short: "Roasted wholewheat crumble",
    badge: "Bestseller",
    tagline: "The everyday one. Roasted slowly until the kitchen smells right.",
    description:
      "Wholewheat flour roasted low and slow, folded with nuts and a gentle sweetness. Eat a spoonful with your morning chai, or stir into warm milk on cold evenings. (Placeholder description — refine with the family’s own words.)",
    enjoyedFor: ["immunity", "wellness"],
    ingredients: ["Ingredient list to be confirmed", "Wholewheat flour (TBC)", "Ghee (TBC)", "Nuts — variety TBC", "Sweetener — type TBC"],
    nutrition: nutritionPlaceholder,
    preparation:
      "Made in small batches on a slow flame in a home kitchen. Batch size, roasting time and process details to be added.",
    storage: "Store in an airtight jar, away from moisture. Shelf life: TBC.",
    variants: ladder(349),
    featured: true,
  },
  {
    slug: "mothers-panjiri",
    hindi: "जच्चा पंजीरी",
    name: "Panjiri for New Mothers",
    category: "panjiri",
    short: "A richer panjiri for new mothers",
    tagline: "Made the way families have long made it for the weeks after a baby arrives.",
    description:
      "A richer panjiri in the tradition of post-delivery foods across North India. Always check with your doctor about diet after childbirth. (Placeholder — all copy and ingredients to be reviewed.)",
    enjoyedFor: ["postpartum", "bone", "wellness"],
    ingredients: ["Ingredient list to be confirmed", "Wholewheat flour (TBC)", "Ghee (TBC)", "Traditional additions — TBC"],
    nutrition: nutritionPlaceholder,
    preparation: "Prepared to order in small batches. Process details to be added.",
    storage: "Store in an airtight jar, away from moisture. Shelf life: TBC.",
    variants: ladder(449, ["in_stock", "in_stock", "low_stock"]),
    featured: true,
  },
  {
    slug: "atta-pinni",
    hindi: "आटा पिन्नी",
    name: "Atta Pinni",
    category: "pinni",
    short: "Hand-pressed winter sweet",
    badge: "Bestseller",
    tagline: "Pressed in the palm, still warm. Dense, nutty, a little crumbly.",
    description:
      "Roasted flour and ghee pressed into rounds by hand — a winter staple in Punjabi homes. (Placeholder description.)",
    enjoyedFor: ["wellness", "bone"],
    ingredients: ["Ingredient list to be confirmed"],
    nutrition: nutritionPlaceholder,
    preparation: "Hand-pressed after roasting. Approximate piece weight and count per pack: TBC.",
    storage: "Keep in a cool, dry place. Shelf life: TBC.",
    variants: ladder(399),
    featured: true,
  },
  {
    slug: "dry-fruit-laddu",
    hindi: "ड्राई फ्रूट लड्डू",
    name: "Dry-Fruit Laddu",
    category: "laddus",
    short: "Fruit and nuts, rolled by hand",
    badge: "Bestseller",
    tagline: "A little round of something sweet, made without shortcuts.",
    description:
      "Dried fruit and nuts bound together and rolled by hand into small rounds — a sweet that doesn’t feel like a compromise. (Placeholder description.)",
    enjoyedFor: ["wellness", "clarity", "immunity"],
    ingredients: ["Ingredient list to be confirmed", "Dates (TBC)", "Nuts — variety TBC"],
    nutrition: nutritionPlaceholder,
    preparation: "Rolled by hand in small batches. Pieces per pack: TBC.",
    storage: "Refrigerate after opening in warm weather. Shelf life: TBC.",
    variants: ladder(499),
    featured: true,
  },
  {
    slug: "seasonal-laddu",
    hindi: "मौसमी लड्डू",
    name: "Seasonal Laddu",
    category: "laddus",
    short: "Small seasonal runs",
    badge: "Limited",
    tagline: "Whatever the season brings in. Small runs, gone quickly.",
    description: "A rotating laddu made with seasonal ingredients. (Placeholder product — recipe and name TBC.)",
    enjoyedFor: ["wellness"],
    ingredients: ["Changes with the season — TBC"],
    nutrition: nutritionPlaceholder,
    preparation: "Rolled by hand in small batches.",
    storage: "Shelf life: TBC.",
    variants: ladder(479, ["out_of_stock", "out_of_stock", "out_of_stock"]),
  },
  {
    slug: "everyday-mix",
    hindi: "रोज़ का मेवा",
    name: "Everyday Mewa Mix",
    category: "mixes",
    short: "Lightly roasted nuts, seeds and fruit",
    tagline: "A handful for the afternoon slump.",
    description:
      "Lightly roasted nuts, seeds and dried fruit, mixed for snacking between meals. (Placeholder description — exact mix TBC.)",
    enjoyedFor: ["clarity", "wellness"],
    ingredients: ["Mix composition to be confirmed"],
    nutrition: nutritionPlaceholder,
    preparation: "Dry-roasted in small batches and mixed by hand.",
    storage: "Keep sealed after opening. Shelf life: TBC.",
    variants: ladder(379),
    featured: true,
  },
  {
    slug: "study-table-mix",
    hindi: "पढ़ाई वाला मेवा",
    name: "Study-Table Mix",
    category: "mixes",
    short: "A crunchier mix for desk snacking",
    badge: "New",
    tagline: "For exam season, long shifts, and late nights.",
    description: "A crunchier mix built for desk snacking. (Placeholder product — composition TBC.)",
    enjoyedFor: ["clarity"],
    ingredients: ["Mix composition to be confirmed"],
    nutrition: nutritionPlaceholder,
    preparation: "Dry-roasted in small batches and mixed by hand.",
    storage: "Keep sealed after opening. Shelf life: TBC.",
    variants: ladder(329, ["low_stock", "in_stock", "in_stock"]),
  },
  {
    slug: "winter-trio",
    hindi: "सर्दी की तिकड़ी",
    kind: "bundle",
    contents: [
      { slug: "classic-panjiri", variant: "500g", qty: 1 },
      { slug: "atta-pinni", variant: "500g", qty: 1 },
      { slug: "everyday-mix", variant: "250g", qty: 1 },
    ],
    name: "Winter Trio Box",
    category: "gift-boxes",
    short: "Panjiri, pinni and mewa in one box",
    badge: "New",
    tagline: "Our three winter staples, packed together for gifting or the family pantry.",
    description:
      "Ghar ki Panjiri (500 g), Atta Pinni (500 g) and Everyday Mewa Mix (250 g) in a gift box with a handwritten note. (Placeholder — box design and price to be confirmed.)",
    enjoyedFor: ["immunity", "wellness"],
    ingredients: ["See each product in the box"],
    nutrition: nutritionPlaceholder,
    preparation: "Each jar is made in its own small batch and packed together on the day of dispatch.",
    storage: "Store each jar in a cool, dry place. Shelf life: TBC.",
    variants: [{ id: "box", label: "1 box · 3 jars", grams: 1250, price: 1649, stock: "in_stock" }],
    featured: true,
  },
  {
    slug: "new-mother-box",
    hindi: "जच्चा उपहार",
    kind: "bundle",
    contents: [
      { slug: "mothers-panjiri", variant: "1kg", qty: 1 },
      { slug: "dry-fruit-laddu", variant: "500g", qty: 1 },
    ],
    name: "New Mother’s Box",
    category: "gift-boxes",
    short: "Jachcha panjiri and dry-fruit laddus",
    tagline: "A box for the weeks after a baby arrives, from the tradition of feeding new mothers.",
    description:
      "Panjiri for New Mothers (1 kg) and Dry-Fruit Laddu (500 g) in a gift box with a card for your message. Always check with a doctor about diet after childbirth. (Placeholder — box design and price to be confirmed.)",
    enjoyedFor: ["postpartum"],
    ingredients: ["See each product in the box"],
    nutrition: nutritionPlaceholder,
    preparation: "Each jar is made in its own small batch and packed together on the day of dispatch.",
    storage: "Store each jar in a cool, dry place. Shelf life: TBC.",
    variants: [{ id: "box", label: "1 box · 2 jars", grams: 1500, price: 2199, stock: "in_stock" }],
  },
];

/**
 * Products that can be bought on a repeat delivery ("Subscribe & save").
 * PLACEHOLDER — the subscription offer, discount and intervals in
 * src/lib/pricing.ts must be confirmed and connected to a billing provider.
 */
export const SUBSCRIBABLE_PRODUCTS = ["classic-panjiri", "atta-pinni", "everyday-mix", "study-table-mix"];

for (const p of products) {
  p.customizable = CUSTOMISABLE_PRODUCTS.includes(p.slug);
  p.subscribable = SUBSCRIBABLE_PRODUCTS.includes(p.slug);
}

/** Words a shopper might search for: names, category, ingredients in the house recipe. */
export function searchText(p: Product): string {
  const f = formulas[p.slug];
  const ing = f ? f.lines.flatMap((l) => l.options.map((o) => `${ingredients[o]?.name} ${ingredients[o]?.local}`)) : [];
  const box = p.contents?.map((c) => getProduct(c.slug)?.name ?? "") ?? [];
  return [p.name, p.hindi, p.short, p.tagline, p.category, getCategory(p.category)?.name, ...ing, ...box].join(" ").toLowerCase();
}

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function productsIn(category: string): Product[] {
  return products.filter((p) => p.category === category);
}

export function fromPrice(p: Product): number {
  return Math.min(...p.variants.map((v) => v.price));
}

export function isSoldOut(p: Product): boolean {
  return p.variants.every((v) => v.stock === "out_of_stock");
}

export const stockLabel: Record<StockStatus, string> = {
  in_stock: "In stock",
  low_stock: "Only a few left",
  out_of_stock: "Sold out",
};
