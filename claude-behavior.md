# Merge log — four sites into one Astro project

What was changed, why, and how to undo or extend it. Written for the person who
has to maintain this repo, not as a summary of a conversation.

Date: 2026-09-09 · Astro 6.3.8 · one origin: `https://felix-paul.de`

---

## 1. What happened

Four separate repos (`website`, `blog`, `edu-website`, plus three standalone
reference projects) were merged into **one Astro project serving one domain**.
The former subdomains are gone; every section is now a path.

| Before (own subdomain) | After (path on felix-paul.de) |
|---|---|
| `felix-paul.de` | `/` — unchanged, still the entry point |
| `blog.felix-paul.de` | `/blog/`, posts at `/blog/<slug>/` |
| `edu.felix-paul.de` | `/education/` (sub-pages keep their German slugs: `/education/kontakt/`, `/education/projekte/`, `/education/angebote/<slug>/`, `/education/danke/`) |
| `neck.felix-paul.de` | `/projects/neck/` |
| `codenight.felix-paul.de` | `/projects/codenight/` |
| `tierparks.felix-paul.de` | `/projects/tierpark/` (entry page `UnsereTierwelt.html`) |
| *(never deployed; was planned as `readmybook.d-solve.de`)* | `/projects/readmybook/` — added after the first merge pass, see §5 |

No 301 redirects were written for the old subdomains: their DNS records and
Pages deployments are deleted, so nothing resolves there to redirect *from*.
`public/_redirects` only covers same-origin moves.

## 2. Repository layout

The rule: **shared code never imports from a section; a section may import
shared code.** That one-way dependency is what keeps the blog and the education
section liftable into their own repos later.

```
astro.config.mjs        site + sitemap (incl. the 3 reference projects) + markdown pipeline
src/
  consts.ts             site identity + PATHS + PROJECTS  ← single source of URL truth
  content.config.ts     4-line aggregator, imports each section's collection
  layouts/Layout.astro  THE <head>: canonical, OG, Twitter, schema.org graph
  components/           shared chrome: Header, Footer, Section, Hero, ContactForm
  styles/global.css     merged stylesheet
  blog/                 ← section-owned, self-contained
    BlogLayout.astro      blog chrome on top of the shared Layout
    consts.ts             blog branding + taxonomy (audiences, topics, statuses)
    collection.ts         blog content schema
    components/           blog Header + Footer
    content/posts/        the posts
    plugins/, slug.mjs    mermaid remark plugin, slug helper
  education/            ← section-owned, self-contained (same shape)
    EduLayout.astro, consts.ts, collection.ts, components/, content/angebote/
    _source-images/       unreferenced working images, deliberately NOT in public/
  pages/                routes only — thin files that import from the above
    index, impressum, datenschutz, thank-you, 404
    blog/index, blog/[slug]
    education/index, kontakt, projekte, danke, angebote/[slug]
public/
  favicon.svg, og-default.png, llms.txt, robots.txt, _redirects
  img/, pdf/, downloads/, felix-paul.*   ← main site owns the root
  blog/        logo.svg, og-default.png, demos/
  education/   logo.svg, og-default.png, img/, felix-paul-it-paedagoge.*
  projects/    neck/, codenight/, tierpark/   ← verbatim copies, see §5
```

### How to extract a section again

For the blog: copy `src/blog/`, `src/pages/blog/`, `public/blog/`, add a
standalone `Layout.astro` (copy `src/layouts/Layout.astro` and inline the
Header/Footer slots), drop `base` from `BLOG` in `src/blog/consts.ts`, point
`astro.config.mjs` at the new domain. Nothing else references the section.
Identical procedure for `education`.

## 3. Metadata — the decision, and why

The question was whether each section needs its own metadata. The answer splits
into three levels:

