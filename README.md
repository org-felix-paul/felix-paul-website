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
npm run check     # astro check (types + diagnostics)
npm run slug -- "Ein Titel"   # slug helper for new blog posts
```

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
one portrait image. Each section has its own favicon.

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

## A. Before pushing — checks against `dist/`

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

**2. No broken internal links**

```bash
python3 - <<'PY'
import re, pathlib, urllib.parse
d = pathlib.Path("dist")
ok = lambda u: (d/urllib.parse.unquote(u.lstrip("/"))).is_file() or (d/urllib.parse.unquote(u.lstrip("/"))/"index.html").is_file() or u == "/"
bad = 0
for p in d.rglob("*.html"):
    if "projects" in p.relative_to(d).parts: continue
    for u in re.findall(r'(?:href|src)="(/[^"#?]*)', p.read_text(errors="ignore")):
        if not ok(u): print(f"  BROKEN {p.relative_to(d)} -> {u}"); bad += 1
print(f"done ({bad} broken)")
PY
```

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
