/**
 * Ingredient library for custom batches.
 * PLACEHOLDER — kitchen to confirm: which ingredients are offered, the
 * descriptions and the per-100 g prices used for surcharges. Allergen tags are
 * general facts about the ingredient itself; cross-contact must be confirmed.
 */
export type IngredientCategory = "flour" | "fat" | "sweetener" | "nuts" | "dried-fruit" | "seeds" | "spices";
export type Allergen = "Gluten" | "Milk" | "Tree nuts";

export type Ingredient = {
  id: string;
  name: string;
  local: string;
  /** One line on what it brings to the batch. */
  description: string;
  /** How it's prepared before it goes in. */
  prep: string;
  category: IngredientCategory;
  /** Swatch colour used until the ingredient photo exists. */
  tone: string;
  pricePer100g: number;
  allergen?: Allergen;
};

export const categoryLabel: Record<IngredientCategory, string> = {
  flour: "Flour",
  fat: "Fat",
  sweetener: "Sweetener",
  nuts: "Nuts",
  "dried-fruit": "Dried fruit",
  seeds: "Seeds & traditional extras",
  spices: "Spices",
};

const list: Ingredient[] = [
  { id: "atta", name: "Wholewheat flour", local: "Atta", description: "The body of the batch. Nutty once roasted.", prep: "Slow-roasted in ghee", category: "flour", tone: "#C99A5B", pricePer100g: 6, allergen: "Gluten" },
  { id: "suji", name: "Semolina", local: "Suji", description: "Adds a light, grainy bite.", prep: "Roasted until pale gold", category: "flour", tone: "#E2C489", pricePer100g: 7, allergen: "Gluten" },
  { id: "ghee", name: "Desi ghee", local: "Ghee", description: "Carries the flavour and binds the crumb.", prep: "Melted, roasted with the flour", category: "fat", tone: "#E9C46A", pricePer100g: 65, allergen: "Milk" },
  { id: "jaggery", name: "Jaggery", local: "Gur", description: "Earthy, with caramel notes.", prep: "Powdered", category: "sweetener", tone: "#9A5B2E", pricePer100g: 10 },
  { id: "khand", name: "Unrefined cane sugar", local: "Khand", description: "Clean sweetness, lighter colour.", prep: "Ground fine", category: "sweetener", tone: "#D8B67E", pricePer100g: 14 },
  { id: "sugar", name: "Sugar", local: "Cheeni", description: "Familiar and neutral.", prep: "Ground to boora", category: "sweetener", tone: "#F1EBDD", pricePer100g: 5 },
  { id: "almond", name: "Almonds", local: "Badam", description: "Crunch and a toasted, buttery note.", prep: "Sliced, lightly toasted", category: "nuts", tone: "#B07444", pricePer100g: 90, allergen: "Tree nuts" },
  { id: "cashew", name: "Cashews", local: "Kaju", description: "Soft, creamy bite.", prep: "Halved, roasted in ghee", category: "nuts", tone: "#E7D2A8", pricePer100g: 100, allergen: "Tree nuts" },
  { id: "pistachio", name: "Pistachios", local: "Pista", description: "Bright colour, delicate flavour.", prep: "Slivered", category: "nuts", tone: "#93A75A", pricePer100g: 220, allergen: "Tree nuts" },
  { id: "walnut", name: "Walnuts", local: "Akhrot", description: "Rich, slightly bitter depth.", prep: "Broken by hand", category: "nuts", tone: "#8E5E3B", pricePer100g: 120, allergen: "Tree nuts" },
  { id: "raisin", name: "Raisins", local: "Kishmish", description: "Small bursts of sweetness.", prep: "Washed and dried", category: "dried-fruit", tone: "#5B2A2C", pricePer100g: 40 },
  { id: "fig", name: "Figs", local: "Anjeer", description: "Chewy and jammy.", prep: "Chopped", category: "dried-fruit", tone: "#7A4A31", pricePer100g: 120 },
  { id: "makhana", name: "Fox nuts", local: "Makhana", description: "Light, airy crunch.", prep: "Roasted in ghee, crushed", category: "seeds", tone: "#EFE7D6", pricePer100g: 120 },
  { id: "gond", name: "Edible gum", local: "Gond", description: "A traditional winter addition.", prep: "Fried until it puffs", category: "seeds", tone: "#D9AF63", pricePer100g: 80 },
  { id: "magaz", name: "Melon seeds", local: "Magaz", description: "Tiny and creamy.", prep: "Lightly roasted", category: "seeds", tone: "#EEE6D2", pricePer100g: 150 },
  { id: "pumpkin", name: "Pumpkin seeds", local: "Kaddu beej", description: "Green, crisp and savoury.", prep: "Dry-roasted", category: "seeds", tone: "#62804A", pricePer100g: 90 },
  { id: "flax", name: "Flax seeds", local: "Alsi", description: "Nutty, adds texture.", prep: "Roasted, ground coarse", category: "seeds", tone: "#6A4228", pricePer100g: 25 },
  { id: "coconut", name: "Dry coconut", local: "Nariyal", description: "Soft sweetness, fine texture.", prep: "Finely shredded", category: "seeds", tone: "#F4EEE2", pricePer100g: 40 },
  { id: "cardamom", name: "Green cardamom", local: "Elaichi", description: "Floral warmth.", prep: "Freshly pounded", category: "spices", tone: "#7F9558", pricePer100g: 400 },
  { id: "saunth", name: "Dry ginger", local: "Saunth", description: "Gentle, peppery heat.", prep: "Ground", category: "spices", tone: "#C9A877", pricePer100g: 100 },
  { id: "ajwain", name: "Carom seeds", local: "Ajwain", description: "Sharp and aromatic. A little goes far.", prep: "Toasted", category: "spices", tone: "#7D6242", pricePer100g: 60 },
  { id: "saffron", name: "Saffron", local: "Kesar", description: "Colour and a honeyed aroma.", prep: "Bloomed in warm milk", category: "spices", tone: "#B4321B", pricePer100g: 30000 },
];

export const ingredients: Record<string, Ingredient> = Object.fromEntries(list.map((i) => [i.id, i]));
export const ingredientPrices: Record<string, number> = Object.fromEntries(list.map((i) => [i.id, i.pricePer100g]));
export const ingredientList = list;
