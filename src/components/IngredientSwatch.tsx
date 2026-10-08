import Image from "@/components/SiteImage";
import { ingredients } from "@/data/ingredients";
import { ingredientImage, resolveImage } from "@/data/images";
import styles from "./IngredientSwatch.module.css";

/** Ingredient photo cropped to its container, or a textured colour swatch until the photo exists. */
export function IngredientSwatch({ id, sizes = "96px", className }: { id: string; sizes?: string; className?: string }) {
  const ing = ingredients[id];
  const src = resolveImage(ingredientImage(id, ing?.name ?? id).src);
  return (
    <span className={`${styles.swatch} ${className ?? ""}`} style={{ "--tone": ing?.tone ?? "#d9c7a8" } as React.CSSProperties} aria-hidden="true">
      {src ? <Image src={src} alt="" fill sizes={sizes} className={styles.img} /> : <span className={styles.material} />}
    </span>
  );
}
