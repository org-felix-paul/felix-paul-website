# ReadMyBook — standalone static page

A self-contained, dependency-free page describing **ReadMyBook**, an
AI-based Android app (Google ML Kit text recognition) that reads a children's
book aloud. Built as a complement to a children's book by a friend, so children
whose parents have little time can have a book read to them by scanning it.

**The project is discontinued.** The page says so explicitly, in English and
German, and exists as a portfolio reference.

## Where it lives

Served as a static folder inside the felix-paul.de site at
**`/projects/readmybook/`**. It is a plain copy under `public/projects/` — the
Astro build touches nothing in here, it only copies the folder. Linked from
`/education/projekte/`.

Nothing links out to d-solve.de any more: the page was originally styled and
branded for dSolve and planned for `readmybook.d-solve.de`; that hosting plan
was dropped when everything moved onto one domain. Brand mark, title,
description and footer attribution now point at felix-paul.de.

## Files

```
readmybook/
├── index.html    # the whole page
├── styles.css    # standalone styles (no framework, no build step)
├── favicon.svg   # the felix-paul.de site mark
└── img/
    ├── autorin-liest.png
    ├── Eltern-lesen.png
    ├── nachtmodus.png
    ├── readmybook-cover.jpg      # preview/thumbnail used on /education/projekte/
    └── readmybook-description.jpg
```

## Preview locally

No build step:

```bash
python3 -m http.server 8000   # from this folder, then open http://localhost:8000
```

Note that the header brand links to `/`, which resolves to the site root — so
when previewing this folder standalone that one link goes nowhere. It is
correct in the deployed site.

## Known loose ends

- `index.html` loads Inter from `rsms.me`. The rest of the site ships Inter
  locally via `@fontsource-variable/inter`; a standalone HTML file cannot share
  that bundle, so this stays a third-party request. Swap it for a system font
  stack if that matters more than exact visual parity.
- The embedded YouTube video is `https://www.youtube.com/embed/2dvV22lTHV8`,
  carried over from the old d-solve products page. Worth confirming it is still
  public and on the intended account.
