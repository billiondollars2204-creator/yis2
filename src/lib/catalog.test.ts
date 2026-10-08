import { test } from "node:test";
import assert from "node:assert/strict";
import { filterProducts } from "./catalog.ts";
import type { Product } from "../data/products.ts";

const v = (price: number, stock = "in_stock") => ({ id: "x", label: "x", grams: 250, price, stock });
const list = [
  { slug: "a", name: "Ghar ki Panjiri", short: "", tagline: "", category: "panjiri", enjoyedFor: ["immunity"], variants: [v(349)], customizable: true },
  { slug: "b", name: "Atta Pinni", short: "", tagline: "", category: "pinni", enjoyedFor: ["bone"], variants: [v(399)], featured: true },
  { slug: "c", name: "Seasonal Laddu", short: "", tagline: "", category: "laddus", enjoyedFor: ["wellness"], variants: [v(100, "out_of_stock")] },
  { slug: "d", name: "Mewa Mix", short: "", tagline: "", category: "mixes", enjoyedFor: ["clarity"], variants: [v(299)] },
] as unknown as Product[];

const slugs = (ps: Product[]) => ps.map((p) => p.slug);

test("filters by category, need, custom and stock", () => {
  assert.deepEqual(slugs(filterProducts(list, { category: "pinni" })), ["b"]);
  assert.deepEqual(slugs(filterProducts(list, { need: "immunity" })), ["a"]);
  assert.deepEqual(slugs(filterProducts(list, { custom: true })), ["a"]);
  assert.ok(!slugs(filterProducts(list, { inStock: true })).includes("c"));
});

test("search matches all terms, case-insensitively", () => {
  assert.deepEqual(slugs(filterProducts(list, { q: "PANJIRI ghar" })), ["a"]);
  assert.deepEqual(slugs(filterProducts(list, { q: "nothing" })), []);
});

test("sorting keeps sold-out items last", () => {
  assert.deepEqual(slugs(filterProducts(list, { sort: "price-asc" })), ["d", "a", "b", "c"]);
  assert.deepEqual(slugs(filterProducts(list, { sort: "featured" })), ["b", "a", "d", "c"]);
});

test("price bands match any size in range", () => {
  assert.deepEqual(slugs(filterProducts(list, { price: "under-500" })).sort(), ["a", "b", "c", "d"]);
  assert.deepEqual(slugs(filterProducts(list, { price: "over-1000" })), []);
});
