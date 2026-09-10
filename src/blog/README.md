> Scope: this section only. Repo-wide setup, deployment and the SEO
> review checklist live in the root `README.md`; the merge history is in
> `claude-behavior.md`.

# Blog section (`/blog/`)

**blogging@Felix Paul** — der persönliche Blog von **Felix Peter Paul** zu Themen, die
ihn begeistern: KI & AI-Security, Teaching und beliebige spannende IT-Projekte. Er ist
ein Geschwister-Projekt des zentralen Hubs [felix-paul.de](https://felix-paul.de) und
teilt dessen Look und Stack.

> **Sprache:** Die gesamte Oberfläche und alle Beiträge sind auf **Deutsch**. Branding:
> Wortmarke „blogging@Felix Paul“ und ein blog-spezifisches Favicon (Feed-Glyph in der
> Markenfarbe `#015aa0`). Es gibt **kein** „FP“-Monogramm mehr.

## Why this stack

This was a deliberate decision (see `administration/ROADMAP.md` → "make a small blog").
Ghost and hosted newsletter platforms were considered. Astro won for v1 because it is
**free**, keeps **content as markdown in git** (docs-as-code), reuses the existing
`main-website` stack, and ships today. The paid/membership features that would favour
Ghost are explicitly deferred (no paying customer yet).

**Migration trigger:** once paid demand is validated, either add a Cloudflare
Workers + Stripe paywall (content stays in git) or export the markdown to Ghost. The
Astro → Ghost direction is the cheap one, so starting here keeps options open.

## Stack

- [Astro](https://astro.build/) (static output)
- [Tailwind CSS v4](https://tailwindcss.com/) via `@tailwindcss/postcss`
- `@astrojs/sitemap` for `sitemap-index.xml`
- A `posts` content collection (markdown in `src/blog/content/posts/`)
- Deployed as a static site on **Cloudflare Pages**

Language: **German** throughout. Legal pages live on the main site — the footer links
to `felix-paul.de/impressum/` and `/datenschutz/` rather than duplicating them.

## Writing a post

Add a markdown file to `src/blog/content/posts/`. The filename (kebab-case) becomes the URL
slug. Frontmatter is validated by `src/blog/collection.ts`:

```yaml
---
title: "Post title"
description: "One- or two-sentence teaser, shown in the list and as the meta description."
pubDate: 2026-05-28
audience: ["teachers"]      # any of: students, parents, teachers
topics: ["ai", "security"]  # any of: ai, security, general
draft: false                # true hides it from the build
preview: false              # true = "Coming soon …" teaser (see below)
---
```

Body is plain markdown; raw HTML is allowed for anything fancy. The audience/topic
vocabularies are defined once in `src/blog/consts.ts` (`AUDIENCES`, `TOPICS`) and drive both
the schema and the filter UI — add a value there and it appears everywhere.

### Preview posts (look-ahead teasers)

Set `preview: true` to publish a post as a **teaser** for something planned but not yet
written. Preview posts appear in the list with only their title, topic/audience chips and a
`Coming soon …` placeholder instead of the description — the body and the detail page are
suppressed entirely. They give readers a transparent look at what's coming next.

The home page has a **Status** filter (`Veröffentlicht` / `Preview`) so previews can be
shown alongside or separately from published posts. The status vocabulary and the German
labels live in `src/blog/consts.ts` (`STATUSES`, `STATUS_LABELS`). When the post is ready, flip
`preview` to `false` and fill in the real body.

## Adding a new audience or topic

The vocabularies live in **one place**: `src/blog/consts.ts`. Editing them updates the schema
(`src/blog/collection.ts`), the filter pills and the post badges automatically — nothing
else to touch.

To add a topic (same steps for an audience, using `AUDIENCES` / `AUDIENCE_LABELS`):

1. Add the value to the `TOPICS` array (lowercase, no spaces — this is what goes in
   frontmatter and the URL of any future filter state):

   ```ts
   export const TOPICS = ["ai", "security", "general", "crypto"] as const;
   ```

2. Add a display label in `TOPIC_LABELS`. TypeScript **forces** this — `TOPIC_LABELS` is
   `Record<Topic, string>`, so the build fails until every value has a label:

   ```ts
   export const TOPIC_LABELS: Record<Topic, string> = {
     ai: "AI",
     security: "Security",
     general: "General",
     crypto: "Cryptography",
   };
   ```

3. Use it in any post's frontmatter: `topics: ["crypto"]`.

Run `npm run build` (or `npx astro check`) to confirm — a typo'd value in frontmatter or a
missing label is a build error, not a silent miss.

**Removing or renaming** a value: change it in `src/blog/consts.ts`, then update any post
frontmatter that still uses the old value (the build will flag the stragglers).

## Filtering & search

### Where it runs

**100% in the user's browser, in JavaScript** — no backend, no API, no network call,
and **no search engine or library** (no Pagefind, Algolia, Fuse.js, Lunr, FlexSearch).
It is a hand-rolled inline `<script>` in `src/pages/blog/index.astro` (~50 lines).

The flow:

1. **At build time** Astro renders every published post into the static HTML. For each
   post it concatenates `title + description + topic labels + audience labels + full
   markdown body`, lowercases it, and writes it into a `data-search` attribute on the
   post's `<li>` (see `searchText`, `index.astro:29`). So the searchable text ships
   pre-baked inside `index.html`.
2. **In the browser**, on every `input` event, the script lowercases/trims the query and
   does a plain `text.includes(query)` substring test per card, toggling `hidden`
   (`index.astro:174`). Audience/topic pills are combined with search as a logical AND.

### Is it "full-text" search?

Sort of. It *does* search the **entire post body** (not just the title/teaser), so in
that sense it is full-text. But it is a naïve **case-insensitive substring match** — not
a real search index. There is **no** tokenisation, stemming, fuzzy matching, typo
tolerance, relevance ranking, or multi-term scoring. Matching posts simply stay visible
in their existing (newest-first) order.

### What gets found vs. not

The query must appear as **one contiguous substring** somewhere in the indexed text.

**Found:**
- Words from the title, teaser/description, **or anywhere in the article body**.
- Topic/audience **labels** as shown in the UI: `AI`, `Security`, `General`,
  `For students`, `For parents`, `For teachers`.
- **Partial words / prefixes / mid-word fragments** — `secur` → "security",
  `neura` → "neural network", `teach` → "teaching".
- **Case-insensitive** — `SECURITY` == `security`.
- Raw markdown is part of the body, so link URLs and syntax are technically searchable
  too (e.g. `http`).

**Not found:**
- **Typos / fuzzy** — `securty`, `nueral` → nothing (no fuzzy matching).
- **Multiple non-adjacent keywords** — `ai school` only matches if that exact string
  (space included) appears verbatim; it does **not** find a post that mentions "AI" in
  one place and "school" in another. (Workaround: search one word, narrow with pills.)
- **Stem in the wrong direction** — `teach` finds "teaching" (substring), but `teaching`
  does **not** find "teach"; `children` does not find "child".
- **Synonyms / translations** — `cybersecurity` won't match "IT security".
- **No JavaScript** — search and pills are inert, but all posts remain fully listed and
  linkable (progressive enhancement).

### Customer experience

Snappy and zero-latency (everything is already in the page; filtering is instant as you
type), and it works offline once loaded. The trade-off is that it behaves like a "filter
this list" box rather than a smart search engine: great for a small blog with a handful
of posts, but a single-keyword, exact-substring tool — users typing a phrase or a
misspelling may see "no posts match". This is acceptable at the current post count; if
the catalogue grows, switch to [Pagefind](https://pagefind.app/) (static, also
client-side, but with real tokenised indexing and ranking).

## Pages

| Route | File | Notes |
|-------|------|-------|
| `/` | `src/pages/blog/index.astro` | Post list + filter pills + search |
| `/<slug>/` | `src/pages/blog/[slug].astro` | Post detail + workshop CTA |
| `/404` | `src/pages/404.astro` | Not-found page |

## Run locally

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # output to dist/
npm run preview  # serve the built dist/
```

## Deploy (Cloudflare Pages)

- Framework preset: **Astro**
- Build command: `npm run build`
- Build output directory: `dist`
- No environment variables required (fully static).

`astro.config.mjs` sets `site: "https://felix-paul.de/blog"`, which drives canonical
URLs, the sitemap and Open Graph `og:url`. Point a `blog` subdomain at the Pages project
in Cloudflare. `public/robots.txt` references `https://felix-paul.de/blog/sitemap-index.xml`.

## Deferred (do not build until needed)

Email newsletter, members-only/teaser paywall and login are intentionally **not**
implemented. See the migration trigger above.

## German relaunch — what changed

The blog was relaunched as Felix's German personal blog. Summary of edits:

- **Language → German.** All UI text (header, footer, homepage, filter labels, 404, post
  layout, CTA) and all three posts (title, description, body) translated to German. `<html
  lang="de">`, `og:locale=de_DE`, date formatting via `Intl.DateTimeFormat("de-DE", …)`.
  Filter vocab labels in `src/blog/consts.ts`: `KI`, `IT-Sicherheit`, `Allgemein` /
  `Für Schüler:innen`, `Für Eltern`, `Für Lehrkräfte`. Post **slugs/filenames are
  unchanged** so links and the sitemap stay stable.
- **Branding.** Header wordmark is now **`blogging@Felix Paul`** with the blog favicon as
  the mark. The `Layout.astro` `<title>` and `og:site_name` use the same wordmark.
- **Favicon** (`public/favicon.svg`, hand-authored): rounded square in the brand color
  `#015aa0` with a white RSS/feed glyph (dot + two broadcasting arcs) and the word
  **"Blog"** across the top — instantly readable as a blog feed.
- **No more "FP".** The "FP" monogram badge was removed from header and footer and
  replaced by the favicon image + the `blogging@Felix Paul` wordmark. (Verified: no "FP"
  badge remains anywhere.)
- **Homepage hero.** Large, prominent heading: *"Felix Pauls persönlicher Blog"* with a
  short personal intro (KI & AI-Security, Teaching, spannende IT-Projekte) — designed to
  stand out from the sibling sites.
- **Footer drastically shortened.** Two columns: (1) wordmark + one-line tagline, (2) a
  **"Mehr"** group linking Felix's other sites (felix-paul.de, felix-paul.de/education,
  d-solve.de) each with a one-line mini description. A slim bottom bar holds © + the
  essential links (Impressum, Datenschutz, Kontakt). No links to small project pages.
- **Metadata.** `SITE.tagline` and `SITE.description` in `src/blog/consts.ts` updated to the
  German personal-blog positioning; OG/Twitter meta inherit it.
- **Sitemap & robots.** Verified consistent — `astro.config.mjs` has the sitemap
  integration with `site: "https://felix-paul.de/blog"`, and `public/robots.txt` points
  at `https://felix-paul.de/blog/sitemap-index.xml`. No changes needed.

## Manual follow-up steps

1. **Run a clean build.** The sandboxed environment here blocked `npm run build` (and the
   local `astro` binary), so the build could not be executed as part of this change. Run
   it locally and confirm it is clean and that `dist/sitemap-index.xml` is emitted:

   ```bash
   npm run build
   ```

2. **Regenerate `public/og-default.png` (1200×630).** `ImageMagick`'s `convert` is
   installed but was **blocked by the sandbox**, so the OG raster was **not** regenerated
   — the previous PNG is still in place. A ready-to-render source SVG is checked in at
   `og-source.svg` (brand gradient, feed-glyph mark, "blogging@Felix Paul",
   "Felix Pauls persönlicher Blog" and the "KI · IT-Sicherheit · Teaching" tagline).
   Render it and then delete the source:

   ```bash
   convert -density 96 -background none og-source.svg -resize 1200x630 -flatten public/og-default.png
   rm og-source.svg
   ```

   (Or open `og-source.svg` in any vector tool and export a 1200×630 PNG to
   `public/og-default.png`.) The current PNG is a valid, non-broken image, so the page is
   not broken in the meantime — it just shows the old artwork until regenerated.

---

## How to extend the blog

Astro + Tailwind v4. Tokens `brand-*` / `ink-*` live in `src/styles/global.css`. Run
`npm run build` after any change. The whole blog is in German.

### Add a new reusable component

Create `src/blog/components/MyThing.astro` (typed `Props` in the frontmatter, markup below) and
import it where needed. The blog ships `Header.astro` and `Footer.astro`; the index and
post layouts live in `src/pages/blog/index.astro` and `src/pages/blog/[slug].astro`, the page shell
in `src/blog/BlogLayout.astro`. Match the existing Tailwind classes.

### Add a new blog post

Posts are a **content collection** — drop in a Markdown file and it appears automatically
(in the list, the filters, the sitemap and at its own URL).

1. Create `src/blog/content/posts/mein-beitrag.md`. The **file name becomes the URL slug**
   (`/mein-beitrag/`), so keep it lowercase-kebab. Frontmatter (schema in
   `src/blog/collection.ts`):
   ```md
   ---
   title: "Mein Beitragstitel"
   description: "1–2 Sätze, erscheinen in der Liste und als OG/Meta-Beschreibung."
   pubDate: 2026-06-01          # YYYY-MM-DD
   audience: ["teachers"]       # any of: students, parents, teachers
   topics: ["ai", "security"]   # any of: ai, security, general
   draft: false                 # true = excluded from the build
   ---

   Dein Beitrag in **Markdown**. Überschriften mit `##`, Listen, Links, Bilder …
   ```
2. `audience` and `topics` drive the on-site filter chips; their German labels live in
   `AUDIENCE_LABELS` / `TOPIC_LABELS` in `src/blog/consts.ts`. To add a *new* audience or topic
   value, extend the `AUDIENCES` / `TOPICS` arrays and the label maps there.
3. Images for a post go in `public/` and are referenced with an absolute path
   (`/img/…`). Give every image meaningful alt text.
