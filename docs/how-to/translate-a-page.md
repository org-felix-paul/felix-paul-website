# How to translate a page

German is the default language and keeps the URLs without prefix
(`/schools/`). English lives under `/en/` (`/en/schools/`).

## What exists today

| Page | English version |
|---|---|
| `/`, `/companies/`, `/individuals/` | real translations, same file as the German page (`src/home/`, `src/audiences/`) |
| `/impressum/`, `/datenschutz/`, `/thank-you/` | real translations in `src/pages/en/` |
| `/schools/…`, `/blog/…` | German content under the English URL (fallback) |

Astro's `fallback: { en: "de" }` in `astro.config.mjs` builds an `/en/…` URL
for **every** German page. Where no English file exists, the German content
is served there, with a canonical link back to the German URL, no `hreflang`
and no sitemap entry. Menu entries pointing at such a page carry a small
"in German" badge on the English site. All of that is computed from which
files exist under `src/pages/en/`; nothing is maintained by hand.

## Translate a page that is built from a component

The home page and the audience pages already contain both languages. Edit
the `en` object in the section file. Nothing else.

## Translate a page that only exists in German

Example: the schools overview.

1. Create `src/pages/en/schools/index.astro` with the same path as the German
   file (`/en/X/` ↔ `/X/` is derived mechanically, so the slug must match).
2. Pass `lang="en"` to the layout: `<Layout lang="en" title="…" description="…">`.
   That sets `<html lang>`, the header and footer labels, and the contact
   form's English auto-reply and thank-you page.
3. For links to other pages use `lokalisiere(href, "en")` from
   `src/i18n/pages.mjs`; it returns the English path if that page exists and
   the German one otherwise.

Once the file exists the language switch in the header appears on both
pages, the `hreflang` pair is emitted, the "in German" badges for that
target disappear and the page enters the sitemap.

For a large page consider the pattern of `src/audiences/`: move the markup
into one component with `de` and `en` objects and let both route files call
it, so that later layout changes are made once.

## Things that stay German on purpose

Route segments (`/schools/`, not `/en/schulen/`), `/impressum/` and
`/datenschutz/` (the terms German visitors search for), blog post slugs, and
the school workshops (written for the German school system). The English
legal pages state that they are courtesy translations.
