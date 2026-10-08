import { test } from "node:test";
import assert from "node:assert/strict";
import {
  canCustomize,
  customizationSignature,
  EMPTY_CUSTOMIZATION,
  gramsOf,
  isCustomized,
  maxFor,
  minQtyForCustom,
  normalize,
  packSurcharge,
  resolveFormula,
  setAmount,
  setPick,
  surchargePer500,
  type Formula,
} from "./customization.ts";

const f: Formula = {
  lines: [
    { key: "flour", role: "base", options: ["atta"], grams: 0, min: 250, max: 500, step: 10, fill: true },
    { key: "ghee", role: "base", options: ["ghee"], grams: 100, min: 80, max: 130, step: 10 },
    { key: "sweetener", role: "base", options: ["jaggery", "khand"], grams: 50, min: 40, max: 80, step: 10 },
    { key: "almond", role: "addition", options: ["almond"], grams: 20, min: 0, max: 60, step: 10 },
    { key: "raisin", role: "addition", options: ["raisin"], grams: 0, min: 0, max: 40, step: 10 },
  ],
};
const prices = { atta: 6, ghee: 60, jaggery: 10, khand: 20, almond: 90, raisin: 40 };
const E = EMPTY_CUSTOMIZATION;

test("the 500 g rule applies to total line weight", () => {
  assert.equal(canCustomize(250, 1), false);
  assert.equal(canCustomize(250, 2), true);
  assert.equal(canCustomize(1000, 1), true);
  assert.equal(minQtyForCustom(250), 2);
  assert.equal(minQtyForCustom(500), 1);
});

test("the fill line takes the remaining weight so the batch stays at 500 g", () => {
  assert.equal(gramsOf(f, E, "flour"), 330);
  const { custom } = setAmount(f, E, "almond", 40);
  assert.equal(gramsOf(f, custom, "flour"), 310);
  const total = resolveFormula(f, custom).reduce((n, r) => n + r.grams, 0);
  assert.equal(total, 500);
});

test("amounts clamp to min, max and step", () => {
  assert.equal(setAmount(f, E, "almond", 999).limited, "max");
  assert.equal(setAmount(f, E, "almond", 66).applied, 60);
  assert.equal(setAmount(f, E, "almond", 66).limited, "max");
  assert.equal(setAmount(f, E, "ghee", 10).applied, 80);
  assert.equal(setAmount(f, E, "ghee", 10).limited, "min");
  assert.equal(setAmount(f, E, "almond", 26).applied, 30);
});

test("additions are capped so the fill line keeps its minimum", () => {
  let c = setAmount(f, E, "almond", 60).custom;
  c = setAmount(f, c, "raisin", 40).custom;
  assert.equal(gramsOf(f, c, "flour"), 250);
  assert.equal(maxFor(f, c, "ghee"), 100);
  const r = setAmount(f, c, "ghee", 120);
  assert.equal(r.applied, 100);
  assert.equal(r.limited, "fill");
});

test("normalize keeps only differences from the house recipe", () => {
  const c = normalize(f, { amounts: { almond: 20, raisin: 10, flour: 1 }, picks: { sweetener: "jaggery" }, note: "  " });
  assert.deepEqual(c, { amounts: { raisin: 10 }, picks: {}, note: "" });
  assert.equal(isCustomized(normalize(f, { amounts: { almond: 20 }, picks: {}, note: "" })), false);
});

test("signature ignores key order", () => {
  assert.equal(customizationSignature(E), "std");
  const a = customizationSignature({ amounts: { a: 1, b: 2 }, picks: {}, note: "" });
  const b = customizationSignature({ amounts: { b: 2, a: 1 }, picks: {}, note: "" });
  assert.equal(a, b);
});

test("surcharge charges only premium increases and pricier swaps", () => {
  assert.equal(surchargePer500(f, E, prices), 0);
  assert.equal(surchargePer500(f, setAmount(f, E, "almond", 0).custom, prices), 0);
  // +20 g almonds at ₹90/100 g = ₹18 → ₹20
  assert.equal(surchargePer500(f, setAmount(f, E, "almond", 40).custom, prices), 20);
  // khand swap: (20 − 10) × 50 g / 100 = ₹5
  assert.equal(surchargePer500(f, setPick(f, E, "sweetener", "khand"), prices), 5);
  assert.equal(packSurcharge(f, setAmount(f, E, "almond", 40).custom, prices, 1000), 40);
});
