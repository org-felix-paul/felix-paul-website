# felix-paul.de

One Astro project serving the whole domain: the personal site at `/`, the blog
at `/blog/`, school workshops at `/education/`, and three reference projects
served verbatim under `/projects/`.

- **Merge history and every decision made:** [`claude-behavior.md`](./claude-behavior.md)
- **Blog section docs:** [`src/blog/README.md`](./src/blog/README.md)
- **Education section docs:** [`src/education/README.md`](./src/education/README.md)

## Run

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # -> dist/
npm run preview   # serve dist/ locally
npm run check       # astro check (types + diagnostics)
npm run check:links # broken internal links, resolved the way the host does
npm run check:links -- --live   # additionally fetch every page from the live site
npm run verify      # check + build + link check, all three
npm run slug -- "Ein Titel"   # slug helper for new blog posts
```

## Adding content

| what | where |
|---|---|
| Blog post | `src/blog/content/posts/<slug>.md` |
| Bildungsangebot | `src/education/content/angebote/<slug>.md` |
| Aktuelles-Eintrag (Vortrag, Workshop, Release) | `src/news/content/<slug>.md` — copy `_vorlage.md`, set `draft: false` |

The home page renders the education offers, the three latest posts and the
news log **from these same collections**. Add a file, and it appears in both
places at once — there is no second copy to keep in sync.

## Layout in one paragraph

`src/consts.ts` holds site identity and **every URL** (`PATHS`, `PROJECTS`,
`PORTRAIT`, `FAVICONS`) — change a section's path there, not with
find-and-replace. `src/layouts/Layout.astro` owns the entire `<head>`:
canonical, OG/Twitter, and the site-wide schema.org graph.
`src/components/SiteHeader.astro` and `SiteFooter.astro` hold the chrome once;
each section passes its own branding as props. Each section (`src/blog/`,
`src/education/`) owns its branding, components, content and content schema,
and wraps the shared Layout in its own `*Layout.astro`. **Shared code never
imports from a section** — that one-way dependency is what keeps a section
extractable. `src/pages/` holds routes only.

Single copies, on purpose: one contact form (the `#kontakt` block on the home
page), one confirmation page (`/thank-you/`), one Impressum, one Datenschutz,
one portrait image, and one footer (`SiteFooter.astro` takes no props and is
byte-identical on every page). Each section has its own favicon.

The four areas of the business — Keynotes & Fachvorträge, Bildungsangebote,
Software, Blog — are declared once as `AREAS` in `src/consts.ts` and reused by
the footer and the overview block, so the same four labels appear everywhere.

## Setting up a clone

```bash
git clone git@github.com:org-felix-paul/official-representation.git
cd official-representation
npm install
git config core.hooksPath .githooks   # ← do not skip this
```

**Why that last line is needed.** Git's own hook directory is `.git/hooks/`,
which is never cloned or pushed — anything in there stays on one machine. So
the hook lives in `.githooks/`, a normal tracked folder that *does* travel with
the repo, and `core.hooksPath` tells git to look there instead.

The config itself is per-clone and is deliberately not synced: a repo you clone
must not be able to run code on your machine without you opting in. So the
script arrives automatically, the activation does not. **On every new machine,
run that one command.**

Check it is active:

```bash
git config --get core.hooksPath     # should print: .githooks
```

## Before pushing

With the hook active, `git push` first runs `.githooks/pre-push`:

```
npm run check      # astro check — types and diagnostics
npm run build      # produces dist/
node scripts/check-links.mjs        # link check against that fresh build
```

Roughly 25–30 seconds, almost all of it the build. It runs on **push**, not on
commit — committing work in progress stays free.

**If anything fails, the push is aborted** and nothing reaches the remote; the
commits stay local until it is fixed. Git's rule is just exit code 0 = proceed,
anything else = stop. A typical failure:

```
  /impressum/
    → /gibt-es-nicht/
      404 – keine Datei, die ausgeliefert würde

pre-push abgebrochen: gebrochene interne Links (siehe oben).
```

Fix the link, or — if it genuinely cannot be repaired — add it to `KNOWN` in
`scripts/check-links.mjs` with a reason.

### Skipping the hook

