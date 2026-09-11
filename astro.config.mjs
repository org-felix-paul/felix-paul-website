import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { unified } from "@astrojs/markdown-remark";
import rehypeSlug from "rehype-slug";
import rehypeTableWrap from "./src/blog/plugins/rehype-table-wrap.mjs";
import remarkMermaid from "./src/blog/plugins/remark-mermaid.mjs";
import { echteEnglischeRouten } from "./src/i18n/pages.mjs";

// Ein Origin für alles: Hauptseite unter "/", Blog unter "/blog/", Schul-
// angebote unter "/schools/". Die Referenzprojekte liegen als GitHub Pages
// unter github.felix-paul.de — siehe PROJECTS in src/consts.ts.

// Die /en/-Routen, hinter denen wirklich Englisch steht.
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
        // Rückfall-Seiten unter /en/ zeigen deutschen Text und kanonisieren
        // auf die deutsche URL. Sie in die Sitemap zu schreiben, wäre
        // widersprüchlich: sie sagen selbst, sie seien nicht das Original.
        // Echt übersetzte /en/-Seiten stehen dagegen drin — und zwar
        // automatisch, sobald die Datei unter src/pages/en/ liegt.
        (!page.includes("/en/") || uebersetzt.has(new URL(page).pathname)),
    }),
  ],
  markdown: {
    // Seit Astro 6 läuft die Markdown-Pipeline über unified(); die früheren
    // Schlüssel remarkPlugins/rehypePlugins sind veraltet. Astros Standards
    // (GFM, SmartyPants, Shiki) bleiben aktiv, die Plugins kommen obendrauf
    // und gelten für alle Markdown-Collections.
    processor: unified({
      remarkPlugins: [remarkMermaid],
      // rehype-slug gibt jeder Überschrift eine GitHub-artige Anker-ID, damit
      // Inhaltsverzeichnisse auf Abschnitte springen können.
      rehypePlugins: [rehypeSlug, rehypeTableWrap],
    }),
  },
  // Tailwind über das Vite-Plugin (der von Tailwind empfohlene Weg für
  // Vite-Projekte). Der PostCSS-Weg löste `@import "tailwindcss"` unter
  // Vite 8 nicht mehr auf.
  vite: {
    plugins: [tailwindcss()],
  },

  build: {
    // Kleines CSS-Bundle direkt ins HTML inlinen -> kein render-blockierender Request
    inlineStylesheets: "always",
  },
});