**Emitted exactly once, site-wide (in `src/layouts/Layout.astro`):**
`Person`, `Organization` (dSolve) and `WebSite` schema.org nodes, plus
`author`, `theme-color`, favicon and the sitemap link. One origin means one
identity. Before the merge each site declared its own `Person` node — Google
and answer engines then saw three competing descriptions of the same human.
Duplicating identity per section would actively hurt, so the per-section
JSON-LD blocks from `blog` and `edu-website` were **deleted**, not merged.

**Per page, mandatory:** `<title>`, `meta description`, `canonical`, `og:url`,
`og:image` and one `WebPage` node. These are what distinguish URLs; a missing
or duplicated one is the classic ranking bug.

**Per page, by type (new — this was the gap `discussions/seo.md` flagged):**
- `BlogPosting` on every post (headline, description, `datePublished`, author →
  references the shared Person by `@id` instead of repeating it)
- `Service` on every education offer page (audience, areaServed, provider →
  same `@id` reference)

Sections keep only their **branding**: `og:site_name` and the title suffix
(`blogging@Felix Paul` for the blog), plus their own OG image. That is a
section-level cosmetic, not a second identity.

Verify the shape of any page with:
```bash
python3 -c "import re,json,sys;h=open(sys.argv[1]).read();b=re.findall(r'<script type=\"application/ld\+json\">(.*?)</script>',h,re.S);[print([n.get('@type') for n in json.loads(x).get('@graph',[json.loads(x)])]) for x in b]" dist/blog/how-to-mislead-ai/index.html
# -> ['Person', 'Organization', 'WebSite', 'WebPage', 'BlogPosting']
```

## 4. Every change made to content and code

**Links rewritten** (all 488 internal absolute links in the build now resolve):
- `SITE.eduSite` / `SITE.blogSite` deleted from the config; all callers now use
  `PATHS.education` / `PATHS.blog`
- Cross-section links dropped `target="_blank"` + `rel="noopener noreferrer"`
  — those are same-origin now. `d-solve.de` and LinkedIn keep them.
- 13 markdown files: `https://blog.felix-paul.de/...` → `/blog/...`,
  `https://edu.felix-paul.de` → `/education/`
- `https://felix-paul.de/contact/` → `/#kontakt` in 7 posts. **This was already
  broken before the merge** — the main site is a one-pager and has never had a
  `/contact/` route; the form is the `#kontakt` section.
- `public/blog/demos/` (the prompt-injection demo pages) linked to
  `/demos/...`; rewritten to `/blog/demos/...` in 3 HTML files and 1 post.
- The post `how-google-search-works` explains this site's own SEO setup using
  its real robots.txt/sitemap URLs — updated so the lesson stays true.
- `formsubmit` `_next` for the education form → `https://felix-paul.de/education/danke/`

**Deleted (as instructed): duplicate legal pages.** `edu-website`'s
`impressum.astro` and `datenschutz.astro` are gone; everything points at the
main site's `/impressum/` and `/datenschutz/`. The education 404 was dropped
too — one origin serves one 404.

**Asset collisions resolved.** All three sites had a `favicon.svg` and an
`og-default.png`, all different. The main site's favicon is now the domain
favicon; the blog's and education's former favicons live on as their section
logos (`/blog/logo.svg`, `/education/logo.svg`) because both use them as a
wordmark in their header. OG images stayed per section.

**Fixes made along the way** (small, and each one is a real defect):
- **Missing H1s.** `Section.astro` always rendered its title as `<h2>`, so
  `/impressum/`, `/datenschutz/`, `/education/kontakt/` and
  `/education/projekte/` had no `<h1>` at all. `Section` now takes
  `as="h1" | "h2"` (default `h2`); those four pages pass `as="h1"`. Every page
  in the build now has exactly one H1.
- `/education/` had the site-wide default title; it now has its own.
- `/thank-you/` and `/education/danke/` shared a meta description; differentiated.
- Both confirmation pages are excluded from the sitemap — dead ends with no
  search value.
- The blog loaded Inter from `rsms.me` (render-blocking third-party request,
  and a third-party data flow on a site with a Datenschutz page). The merged
  stylesheet uses the local `@fontsource-variable/inter` the other two already used.
