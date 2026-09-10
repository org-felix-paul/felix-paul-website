import { existsSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";

const WURZEL = "src/pages/en";

/**
 * Die /en/-Routen, hinter denen wirklich eine übersetzte Seite steht.
 *
 * Astro erzeugt durch `fallback: { en: "de" }` für JEDE deutsche Seite auch
 * eine /en/-URL — dort steht dann aber der deutsche Text. Solche Rückfall-
 * seiten kanonisieren auf die deutsche URL und dürfen weder in die Sitemap
 * noch in ein hreflang-Paar. Unterscheiden lassen sie sich nur an der Quelle:
 * echt übersetzt ist, wofür eine Datei in src/pages/en/ existiert.
 *
 * Wird zur Bauzeit gelesen (astro.config und Layout laufen in Node), nicht im
 * Browser.
 */
export function echteEnglischeRouten() {
  if (!existsSync(WURZEL)) return new Set();

  const routen = new Set();
  const ablaufen = (verzeichnis) => {
    for (const eintrag of readdirSync(verzeichnis, { withFileTypes: true })) {
      const pfad = join(verzeichnis, eintrag.name);
      if (eintrag.isDirectory()) {
        ablaufen(pfad);
        continue;
      }
      if (!/\.(astro|md|mdx)$/.test(eintrag.name)) continue;
      // src/pages/en/index.astro -> /en/, src/pages/en/about.astro -> /en/about/
      const rest = relative(WURZEL, pfad).replace(/\.(astro|md|mdx)$/, "");
      const stamm = rest === "index" ? "" : rest.replace(/\/index$/, "");
      routen.add(stamm ? `/en/${stamm}/` : "/en/");
    }
  };
  ablaufen(WURZEL);
  return routen;
}

/**
 * Übersetzt einen internen Pfad in seine englische Entsprechung — aber nur,
 * wenn es die englische Seite wirklich gibt.
 *
 * Das ist der Kern von „dementsprechend verlinken": ein Link von einer
 * englischen Seite soll englisch weitergehen, wo das möglich ist, und
 * ansonsten ehrlich auf die deutsche Seite führen. Auf `/en/schools/` zu
 * verlinken wäre falsch — dort steht deutscher Text unter einer englischen
 * Adresse, und der Leser merkt es erst nach dem Klick.
 *
 * Externe Ziele, Anker und bereits englische Pfade bleiben unverändert.
 */
export function lokalisiere(href, sprache) {
  if (sprache !== "en") return href;
  if (typeof href !== "string") return href;
  if (!href.startsWith("/") || href.startsWith("//") || href.startsWith("/en/")) return href;

  const routen = echteEnglischeRouten();
  // "/#kontakt" -> Pfad "/" und Anker "#kontakt" getrennt behandeln.
  const teiler = href.indexOf("#");
  const pfad = teiler === -1 ? href : href.slice(0, teiler);
  const anker = teiler === -1 ? "" : href.slice(teiler);
  const englisch = pfad === "/" ? "/en/" : `/en${pfad}`;
  return routen.has(englisch) ? englisch + anker : href;
}

/**
 * Wahr, wenn ein internes Ziel es nur auf Deutsch gibt.
 *
 * Wird berechnet statt gepflegt: sobald eine Seite unter `src/pages/en/`
 * entsteht, verschwindet der Hinweis „in German" von selbst. Ein von Hand
 * gesetztes Flag hätte man dabei vergessen.
 */
export function nurDeutsch(href) {
  if (typeof href !== "string") return false;
  if (!href.startsWith("/") || href.startsWith("//") || href.startsWith("/en/")) return false;
  if (href.startsWith("/#")) return false;
  return lokalisiere(href, "en") === href;
}