```bash
git push --no-verify
```

Skips every pre-push hook. Legitimate when you need the commits on the remote
and know what the check would say — for instance pushing a branch that is not
deployed. Do not make it a habit on `main`: this site deploys straight from
`main`, so whatever passes here goes live.

**Why a custom link checker.** "Does the file exist?" is the wrong question: a
folder without an `index.html` exists on disk but is served as a 404. That is
exactly how `/projects/neck/css` slipped through. `scripts/check-links.mjs`
resolves every link the way the host does — trailing slash, implicit
`.html`, implicit `index.html`, folder-without-index — checks relative links
too, covers the reference projects under `/projects/`, and verifies that
`#anchors` exist on the page they point at.

Links that genuinely cannot be repaired live in the `KNOWN` list at the top of
that script, each with a reason. One of them is deliberate: a Codenight page
about alt texts shows a missing image on purpose.

## Environment banner

Preview deployments show an amber strip above the header saying they are not
the public site. Production shows nothing.

**How it decides.** Cloudflare Pages sets `CF_PAGES_BRANCH` on every build.
`src/deploy.ts` reads it:

| build | `CF_PAGES_BRANCH` | banner |
|---|---|---|
| production | `main` | none |
| any other branch | `int`, `dev`, `feat/x`, … | `Vorschau · Branch <name>` |
| `astro dev` | unset | `Lokale Entwicklung` |
| local `npm run build` | unset | none |

**Every branch except `main` gets one**, named after the branch — there is no
list of known environments to maintain, so a feature-branch preview is covered
too. The check is against the literal string `main`: if the production branch
is ever renamed, `src/deploy.ts` has to be renamed with it, or production would
start showing a banner.

The last row is deliberate: a banner that leaks into production is worse than
one missing from a preview, so anything uncertain is treated as production.
Cloudflare always sets the variable, so the only uncertain case is local.

**Why not a branch that edits the code.** The old `int` branch carried a
one-line source change to mark the environment. Every merge from `main` then
had to preserve it, and the two branches drifted. With the banner, `int` can
be a plain copy of `main` — no branch-only edits, nothing to reconcile.

**Nothing is shipped to production.** `import.meta.env.CF_PAGES_BRANCH` is
replaced at build time, so on `main` the condition is statically false and the
markup is dropped. Verified: the strings do not appear in the production HTML.

Test it locally:

```bash
CF_PAGES_BRANCH=int npm run build && npm run preview   # banner
npm run build && npm run preview                       # no banner
```

To set up a preview environment: create the branch, add it under
Settings → Builds & Deployments → Branch control in the Pages project, and
give it a hostname (e.g. `int.felix-paul.de`) if you want a stable URL. No
code change is needed — the banner appears automatically.

## Deploy

Cloudflare Pages, git-connected: push to `main` → build → live. Build command
`npm run build`, output directory `dist`. No `wrangler.toml`, no GitHub Actions
deploy step — the git connection is the pipeline.

Restrict Pages builds to `main` (+ `dev`/`int` if used) under
Settings → Builds & Deployments → Branch control. The free tier allows 500
builds/month across all projects.

---

# Manual SEO review

Run this after any structural change and once a quarter. It is deliberately
all-manual and free — no tooling to install. Deeper strategy (content, E-E-A-T,
GEO) lives in `administration/discussions/seo.md`; this is the mechanical check
for *this* repo.

## A. Manual checks against `dist/`

```bash
npm run build
```

**1. Every page has exactly one H1 and a unique title**

```bash
python3 - <<'PY'
import re, pathlib
d = pathlib.Path("dist"); titles = {}
for p in sorted(d.rglob("*.html")):
    if "projects" in p.relative_to(d).parts: continue
    h = p.read_text(errors="ignore")
    n = len(re.findall(r"<h1[\s>]", h))
    t = (re.search(r"<title>(.*?)</title>", h, re.S) or [None,""])[1]
    r = "/" + str(p.relative_to(d)).replace("index.html","")
    if n != 1: print(f"  H1={n}  {r}")
    titles.setdefault(t, []).append(r)
for t, rs in titles.items():
    if len(rs) > 1: print(f"  DUPLICATE TITLE {t!r}: {rs}")
print("done")
PY
```
Zero output before `done` = pass. A page with no H1 usually means a `Section`
that should carry `as="h1"` doesn't.

