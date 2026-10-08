"use client";

import { useSaved } from "@/lib/stores";
import { useHydrated } from "@/lib/cart";
import { track } from "@/lib/analytics";
import { HeartIcon } from "./icons";

export function SaveButton({ slug, name, className, withLabel }: { slug: string; name: string; className?: string; withLabel?: boolean }) {
  const hydrated = useHydrated();
  const saved = useSaved((s) => s.slugs.includes(slug));
  const toggle = useSaved((s) => s.toggle);
  const on = hydrated && saved;
  return (
    <button
      type="button"
      className={className ?? "icon-btn"}
      aria-pressed={on}
      aria-label={withLabel ? undefined : on ? `Remove ${name} from saved` : `Save ${name}`}
      onClick={() => {
        toggle(slug);
        track(on ? "remove_from_wishlist" : "add_to_wishlist", { item_id: slug });
      }}
      style={{ color: on ? "var(--brand)" : undefined }}
    >
      <HeartIcon filled={on} />
      {withLabel && (on ? "Saved" : "Save")}
    </button>
  );
}
