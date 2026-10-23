# How to check and deploy

## The checks

| Command | What it does | When |
|---|---|---|
| `npm run check` | `astro check`: TypeScript and Astro diagnostics across all files | before every push (hook) |
| `npm run build` | builds `dist/`; validates all content frontmatter | before every push (hook) |
| `npm run check:links` | resolves every internal `href`/`src` in `dist/` the way Cloudflare Pages does, including `#anchors` | before every push (hook) |
| `npm run verify` | the three above in one go | any time |
| `npm run check:links:live` | additionally fetches every built page from felix-paul.de | after a deploy that moved pages |
| `npm run check:contrast` | WCAG AA for every text/background pair in the markup, light and dark | after changing colours |

**Why an own link checker.** "Does the file exist?" is the wrong question: a
folder without an `index.html` exists on disk but is served as a 404. The
script mirrors the host's rules (`/a/b/` → `a/b/index.html`, `/a/b` →
`a/b.html` or `a/b/index.html`, folder without index → 404). Links that
cannot be repaired go into the `KNOWN` list at the top of
`scripts/check-links.mjs`, each with a reason.

## The pre-push hook

`.githooks/pre-push` runs check, build and link check on `git push` and
aborts the push on the first failure. It runs on push, not on commit, so
committing work in progress is free. Activate once per clone:

```bash
git config core.hooksPath .githooks
```

`git push --no-verify` skips it. Acceptable for a branch that is not
deployed; do not make it a habit on `main`, because `main` is live.

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
- Submit the form once and check that the mail arrives with the sender as
  `Reply-To`, and that the auto-reply reaches the sender (FormSubmit
  occasionally needs re-activation after long inactivity: submit once, click
  the activation link in the mail).
- Paste a URL into LinkedIn or WhatsApp and check the preview image; the
  main site, blog and schools have different ones.
- Once a quarter: [seo-review.md](seo-review.md).
