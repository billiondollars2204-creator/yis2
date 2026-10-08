import type { BenefitSlug } from "./products";

/**
 * Benefit copy describes how these foods are traditionally enjoyed.
 * PLACEHOLDER: all wording must be reviewed for regulatory compliance
 * (e.g. FSSAI advertising rules) before launch. No medical claims.
 */
export const benefits: { slug: BenefitSlug; title: string; occasion: string; hindi: string; line: string }[] = [
  { slug: "immunity", title: "Immunity", occasion: "Winter mornings", hindi: "सर्दी", line: "Winter foods families reach for when the weather turns." },
  { slug: "postpartum", title: "Postpartum care", occasion: "New mothers", hindi: "जच्चा", line: "From the tradition of nourishing mothers after a baby arrives." },
  { slug: "clarity", title: "Mental clarity", occasion: "Exam season", hindi: "पढ़ाई", line: "A handful at the desk instead of something from a packet." },
  { slug: "wellness", title: "Everyday wellness", occasion: "Long workdays", hindi: "रोज़", line: "Real food for steady energy between meals." },
  { slug: "bone", title: "Bone health", occasion: "Growing kids", hindi: "बच्चे", line: "Foods long given to growing children and grandparents." },
];

export const benefitTitle = Object.fromEntries(benefits.map((b) => [b.slug, b.title])) as Record<BenefitSlug, string>;

export const faqs: { group: string; items: { q: string; a: string }[] }[] = [
  {
    group: "About the food",
    items: [
      {
        q: "Is everything really made at home?",
        a: "Yes — every batch is prepared by hand in our home kitchen, in small quantities. (Placeholder: add kitchen location, licence details and team.)",
      },
      {
        q: "Do you use preservatives or artificial additives?",
        a: "Our recipes are built around simple pantry ingredients. Placeholder: confirm the exact wording once ingredient lists and lab testing are finalised.",
      },
      {
        q: "How long does it stay fresh?",
        a: "Shelf life depends on the product and is printed on every pack. Placeholder: add per-product shelf life.",
      },
      {
        q: "I have a nut allergy. Is it safe for me?",
        a: "Our kitchen handles nuts every day, so we can’t guarantee any product is free from traces. Please contact us before ordering. (Placeholder: confirm allergen policy.)",
      },
    ],
  },
  {
    group: "Customising",
    items: [
      {
        q: "Which products can I customise?",
        a: "Panjiri, pinni and our dry-fruit mix can be made as custom batches. You start from our house recipe and adjust each ingredient by the gram, within limits set by the kitchen, then review the full recipe and price before adding it to your cart. Other products are made to the house recipe only.",
      },
      {
        q: "Why is there a 500 g minimum for custom orders?",
        a: "Every custom order is a separate batch cooked just for you. Below 500 g a batch doesn’t roast evenly, so we keep smaller orders to our standard recipes.",
      },
      {
        q: "Do custom orders take longer?",
        a: "Usually a little — placeholder: add expected extra preparation time.",
      },
    ],
  },
  {
    group: "Orders & delivery",
    items: [
      {
        q: "Where do you deliver?",
        a: "Placeholder: list serviceable regions and PIN code coverage once the shipping partner is confirmed.",
      },
      {
        q: "How do I track my order?",
        a: "You’ll get tracking details by email and SMS once your order ships. (Placeholder: wire up shipping notifications.)",
      },
      {
        q: "Can I cancel or change an order?",
        a: "Contact us as soon as possible. Standard orders can usually be changed before they’re packed; custom batches can’t be changed once cooking starts. (Placeholder policy.)",
      },
    ],
  },
];

export const indianStates = [
  "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chandigarh",
  "Chhattisgarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Goa", "Gujarat", "Haryana",
  "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka", "Kerala", "Ladakh", "Lakshadweep",
  "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Puducherry",
  "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand",
  "West Bengal",
];