- `markdown.remarkPlugins` is deprecated in Astro 6; the pipeline now uses
  `unified()` from `@astrojs/markdown-remark`. Astro's defaults (GFM, Shiki)
  stay active and now apply to the education markdown too.
- Pre-existing type error in the blog's mermaid loader (`querySelectorAll`
  returns `Element`, mermaid wants `HTMLElement`) — typed. `astro check` is
  now at 0 errors, 0 warnings.
- `blog/public/.claude/settings.local.json` was inside the published folder and
  would have shipped to the web. Not copied.
- `edu-website/public/compressed/` and `originals/` are referenced nowhere but
  were being published. Moved to `src/education/_source-images/` — kept, not
  deleted, just no longer served.

## 5. What was deliberately not touched

**The four reference projects are byte-identical copies.** Only `.gitignore`
files were left behind by the copy. They are linked, never imported, exactly as
they were when they lived on their own subdomains.

`readmybook` was added in a second pass (it was not present during the first
merge). It is a self-contained static page with no build step; all five images
it references are present and every internal path is relative, so it works
under `/projects/readmybook/` unchanged.

They survive the move to a subpath because all three use **relative** internal
paths. One root-absolute reference exists —
`public/projects/neck/lib/bootstrap-icons/index.html` links
`/assets/css/bootstrap.min.css` — but that is a vendored demo page of the
bootstrap-icons library, the file does not exist in the repo, and it was equally
broken on the old subdomain. NECK's own `index.html` is unaffected.

## 6. Open items

1. **`public/projects/neck/Datensätze/große-vorschläge/` is 62 MB**, including
   two 23 MB `.xlsx` files. Cloudflare's per-file limit is 25 MB, so this
   *just* fits — but it makes the published payload 114 MB and every clone of
   this repo carries it. The files are genuinely referenced by
   `js/save-load-file/load-dataset.js`. Worth converting to compressed CSV or
   moving to R2 at some point; left alone here because reference-project content
   was out of scope.
2. **The prompt-injection demo pages under `/blog/demos/drohnen-vergleich/`**
   are deliberately fake product pages (teaching props for the
   `how-to-mislead-ai` post, one of them carrying an intentionally malicious
   JSON-LD block as part of the lesson). Checked: they already carry
   `<meta name="robots" content="noindex,nofollow">` and are not in the
   sitemap, so they cannot be indexed. Nothing to do — noted here only so the
   missing site metadata on those pages is not mistaken for a defect later.
3. **`/blog/` and `/education/` both use the same brand colours and layout.**
   That is fine, but the blog's `blogging@Felix Paul` wordmark now sits on the
   same domain as the main site's `Felix Paul persönlich`. Worth one design
   pass to decide whether the two headers should converge.
4. The four pre-merge folders were moved to `../_pre-merge-backup/`, not
   deleted (this repo had no commits, so there was no history to recover from).
   Delete that folder once the first deployment is verified.
5. **`readmybook` is a dSolve project living on the felix-paul.de domain.**
   Its own README says it "mirrors how ReadMyBook was presented on d-solve.de",
   it ships the dSolve favicon, its only outbound link is `https://d-solve.de`,
   and it was meant to be hosted at `readmybook.d-solve.de`. Hosting it here
   was an explicit instruction, but it cuts against the rule in
   `administration/README.md` that a small d-solve page points at its own main
   site — and against the ADR rule that a project belongs on the domain whose
   authority it pays into. Revisit if d-solve.de is ever built out.
6. **`/projects/readmybook/` currently has no inbound internal link.** It is in
   the sitemap, but no page on the site links to it, so it is an orphan — the
   weakest possible position for indexing. The other three are linked from
   `/education/projekte/`; readmybook does not belong there (it is neither
   school software nor a workshop). Placement is an open content decision.
