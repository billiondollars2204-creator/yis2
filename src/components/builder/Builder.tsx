"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { getProduct } from "@/data/products";
import { customNoun, getFormula } from "@/data/formulations";
import { categoryLabel, ingredientPrices, ingredients, type Allergen, type IngredientCategory } from "@/data/ingredients";
import {
  EMPTY_CUSTOMIZATION,
  FORMULA_BASIS,
  fillLine,
  isCustomized,
  maxFor,
  MIN_CUSTOM_GRAMS,
  resolveFormula,
  setAmount,
  setPick,
  surchargePer500,
  type Customization,
} from "@/lib/customization";
import { useCart, useCartUI, useHydrated } from "@/lib/cart";
import { formatINR } from "@/lib/money";
import { formatGrams } from "@/lib/units";
import { describeChanges } from "@/lib/describe";
import { track } from "@/lib/analytics";
import { useTween } from "@/lib/useTween";
import { useDialog } from "@/lib/useDialog";
import { Breadcrumbs } from "../ui";
import { ArrowLeft, ArrowRight, CheckIcon, CloseIcon, InfoIcon } from "../icons";
import { IngredientControl } from "./IngredientControl";
import { Steps } from "./Steps";
import styles from "./builder.module.css";

type Batch = { id: string; pack: number; qty: number; label: string };
type Tab = "base" | IngredientCategory | "note";
const ADD_ORDER: IngredientCategory[] = ["nuts", "dried-fruit", "seeds", "spices"];

