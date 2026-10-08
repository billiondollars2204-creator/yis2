import Link from "next/link";
import styles from "./builder.module.css";

const labels = ["Choose", "Adjust", "Review"];

export function Steps({ current, slug }: { current: 0 | 1 | 2 | 3; slug?: string }) {
  return (
    <ol className={styles.steps} aria-label="Custom batch steps">
      {labels.map((l, i) => {
        const state = i < current ? "done" : i === current ? "current" : "todo";
        const href = i === 0 ? "/customise" : i === 1 && slug ? `/customise/${slug}` : undefined;
        return (
          <li key={l} data-state={state} aria-current={state === "current" ? "step" : undefined}>
            <span className={styles.stepDot}>{state === "done" ? "✓" : i + 1}</span>
            {state === "done" && href ? <Link href={href}>{l}</Link> : <span>{l}</span>}
          </li>
        );
      })}
    </ol>
  );
}
