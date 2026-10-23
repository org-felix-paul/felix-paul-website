# How to do the SEO review

Run after any structural change and once a quarter. All manual and free.
Every check below runs against a fresh `npm run build`.

## 1. Exactly one H1 and a unique title per page

```bash
python3 - <<'PY'
import re, pathlib
d = pathlib.Path("dist"); titles = {}
for p in sorted(d.rglob("*.html")):
    h = p.read_text(errors="ignore")
    n = len(re.findall(r"<h1[\s>]", h))
    t = (re.search(r"<title>(.*?)</title>", h, re.S) or [None, ""])[1]
    r = "/" + str(p.relative_to(d)).replace("index.html", "")
    if n != 1: print(f"  H1={n}  {r}")
    titles.setdefault(t, []).append(r)
for t, rs in titles.items():
    if len(rs) > 1: print(f"  DUPLICATE TITLE {t!r}: {rs}")
print("done")
PY
```

No output before `done` = pass. English fallback pages (`/en/schools/…`)
legitimately share the German title; everything else must be unique. A page
without H1 usually means a `Section` that should carry `as="h1"` does not.

## 2. Broken internal links

`npm run check:links` — runs on every push anyway.

## 3. Meta descriptions between 120 and 160 characters

```bash
grep -rho '<meta name="description" content="[^"]*"' dist --include='*.html' \
  | sed 's/.*content="//;s/"$//' | awk '{ print length(), $0 }' | sort -n | uniq | sed -n '1,5p;$p'
```

Under about 80 or over about 170 characters is worth rewriting. Blog post
descriptions come from the post's frontmatter, workshop descriptions from
`teaser`.

## 4. Structured data: one block, the right nodes

```bash
python3 - <<'PY'
import re, json, pathlib
for f in ["dist/index.html", "dist/blog/how-to-mislead-ai/index.html",
          "dist/schools/workshops/ki-lehrerworkshop/index.html"]:
    h = pathlib.Path(f).read_text()
    b = re.findall(r'<script type="application/ld\+json">(.*?)</script>', h, re.S)
    print(f, len(b), [[n.get("@type") for n in json.loads(x)["@graph"]] for x in b])
PY
```

Expected: exactly one block each; `Person, Organization, WebSite,
ProfilePage` on the home page, `…, WebPage, BlogPosting` on a post,
`…, WebPage, Service` on a workshop. A second block or a second `Person`
means a section re-declared the identity, which `Layout.astro` exists to
prevent.

## 5. Canonicals and sitemap

```bash
grep -rho '<link rel="canonical" href="[^"]*"' dist --include='*.html' | sort -u
grep -o '<loc>[^<]*</loc>' dist/sitemap-0.xml | sed 's/<[^>]*>//g' | sort
```

Every canonical starts with `https://felix-paul.de` and matches where the
file sits; English fallback pages canonicalise to the German URL. The
sitemap contains no `/thank-you/` and no fallback `/en/` pages, but does
contain the real English pages.

## 6. In the browser, after deploying

1. [Rich Results Test](https://search.google.com/test/rich-results): home
   page, a post, a workshop. Person, BlogPosting, Service detected without
   errors.
2. [PageSpeed Insights](https://pagespeed.web.dev/), mobile: LCP < 2.5 s,
   INP < 200 ms, CLS < 0.1.
3. `site:felix-paul.de` in Google and Bing; compare the count with the
   sitemap.
4. Google Search Console: index coverage and Core Web Vitals field data.
   Bing Webmaster Tools imports from Search Console and feeds Copilot and
   ChatGPT, so keep both.
5. Ask ChatGPT, Perplexity and Google AI Mode a question the content
   answers, and see whether felix-paul.de is cited.

Open improvements are listed under "Known gaps" in the root README.
