#!/usr/bin/env node
/**
 * Prüft alle internen Links im Build-Ergebnis so, wie ein statischer Host sie
 * auflöst.
 *
 *   npm run check:links              # gegen dist/ (schnell, offline)
 *   npm run check:links:live         # zusätzlich gegen die deployte Seite
 *
 * Warum eigenes Skript und nicht "existiert die Datei?": ein Ordner ohne
 * index.html existiert im Dateisystem, wird aber als 404 ausgeliefert. Eine
 * naive Prüfung hielt solche Links für gültig.
 *
 * Auflösungsregeln (Cloudflare Pages):
 *   /a/b/      -> dist/a/b/index.html
 *   /a/b       -> dist/a/b.html  ODER  dist/a/b/index.html
 *   /a/b.html  -> dist/a/b.html   (wird beim Ausliefern auf /a/b umgeleitet)
 *   Ordner ohne index.html        -> 404
 */
import { readFileSync, existsSync, statSync } from "node:fs";
import { readdir } from "node:fs/promises";
import { join, dirname, resolve, relative, posix } from "node:path";

const DIST = "dist";
const LIVE = process.argv.includes("--live");
const BASE = "https://felix-paul.de";

const walk = async (dir) => {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else if (e.name.endsWith(".html")) out.push(p);
  }
  return out;
};

/** Wie der Host: liefert den Dateipfad oder null (= 404). */
const servedFile = (urlPath) => {
  const rel = decodeURIComponent(urlPath).replace(/^\/+/, "");
  const candidates = rel === ""
    ? ["index.html"]
    : rel.endsWith("/")
      ? [rel + "index.html"]
      : [rel, rel + ".html", posix.join(rel, "index.html")];
  for (const c of candidates) {
    const f = join(DIST, c);
    if (existsSync(f) && statSync(f).isFile()) return f;
  }
  return null;
};

const IGNORED = /^(https?:|mailto:|tel:|data:|javascript:|#|\/\/)/i;

/**
 * Bewusst offene Links, die der Checker nicht melden soll. Jeder Eintrag
 * braucht eine Begründung, damit die Prüfung grün sein kann und trotzdem
 * niemand vergisst, warum. Neue Einträge nur, wenn der Link wirklich nicht
 * zu reparieren ist.
 *
 *   { from: "/blog/", link: "/gibt-es-nicht/", why: "…" }
 */
const KNOWN = [];
const isKnown = (from, link) => KNOWN.some((k) => k.from === from && k.link === link);

const files = (await walk(DIST)).sort();
const problems = [];
const known = [];
let checked = 0;

for (const file of files) {
  const html = readFileSync(file, "utf8");
  const fromUrl = "/" + relative(DIST, file).replace(/index\.html$/, "").replace(/\\/g, "/");

  for (const m of html.matchAll(/(?:href|src)\s*=\s*"([^"]+)"/g)) {
    const raw = m[1].trim();
    if (!raw || IGNORED.test(raw)) continue;

    const [pathPart, hash] = raw.split("#");
    // reiner Anker auf der eigenen Seite
    const target = pathPart === ""
      ? fromUrl
      : pathPart.startsWith("/")
        ? pathPart.split("?")[0]
        // Basis für relative Links: bei einer Verzeichnis-URL (endet auf "/")
        // das Verzeichnis selbst, sonst dessen Elternverzeichnis. Andernfalls
        // landet jeder relative Link einer index.html eine Ebene zu hoch.
        : posix.normalize(
            posix.join(fromUrl.endsWith("/") ? fromUrl : dirname(fromUrl), pathPart.split("?")[0]),
          );

    checked++;
    const served = servedFile(target);
    if (!served) {
      (isKnown(fromUrl, raw) ? known : problems).push({
        from: fromUrl,
        link: raw,
        why: "404 – keine Datei, die ausgeliefert würde",
      });
      continue;
    }
    if (hash) {
      const targetHtml = readFileSync(served, "utf8");
      const id = decodeURIComponent(hash);
      const found =
        targetHtml.includes(`id="${id}"`) ||
        targetHtml.includes(`id='${id}'`) ||
        targetHtml.includes(`name="${id}"`);
      if (!found) problems.push({ from: fromUrl, link: raw, why: `Anker #${id} existiert dort nicht` });
    }
  }
}

console.log(`\n  ${files.length} Seiten, ${checked} interne Links geprüft`);
if (known.length) {
  console.log(`  ${known.length} bekannte, bewusst offene Link(s) (siehe KNOWN in diesem Skript)`);
}
if (problems.length === 0) {
  console.log("  ✓ keine gebrochenen internen Links\n");
} else {
  console.log(`  ✗ ${problems.length} Problem(e):\n`);
  for (const p of problems) console.log(`    ${p.from}\n      → ${p.link}\n        ${p.why}`);
  console.log();
}

if (LIVE) {
  console.log("  Live-Prüfung gegen " + BASE + " …");
  const urls = [...new Set(files.map((f) => "/" + relative(DIST, f).replace(/index\.html$/, "").replace(/\\/g, "/")))];
  let bad = 0;
  for (const u of urls) {
    const res = await fetch(BASE + encodeURI(u), { redirect: "follow" }).catch(() => null);
    if (!res || !res.ok) { console.log(`    ${res ? res.status : "ERR"}  ${u}`); bad++; }
  }
  console.log(bad === 0 ? `  ✓ alle ${urls.length} Seiten liefern 200\n` : `  ✗ ${bad} von ${urls.length} Seiten nicht erreichbar\n`);
  if (bad) process.exitCode = 1;
}

if (problems.length) process.exitCode = 1;
