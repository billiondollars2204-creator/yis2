import { test } from "node:test";
import assert from "node:assert/strict";
import { CUSTOMISABLE_PRODUCTS, formulas } from "../data/formulations.ts";
import { ingredients } from "../data/ingredients.ts";
import { EMPTY_CUSTOMIZATION, gramsOf, resolveFormula } from "./customization.ts";

test("every customisable product has a valid house formula", () => {
  for (const slug of CUSTOMISABLE_PRODUCTS) {
    const f = formulas[slug];
    assert.ok(f, `missing formula for ${slug}`);
    const fills = f.lines.filter((l) => l.fill);
    assert.equal(fills.length, 1, `${slug} needs one fill line`);
    const fill = gramsOf(f, EMPTY_CUSTOMIZATION, fills[0].key);
    assert.ok(fill >= fills[0].min, `${slug}: house fill ${fill} g is below its minimum`);
    const total = resolveFormula(f, EMPTY_CUSTOMIZATION).reduce((n, r) => n + r.grams, 0);
    assert.equal(Math.round(total), 500);
    for (const l of f.lines) {
      for (const id of l.options) assert.ok(ingredients[id], `${slug}: unknown ingredient ${id}`);
      if (!l.fill) assert.ok(l.grams >= l.min && l.grams <= l.max, `${slug}/${l.key}: house amount outside limits`);
      if (l.role === "base" && !l.fill) assert.ok(l.min > 0, `${slug}/${l.key}: base lines can't be removable`);
    }
  }
});
