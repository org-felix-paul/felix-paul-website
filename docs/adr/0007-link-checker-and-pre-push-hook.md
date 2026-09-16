# 0007. Own link checker, run by a tracked pre-push hook

Status: accepted 2026-09-10

## Context

An earlier inline check asked "does this path exist in `dist/`?". A folder
without `index.html` exists but is served as a 404 by Cloudflare Pages; such
a link reached production. There was also no CI, and adding GitHub Actions
for a site that deploys through Cloudflare's git connection would have been a
second pipeline to maintain.

## Decision

`scripts/check-links.mjs` resolves every `href` and `src` in `dist/` with the
host's rules (trailing slash, implicit `.html`, implicit `index.html`, folder
without index → 404), checks relative links and `#anchors`, and lists
deliberately open links in a `KNOWN` array with reasons. `.githooks/pre-push`
runs `astro check`, `astro build` and this script; git is pointed at the
folder with `git config core.hooksPath .githooks` once per clone.

## Consequences

- Nothing with a broken internal link reaches `main`, and `main` is live.
- The hook must be activated per clone; the README says so in bold. A
  clone that skips it is not protected.
- The check runs on push, not commit, so committing work in progress stays
  free. `--no-verify` remains available for undeployed branches.
