import Image from "@/components/SiteImage";
import { resolveImage, type ImageRef } from "@/data/images";
import { showPlaceholderMarkers } from "@/lib/site";
import styles from "./SmartImage.module.css";

type Props = {
  image: ImageRef;
  sizes: string;
  ratio?: string;
  preload?: boolean;
  decorative?: boolean;
  className?: string;
  /** Short caption shown on the placeholder (e.g. a Hindi name). */
  caption?: string;
  quiet?: boolean;
};

/**
 * Renders the slot's photo when it exists in /public; otherwise a same-size
 * placeholder (cream with a faint jaali lattice), so layout never shifts.
 */
export function SmartImage({ image, sizes, ratio, preload, decorative, className, caption, quiet }: Props) {
  const src = resolveImage(image.src);
  return (
    <div className={`${styles.frame} ${className ?? ""}`} style={ratio ? { aspectRatio: ratio } : undefined}>
      {src ? (
        <Image src={src} alt={decorative ? "" : image.alt} fill sizes={sizes} preload={preload} className={styles.img} />
      ) : (
        <div className={`${styles.placeholder} jaali`} {...(decorative ? { "aria-hidden": true } : { role: "img", "aria-label": image.alt })}>
          {caption && <span className={`${styles.caption} hindi`}>{caption}</span>}
          {showPlaceholderMarkers && !quiet && <span className={styles.label}>Photo: {image.id}</span>}
        </div>
      )}
    </div>
  );
}
