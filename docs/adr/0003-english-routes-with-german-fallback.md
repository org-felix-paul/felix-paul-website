# 0003. English under `/en/` with German fallback, translation state computed from files

Status: accepted 2026-09-10

## Context

The site is German-first, but the speaking and consulting audience is partly
English-speaking. Translating everything at once was not realistic, and
translated pages drift when the German page changes.

## Decision

Astro i18n with `defaultLocale: "de"`, `prefixDefaultLocale: false` and
`fallback: { en: "de" }` with `fallbackType: "rewrite"`: every German page
also exists under `/en/`, serving German content where no translation
exists. Which `/en/` pages are real is derived at build time from the files
under `src/pages/en/` (`src/i18n/pages.mjs`), and drives `hreflang`, the
language switch, the sitemap filter and the "in German" badges.

Pages that exist in both languages are one component with `de` and
`en: typeof de` text objects, so TypeScript reports a missing translation.
Route segments stay English (`/schools/`), legal slugs stay German
(`/impressum/`), and the school workshops and the blog stay German on
purpose.

## Consequences

- The English URL tree is complete from day one; each translation replaces
  a fallback and needs no configuration.
- Fallback pages are honest: canonical to the German URL, no `hreflang`, not
  in the sitemap, badge in menus.
- The `/en/X/` ↔ `/X/` pairing is mechanical, so an English page must keep
  the German slug (`/en/impressum/`, not `/en/legal-notice/`).
- Translated legal pages are courtesy translations and say so.
