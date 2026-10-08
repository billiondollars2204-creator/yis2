/** Checkout validation. Pure functions so they can be unit-tested. */
export type CheckoutValues = {
  email: string;
  phone: string;
  fullName: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  pincode: string;
  shipping: string;
  payment: string;
  notes: string;
};

export type CheckoutErrors = Partial<Record<keyof CheckoutValues, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
// Indian mobile numbers: 10 digits starting 6–9, optional +91 / 0 prefix.
const PHONE = /^(?:\+?91[-]?|0)?[6-9]\d{9}$/;
const PINCODE = /^[1-9]\d{5}$/;

export function validateField(name: keyof CheckoutValues, raw: string): string | undefined {
  const v = raw.trim();
  switch (name) {
    case "email":
      if (!v) return "Enter your email address.";
      if (!EMAIL.test(v)) return "That email doesn’t look right — check for a typo.";
      return;
    case "phone":
      if (!v) return "Enter a mobile number.";
      if (!PHONE.test(v.replace(/\s/g, ""))) return "Enter a 10-digit Indian mobile number.";
      return;
    case "fullName":
      if (v.length < 2) return "Enter the name for delivery.";
      return;
    case "address1":
      if (v.length < 5) return "Enter your house number and street.";
      return;
    case "city":
      if (!v) return "Enter your city or town.";
      return;
    case "state":
      if (!v) return "Choose your state or union territory.";
      return;
    case "pincode":
      if (!PINCODE.test(v)) return "Enter a 6-digit PIN code.";
      return;
    case "shipping":
      if (!v) return "Choose a delivery option.";
      return;
    case "payment":
      if (!v) return "Choose how you’d like to pay.";
      return;
    case "notes":
      if (v.length > 300) return "Keep delivery notes under 300 characters.";
      return;
    default:
      return;
  }
}

export function validateCheckout(values: CheckoutValues): CheckoutErrors {
  const errors: CheckoutErrors = {};
  (Object.keys(values) as (keyof CheckoutValues)[]).forEach((k) => {
    const e = validateField(k, values[k]);
    if (e) errors[k] = e;
  });
  return errors;
}