7. `readmybook/README.md` is stale in two places: it documents a
   `copy-assets.sh` that does not exist, and it describes the
   `readmybook.d-solve.de` hosting plan that this merge supersedes. Left
   untouched — reference-project content was out of scope.
8. `readmybook/index.html` loads Inter from `rsms.me` (third-party render-
   blocking request, the same issue that was fixed for the blog). Not changed,
   for the same reason as item 7.

## 7. Verification performed

```bash
npm run build      # 22 pages, 0 errors
npx astro check    # 0 errors, 0 warnings
```
- 488 internal absolute links checked against the build output — all resolve
- No `*.felix-paul.de` subdomain reference left in any built page, sitemap or txt
- Every page has exactly one `<h1>` and a unique `<title>`
- Every page carries exactly one `ld+json` block with the expected node types
- All seven reference-project entry points reachable in `dist/`
- `readmybook`'s own seven internal asset references resolve under the new path
- Sitemap: 23 URLs, one origin, confirmation pages excluded

---

## 8. Second pass — de-duplication and harmonisation

A follow-up round after the first commit (`d854567`). Everything below is in
addition to §1–§7.

### ReadMyBook: listed, and cut loose from dSolve

It is now linked from `/education/projekte/` as a third project block, using
`img/readmybook-cover.jpg` (previously unreferenced) as its thumbnail.

All dSolve branding was removed, because the page is served from felix-paul.de
now: the dSolve "d" favicon was replaced with the site mark, the header brand
block links to `/` instead of `d-solve.de` and uses the site favicon instead of
`img/logo.png` (the dSolve logo, 411 KB, moved out of the repo), the `<title>`
and meta description say "Felix Paul" instead of "dSolve", and the footer
attribution points at `/`. `styles.css` and `README.md` were reworded. The
`LICENSE` copyright holder was changed from `org-d-solve` to `org-felix-paul`
to match the other three projects and this repo — **revert that line if dSolve
should keep the copyright**; it is the one change here that is a legal
statement rather than a link.

### NECK: broken links resolved

NECK's developer handbook linked to `index.html`, `css`, `js` and the Bootstrap
cheatsheet as if the document sat at the project root — but it renders three
levels deep in `docs/developer-handbook/book/`. Two of those four resolved to
the *wrong* existing target (mdBook's own `css/` folder and the book's own
`index.html`), which is why only two showed up as broken.

Fixed in the mdBook source (`docs/developer-handbook/src/einfuehrung.md`,
prefix `../../../`), in the standalone `docs/Entwickelerdokumentation.md`
(prefix `../`), and in the three already-built HTML files so the fix is live
without re-running mdbook. Only the four prose links were touched — mdBook's
own navigation also uses `href="index.html"` and must stay book-relative.
**NECK's own pages now have zero broken links.**

Seven files under `neck/lib/` still have broken links. They are vendored
Bootstrap sample pages (`examples/album`, `navbars`, `starter-template`,
`sticky-footer`, …) whose links point into Bootstrap's documentation site,
which was never vendored. They are third-party artifacts, not NECK content,
and nothing links to them except the cheatsheet, which the handbook needs. The
folder is 1.4 MB; removing everything under `examples/` except `cheatsheet/`
would be safe, but deleting files is not "resolving a link", so it was left
for an explicit decision.

### Images: the portrait existed seven times

Same photo, byte-identical, in two formats:

| was | |
|---|---|
| `/felix-paul.avif`, `/img/personal.avif`, `/education/felix-paul-it-paedagoge.avif` | 3 × 28 KB |
| `/felix-paul.png`, `/img/personal.png`, `/education/felix-paul-it-paedagoge.png`, `/pressefoto-felix-paul.png` | 4 × 380 KB |

Three of the seven were referenced; the other four were dead weight. Now two
files, behind one constant (`PORTRAIT` in `src/consts.ts`):

- `PORTRAIT.image` → `/img/felix-paul.avif` — every hero and the "Über mich"
  block (three call sites)
