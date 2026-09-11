#!/usr/bin/env node
/**
 * Misst die Kontrastverhältnisse, die diese Seite wirklich ausliefert.
 *
 * Die Werte werden NICHT hier gepflegt, sondern aus src/styles/global.css
 * gelesen — die Datei ist die einzige Quelle der Wahrheit. Geprüft wird jedes
 * Paar, das im Markup tatsächlich vorkommt (`text-x auf bg-y`), in beiden
 * Schemata. Rechenweg: relative Luminanz nach WCAG 2.1, (L1+0.05)/(L2+0.05).
 *
 *   node scripts/check-contrast.mjs          # Tabelle + Exit-Code
 *   node scripts/check-contrast.mjs --quiet  # nur Verstöße
 */
import { readFileSync } from "node:fs";

const css = readFileSync(new URL("../src/styles/global.css", import.meta.url), "utf8");

/** Die --c-*-Deklarationen eines Blocks einsammeln. */
const block = (start) => {
  const from = css.indexOf(start);
  if (from < 0) throw new Error(`Block nicht gefunden: ${start}`);
  const body = css.slice(from, css.indexOf("\n}", from));
  const out = {};
  for (const m of body.matchAll(/--c-([a-z0-9-]+):\s*(#[0-9a-f]{3,8})/gi)) out[m[1]] = m[2];
  return out;
};

const schemes = {
  hell: block("\n:root {"),
  dunkel: block('\n:root[data-theme="dark"] {'),
};

// ── WCAG-Rechnung ─────────────────────────────────────────────────────────
const bytes = (h) => {
  let x = h.replace("#", "");
  if (x.length === 3) x = [...x].map((c) => c + c).join("");
  return [0, 2, 4].map((i) => parseInt(x.slice(i, i + 2), 16));
};
const chan = (v) => {
  const c = v / 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
};
const lum = (h) => {
  const [r, g, b] = bytes(h);
  return 0.2126 * chan(r) + 0.7152 * chan(g) + 0.0722 * chan(b);
};
const ratio = (a, b) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};
/** Halbtransparente Tönung (`bg-brand-50/60`) auf ihren Grund rechnen. */
const over = (fg, bg, alpha) => {
  const f = bytes(fg);
  const b = bytes(bg);
  return "#" + f.map((v, i) => Math.round(v * alpha + b[i] * (1 - alpha)).toString(16).padStart(2, "0")).join("");
};

// ── Die Paare, die im Markup wirklich vorkommen ───────────────────────────
// min: geforderter Wert. 7 = Fließtext-Ziel dieses Zweigs (AAA),
// 4.5 = Text AA, 3 = Linie/Rahmen bzw. großer Text.
const paare = (c) => {
  const t = (k) => c[k];
  const surf = t("surface");
  const canv = t("canvas");
  const ink50 = t("ink-50");
  return [
    // ── Fließtext und Überschriften ──────────────────────────────────────
    ["Fließtext ink-700 auf canvas", t("ink-700"), canv, 7],
    ["Fließtext ink-700 auf surface", t("ink-700"), surf, 7],
    ["Fließtext ink-700 auf ink-50", t("ink-700"), ink50, 7],
    ["Überschrift ink-900 auf canvas", t("ink-900"), canv, 7],
    ["Überschrift ink-900 auf surface", t("ink-900"), surf, 7],
    ["Überschrift ink-900 auf ink-50", t("ink-900"), ink50, 7],
    ["Fließtext ink-800 auf surface", t("ink-800"), surf, 7],
    ["Lead ink-600 auf canvas", t("ink-600"), canv, 7],
    ["Lead ink-600 auf ink-50", t("ink-600"), ink50, 7],
    ["Gedämpft ink-500 auf canvas", t("ink-500"), canv, 7],
    ["Gedämpft ink-500 auf ink-50", t("ink-500"), ink50, 7],
    ["Kleinschrift ink-400 auf surface", t("ink-400"), surf, 4.5],
    ["Kleinschrift ink-400 auf ink-50", t("ink-400"), ink50, 4.5],
    ["Chip ink-500 auf ink-100", t("ink-500"), t("ink-100"), 4.5],

    // ── Marke: Link, Knopf, Fläche ───────────────────────────────────────
    ["Link brand-700 auf canvas", t("brand-700"), canv, 7],
    ["Link brand-700 auf surface", t("brand-700"), surf, 7],
    ["Link brand-700 auf ink-50", t("brand-700"), ink50, 4.5],
    ["Link brand-700 auf brand-50", t("brand-700"), t("brand-50"), 4.5],
    ["Hover brand-900 auf surface", t("brand-900"), surf, 7],
    ["Hover brand-900 auf brand-50 (60 %)", t("brand-900"), over(t("brand-50"), surf, 0.6), 4.5],
    ["Knopfschrift on-accent auf brand-700", t("on-accent"), t("brand-700"), 4.5],
    ["Knopfschrift on-accent auf brand-800 (hover)", t("on-accent"), t("brand-800"), 4.5],
    ["Kachelschrift on-accent auf brand-600", t("on-accent"), t("brand-600"), 4.5],
    ["Verlaufsschrift on-accent auf brand-700", t("on-accent"), t("brand-700"), 4.5],
    ["Verlaufsschrift on-accent auf brand-900", t("on-accent"), t("brand-900"), 4.5],
    ["Verlauf-Lead brand-100 auf brand-700", t("brand-100"), t("brand-700"), 4.5],
    ["Verlauf-Lead brand-100 auf brand-900", t("brand-100"), t("brand-900"), 4.5],
    ["Chip brand-800 auf brand-50", t("brand-800"), t("brand-50"), 4.5],
    ["Chip brand-900 auf brand-100 (70 %)", t("brand-900"), over(t("brand-100"), surf, 0.7), 4.5],
    ["Umkehrknopf brand-800 auf surface", t("brand-800"), surf, 4.5],

    // ── Linien ───────────────────────────────────────────────────────────
    ["Rahmen ink-200 auf canvas", t("ink-200"), canv, 3],
    ["Rahmen ink-200 auf surface", t("ink-200"), surf, 3],
    ["Rahmen ink-200 auf ink-50", t("ink-200"), ink50, 3],
    ["Rahmen ink-300 auf surface", t("ink-300"), surf, 3],
    ["Rahmen ink-300 auf ink-50", t("ink-300"), ink50, 3],
    ["Rahmen brand-200 auf surface", t("brand-200"), surf, 3],
    ["Fokusring brand-200 auf surface", t("brand-200"), surf, 3],
    ["Rahmen brand-300 auf surface", t("brand-300"), surf, 3],
    ["Rahmen brand-300 auf brand-50 (60 %)", t("brand-300"), over(t("brand-50"), surf, 0.6), 3],
    ["Fokusrahmen brand-500 auf surface", t("brand-500"), surf, 3],
    ["Rahmen emerald-300 auf surface", t("emerald-300"), surf, 3],
    ["Rahmen emerald-400 auf surface (hover)", t("emerald-400"), surf, 3],
    ["Ring emerald-200 auf emerald-100", t("emerald-200"), t("emerald-100"), 3],
    ["Ring emerald-200 auf surface", t("emerald-200"), surf, 3],
    ["Rahmen amber-300 auf surface", t("amber-300"), surf, 3],
    ["Rahmen amber-300 auf amber-50", t("amber-300"), t("amber-50"), 3],

    // ── Emerald / Amber als Schrift ──────────────────────────────────────
    ["emerald-700 auf surface", t("emerald-700"), surf, 4.5],
    ["emerald-800 auf surface", t("emerald-800"), surf, 4.5],
    ["emerald-800 auf emerald-50", t("emerald-800"), t("emerald-50"), 4.5],
    ["emerald-900 auf emerald-100", t("emerald-900"), t("emerald-100"), 4.5],
    ["emerald-900 auf emerald-50 (60 %)", t("emerald-900"), over(t("emerald-50"), surf, 0.6), 4.5],
    ["Knopfschrift on-accent auf emerald-600", t("on-accent"), t("emerald-600"), 4.5],
    ["Knopfschrift on-accent auf emerald-700 (hover)", t("on-accent"), t("emerald-700"), 4.5],
    ["amber-700 auf amber-50", t("amber-700"), t("amber-50"), 4.5],
    ["amber-800 auf amber-50", t("amber-800"), t("amber-50"), 4.5],
    ["amber-800 auf surface", t("amber-800"), surf, 4.5],
    ["Banner amber-950 auf amber-400", t("amber-950"), t("amber-400"), 4.5],

    // ── Tabellen und Codeblöcke im Blog ──────────────────────────────────
    ["Tabellenrahmen ink-200 auf ink-50 (th)", t("ink-200"), ink50, 3],
    ["Tabellenschrift ink-700 auf ink-50 (th)", t("ink-700"), ink50, 7],
    ["Codeplatte Shiki-Text #e1e4e8 auf code-bg", "#e1e4e8", t("code-bg"), 4.5],
    ["Codeplattenkante ink-200 auf surface", t("ink-200"), surf, 3],
    ["Codeplattenkante ink-200 auf code-bg", t("ink-200"), t("code-bg"), 3],
  ];
};

let fehler = 0;
const quiet = process.argv.includes("--quiet");
for (const [name, c] of Object.entries(schemes)) {
  const rows = paare(c);
  if (!quiet) {
    console.log(`\n── Schema: ${name} ${"─".repeat(Math.max(0, 58 - name.length))}`);
    console.log("  Verhältnis  Ziel   Paar");
  }
  for (const [label, fg, bg, min] of rows) {
    if (!fg || !bg) throw new Error(`Farbe fehlt für „${label}" (${fg} / ${bg})`);
    const r = ratio(fg, bg);
    const ok = r >= min - 1e-9;
    if (!ok) fehler++;
    if (!quiet || !ok) {
      const mark = ok ? "  " : "!!";
      console.log(`${mark} ${r.toFixed(2).padStart(6)}:1  ${String(min).padStart(4)}   ${label}   ${fg} / ${bg}`);
    }
  }
}
console.log(fehler === 0 ? "\nAlle geprüften Paare halten ihr Ziel." : `\n${fehler} Paar(e) unter Ziel.`);
process.exit(fehler === 0 ? 0 : 1);
