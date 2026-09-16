# Reference: file map

## Routes

Astro derives URLs from files under `src/pages/`. Route files are thin;
the content lives where the second column says.

| URL | Route file | Content lives in |
|---|---|---|
| `/` | `src/pages/index.astro` | `src/home/HomePage.astro` and one file per section |
| `/en/` | `src/pages/en/index.astro` | same, `lang="en"` |
| `/companies/`, `/en/companies/` | `src/pages/companies.astro`, `en/companies.astro` | `src/audiences/CompaniesPage.astro` |
| `/individuals/`, `/en/individuals/` | `src/pages/individuals.astro`, `en/individuals.astro` | `src/audiences/IndividualsPage.astro` |
| `/schools/` | `src/pages/schools/index.astro` | that file + `src/schools/components/`, cards from `src/schools/content/angebote/` |
| `/schools/insights/` | `src/pages/schools/insights.astro` | that file; links from `PROJECTS` in `consts.ts` |
| `/schools/workshops/<slug>/` | `src/pages/schools/workshops/[slug].astro` | `src/schools/content/angebote/<slug>.md` |
| `/blog/` | `src/pages/blog/index.astro` | list, filters and search; posts from `src/blog/content/posts/` |
| `/blog/<slug>/` | `src/pages/blog/[slug].astro` | `src/blog/content/posts/<slug>.md` |
| `/impressum/`, `/datenschutz/`, `/thank-you/`, `/404` | `src/pages/*.astro` | those files (English in `src/pages/en/`) |
| `/en/<anything else>/` | none | Astro fallback: German content, canonical to the German URL |
| `/sitemap-index.xml` | `@astrojs/sitemap` in `astro.config.mjs` | filter excludes thank-you pages and fallback pages |
| `/robots.txt`, `/llms.txt`, `/_redirects`, images, PDFs | `public/` | copied verbatim |

## What is defined where

```mermaid
flowchart TB
  subgraph cfg["Project"]
    AC["astro.config.mjs<br/>site URL, i18n, sitemap filter,<br/>markdown plugins, Tailwind"]
    PK["package.json<br/>npm scripts"]
    HK[".githooks/pre-push<br/>check + build + links"]
    SC["scripts/<br/>check-links.mjs, check-contrast.mjs"]
  end
  subgraph shared["src/ — shared, imports nothing from a section"]
    K["consts.ts<br/>SITE identity · PATHS · PROJECTS<br/>AREAS (footer) · NAV (header)"]
    D["deploy.ts<br/>preview banner decision"]
    I["i18n/pages.mjs<br/>which /en/ pages exist, lokalisiere()<br/>i18n/ui.ts — footer/form labels"]
    L["layouts/Layout.astro<br/>&lt;head&gt;, canonical, hreflang, OG,<br/>schema.org graph, theme script,<br/>header slot, footer"]
    C["components/<br/>SiteHeader · SiteFooter · Section<br/>ContactForm · CtaBanner<br/>ZielgruppenHinweis · ThemeToggle<br/>LanguageLink · EnvBanner"]
    G["styles/global.css<br/>colour tokens light/dark,<br/>.prose-content, tables, mermaid"]
    CC["content.config.ts<br/>registers the three collections"]
  end
  subgraph sections["src/ — sections, each self-contained"]
    H["home/<br/>HomePage + one file per section"]
    A["audiences/<br/>CompaniesPage · IndividualsPage"]
    S["schools/<br/>SchoolsLayout · consts · collection<br/>components/ · content/angebote/"]
    B["blog/<br/>BlogLayout · consts · collection<br/>components/ · plugins/ · content/posts/"]
    N["news/<br/>collection · NewsLog · content/"]
  end
  P["src/pages/ — routes only"] --> H & A & S & B
  P --> L
  H & A --> L & C & K
  S & B --> L & C & K
  N --> C
  L --> C & K & I & G & D
  C --> K & I
  CC --> S & B & N
  AC --> I
  S -. "cards on the home page" .-> H
  B -. "latest posts on the home page" .-> H
```

Dashed arrows are data (a home section reads a section's collection), not
imports of section code into shared code.

## `src/consts.ts` at a glance

| Export | Holds | Used by |
|---|---|---|
| `SITE` | name, tagline, description, URL, e-mail, address, phone, social links | Layout (schema.org), footer, contact form, legal pages |
| `PORTRAIT` | the one portrait image and the press photo | hero, about, press section, schema.org |
| `PATHS` | every internal URL: sections, legal pages, `#kontakt`, thank-you | everything that links across sections |
| `FAVICONS` | one icon per section | the three layouts |
| `PROJECTS`, `GITHUB_PAGES` | links to the reference projects on GitHub Pages | `/schools/insights/` |
| `AREAS` | the four business areas with German and English labels | footer, schema.org offers |
| `NAV`, `NavItem`, `NavGroup`, `isGroup` | the header menu | `Header.astro`, `SiteHeader.astro` |

`src/schools/_source-images/` holds the working files for the schools logo
and favicon; nothing references them and they are not published.

Section constants: `src/blog/consts.ts` (`BLOG`, `postPath`, taxonomies and
labels), `src/schools/consts.ts` (`SCHOOLS`, `SCHOOLS_PATHS`,
`workshopPath`), `src/news/collection.ts` (`NEWS_KINDS`).

## Build pipeline

```mermaid
flowchart LR
  MD["Markdown + frontmatter<br/>src/*/content/"] -->|"glob loader + Zod schema<br/>(collection.ts)"| COL["content collections"]
  COL -->|"getCollection()"| PG["pages and sections<br/>(.astro)"]
  PG --> LAY["Layout.astro"]
  LAY -->|"astro build"| DIST["dist/ — static HTML,<br/>CSS inlined, JS only where needed"]
  PUB["public/"] -->|copied| DIST
  DIST --> LC["check-links.mjs"]
  DIST -->|"push to main"| CF["Cloudflare Pages"]
```

Markdown passes through `remark-mermaid` (turns ```` ```mermaid ```` blocks
into `<pre class="mermaid">`), `rehype-slug` (heading ids) and
`rehype-table-wrap` (a `div.table-wrap` around each table); all three are
configured in `astro.config.mjs`. Mermaid itself is loaded in the browser
only on pages that contain a diagram (`src/pages/blog/[slug].astro`).
