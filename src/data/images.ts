import manifest from "./image-manifest.json";

/**
 * Image slots. `src` is a path stem under /public without an extension; the
 * manifest (scripts/image-manifest.mjs) maps it to whichever file exists.
 * Missing files render as a neutral placeholder of the same size. Generation
 * briefs for every slot live in CODEX_IMAGES.md — keep ids and paths in sync.
 */
export type Tone = "sand" | "clay" | "sage";
export type ImageRef = { id: string; src: string; alt: string; label: string; tone?: Tone };

const files = manifest as Record<string, string>;

export function resolveImage(stem: string): string | undefined {
  return files[stem];
}

export function hasImage(ref?: ImageRef): boolean {
  return !!ref && !!files[ref.src];
}

export const images = {
  homeHero: {
    id: "home-hero",
    src: "/images/home/hero",
    alt: "Atta pinni and a bowl of roasted panjiri on a kitchen counter, ready for the snack cupboard",
    label: "Home hero · landscape",
    tone: "sand",
  },
  homeHeroMobile: {
    id: "home-hero-mobile",
    src: "/images/home/hero-mobile",
    alt: "Atta pinni and a bowl of roasted panjiri on a kitchen counter, ready for the snack cupboard",
    label: "Home hero · portrait crop",
    tone: "sand",
  },
  customise: {
    id: "home-customise",
    src: "/images/home/customise",
    alt: "Small brass bowls of almonds, cashews, raisins, makhana and cardamom arranged around a bowl of roasted panjiri",
    label: "Custom batches",
    tone: "clay",
  },
  gifting: {
    id: "home-gifting",
    src: "/images/home/gifting",
    alt: "A kraft gift box holding three jars of panjiri, pinni and mewa, tied with red cotton string",
    label: "Gift boxes",
    tone: "clay",
  },
  story: {
    id: "home-story",
    src: "/images/home/story",
    alt: "A woman stirring panjiri in a heavy kadhai in a sunlit home kitchen",
    label: "Our story",
  },
  storyHero: {
    id: "story-hero",
    src: "/images/story/hero",
    alt: "Two generations of a family standing together in their home kitchen",
    label: "Our story · hero",
  },
  storyRoasting: {
    id: "story-roasting",
    src: "/images/story/roasting",
    alt: "Wholewheat flour being stirred in a kadhai until golden",
    label: "Our story · roasting",
    tone: "clay",
  },
  storyRolling: {
    id: "story-rolling",
    src: "/images/story/rolling",
    alt: "Hands pressing pinni one at a time",
    label: "Our story · pressing",
  },
  storyPacking: {
    id: "story-packing",
    src: "/images/story/packing",
    alt: "Glass jars of panjiri being filled and sealed on a wooden table",
    label: "Our story · packing",
    tone: "sage",
  },
} satisfies Record<string, ImageRef>;

const categoryTone: Record<string, Tone> = { panjiri: "sand", pinni: "clay", laddus: "clay", mixes: "sage", "gift-boxes": "sand" };

/** Arch-cropped occasion tiles on the home page ("Shop by occasion"). */
export function occasionImage(slug: string, title: string): ImageRef {
  return { id: `occasion-${slug}`, src: `/images/occasions/${slug}`, alt: title, label: title, tone: "sand" };
}

const categoryAlt: Record<string, string> = {
  panjiri: "Golden roasted panjiri in a steel bowl",
  pinni: "Handmade pinni on a steel plate",
  laddus: "Dry-fruit laddus arranged on a brass thali",
  mixes: "A steel saucer of nuts, seeds and raisins",
  "gift-boxes": "A kraft gift box of homemade sweets tied with cotton string",
};

export function categoryImage(slug: string, name: string): ImageRef {
  return { id: `category-${slug}`, src: ({panjiri:"/images/vibrant/panjiri",pinni:"/images/vibrant/pinni",mixes:"/images/vibrant/mewa",laddus:"/images/commerce/laddus"} as Record<string,string>)[slug] ?? "/images/commerce/custom", alt: categoryAlt[slug] ?? name, label: `Category · ${name}`, tone: categoryTone[slug] };
}

/** Three shots per product: 1 packshot, 2 texture close-up, 3 served at home. */
export function productImages(p: { slug: string; name: string; category: string }): ImageRef[] {
  const tone = categoryTone[p.category];
  const coral: Record<string, string> = { "atta-pinni": "pinni", "classic-panjiri": "panjiri", "everyday-mix": "mewa" };
  if (coral[p.slug]) return [{ id: `${p.slug}-food`, src: `/images/vibrant/${coral[p.slug]}`, alt: `${p.name}, served unpackaged`, label: p.name, tone }];
  const fallback: Record<string,string> = {pinni:"/images/vibrant/pinni",panjiri:"/images/vibrant/panjiri",mixes:"/images/vibrant/mewa",laddus:"/images/commerce/laddus","gift-boxes":"/images/butter/hero-proportions-v2"};
  return [{ id: `${p.slug}-food`, src: fallback[p.category] ?? "/images/commerce/custom", alt: `${p.name} — illustrative food serving`, label: p.name, tone }];
}

/** Top-down texture photo of one ingredient, used by the custom-batch builder. */
export function ingredientImage(id: string, name: string): ImageRef {
  return { id: `ingredient-${id}`, src: `/images/ingredients/${id}`, alt: name, label: name, tone: "sand" };
}
