# 0002. The shared layout owns the `<head>` and the site identity

Status: accepted 2026-09-10

## Context

After the merge the question was whether each section needs its own
metadata. Before, each site emitted its own JSON-LD `Person` node and its own
`<head>` boilerplate.

## Decision

`src/layouts/Layout.astro` emits the whole `<head>`: title, description,
canonical, `hreflang`, Open Graph, favicon, theme script and the schema.org
graph. Three levels:

- once per domain: `Person`, `Organization` (dSolve), `WebSite`;
- once per page: `WebPage` with title, description, canonical, `og:url`,
  `og:image`;
- per page type, passed in through the `schema` prop: `BlogPosting` on posts,
  `Service` on workshop pages, each referencing the person by `@id`.

Section layouts only pass branding defaults (title suffix, `og:site_name`,
OG image, favicon) and supply their header through a slot.

## Consequences

- No section can accidentally declare a second identity; a second
  `ld+json` block on any page is a bug.
- The title suffix is dropped once a title alone reaches 45 characters,
  because Google shows about 60.
- Every page has exactly one `<h1>`; `Section` takes `as="h1"` for the one
  section that is the page heading.
