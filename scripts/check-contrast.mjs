// Prüft die Farbkombinationen, die das Markup wirklich ausliefert, gegen
// WCAG AA — in beiden Schemata.
//
// Der Anlass: im Dunkelmodus kippen die Marken- und ink-Skalen mit, ein fest
// verdrahtetes `text-white` aber nicht. Jeder Button der Seite stand dadurch
// bei 1,68:1. Solche Fehler sieht man im Hellmodus nie — deshalb misst dieses
// Skript statt zu schauen.
//
// Es liest die Tokenwerte direkt aus global.css, damit Palette und Prüfung
// nicht auseinanderlaufen können, und sammelt die Paare aus den class-Attributen
// der .astro-Dateien: nur Kombinationen, die tatsächlich zusammen vorkommen.
//
//   node scripts/check-contrast.mjs

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const CSS = "src/styles/global.css";
const SRC = "src";

// ── Tokenwerte aus global.css ──────────────────────────────────────────────
const css = readFileSync(CSS, "utf8");
const scope = (marker) => {
  const start = css.indexOf(marker);
  const end = css.indexOf("\n}", start);
  return Object.fromEntries(
    [...css.slice(start, end).matchAll(/--c-([a-z0-9-]+):\s*(#[0-9a-fA-F]{6})/g)].map((m) => [
      m[1],
      m[2].toLowerCase(),
    ]),
  );
};
const SCHEMES = { hell: scope(":root {"), dunkel: scope(':root[data-theme="dark"]') };

// ── Kontrast nach WCAG 2.1 ─────────────────────────────────────────────────
const luminanz = (hex) => {
  const kanal = [1, 3, 5]
    .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * kanal[0] + 0.7152 * kanal[1] + 0.0722 * kanal[2];
};
const kontrast = (a, b) => {
  const [x, y] = [luminanz(a), luminanz(b)];
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
};

// ── Paare aus dem Markup einsammeln ────────────────────────────────────────
const dateien = [];
(function lauf(dir) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) lauf(p);
    else if (p.endsWith(".astro")) dateien.push(p);
  }
})(SRC);

// Verlauf: bg-gradient-to-* from-X to-Y — beide Enden tragen dieselbe Schrift.
const flaeche = (cls) => {
  const treffer = [
    ...cls.matchAll(/\bbg-((?:brand|ink|emerald|amber)-\d{2,3}|surface|canvas)\b/g),
    ...cls.matchAll(/\b(?:from|to)-((?:brand|ink|emerald|amber)-\d{2,3})\b/g),
  ].map((m) => m[1]);
  return [...new Set(treffer)];
};

const paare = new Map();
for (const datei of dateien) {
  const inhalt = readFileSync(datei, "utf8");
  for (const m of inhalt.matchAll(/class(?:List)?=?[:\s]*["'`]([^"'`]+)["'`]/g)) {
    const cls = m[1];
    const schriften = [
      ...cls.matchAll(/(?:^|\s)text-((?:brand|ink|emerald|amber)-\d{2,3}|on-accent)\b/g),
    ].map((x) => x[1]);
    const flaechen = flaeche(cls);
    if (!schriften.length || !flaechen.length) continue;
    // Schriftgröße bestimmt die Schwelle: ab 18.66px fett bzw. 24px gilt 3:1.
    const gross = /\btext-(xl|2xl|3xl|4xl|5xl|6xl)\b/.test(cls);
    for (const s of schriften)
      for (const f of flaechen) paare.set(`${s}|${f}|${gross}`, { s, f, gross, datei });
  }
}

// ── Prüfen ─────────────────────────────────────────────────────────────────
let fehler = 0;
let geprueft = 0;
for (const [name, palette] of Object.entries(SCHEMES)) {
  const schlecht = [];
  for (const { s, f, gross, datei } of paare.values()) {
    const vg = palette[s];
    const hg = palette[f];
    if (!vg || !hg) continue; // surface/canvas sind keine --c-*-Skalen? dann überspringen
    geprueft++;
    const soll = gross ? 3 : 4.5;
    const ist = kontrast(vg, hg);
    if (ist < soll) {
      fehler++;
      schlecht.push(`    text-${s} auf bg-${f}: ${ist.toFixed(2)}:1 (nötig ${soll}) — ${datei}`);
    }
  }
  console.log(`\n── Schema ${name} ${"─".repeat(50)}`);
  console.log(schlecht.length ? schlecht.join("\n") : "    alle Paare bestehen AA");
}

console.log(`\n${geprueft} Paare geprüft, ${fehler} unter AA.`);
process.exit(fehler ? 1 : 0);