export function Builder({ slug }: { slug: string }) {
  const product = getProduct(slug)!;
  const formula = getFormula(slug)!;
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const stage = params.get("step") === "review" ? "review" : "adjust";
  const editKey = params.get("edit");
  const hydrated = useHydrated();
  const cartLines = useCart((s) => s.lines);
  const add = useCart((s) => s.add);
  const replace = useCart((s) => s.replace);
  const openCart = useCartUI((s) => s.setOpen);

  const baseBatches = useMemo(() => {
    const out: Batch[] = [];
    if (product.variants.some((v) => v.grams === 500)) out.push({ id: "500", pack: 500, qty: 1, label: "500 g" });
    if (product.variants.some((v) => v.grams === 1000)) out.push({ id: "1000", pack: 1000, qty: 1, label: "1 kg" }, { id: "2000", pack: 1000, qty: 2, label: "2 kg" });
    return out;
  }, [product]);

  const [custom, setCustom] = useState<Customization>(EMPTY_CUSTOMIZATION);
  const [batches, setBatches] = useState(baseBatches);
  const [batchId, setBatchId] = useState(baseBatches[0]?.id ?? "500");
  const [tab, setTab] = useState<Tab>("base");
  const [hit, setHit] = useState<{ key: string; n: number } | null>(null);
  const [messages, setMessages] = useState<Record<string, string>>({});
  const [announce, setAnnounce] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [sheet, setSheet] = useState(false);
  const sheetRef = useDialog(sheet, () => setSheet(false));
  const n = useRef(0);
  const loaded = useRef(false);

  // Editing from the cart: prefill recipe and batch size, then replace the line on confirm.
  useEffect(() => {
    if (!hydrated || loaded.current || !editKey) return;
    loaded.current = true;
    const line = cartLines.find((l) => l.key === editKey && l.slug === slug);
    const v = line && product.variants.find((x) => x.id === line.variantId);
    if (!line || !v) return;
    setCustom(line.customization ?? EMPTY_CUSTOMIZATION);
    const match = baseBatches.find((b) => b.pack === v.grams && b.qty === line.qty);
    if (match) setBatchId(match.id);
    else {
      setBatches([...baseBatches, { id: "edit", pack: v.grams, qty: line.qty, label: formatGrams(v.grams * line.qty) }]);
      setBatchId("edit");
    }
    setEditing(line.key);
  }, [hydrated, editKey, cartLines, slug, product, baseBatches]);

  const rows = resolveFormula(formula, custom);
  const fill = fillLine(formula);
  const fillName = ingredients[rows.find((r) => r.fill)!.pick].name.toLowerCase();
  const batch = batches.find((b) => b.id === batchId) ?? batches[0];
  const variant = product.variants.find((v) => v.grams === batch.pack)!;
  const scale = (batch.pack * batch.qty) / FORMULA_BASIS;
  const extraPack = Math.round(surchargePer500(formula, custom, ingredientPrices) * (batch.pack / FORMULA_BASIS));
  const base = variant.price * batch.qty;
  const extra = extraPack * batch.qty;
  const total = base + extra;
  const shown = useTween(total);
  const changes = describeChanges(slug, custom);
  const soldOut = variant.stock === "out_of_stock";
  const allergens = [...new Set(rows.filter((r) => r.grams > 0).map((r) => ingredients[r.pick]?.allergen).filter(Boolean))] as Allergen[];

  const groups: { id: Tab; title: string; keys: string[] }[] = [
    { id: "base", title: "Base", keys: formula.lines.filter((l) => l.role === "base").map((l) => l.key) },
    ...ADD_ORDER.map((c) => ({ id: c as Tab, title: categoryLabel[c], keys: formula.lines.filter((l) => l.role === "addition" && ingredients[l.options[0]].category === c).map((l) => l.key) })).filter((g) => g.keys.length),
    { id: "note", title: "Note", keys: [] },
  ];
  const changedIn = (keys: string[]) => keys.filter((k) => custom.amounts[k] !== undefined || custom.picks[k] !== undefined).length;

  function msg(key: string, text: string | null) {
    setMessages((m) => {
      const next = { ...m };
      if (text) next[key] = text;
      else delete next[key];
      return next;
    });
  }

  function amount(key: string, g: number) {
    const before = rows.find((r) => r.key === key)!;
    const line = formula.lines.find((l) => l.key === key)!;
    const res = setAmount(formula, custom, key, g);
    const name = ingredients[before.pick].name;
    if (res.limited === "max") msg(key, `${name} goes up to ${formatGrams(line.max)} per 500 g.`);
    else if (res.limited === "min") msg(key, `${name} is part of the base, so it stays at ${formatGrams(line.min)} or more.`);
    else if (res.limited === "fill") msg(key, `No room for more — the batch needs at least ${formatGrams(fill.min)} of ${fillName}. Reduce another ingredient first.`);
    else msg(key, null);
    if (res.applied === before.grams) return;
    setCustom(res.custom);
    n.current += 1;
    setHit({ key, n: n.current });
    setAnnounce(`${name} ${res.applied === 0 ? "removed" : `${formatGrams(res.applied)} per 500 g`}.`);
    track("customize_change", { item_id: slug, ingredient: key, grams: res.applied });
  }

  function pick(key: string, id: string) {
    setCustom(setPick(formula, custom, key, id));
    n.current += 1;
    setHit({ key, n: n.current });
    setAnnounce(`${ingredients[id].name} selected.`);
    track("customize_change", { item_id: slug, ingredient: key, pick: id });
  }

  const go = (step: "review" | null) => {
    const sp = new URLSearchParams(params.toString());
    if (step) sp.set("step", step);
    else sp.delete("step");
    router.push(`${pathname}${sp.toString() ? `?${sp}` : ""}`);
  };

  function confirm() {
    if (soldOut) return;
    const c = isCustomized(custom) ? custom : undefined;
    if (editing) replace(editing, slug, variant.id, batch.qty, c);
    else add(slug, variant.id, batch.qty, c);
    track("add_to_cart", { item_id: slug, variant: variant.id, quantity: batch.qty, value: total, currency: "INR", customized: !!c, source: "builder" });
    setDone(true);
    setEditing(null);
    setTimeout(() => openCart(true), 400);
  }

  const card = (
    <div className={styles.card}>
      <div className={styles.cardHead}>
        <span>Your recipe</span>
        <span className="num">{batch.label}</span>
      </div>
      <details className={styles.recipeDetails}>
        <summary>View full recipe</summary>
      <ul className={styles.recipe}>
        {[...rows]
          .filter((r) => r.grams > 0)
          .sort((a, b) => b.grams - a.grams)
          .map((r) => (
            <li key={r.key} data-changed={r.grams !== r.houseGrams || r.pick !== r.housePick || undefined}>
              <span>{ingredients[r.pick].name}</span>
              <span className="num">{formatGrams(r.grams * scale)}</span>
            </li>
          ))}
      </ul>
      </details>
      <dl className={styles.price}>
        <div>
          <dt>{batch.qty > 1 ? `${batch.qty} × ${variant.label}` : `${variant.label} batch`}</dt>
          <dd className="num">{formatINR(base)}</dd>
        </div>
        {extra > 0 && <div>
          <dt>Extra ingredients</dt>
          <dd className="num">+{formatINR(extra)}</dd>
        </div>}
        <div className={styles.total}>
          <dt>Total</dt>
          <dd className="num">{formatINR(shown)}</dd>
        </div>
      </dl>
    </div>
  );

  if (done) {
    return (
      <div className={`container ${styles.page}`}>
        <Steps current={3} slug={slug} />
        <div className={styles.done} role="status">
          <span className={styles.doneIcon}>
            <CheckIcon />
          </span>
          <h1>Your {customNoun[product.category]} is in the cart</h1>
          <p className="lead">
            {batch.label} · {isCustomized(custom) ? `${changes.length} change${changes.length === 1 ? "" : "s"} from the house recipe` : "house recipe"} · {formatINR(total)}. You can
            edit the recipe from your cart until you check out.
          </p>
          <div className={styles.doneActions}>
            <Link href="/checkout" className="btn btn--lg">
              Checkout
            </Link>
            <Link href="/cart" className="btn btn--lg btn--outline">
              View cart
            </Link>
          </div>
          <Link href="/customise" className="more">
            Make another batch <ArrowRight />
          </Link>
        </div>
      </div>
    );
  }

  if (stage === "review") {
    const shownRows = [...rows].filter((r) => r.grams > 0).sort((a, b) => b.grams - a.grams);
    const leftOut = rows.filter((r) => r.grams === 0 && r.houseGrams > 0);
    return (
      <div className={`container ${styles.page}`}>
        <Steps current={2} slug={slug} />
        <header className={styles.head}>
          <h1>Review your {product.name}</h1>
          <p className="muted">Check every ingredient before it goes in the cart. Amounts are for your {batch.label} batch.</p>
        </header>
        <div className={styles.reviewGrid}>
          <div>
            <table className={styles.table}>
              <caption className="visually-hidden">Full recipe for your batch</caption>
              <thead>
                <tr>
                  <th scope="col">Ingredient</th>
                  <th scope="col">Your {batch.label}</th>
                </tr>
              </thead>
              <tbody>
                {shownRows.map((r) => {
                  const d = r.grams - r.houseGrams;
                  return (
                    <tr key={r.key} data-changed={d !== 0 || r.pick !== r.housePick || undefined}>
                      <th scope="row">
                        {ingredients[r.pick].name}
                        <small>{r.role === "base" ? "Base" : categoryLabel[ingredients[r.pick].category]}</small>
                      </th>
                      <td className="num">{formatGrams(r.grams * scale)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {leftOut.length > 0 && <p className="muted small">Left out: {leftOut.map((r) => ingredients[r.pick].name).join(", ")}</p>}
            {custom.note && <p className="muted small">Note for the kitchen: “{custom.note}”</p>}
            <div className={`notice notice--info ${styles.terms}`}>
              <InfoIcon />
              <div>
                <p>
                  <strong>Allergens:</strong> {allergens.length ? allergens.join(", ") : "Check the full ingredient list"}. Removing an ingredient does not make this batch allergen-free. Kitchen cross-contact information must be confirmed before ordering.
                </p>
                <p>
                  Custom batch review, lead times and return terms will be confirmed before orders open.
                </p>
              </div>
            </div>
          </div>
          <aside className={styles.reviewAside}>
            {card}
            <button type="button" className="btn btn--lg btn--block" onClick={confirm} disabled={soldOut}>
              {soldOut ? "Sold out" : editing ? `Update cart · ${formatINR(total)}` : `Add to cart · ${formatINR(total)}`}
            </button>
            <button type="button" className="btn btn--ghost btn--block" onClick={() => go(null)}>
              <ArrowLeft /> Back to adjusting
            </button>
          </aside>
        </div>
      </div>
    );
  }

  const current = groups.find((g) => g.id === tab) ?? groups[0];

  return (
    <div className={`container ${styles.page}`}>
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/customise", label: "Custom batches" }, { label: product.name }]} />
      <Steps current={1} slug={slug} />
      <header className={styles.head}>
        <div>
          <h1>
            {editing ? "Edit your" : "Custom"} {product.name}
          </h1>
          <p className="muted">
            Adjust your ingredients. Review the recipe and price before adding to bag.
          </p>
        </div>
        <fieldset className={styles.batch}>
          <legend className="label">Batch size</legend>
          <div className={styles.batchRow}>
            {batches.map((b) => {
              const v = product.variants.find((x) => x.grams === b.pack);
              const out = !v || v.stock === "out_of_stock";
              return (
                <label key={b.id} className="choice">
                  <input type="radio" name="batch" checked={batchId === b.id} disabled={out} onChange={() => setBatchId(b.id)} />
                  <span>
                    <strong className="num">{b.label}</strong>
                    {out && <small>Sold out</small>}
                  </span>
                </label>
              );
            })}
          </div>
          <p className="hint">
            Prefer a smaller pack?{" "}
            <Link href={`/shop/${slug}`} className="link">
              Shop original recipe
            </Link>
          </p>
        </fieldset>
      </header>

      <div className={styles.layout}>
        <div className={styles.panel}>
          <div className={styles.tabs} role="tablist" aria-label="Ingredient groups">
            {groups.map((g) => {
              const c = changedIn(g.keys) + (g.id === "note" && custom.note ? 1 : 0);
              return (
                <button key={g.id} type="button" role="tab" id={`tab-${g.id}`} aria-selected={tab === g.id} aria-controls="tabpanel" className={styles.tab} tabIndex={tab === g.id ? 0 : -1} onKeyDown={(e) => {
                  const index = groups.findIndex(x => x.id === g.id);
                  const next = e.key === "ArrowRight" ? (index + 1) % groups.length : e.key === "ArrowLeft" ? (index - 1 + groups.length) % groups.length : e.key === "Home" ? 0 : e.key === "End" ? groups.length - 1 : -1;
                  if (next >= 0) { e.preventDefault(); setTab(groups[next].id); document.getElementById(`tab-${groups[next].id}`)?.focus(); }
                }} onClick={() => setTab(g.id)}>
                  {g.title}
                  {c > 0 && <span className={styles.tabCount}>{c}</span>}
                </button>
              );
            })}
          </div>
          <div id="tabpanel" role="tabpanel" aria-labelledby={`tab-${current.id}`} className={styles.tabpanel}>
            {current.id === "note" ? (
              <div className={styles.note}>
                <label htmlFor="kitchen-note" className="label">
                  A note for the kitchen (optional)
                </label>
                <textarea
                  id="kitchen-note"
                  className="textarea"
                  rows={4}
                  maxLength={200}
                  value={custom.note}
                  onChange={(e) => setCustom({ ...custom, note: e.target.value })}
                  placeholder="e.g. It’s for my grandmother — please keep it soft."
                />
                <p className="hint">{200 - custom.note.length} characters left. For allergies, please contact us before ordering.</p>
              </div>
            ) : (
              <>
                <p className={styles.groupNote}>
                  {current.id === "base" ? "Required ingredients. Adjust within limits — they can’t be removed." : "Optional. Add, adjust or remove."} Amounts are per 500 g.
                </p>
                <ul className={styles.ings}>
                  {current.keys.map((k) => (
                    <IngredientControl
                      key={k}
                      line={formula.lines.find((l) => l.key === k)!}
                      row={rows.find((r) => r.key === k)!}
                      reach={maxFor(formula, custom, k)}
                      message={messages[k]}
                      onAmount={(g) => amount(k, g)}
                      onPick={(id) => pick(k, id)}
                    />
                  ))}
                </ul>
              </>
            )}
            <div className={styles.tabNav}>
              {groups.findIndex((g) => g.id === tab) < groups.length - 1 ? (
                <button type="button" className="btn btn--outline" onClick={() => setTab(groups[groups.findIndex((g) => g.id === tab) + 1].id)}>
                  Next: {groups[groups.findIndex((g) => g.id === tab) + 1].title} <ArrowRight />
                </button>
              ) : (
                <button type="button" className="btn" onClick={() => go("review")} disabled={soldOut}>
                  Review batch <ArrowRight />
                </button>
              )}
              <button
                type="button"
                className={styles.linkBtn}
                onClick={() => {
                  setCustom({ ...EMPTY_CUSTOMIZATION, note: custom.note });
                  setMessages({});
                  setAnnounce("Reset to the house recipe.");
                }}
                disabled={!isCustomized({ ...custom, note: "" })}
              >
                Reset recipe
              </button>
            </div>
          </div>
        </div>

        <aside className={styles.side} aria-label="Your recipe">
          {card}
          <button type="button" className="btn btn--lg btn--block" onClick={() => go("review")} disabled={soldOut}>
            Review batch <ArrowRight />
          </button>
          <p className="hint" style={{ textAlign: "center" }}>
            {changes.length ? `${changes.length} change${changes.length === 1 ? "" : "s"} from the house recipe` : "House recipe"}
          </p>
        </aside>
      </div>

      <div className={styles.mobileBar}>
        <button type="button" className={styles.mobileInfo} onClick={() => setSheet(true)} aria-haspopup="dialog">
          <span className={styles.mini} aria-hidden="true">
            {[...rows]
              .filter((r) => r.grams > 0)
              .sort((a, b) => b.grams - a.grams)
              .map((r) => (
                <span key={r.key} style={{ flexGrow: r.grams, background: ingredients[r.pick].tone }} />
              ))}
          </span>
          <span>
            {batch.label} · <strong className="num">{formatINR(shown)}</strong> · <span>View recipe</span>
          </span>
        </button>
        <button type="button" className="btn" onClick={() => go("review")} disabled={soldOut}>
          Review
        </button>
      </div>

      <dialog ref={sheetRef} className="sheet sheet--bottom" aria-label="Your recipe">
        <div className="sheet-head">
          <h2>Your recipe</h2>
          <button type="button" className="icon-btn" onClick={() => setSheet(false)} aria-label="Close">
            <CloseIcon />
          </button>
        </div>
        <div style={{ padding: "var(--sp-4) var(--sp-5) var(--sp-6)", overflowY: "auto", maxHeight: "calc(88dvh - 70px)" }}>{card}</div>
      </dialog>

      <div className="visually-hidden" role="status" aria-live="polite">
        {announce ? `${announce} Total ${formatINR(total)}.` : ""}
      </div>
    </div>
  );
}
