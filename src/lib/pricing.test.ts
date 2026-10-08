import { test } from "node:test";
import assert from "node:assert/strict";
import { applyCoupon, stateFromPincode, subscriptionPrice, unitPriceFor } from "./pricing.ts";

test("subscription price applies the configured discount", () => {
  assert.equal(subscriptionPrice(349), 314);
  assert.equal(unitPriceFor(349), 349);
  assert.equal(unitPriceFor(349, { every: 4 }), 314);
});

test("coupons validate code and minimum order", () => {
  assert.equal(applyCoupon("", 1000).ok, false);
  assert.equal(applyCoupon("nope", 1000).ok, false);
  assert.equal(applyCoupon("welcome10", 300).ok, false);
  const r = applyCoupon(" welcome10 ", 1000);
  assert.ok(r.ok && r.discount === 100 && r.code === "WELCOME10");
});

test("PIN code suggests a state", () => {
  assert.equal(stateFromPincode("141002"), "Punjab");
  assert.equal(stateFromPincode("110001"), "Delhi");
  assert.equal(stateFromPincode("160017"), "Chandigarh");
  assert.equal(stateFromPincode("560001"), "Karnataka");
  assert.equal(stateFromPincode("248001"), "Uttarakhand");
  assert.equal(stateFromPincode("12345"), undefined);
});