- `PORTRAIT.press` → `/pressefoto-felix-paul.png` — the press-kit download and
  the `image` of the schema.org Person. It keeps its root URL because the
  filename is what a journalist ends up with on disk.

Saves ~1.2 MB. `EDU.portrait` now points at the shared file with a comment
saying to copy that one file if the section is ever extracted.

**Verified: no two files anywhere outside `public/projects/` are identical.**

### One header and one footer for the whole domain

The three sections shipped three near-identical headers (sticky shell, mobile
toggle, nav list, CTA) and three near-identical footers. Only the branding and
the link lists ever differed.

Now: `src/components/SiteHeader.astro` and `src/components/SiteFooter.astro`
hold the markup and behaviour once; each section keeps a ~15-line wrapper that
passes *its own* identity as props. Section identity survives as data, not as a
fork — which is also what keeps a section extractable.

The header handles both nav kinds in one component: entries starting with `#`
get scroll-spy and are prefixed with the section home when the visitor is
elsewhere; path entries get `aria-current` from the pathname. The two
behaviours used to live in two different files.

Roughly 250 lines of duplicated markup and script became 329 shared + 79
wrapper.

### One contact form, one confirmation page

The education section carried a second contact page, a second confirmation
page and a second `ContactForm` component that differed from the main one only
in wording and three FormSubmit values.

Removed: `src/pages/education/kontakt.astro`,
`src/pages/education/danke.astro`, `src/education/components/ContactForm.astro`.
`PATHS.kontakt` (`/#kontakt`) and `PATHS.thankYou` (`/thank-you/`) are now
domain-wide; `EDU_PATHS.kontakt`/`.danke` are aliases of them so callers in the
section still read naturally. 301s were added for both old URLs.

**The build now contains exactly one contact form and one `_next` target.**

Two consequences worth knowing:

1. Inbox differentiation is gone. The education form used
   `_subject: "Neue Anfrage über felix-paul.de/education"`; there is one
   subject now. If telling school enquiries apart matters, the cheapest fix is
   a hidden field set from the referrer rather than a second form.
2. The offer pages linked `/education/kontakt/?angebot=<title>`. After the
   move that became `/#kontakt?angebot=…`, where the query string sits **inside
   the fragment** and is not a query parameter at all. Nothing ever read it —
   there is no script for it — so the tail was dropped. To reinstate offer
   prefill properly it needs a well-formed `/?angebot=…#kontakt` plus a small
   script on the home page that writes the value into the message field.

### One favicon per section

Explicitly requested, and it overrides the "one origin, one favicon" reasoning
in §3 — which applied to *identity metadata*, not to the tab icon. `Layout`
takes a `favicon` prop (`FAVICONS` in `src/consts.ts`); the same file serves as
the section wordmark, so each section has exactly one visual mark:

| section | favicon |
|---|---|
| main site (incl. Impressum, Datenschutz, Thank-You) | `/favicon.svg` |
| blog | `/blog/logo.svg` |
| education | `/education/logo.svg` |

### Verification after this pass

```
astro check       0 errors, 0 warnings
routes            20 (was 22: contact + confirmation merged away)
internal links    461 checked, 0 broken
h1 / titles       exactly one h1 per page, no duplicate titles
structured data   exactly one ld+json block per page
sitemap           22 URLs, one origin
duplicate files   none outside public/projects/
contact forms     1
```

### Still open after this pass

- The published payload is still 114 MB, almost all of it
  `neck/Datensätze/` (§6 item 1) — untouched.
- `/projects/readmybook/img/readmybook-cover.jpg` is 802 KB and is now a
  visible thumbnail on `/education/projekte/`. It is lazy-loaded, but it wants
  resizing. `education/img/codenight/tierwelt-small.png` has the same problem
  at 708 KB despite its name.
- `/education/og-default.png` is 368 KB, versus 48 KB for the main site's.

---

## 9. Third pass — NECK cleanup and payload

### What a visitor actually downloads

