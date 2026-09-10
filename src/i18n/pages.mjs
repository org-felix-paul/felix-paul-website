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
