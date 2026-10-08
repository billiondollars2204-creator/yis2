import { test } from "node:test";
import assert from "node:assert/strict";
import { validateCheckout, validateField, type CheckoutValues } from "./validation.ts";

const valid: CheckoutValues = {
  email: "asha@example.com",
  phone: "+91 98765 43210",
  fullName: "Asha Kaur",
  address1: "12 Model Town",
  address2: "",
  city: "Ludhiana",
  state: "Punjab",
  pincode: "141002",
  shipping: "standard",
  payment: "online",
  notes: "",
};

test("valid checkout has no errors", () => {
  assert.deepEqual(validateCheckout(valid), {});
});

test("field rules", () => {
  assert.ok(validateField("email", "asha@"));
  assert.ok(validateField("phone", "12345"));
  assert.equal(validateField("phone", "9876543210"), undefined);
  assert.ok(validateField("pincode", "01234"));
  assert.ok(validateField("pincode", "12345"));
  assert.equal(validateField("address2", ""), undefined);
});

test("missing required fields are reported", () => {
  const errors = validateCheckout({ ...valid, email: "", state: "", pincode: "" });
  assert.deepEqual(Object.keys(errors).sort(), ["email", "pincode", "state"]);
});
