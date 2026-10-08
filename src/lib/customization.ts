/**
 * Custom-batch formulation model. Pure and dependency-free so it can be
 * unit-tested with `node --test`.
 *
 * A formula lists ingredient amounts in grams per FORMULA_BASIS (500 g) of
 * finished batch. Exactly one line is the `fill` line: it is never set
 * directly and always takes up whatever weight remains, so the batch total
 * stays fixed. Additions are therefore limited by the fill line's minimum.
 */
export const MIN_CUSTOM_GRAMS = 500;
export const FORMULA_BASIS = 500;

export type FormulaLine = {
  key: string;
  /** "base" lines are required and can't be removed; "addition" lines can go to 0. */
  role: "base" | "addition";
  /** Ingredient ids; the first is the house choice. More than one means it can be swapped. */
  options: string[];
  /** House amount in grams per 500 g (ignored for the fill line). */
  grams: number;
  min: number;
  max: number;
  step: number;
  fill?: boolean;
};

export type Formula = { lines: FormulaLine[] };

/** Only differences from the house recipe are stored (see `normalize`). */
export type Customization = {
  amounts: Record<string, number>;
  picks: Record<string, string>;
  note: string;
};

export const EMPTY_CUSTOMIZATION: Customization = { amounts: {}, picks: {}, note: "" };

export function lineGrams(packGrams: number, qty: number): number {
  return packGrams * qty;
}

export function canCustomize(packGrams: number, qty: number): boolean {
  return lineGrams(packGrams, qty) >= MIN_CUSTOM_GRAMS;
}

/** Smallest quantity of a pack size that reaches the custom-batch minimum. */
export function minQtyForCustom(packGrams: number): number {
  return Math.max(1, Math.ceil(MIN_CUSTOM_GRAMS / packGrams));
}

const tidy = (n: number) => Math.round(n * 100) / 100;
const snap = (n: number, step: number) => tidy(Math.round(n / step) * step);

function line(f: Formula, key: string): FormulaLine {
  const l = f.lines.find((x) => x.key === key);
  if (!l) throw new Error(`Unknown formula line: ${key}`);
  return l;
}

export function fillLine(f: Formula): FormulaLine {
  const l = f.lines.find((x) => x.fill);
  if (!l) throw new Error("Formula needs exactly one fill line");
  return l;
}

function setAmountRaw(f: Formula, c: Customization, key: string): number {
  const l = line(f, key);
  return c.amounts[key] ?? l.grams;
}

/** Grams per 500 g for a line, including the computed fill line. */
export function gramsOf(f: Formula, c: Customization, key: string): number {
  const l = line(f, key);
  if (!l.fill) return setAmountRaw(f, c, key);
  const others = f.lines.filter((x) => !x.fill).reduce((n, x) => n + setAmountRaw(f, c, x.key), 0);
  return tidy(FORMULA_BASIS - others);
}

export function pickOf(f: Formula, c: Customization, key: string): string {
  const l = line(f, key);
  const p = c.picks[key];
  return p && l.options.includes(p) ? p : l.options[0];
}

/** Highest amount a line can reach right now, respecting its max and the fill minimum. */
export function maxFor(f: Formula, c: Customization, key: string): number {
  const l = line(f, key);
  if (l.fill) return gramsOf(f, c, key);
  const fill = fillLine(f);
  const headroom = gramsOf(f, c, fill.key) - fill.min;
  const cap = gramsOf(f, c, key) + Math.max(0, headroom);
  return tidy(Math.min(l.max, Math.floor(cap / l.step) * l.step));
}

export type Limit = "min" | "max" | "fill" | null;

/** Sets a line's amount, clamped to its limits. Reports which limit applied, if any. */
export function setAmount(f: Formula, c: Customization, key: string, target: number): { custom: Customization; applied: number; limited: Limit } {
  const l = line(f, key);
  if (l.fill) return { custom: c, applied: gramsOf(f, c, key), limited: "fill" };
  const wanted = snap(target, l.step);
  const hardMax = Math.min(l.max, maxFor(f, c, key));
  let applied = wanted;
  let limited: Limit = null;
  if (wanted < l.min) {
    applied = l.min;
    limited = "min";
  } else if (wanted > hardMax) {
    applied = hardMax;
    limited = hardMax < l.max ? "fill" : "max";
  }
  return { custom: normalize(f, { ...c, amounts: { ...c.amounts, [key]: applied } }), applied, limited };
}

export function setPick(f: Formula, c: Customization, key: string, pick: string): Customization {
  return normalize(f, { ...c, picks: { ...c.picks, [key]: pick } });
}

/** Drops values equal to the house recipe, unknown keys and the fill line. */
export function normalize(f: Formula, c: Customization): Customization {
  const amounts: Record<string, number> = {};
  const picks: Record<string, string> = {};
  for (const l of f.lines) {
    const a = c.amounts[l.key];
    if (!l.fill && a !== undefined && a !== l.grams) amounts[l.key] = a;
    const p = c.picks[l.key];
    if (p && p !== l.options[0] && l.options.includes(p)) picks[l.key] = p;
  }
  return { amounts, picks, note: c.note.trim() };
}

export function isCustomized(c: Customization | undefined | null): c is Customization {
  if (!c) return false;
  return Object.keys(c.amounts).length > 0 || Object.keys(c.picks).length > 0 || c.note.trim() !== "";
}

/** Stable signature so identical formulations merge into one cart line. */
export function customizationSignature(c: Customization | undefined | null): string {
  if (!isCustomized(c)) return "std";
  const pairs = (o: Record<string, unknown>) =>
    Object.keys(o)
      .sort()
      .map((k) => `${k}=${o[k]}`)
      .join(",");
  return `a:${pairs(c.amounts)}|p:${pairs(c.picks)}|n:${c.note.trim()}`;
}

export type ResolvedRow = {
  key: string;
  role: FormulaLine["role"];
  fill: boolean;
  pick: string;
  grams: number;
  houseGrams: number;
  housePick: string;
  share: number;
};

export function resolveFormula(f: Formula, c: Customization): ResolvedRow[] {
  const houseFill = gramsOf(f, EMPTY_CUSTOMIZATION, fillLine(f).key);
  return f.lines.map((l) => {
    const grams = gramsOf(f, c, l.key);
    return {
      key: l.key,
      role: l.role,
      fill: !!l.fill,
      pick: pickOf(f, c, l.key),
      grams,
      houseGrams: l.fill ? houseFill : l.grams,
      housePick: l.options[0],
      share: grams / FORMULA_BASIS,
    };
  });
}

/**
 * Surcharge per 500 g: premium amounts above the house recipe, plus any
 * pricier swap, charged at ingredient cost and rounded up to ₹5. Removing or
 * reducing ingredients never lowers the price.
 */
export function surchargePer500(f: Formula, c: Customization, pricePer100g: Record<string, number>): number {
  let total = 0;
  for (const r of resolveFormula(f, c)) {
    if (r.fill) continue;
    const price = (id: string) => pricePer100g[id] ?? 0;
    total += (Math.max(0, r.grams - r.houseGrams) * price(r.pick)) / 100;
    if (r.pick !== r.housePick) total += (Math.max(0, price(r.pick) - price(r.housePick)) * Math.min(r.grams, r.houseGrams)) / 100;
  }
  return total <= 0 ? 0 : Math.ceil(total / 5) * 5;
}

export function packSurcharge(f: Formula, c: Customization, pricePer100g: Record<string, number>, packGrams: number): number {
  return Math.round(surchargePer500(f, c, pricePer100g) * (packGrams / FORMULA_BASIS));
}
