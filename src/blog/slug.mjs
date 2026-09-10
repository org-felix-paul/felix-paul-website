#!/usr/bin/env node
/**
 * Gibt die Anker-ID (den "Slug") für einen Überschriftentext aus – exakt so,
 * wie rehype-slug sie beim Build erzeugt. Damit kann man beim Schreiben eines
 * Inhaltsverzeichnisses die Sprung-Links von Hand anlegen, ohne raten zu müssen.
 *
 * Nutzung:
 *   npm run slug "1. Die vier Stufen"
 *   → #1-die-vier-stufen
 *
 * Den Überschriftentext OHNE führende "##", aber MIT der Nummer angeben.
 */
import GithubSlugger from "github-slugger";

const text = process.argv.slice(2).join(" ").trim();

if (!text) {
  console.error('Nutzung: npm run slug "1. Deine Überschrift"');
  process.exit(1);
}

console.log("#" + new GithubSlugger().slug(text));
