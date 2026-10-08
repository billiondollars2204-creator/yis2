export const site = {
  name: "Immunitywize",
  tagline: "Homemade Indian snacks, slow-roasted in small batches",
  description:
    "Immunitywize makes panjiri, pinni, dry-fruit laddus and dry-fruit mixes by hand, in small batches, from family recipes.",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, ""),
  // PLACEHOLDER contact details — replace before launch.
  email: "hello@example.com",
  phone: "+91 00000 00000",
  whatsapp: "+91 00000 00000",
  city: "Your city, India",
  locale: "en_IN",
};

export const showPlaceholderMarkers = process.env.NEXT_PUBLIC_SHOW_PLACEHOLDER_MARKERS !== "false";

export const nav = [
  { href: "/customise", label: "Custom batches" },
  { href: "/our-story", label: "Our story" },
  { href: "/support", label: "Help" },
];

/** Confirm these business-owned disclosures before accepting real orders. */
export const business = {
  legalName: "",
  registeredAddress: "",
  customerEmail: "",
  customerPhone: "",
  fssaiNumber: "",
  gstin: "",
  grievanceName: "",
  grievanceDesignation: "",
  grievanceEmail: "",
  grievancePhone: "",
};
