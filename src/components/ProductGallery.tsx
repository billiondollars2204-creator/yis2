"use client";

import { useRef, useState } from "react";
import type { ImageRef } from "@/data/images";
import { SmartImage } from "./SmartImage";
import styles from "./ProductGallery.module.css";

/** Swipeable gallery (scroll-snap) with thumbnails; works with touch, mouse and keyboard. */
export function ProductGallery({ images, name, caption }: { images: ImageRef[]; name: string; caption?: string }) {
  const [index, setIndex] = useState(0);
  const track = useRef<HTMLDivElement>(null);
  const go = (i: number) => {
    setIndex(i);
    const el = track.current;
    el?.scrollTo({ left: i * el.clientWidth, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };
  return (
    <div className={styles.gallery}>
      <div
        ref={track}
        className={styles.track}
        tabIndex={0}
        role="region"
        aria-roledescription="carousel"
        aria-label={`${name} photos, ${index + 1} of ${images.length}`}
        onScroll={(e) => {
          const el = e.currentTarget;
          const i = Math.round(el.scrollLeft / el.clientWidth);
          if (i !== index) setIndex(i);
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") go(Math.min(images.length - 1, index + 1));
          if (e.key === "ArrowLeft") go(Math.max(0, index - 1));
        }}
      >
        {images.map((im, i) => (
          <div key={im.id} className={styles.slide} aria-hidden={i !== index}>
            <SmartImage image={im} sizes="(min-width: 960px) 50vw, 100vw" ratio="1 / 1" preload={i === 0} caption={i === 0 ? caption : undefined} />
          </div>
        ))}
      </div>
      {images.length > 1 && <ul className={styles.thumbs} aria-label="Choose photo">
        {images.map((im, i) => (
          <li key={im.id}>
            <button type="button" className={styles.thumb} aria-current={i === index || undefined} aria-label={`Show photo ${i + 1} of ${images.length}`} onClick={() => go(i)}>
              <SmartImage image={im} sizes="80px" ratio="1 / 1" decorative quiet />
            </button>
          </li>
        ))}
      </ul>}
    </div>
  );
}
