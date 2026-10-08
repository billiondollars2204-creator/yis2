import { getFormula } from "@/data/formulations";
import { ingredients } from "@/data/ingredients";
import { resolveFormula, type Customization } from "./customization";
import { formatGrams } from "./units";

export type ChangeRow = { key: string; label: string; detail: string; kind: "more" | "less" | "added" | "removed" | "swapped" };

/** Human-readable differences from the house recipe, per 500 g. */
export function describeChanges(slug: string, c: Customization): ChangeRow[] {
  const f = getFormula(slug);
  if (!f) return [];
  const rows: ChangeRow[] = [];
  for (const r of resolveFormula(f, c)) {
    if (r.fill) continue;
    const name = ingredients[r.pick]?.name ?? r.pick;
    if (r.pick !== r.housePick) {
      rows.push({ key: `${r.key}-pick`, label: name, detail: `instead of ${ingredients[r.housePick]?.name.toLowerCase() ?? r.housePick}`, kind: "swapped" });
    }
    if (r.grams === r.houseGrams) continue;
    if (r.grams === 0) rows.push({ key: r.key, label: name, detail: "left out", kind: "removed" });
    else if (r.houseGrams === 0) rows.push({ key: r.key, label: name, detail: `added · ${formatGrams(r.grams)}`, kind: "added" });
    else rows.push({ key: r.key, label: name, detail: `${formatGrams(r.grams)} (house ${formatGrams(r.houseGrams)})`, kind: r.grams > r.houseGrams ? "more" : "less" });
  }
  return rows;
}

export function batchLabel(packGrams: number, qty: number): string {
  const total = formatGrams(packGrams * qty);
  return qty > 1 ? `${total} (${qty} × ${formatGrams(packGrams)})` : total;
}