**2. No broken internal links** — automated, nothing to do here

```bash
npm run check:links
```

This runs on every push via `.githooks/pre-push`. An earlier version of this
checklist had an inline script for it; it was removed because it asked "does
the path exist", which treats a folder without an `index.html` as valid when
the host serves it as a 404. `scripts/check-links.mjs` resolves links the way
the host does instead.

**3. Meta descriptions present and 120–160 characters**

```bash
grep -rho '<meta name="description" content="[^"]*"' dist --include='*.html' \
  | sed 's/.*content="//;s/"$//' | awk '{ print length(), $0 }' | sort -n | head -5
```
Anything under ~80 or over ~170 characters is worth rewriting. Homepages may
keep the `SITE` default; every other page should have its own.

**4. Structured data is one block with the right nodes**

```bash
python3 - <<'PY'
import re, json, pathlib
for f in ["dist/index.html", "dist/blog/how-to-mislead-ai/index.html",
          "dist/education/angebote/ki-lehrerworkshop/index.html"]:
    h = pathlib.Path(f).read_text()
    b = re.findall(r'<script type="application/ld\+json">(.*?)</script>', h, re.S)
    print(f, len(b), [[n.get("@type") for n in json.loads(x).get("@graph",[json.loads(x)])] for x in b])
PY
```
Expected: exactly **1** block each, with
`['Person','Organization','WebSite','ProfilePage']` on the home page,
`[…,'WebPage','BlogPosting']` on a post, `[…,'WebPage','Service']` on an offer.
More than one block, or a second `Person`, means a section re-declared identity —
that is the bug this structure exists to prevent.

**5. Canonical matches the real URL and the sitemap is complete**

```bash
grep -rho '<link rel="canonical" href="[^"]*"' dist --include='*.html' | sort -u
grep -o '<loc>[^<]*</loc>' dist/sitemap-0.xml | sed 's/<[^>]*>//g' | sort
```
Every canonical must start `https://felix-paul.de` and match where the file
actually sits. Confirmation pages (`/thank-you/`, `/education/danke/`) must
**not** appear in the sitemap.

## B. After deploying — checks in the browser

1. **Rich Results Test** — <https://search.google.com/test/rich-results>, paste
   the homepage, a blog post and an offer page. Person/BlogPosting/Service must
   be detected without errors.
2. **Schema.org validator** — <https://validator.schema.org/> for the raw graph.
3. **PageSpeed Insights** — <https://pagespeed.web.dev/>, mobile tab. Targets:
   LCP < 2.5 s, INP < 200 ms, CLS < 0.1.
4. **Social preview** — paste a URL into WhatsApp or LinkedIn and confirm the
   right OG image appears (main site, blog and education have different ones).
5. **`site:` check** — `site:felix-paul.de` in Google and Bing. Count the
   indexed pages; compare against the 22 in the sitemap.

## C. Search Console and Bing — after this merge specifically

The old subdomain properties are dead. Do this once:

1. **Google Search Console** → the `felix-paul.de` Domain property is the only
   one that matters now. Submit `https://felix-paul.de/sitemap-index.xml`.
2. Use **URL Inspection → Request indexing** for `/`, `/blog/`, `/education/`.
3. **Bing Webmaster Tools** → import from Search Console (fastest), submit the
   same sitemap. Bing feeds ChatGPT and Copilot, so skipping it costs AI visibility.
4. Delete the `blog.`, `edu.`, `neck.`, `tierparks.`, `codenight.` properties
   once they stop reporting — they can no longer be verified anyway.
5. Watch **Index coverage** for 4–6 weeks. The old subdomain URLs will drop out
   as 404s; that is expected and needs no action, since nothing resolves there.

## D. Recurring, quarterly

- Re-run section A after any structural change.
- Re-check Core Web Vitals in Search Console (field data, not lab).
- Ask ChatGPT, Perplexity and Google AI Mode a question your content answers —
  see whether you get cited. That is the GEO half of `discussions/seo.md`.
