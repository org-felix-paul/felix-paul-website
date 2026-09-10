import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { unified } from "@astrojs/markdown-remark";
import rehypeSlug from "rehype-slug";
import remarkMermaid from "./src/blog/plugins/remark-mermaid.mjs";
import { echteEnglischeRouten } from "./src/i18n/pages.mjs";

// One origin for everything: the main site at "/", the blog at "/blog/",
// the education section at "/education/" and the untouched reference
// projects as static files under "/projects/".
// Ein Satz aus /en/-Routen, hinter denen wirklich Englisch steht.
const uebersetzt = echteEnglischeRouten();

export default defineConfig({
  site: "https://felix-paul.de",

  // Deutsch ist die Ausgangssprache und behält die URLs ohne Präfix
  // (/schools/), Englisch bekommt /en/ davor (/en/schools/).
  //
  // fallbackType "rewrite": existiert eine englische Seite nicht, liefert
  // Astro unter der englischen URL den deutschen Inhalt aus – ohne Umleitung
  // und ohne 404. Dadurch ist die englische Seitenstruktur ab dem ersten Tag
  // vollständig, und jede Übersetzung, die später dazukommt, ersetzt einfach
  // den Rückfall. Umgekehrt gäbe es Lücken, solange nicht alles übersetzt ist.
  i18n: {
    locales: ["de", "en"],
    defaultLocale: "de",
    routing: {
      prefixDefaultLocale: false,
      fallbackType: "rewrite",
    },
    fallback: { en: "de" },
  },
  integrations: [
    sitemap({
      // Form confirmation pages are dead ends with no search value and would
      // only dilute the crawl budget.
      filter: (page) =>
        !page.endsWith("/thank-you/") &&
        !page.endsWith("/education/danke/") &&
        // Rückfall-Seiten unter /en/ zeigen deutschen Text und kanonisieren
        // auf die deutsche URL. Sie in die Sitemap zu schreiben, wäre
        // widersprüchlich: sie sagen selbst, sie seien nicht das Original.
        // Echt übersetzte /en/-Seiten stehen dagegen drin — und zwar
        // automatisch, sobald die Datei unter src/pages/en/ liegt.
        (!page.includes("/en/") || uebersetzt.has(new URL(page).pathname)),
      // The reference projects are plain static files in public/, so Astro does
      // not know about them. Their entry pages are added by hand — one URL per
      // project, not every sub-page, to keep the sitemap meaningful.
      customPages: [
        "https://felix-paul.de/projects/neck/",
        "https://felix-paul.de/projects/codenight/",
        "https://felix-paul.de/projects/tierpark/UnsereTierwelt.html",
        "https://felix-paul.de/projects/readmybook/",
      ],
    }),
  ],
  markdown: {
    // Astro 6 configures the markdown pipeline through unified(); the top-level
    // remarkPlugins/rehypePlugins keys are deprecated. Astro's defaults (GFM,
    // smartypants, Shiki) stay active, these two are added on top and now apply
    // to both sections' markdown.
    processor: unified({
      remarkPlugins: [remarkMermaid],
      // rehype-slug gives every heading a GitHub-style anchor id so the tables
      // of contents can jump to a section.
      rehypePlugins: [rehypeSlug],
    }),
  },
  build: {
    // Kleines CSS-Bundle direkt ins HTML inlinen -> kein render-blockierender Request
    inlineStylesheets: "always",
  },
});
