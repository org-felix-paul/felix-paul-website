# Tests and checks

What is checked, when, and where it runs. Commands are in `package.json`;
how to set up the contact form secrets is in
[contact-form.md](../how-to/contact-form.md).

## Before a deploy: against the code and `dist/`

No network. The pre-push hook (`.githooks/pre-push`) runs check, build and
link check on every `git push` and aborts on the first failure. GitHub Actions
runs `npm run verify` again on every push and pull request
(`.github/workflows/verify.yml`), which catches `--no-verify` and clones
without the hook. Cloudflare Pages itself only runs `npm run build` and
deploys regardless, so a red Verify run on `main` means the site is already
live with the error: fix it right away.

| Command | What it checks | Runs automatically |
|---|---|---|
| `npm run verify` | the three below in one go: `astro check && npm run build && node scripts/check-links.mjs` | GitHub Actions, every push and pull request |
| `npm run check` | `astro check`: TypeScript and Astro diagnostics in all files | pre-push hook |
| `npm run build` | builds `dist/`, validates all content frontmatter, builds the Pagefind index | pre-push hook, Cloudflare on every push |
| `npm run check:links` | every internal `href`/`src` in `dist/` resolved the way Cloudflare Pages does, including `#anchors` | pre-push hook |
| `npm run check:contrast` | WCAG AA for every text/background pair in the markup, light and dark | — (after changing colours) |

The contact form logic has its unit tests in the
[contact-form](https://github.com/org-d-solve/contact-form) package, run on
every push there.

**Why an own link checker.** "Does the file exist?" is the wrong question: a
folder without an `index.html` exists on disk but is served as a 404. The
script mirrors the host's rules (`/a/b/` → `a/b/index.html`, `/a/b` →
`a/b.html` or `a/b/index.html`, folder without index → 404). Links that
cannot be repaired go into the `KNOWN` list at the top of
`scripts/check-links.mjs`, each with a reason.

Activate the hook once per clone, and again after moving the folder (the
path is stored in `.git/config`):

```bash
git config core.hooksPath .githooks
```

## After a deploy: against the live site

These need the deployed site and the network. Both scripted ones run daily
at 06:17 UTC as two jobs of `.github/workflows/live-checks.yml`, startable by
hand under Actions; a failed run mails the person who last edited the
workflow.

| Command | What it checks | Runs automatically |
|---|---|---|
| `npm run check:form:live` | the real contact form chain: enquiry in test mode → Pages Function → Zoho → mail in the folder `felix-paul/test` within 90 s | daily, GitHub Actions |
| `npm run check:links:live` | `check:links` plus fetching every built page from felix-paul.de | daily, GitHub Actions (builds `main` first) |
| by hand | link preview image in LinkedIn or WhatsApp (main site, blog and schools differ) | — |
| by hand, quarterly | [seo-review.md](../how-to/seo-review.md) | — |

Previews (`*.official-representation.pages.dev`) are behind Cloudflare
Access, so the scripts cannot reach them; test a branch in the browser while
logged in. GitHub pauses scheduled workflows after 60 days without a commit;
re-enable under Actions.
