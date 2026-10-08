"use client";
import { ingredients } from "@/data/ingredients";
import type { ResolvedRow } from "@/lib/customization";
import { formatShare } from "@/lib/units";
import styles from "./builder.module.css";
/** A proportional bar chart of the live recipe by weight. */
export function RecipeJar({ rows, highlight, size = "md" }: { rows: ResolvedRow[]; highlight?: { key: string; n: number } | null; size?: "sm" | "md" }) {
 const visible=rows.filter(r=>r.grams>0);
 return <figure className={styles.recipeChart} data-size={size}><figcaption>YOUR RECIPE BY WEIGHT</figcaption><div role="img" aria-label={visible.map(r=>`${ingredients[r.pick]?.name} ${formatShare(r.share)}`).join(", ")} className={styles.recipeBar}>{visible.map(r=><span key={r.key} style={{flex:r.grams,background:ingredients[r.pick]?.tone??"#d9c7a8"}} data-hit={highlight?.key===r.key||undefined} title={`${ingredients[r.pick]?.name}: ${formatShare(r.share)}`}/>)}</div><p>Each section represents an ingredient’s share of your batch.</p></figure>;
}
