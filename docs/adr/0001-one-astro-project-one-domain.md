# 0001. One Astro project, one domain, sections as paths

Status: accepted 2026-09-10

## Context

The personal site, the blog, the school offers and three reference projects
lived in separate repositories on separate subdomains (`blog.`, `edu.`,
`neck.`, `codenight.`, `tierparks.felix-paul.de`). Each site declared its own
header, footer, contact form, legal pages, portrait and schema.org `Person`.
Search engines saw several competing descriptions of the same person, and
every shared change had to be made several times.

## Decision

Merge everything into one Astro project on `https://felix-paul.de`. Former
subdomains become paths (`/blog/`, `/schools/`). Each section keeps its own
folder under `src/` with layout, components, constants, content and schema.
Shared code never imports from a section; sections may import shared code.

## Consequences

- One deploy, one sitemap, one `robots.txt`, one identity in schema.org.
- Shared chrome exists once; the footer is byte-identical within a language.
- A section can still be extracted: copy its folder, its route files and
  its `public/` folder, add a standalone layout.
- The old subdomains were deleted with their DNS records, so no redirects
  from them are possible; `public/_redirects` only covers same-origin moves.
