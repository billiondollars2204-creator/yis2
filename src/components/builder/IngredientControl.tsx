"use client";

import { ingredients } from "@/data/ingredients";
import type { FormulaLine, ResolvedRow } from "@/lib/customization";
import { formatINR } from "@/lib/money";
import { formatGrams } from "@/lib/units";
import { MinusIcon, PlusIcon } from "../icons";
import styles from "./builder.module.css";

type Props = {
  line: FormulaLine;
  row: ResolvedRow;
  /** Highest amount reachable now (fill-line minimum may cap it below line.max). */
  reach: number;
  message?: string;
  onAmount: (g: number) => void;
  onPick: (id: string) => void;
};

export function IngredientControl({ line, row, reach, message, onAmount, onPick }: Props) {
  const ing = ingredients[row.pick];
  const changed = row.grams !== row.houseGrams || row.pick !== row.housePick;
  const off = row.grams === 0;
  const pct = (g: number) => ((g - 0) / line.max) * 100;
  // Track: filled to value, a tick at the house amount, hatched beyond what's reachable.
  const track = `linear-gradient(90deg, var(--brand) 0 ${pct(row.grams)}%, var(--line) ${pct(row.grams)}% ${pct(reach)}%, transparent ${pct(reach)}%), repeating-linear-gradient(135deg, #e7dccb 0 4px, #f6efe4 4px 8px)`;
  const msgId = `m-${line.key}`;
  const per10 = ing.pricePer100g / 10;

  return (
    <li className={styles.ing} data-state={off ? "off" : changed ? "changed" : "house"}>
      <div className={styles.ingHead}>
        <h3 className={styles.ingName}>
          {ing.name}
        </h3>
        <p className={styles.ingMeta}>
          {line.role === "base" && <span className="tag tag--muted">Required</span>}
          {ing.allergen && <span className="tag tag--gold">{ing.allergen}</span>}
        </p>
      </div>

      {line.options.length > 1 && (
        <fieldset className={styles.swaps}>
          <legend className="visually-hidden">Choose {ing.name.toLowerCase()} type</legend>
          {line.options.map((id) => {
            const o = ingredients[id];
            return (
              <label key={id} className="choice">
                <input type="radio" name={`pick-${line.key}`} checked={row.pick === id} onChange={() => onPick(id)} />
                <span>
                  <strong>{o.name}</strong>
                </span>
              </label>
            );
          })}
        </fieldset>
      )}

      <div className={styles.ingControl}>
        {line.fill ? (
          <p className={styles.auto}>
            <strong className="num">{formatGrams(row.grams)}</strong>
            <span>Balances your 500 g batch</span>
          </p>
        ) : off && line.role === "addition" ? (
          <div className={styles.addRow}>
            <span className="muted small">Not in your batch{row.houseGrams ? ` · house amount ${formatGrams(row.houseGrams)}` : ""}</span>
            <button type="button" className="btn btn--outline btn--sm" onClick={() => onAmount(row.houseGrams || Math.max(line.step, Math.round((line.max * 0.25) / line.step) * line.step))}>
              <PlusIcon /> Add {ing.name.toLowerCase()}
            </button>
          </div>
        ) : (
          <>
            <div className={styles.sliderRow}>
              <button type="button" className={styles.nudge} onClick={() => onAmount(row.grams - line.step)} disabled={row.grams <= line.min} aria-label={`Less ${ing.name}`}>
                <MinusIcon />
              </button>
              <div className={styles.slider}>
                <input
                  type="range"
                  className="range"
                  min={0}
                  max={line.max}
                  step={line.step}
                  value={row.grams}
                  onChange={(e) => onAmount(Number(e.target.value))}
                  aria-label={`${ing.name}, grams per 500 g`}
                  aria-valuetext={`${formatGrams(row.grams)} per 500 g`}
                  aria-describedby={message ? msgId : undefined}
                  style={{ "--track": track } as React.CSSProperties}
                />
                {row.houseGrams > 0 && (
                  <span className={styles.houseTick} style={{ left: `calc(11px + (100% - 22px) * ${row.houseGrams / line.max})` }} aria-hidden="true" title="House amount" />
                )}
              </div>
              <button type="button" className={styles.nudge} onClick={() => onAmount(row.grams + line.step)} disabled={row.grams >= reach} aria-label={`More ${ing.name}`} aria-describedby={message ? msgId : undefined}>
                <PlusIcon />
              </button>
              <output className={`${styles.value} num`}>{formatGrams(row.grams)}</output>
            </div>
            <div className={styles.ingFoot}>
              {changed && (
                <button type="button" className={styles.linkBtn} onClick={() => (row.pick !== row.housePick ? onPick(row.housePick) : onAmount(row.houseGrams))}>
                  Reset
                </button>
              )}
              {line.role === "addition" && (
                <button type="button" className={styles.linkBtn} onClick={() => onAmount(0)}>
                  Remove
                </button>
              )}
            </div>
          </>
        )}
        <details className={styles.ingredientDetails}>
          <summary>Details & limits</summary>
          <p>{ing.description} {ing.prep}.</p>
          <p>House recipe: {formatGrams(row.houseGrams)} · Range: {formatGrams(line.min)}–{formatGrams(line.max)}.</p>
          {!line.fill && <p>Extra ingredient cost: {formatINR(per10 < 1 ? Number(per10.toFixed(1)) : Math.round(per10))} per 10 g above the house amount.</p>}
        </details>
        {message && (
          <p id={msgId} className={styles.limit} role="status">
            {message}
          </p>
        )}
      </div>
    </li>
  );
}