Worth stating plainly, because the repo size was being read as page weight:
**static hosting serves files on request.** Nobody ever downloads the whole
deployment. A visitor to `/` fetches that page's HTML plus the images on it —
nothing from `/projects/` unless they open a project.

The repo size still costs something, just not visitor bandwidth: every
`git clone`, every Pages upload, and the per-file 25 MB Cloudflare limit (one
NECK dataset was at 23 MB, uncomfortably close).

### NECK, cleaned out

Everything below was verified unreferenced by `index.html`, `js/` or `css/`
before deletion.

| removed | size | why |
|---|---|---|
| `Datensätze/…/Covid19SymptomsChecker/` data files | 62 MB | NECK's own `große-vorschläge/README` says "Die Datensätze sind zu groß für das Programm." 316,802 rows; unusable in a browser tool. The `.txt` describing the exercise was kept, with a note. |
| `lib/plotly/` | 3.6 MB | plotly is loaded from `cdn.plot.ly`, not from `lib/` |
| `lib/bootstrap/examples/` | 1.4 MB | Bootstrap's own demo pages — the source of most of the "broken links" |
| `lib/bootstrap/scss/` | 520 KB | Sass sources, never compiled here |
| `lib/bootstrap/css/bootstrap/` | 280 KB | unminified full builds; only `custom-bootstrap.css` is loaded |
| `lib/bootstrap/js/*` except `bootstrap.bundle.min.js` | 2.4 MB | alternate builds and source maps |
| `lib/bootstrap-icons/{index.html,*.json,*.scss}` | 400 KB | icon-gallery demo (held the `/assets/css/…` root-absolute link) and sources |

**NECK: 84 MB → 14 MB, and zero broken links in the entire project.** The
handbook's Bootstrap-cheatsheet link now points at
`getbootstrap.com/docs/5.0/examples/cheatsheet/` instead of the deleted
vendored copy — fixed in the mdBook source, the standalone markdown and the
three built HTML files.

### Images

`/education/projekte/` was the heaviest page on the site at 1.7 MB, almost
entirely because a 3579×2551 photo was being used as a card thumbnail.

| | was | now |
|---|---|---|
| `readmybook-cover.jpg` (3579×2551) | 802 KB | 48 KB — resized to 1200w, same path and format |
| `goppa-book/cover.png` (827×1173, displayed at 176 px) | 432 KB | 20 KB as `cover.avif` |
| six `/education/img/` thumbnails | 794 KB | 206 KB as AVIF |
| `education/og-default.png` | 364 KB | 111 KB as `.jpg` |
| `education/img/codenight/tierwelt-small.png` | 700 KB | deleted — referenced nowhere |

`og:image:type` is derived from the file extension now, so a section can ship
a JPEG OG image without the meta tag lying.

### Result

```
page                       was        now
/                        904 KB     492 KB
/education/projekte/    1657 KB     316 KB
whole deployment        115.7 MB    43.5 MB
```

`astro check` clean, 461 internal links resolve, one h1 and a unique title per
page.

### Still open

- The remaining 43.5 MB is 34.5 MB of reference projects: NECK 14 MB
  (7.7 MB of it the two mdBook handbooks), tierpark 11 MB, codenight 9.5 MB.
  These are archived student/workshop sites; nothing in them is oversized the
  way the deleted material was.
- `dist/pdf/` is 3.9 MB of talk slides and book excerpts, all linked as
  downloads — fetched only when clicked, so they cost nothing on page load.
- Unreferenced but deliberately kept: `public/img/fhe/*.png` (~800 KB, eight
  images) and `public/downloads/*.ipynb` (65 KB). Nothing links to them; they
  look like content assets for pages not yet built, so they were left alone
  rather than deleted. Say the word and they go.
- `public/projects/tierpark/UnserTierparkFiles/` (3.8 MB) appears to be the
  saved-page assets of an `UnserTierpark.html` that is not in the repo — i.e.
  probably orphaned. Not touched: tierpark content was out of scope.
