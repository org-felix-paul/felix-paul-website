# How to add content

All content is Markdown with a frontmatter block. The frontmatter is checked
against a schema at build time (`src/<section>/collection.ts`), so a typo in
a field name or an unknown value fails `npm run build` instead of going live.

The file name (kebab-case, no umlauts) becomes the URL slug and must not
change afterwards, or the URL changes with it.

## Blog post

Create `src/blog/content/posts/<slug>.md`:

```md
---
title: "Titel des Beitrags"
description: "Ein bis zwei Sätze. Erscheint in der Liste und als Meta-Beschreibung."
pubDate: 2026-09-12
audience: ["teachers"]        # any of: professionals, teachers, parents, students
topics: ["ai", "security"]    # any of: general, security, ai
draft: false                  # true = not built at all
preview: false                # true = title only, "Coming soon …", no detail page
---

Body in Markdown. Raw HTML is allowed.
```

It appears at `/blog/<slug>/`, in the list at `/blog/`, and the three newest
posts show on the home page.

How the text itself is written (voice, structure, sources, diagrams, demos):
[write-a-blog-post.md](write-a-blog-post.md).

- **Images** go to `public/blog/…` or `src/blog/content/posts/img/` and are
  referenced with an absolute path (`/blog/img/…`). Give every image an alt
  text.
- **Diagrams**: a fenced code block with the language `mermaid` is rendered
  in the browser, in light and dark mode. See the existing posts for
  examples.
- **Tables** get a wrapper that keeps them on the screen on phones; nothing
  to do.
- **Table of contents**: `rehype-slug` gives every heading an anchor id. To
  link to one by hand, `npm run slug -- "1. Die vier Stufen"` prints the exact
  id.
- **New audience or topic**: add the value to `AUDIENCES` or `TOPICS` in
  `src/blog/consts.ts` and a German label to the matching `*_LABELS` map.
  TypeScript forces the label. The filter buttons on `/blog/` update
  themselves.

The search on `/blog/` is a plain substring match over title, description,
labels and the full body, done in the browser. No index, no typo tolerance.
Good enough for a handful of posts; switch to Pagefind if that changes.

## School workshop

Create `src/schools/content/angebote/<slug>.md`:

```md
---
title: "KI verstehen und verantwortungsvoll nutzen"
subtitle: "Schüler-Workshop"        # the small line above the title
zielgruppe: "Klasse 9–13"
dauer: "90 Min bis 4 Stunden"
preis: "400–1.000 €"
teaser: "Kurzbeschreibung für die Karte."
icon: "ki"                           # ki, shield, people, lock, code, keyboard
order: 2                             # lower = earlier in the grid and price table
preview: false                       # true = "In Vorbereitung", not clickable, not in the price table
---

## Worum es geht
Body for the detail page.
```

It appears as a card on `/schools/`, in the price table there, at
`/schools/workshops/<slug>/`, and the first two by `order` show on the home
page.

**New icon:** pick an outline icon at <https://heroicons.com>, copy the `d`
attribute of its single `<path>`, and add it to the `icons` map in
`src/schools/components/AngebotCard.astro`. Multi-path icons need a second
`<path>` in that component.

## News entry

The "Aktuelles" log on the home page is currently hidden (see
[change-text-and-navigation.md](change-text-and-navigation.md#show-or-hide-a-home-page-section)).
Entries can be added anyway.

Copy `src/news/content/_vorlage.md` to `src/news/content/<slug>.md`, fill in
the fields, set `draft: false`. `kind` is one of `workshop`, `vortrag`,
`publikation`, `software` (labels in `src/news/collection.ts`).

## Files: images, PDFs, downloads

Anything in `public/` is copied to the site root unchanged: `public/pdf/x.pdf`
is served at `/pdf/x.pdf`. Sections keep their assets in their own folder
(`public/blog/`, `public/schools/`). Keep files small; AVIF for photos, PDF
under a few MB.

If a file that is linked from outside is renamed, add a redirect in
`public/_redirects` so the old address keeps working.
