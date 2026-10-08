import type { Formula, FormulaLine } from "@/lib/customization";

/**
 * Which products can be ordered as a custom batch. Add or remove product
 * slugs here; everything else (badges, filters, product pages, builder routes)
 * follows from this list.
 */
export const CUSTOMISABLE_PRODUCTS = ["classic-panjiri", "mothers-panjiri", "atta-pinni", "everyday-mix"];

/**
 * House recipes in grams per 500 g of finished batch, with the limits a
 * customer can adjust within.
 * PLACEHOLDER — kitchen to confirm every amount, limit and step. These are a
 * starting point for the interface, not production formulas.
 */
export type ProductFormula = Formula & { summary: string };

const L = (key: string, role: FormulaLine["role"], options: string[], grams: number, min: number, max: number, step: number, fill = false): FormulaLine => ({
  key,
  role,
  options,
  grams,
  min,
  max,
  step,
  fill,
});

const panjiriAdditions = [
  L("almond", "addition", ["almond"], 20, 0, 60, 5),
  L("cashew", "addition", ["cashew"], 15, 0, 50, 5),
  L("pistachio", "addition", ["pistachio"], 5, 0, 30, 5),
  L("walnut", "addition", ["walnut"], 0, 0, 40, 5),
  L("raisin", "addition", ["raisin"], 10, 0, 40, 5),
  L("makhana", "addition", ["makhana"], 10, 0, 30, 5),
  L("gond", "addition", ["gond"], 5, 0, 25, 5),
  L("magaz", "addition", ["magaz"], 5, 0, 20, 5),
  L("coconut", "addition", ["coconut"], 0, 0, 30, 5),
  L("cardamom", "addition", ["cardamom"], 2, 0, 6, 1),
  L("saffron", "addition", ["saffron"], 0, 0, 1, 0.5),
];

export const formulas: Record<string, ProductFormula> = {
  "classic-panjiri": {
    summary: "Roasted atta, desi ghee and jaggery, with nuts, makhana and cardamom.",
    lines: [
      L("flour", "base", ["atta", "suji"], 0, 220, 500, 5, true),
      L("ghee", "base", ["ghee"], 100, 80, 130, 5),
      L("sweetener", "base", ["jaggery", "khand", "sugar"], 80, 50, 110, 5),
      ...panjiriAdditions,
    ],
  },
  "mothers-panjiri": {
    summary: "A richer panjiri with more ghee, gond, magaz and dry ginger.",
    lines: [
      L("flour", "base", ["atta"], 0, 200, 500, 5, true),
      L("ghee", "base", ["ghee"], 115, 90, 150, 5),
      L("sweetener", "base", ["jaggery", "khand"], 75, 50, 100, 5),
      L("almond", "addition", ["almond"], 30, 0, 60, 5),
      L("cashew", "addition", ["cashew"], 15, 0, 40, 5),
      L("walnut", "addition", ["walnut"], 10, 0, 40, 5),
      L("gond", "addition", ["gond"], 20, 0, 35, 5),
      L("magaz", "addition", ["magaz"], 10, 0, 25, 5),
      L("makhana", "addition", ["makhana"], 10, 0, 30, 5),
      L("coconut", "addition", ["coconut"], 5, 0, 30, 5),
      L("saunth", "addition", ["saunth"], 3, 0, 6, 1),
      L("ajwain", "addition", ["ajwain"], 1, 0, 3, 1),
      L("cardamom", "addition", ["cardamom"], 2, 0, 6, 1),
    ],
  },
  "atta-pinni": {
    summary: "Roasted atta pressed with ghee and khand, with almonds and cardamom.",
    lines: [
      L("flour", "base", ["atta"], 0, 220, 500, 5, true),
      L("ghee", "base", ["ghee"], 115, 95, 140, 5),
      L("sweetener", "base", ["khand", "jaggery", "sugar"], 100, 70, 130, 5),
      L("almond", "addition", ["almond"], 25, 0, 60, 5),
      L("cashew", "addition", ["cashew"], 10, 0, 40, 5),
      L("walnut", "addition", ["walnut"], 0, 0, 40, 5),
      L("magaz", "addition", ["magaz"], 5, 0, 20, 5),
      L("gond", "addition", ["gond"], 0, 0, 20, 5),
      L("raisin", "addition", ["raisin"], 0, 0, 30, 5),
      L("cardamom", "addition", ["cardamom"], 2, 0, 6, 1),
    ],
  },
  "everyday-mix": {
    summary: "Almonds and cashews with raisins and pumpkin seeds, lightly roasted.",
    lines: [
      L("almond", "base", ["almond"], 0, 125, 500, 5, true),
      L("cashew", "base", ["cashew"], 125, 75, 200, 5),
      L("raisin", "addition", ["raisin"], 100, 0, 150, 5),
      L("pumpkin", "addition", ["pumpkin"], 75, 0, 125, 5),
      L("walnut", "addition", ["walnut"], 0, 0, 125, 5),
      L("pistachio", "addition", ["pistachio"], 0, 0, 75, 5),
      L("fig", "addition", ["fig"], 0, 0, 100, 5),
      L("makhana", "addition", ["makhana"], 0, 0, 75, 5),
      L("flax", "addition", ["flax"], 0, 0, 50, 5),
    ],
  },
};

/** What to call one custom order of each category, e.g. "Customise this pinni". */
export const customNoun: Record<string, string> = { panjiri: "panjiri", pinni: "pinni", laddus: "laddu", mixes: "mix" };

export function getFormula(slug: string): ProductFormula | undefined {
  return CUSTOMISABLE_PRODUCTS.includes(slug) ? formulas[slug] : undefined;
}
