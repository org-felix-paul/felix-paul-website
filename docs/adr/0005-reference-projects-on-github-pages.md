# 0005. Reference projects live on GitHub Pages, this site only links

Status: accepted 2026-09-10

## Context

After the merge the reference projects (NECK, Codenight, the pupils' animal
websites, ReadMyBook) were byte-identical copies under `public/projects/`:
36 MB, three quarters of every deploy, re-uploaded on every push although
they never change. They also carried their own broken links, which the link
checker had to whitelist.

## Decision

The projects are published from their own repositories as GitHub Pages under
`https://github.felix-paul.de/…`. This site links to them (`PROJECTS` in
`src/consts.ts`) and redirects the old `/projects/…` URLs there in
`public/_redirects`.

## Consequences

- Deploys are small; the link checker has an empty `KNOWN` list.
- NECK's path is upper-case (`/NECK/`); GitHub Pages is case-sensitive.
- The projects' own SEO (multiple H1s, shared descriptions) is no longer this
  site's concern.
