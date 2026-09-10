import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { unified } from "@astrojs/markdown-remark";
import rehypeSlug from "rehype-slug";
import remarkMermaid from "./src/blog/plugins/remark-mermaid.mjs";

// One origin for everything: the main site at "/", the blog at "/blog/",
// the education section at "/education/" and the untouched reference
// projects as static files under "/projects/".
export default defineConfig({
  site: "https://felix-paul.de",
  integrations: [
    sitemap({
      // Form confirmation pages are dead ends with no search value and would
      // only dilute the crawl budget.
      filter: (page) =>
        !page.endsWith("/thank-you/") && !page.endsWith("/education/danke/"),
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
