# How to check and deploy

## Checks and the pre-push hook

Which checks exist, which run automatically and which against the live
site: [reference/testing.md](../reference/testing.md). In short: the
pre-push hook runs check, unit tests, build and link check on every
`git push`; `git push --no-verify` skips it, fine for a
branch that is not deployed, not on `main`, because `main` is live.

## Deploy

Cloudflare Pages is connected to the GitHub repository. Push to `main` →
Pages runs `npm run build` → `dist/` is live. No CI file, no secrets, no
`wrangler.toml`. Settings in the Pages project: build command `npm run
build`, output directory `dist`, Node 20 or newer.

`public/_redirects` is Cloudflare's redirect file: old paths from before the
merge, renamed downloads, and the reference projects that moved to GitHub
Pages. First matching rule wins, so specific rules come before `/projects/*`.

## Preview deployments and the banner

Every branch that Pages builds, other than `main`, shows an amber strip
above the header ("Vorschau · Branch <name>"). `astro dev` shows "Lokale
Entwicklung". Production shows nothing; a local `npm run build` shows
nothing either, because anything uncertain is treated as production.

The decision is in `src/deploy.ts`, based on `CF_PAGES_BRANCH`, which
Cloudflare sets on every build. The value is inlined at build time, so on
`main` the banner markup does not exist in the HTML at all. If the
production branch is ever renamed, rename `PRODUCTION_BRANCH` there too.

To get a preview environment: create the branch, allow it under Settings →
Builds & Deployments → Branch control in the Pages project, optionally give
it a hostname (`int.felix-paul.de`). No code change.

Test locally:

```bash
CF_PAGES_BRANCH=int npm run build && npm run preview   # banner
npm run build && npm run preview                       # no banner
```

## After a deploy

- `npm run check:links:live` if pages moved.
- `npm run check:form:live` after a deploy that touches the form or its
  secrets. If it fails: [contact-form.md](contact-form.md#when-it-breaks).
- Paste a URL into LinkedIn or WhatsApp and check the preview image; the
  main site, blog and schools have different ones.
- Once a quarter: [seo-review.md](seo-review.md).
