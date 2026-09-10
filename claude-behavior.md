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

---

## 10. Fourth pass — structure, wording and overview

### One vocabulary

The four areas are declared once as `AREAS` in `src/consts.ts` and reused by
the footer and the home page's overview block, so a visitor meets the same four
labels everywhere: **Keynotes & Fachvorträge · Bildungsangebote · Software ·
Blog**.

"Schulworkshops" is gone from the whole site in favour of **Bildungsangebote**,
because the offer is meant to grow into adult education. That touched the site
tagline and description, the schema.org `Offer`, the education section's own
tagline and headings, the hero and the blog's CTA. `/software` was deliberately
not created — d-solve.de is its own site, so the area links out.

### One footer

`SiteFooter.astro` now takes **no props** and is rendered directly by `Layout`.
The three per-section footer wrappers were deleted. It carries the brand block
with a generic line, all five destinations with their subtexts (Startseite plus
the four areas), and a legal bar with **Kontakt as a link** instead of a bare
mail address, plus LinkedIn, Impressum and Datenschutz.

**Verified byte-identical across all 20 pages.**

The blog header's "Startseite" tab was removed — the brand mark already links
home, so the tab was one redundant control in a two-item nav.

### Home page: everything on one scroll

The brief was that scrolling the home page alone should give the whole picture,
without divergence between it and the sub-pages. The fix is structural rather
than editorial: **the home page reads the same content collections the
sub-pages do.**

- `#bildung` renders the real `angebote` collection — the same five offers as
  `/education/`, not a paraphrase of them
- the blog block lists the three newest posts instead of three static topic
  chips
- `#aktuelles` renders the news collection

Add a markdown file and it appears in both places at once. There is no second
copy that can drift.

New section order:

```
Hero → #saeulen → #ueber-mich → #speaking → #bildung
     → #publikationen → #aktuelles → #blog → #presse → #kontakt
```

`#saeulen` shows the three offer areas as cards and **the blog as a thin strip
underneath** — present, but visibly not an offer.

### Speaking topics

Split into five cards, one per talk that stands on its own: Künstliche
Intelligenz, **Identity & Access Management** (new), **IT Security** and
**Cloud** (previously one card), and **Kryptographie** (FHE and
Post-Quanten-Kryptographie merged into one card, both named in the body).

Below them, `weitereThemen` renders as a plain bulleted list — KI und
Arbeitsmarkt, gesellschaftliche Folgen von KI, Skalierung von Enterprise-IT,
Hybrid Cloud, Post-Quanten-Migration, Medienkompetenz, Architekturarbeit in
regulierten Branchen. It is a list precisely so it can grow without the section
turning into a wall of cards.

### Background visualisation

Reworked so the qualifications explain themselves: two labelled groups —
**Fachstudium** (B.Sc./M.Sc. Informatik, B.Sc. Mathematik, brand blue) and
**Lehramtsstudium** (B.Ed./M.Ed., green, so M.Ed. is visibly the teaching
track) — each with a thin caption underneath. **Praxiserfahrung** is now a
full-width bar carrying both, with one sentence of prose explaining why the
combination matters.

### Aktuelles

New collection at `src/news/content/*.md`, same shape as the other sections
(`collection.ts` next to the content, registered in the aggregator). Fields:
`title`, `date`, `kind` (workshop / vortrag / publikation / software),
`summary`, optional `location`, `url`, `urlLabel`, and `draft`.

Seeded with **one** entry — the Codenight Programmiertage, März 2022 — because
that is the only dated activity the repo actually states. The publications have
no dates anywhere in the codebase, so none were invented. `_vorlage.md` is a
copy-paste template with `draft: true`. The whole section hides itself while
the collection is empty.

### Verification

```
astro check      0 errors, 0 warnings
internal links   500 checked, 0 broken
cross-page anchors  bildung, kontakt, publikationen, speaking, ueber-mich — all resolve
footer           identical on all 20 pages
h1 / titles      one h1 per page, no duplicate titles
```

### Suggestions — what was taken up

1. **Hero names the audience.** ✅ The eyebrow is now
   "Für Konferenzen, Schulen & Unternehmen" instead of
   "Informatiker & Mathematiker", so a visitor can self-identify immediately.
   The qualifications still follow in the body text and in `#ueber-mich`.
2. **`#saeulen` stopped selling.** ✅ It was a duplicate of `#bildung` once the
   latter carried the real offers. It is now a signpost: one row per area with
   a single line of text, in a compact bordered list — no cards, no CTAs. The
   blog is the fourth row with a grey marker instead of an accent colour, so
   it reads as an addition rather than an offer.
3. **`#presse` moved below `#kontakt`.** ✅ It only matters to organisers, and
   it was sitting between the blog and the contact form.
4. **Prices** — explained rather than built, see below.
5. **Proof on the speaking cards** — left to Felix.

---

## 11. Fifth pass — orientation, order, and the background graphic

- **Hero eyebrow** now names the audience (§10 suggestion 1).
- **`#saeulen`** replaced: the three offer cards and the blog strip became a
  single compact list, one line per area. `pillars` in the frontmatter became
  `orientation`. It is a signpost now, not a second sales block — the real
  content sits in `#speaking` and `#bildung`.
- **`#presse` moved below `#kontakt`.**
- **Praxiserfahrung sits beside the study blocks again**, not underneath. All
  three groups share one row with their bottom edges aligned; the practice
  block spans the full height of both block rows (`sm:h-[8.5rem]`), is wider
  than the others and takes the remaining width, so it still reads as carrying
  both strands. Each group keeps its thin caption — Fachstudium,
  Lehramtsstudium, Enterprise Architect — and on mobile the practice block
  wraps to its own full-width row.
- **Section backgrounds re-alternated.** Moving `#presse` had left
  `#bildung` and `#publikationen` both muted and then three white sections in
  a row. The light/dark rhythm is now set explicitly per section.

### Checked, not a defect

Blog table-of-contents links to headings with umlauts appear "broken" to a
naive string comparison: the `href` is percent-encoded
(`#…m%C3%BCssen`) while `rehype-slug` writes the id as raw UTF-8
(`#…müssen`). Browsers decode the fragment before matching, and the decoded id
is present, so these resolve correctly. No change made — noted so the same
false positive is not "fixed" later.

### Prices — why it was suggested (not implemented)

Every offer already carries a `preis` in its frontmatter
("250–900 €", "400–600 €", …) and it is shown on `/education/angebote/<slug>/`,
but not on the offer cards on the home page or on `/education/`. The argument
for surfacing it: a visitor who cannot see a rough price has to send an email
to find out whether talking is even worth it — and most people simply do not
send that email. An indicative "ab 250 €" on the card filters out mismatches
before they cost either side a mail exchange, and it makes the enquiries that
do arrive more serious. The counter-argument is real too: a visible number
anchors the negotiation and can look expensive without the context of what is
included. It is a pricing decision, not a layout one, which is why it was left
alone.

---

## 12. Sixth pass — the home page's education block, trimmed

The question was whether the home page should list the real offers at all, or
just link to `/education/`. It keeps them, for one reason above the others:
**`#speaking` shows five concrete topics, so an education teaser would make the
second business area look thinner than the first** — on a page headlined
"Keynotes & Bildungsangebote". Concrete offer names are also what a teacher
scans for ("Elternabend", "KI-Lehrerworkshop"), and they only appear if the
offers are on the page.

What changed instead is the *depth* of each card. Zielgruppe and Dauer were
dropped from the home page; the two pages now have distinct jobs:

| page | answers |
|---|---|
| home `#bildung` | **what exists** — title, subtitle, teaser |
| `/education/` + offer pages | **does it fit** — Zielgruppe, Dauer, Preis, Referenzen |

That gives `/education/` a reason to exist beyond being a longer copy of a
home-page section.

Effect: `#bildung` 219 → 183 words (−16%), from 31% to 26% of the
`/education/` page. All five offers are still named and linked. The page total
moved 1094 → 1058 words, so **this is a role split, not a length fix** — the
largest section is `#speaking` at 24%, and it was left alone.

---

## 13. Seventh pass — shortening

`#speaking` was the longest section on the page (24%). Three changes, no
content removed that mattered:

- **Topic texts cut to one sentence each.** They were two to three sentences
  averaging 30 words; the section is a menu, not the talk.
- **"Weitere Themen" moved into the grid as a sixth tile**, styled back (dashed
  grey border, muted ground) so it reads as an appendix next to five real
  offers. It used to be a full-width panel of its own below the grid.
  Trimmed from seven entries to five, and each shortened to a keyword
  ("KI und der Arbeitsmarkt" instead of "KI und ihre Auswirkungen auf den
  Arbeitsmarkt"). Medienkompetenz and Architekturarbeit were dropped.
- **Grid is `lg:grid-cols-3`**, so six tiles fill two clean rows instead of
  leaving an orphan. Consulting stays as its own box below.

The **hero** intro went from 32 words to 19 and the Atruvia line from 12 to 7 —
the qualification detail was already repeated in `#ueber-mich`.

```
section          was    now
speaking         252    163    -35%
top               66     47    -29%
TOTAL           1058    950
reading time     5.3    4.8 min
```

---

## 14. Eighth pass — navigation, wording, SEO audit

### Education: "Referenzen" was a promise the page could not keep

The nav said Referenzen, and the page ended with a "Referenzen & Stimmen aus
Schulen" box whose own text admitted the testimonials did not exist yet
("Hier sammeln sich künftig …"). Renamed to **Einblicke** in the nav, the page
title, the eyebrow and the cross-links from the home page and the offer pages;
the empty testimonials box is gone.

### Why the scroll indicator only marked some sections

It marks **nav entries**, and it can only mark an entry that points at a
section of the page you are on. Before this pass:

| section | why it never lit up |
|---|---|
| `#aktuelles`, `#presse`, `#kontakt`, `#saeulen` | no nav entry existed |
| `#blog` | the nav entry is `/blog/` — a link to another page, not an anchor |

So it was not a bug, it was the nav being shorter than the page.

### Two-level navigation

The bar keeps the three things someone might book or read; everything else on
the home page sits behind a **"Mehr" dropdown** (Über mich, Publikationen,
Aktuelles, Material für Veranstalter). A `<details>`/`<summary>` element, so
it works without JavaScript; the small script only closes it on outside click,
Escape, and selection.

`NAV` entries can now be a link or a group, and carry an optional **`spy`**
field naming the home-page section they represent — separate from `href`,
because "Blog" links to `/blog/` but marks the blog teaser while you scroll
past it. The group's summary lights up when any of its children is current.

Result: every content section is now represented in the bar. `#top`/`#saeulen`
are the page intro, `#kontakt` is the CTA button.

### SEO audit

Checked across all 20 pages: title, description, canonical, `<html lang>`,
one h1, the five OG/Twitter tags, structured-data shape, and whether the
wording still matches the content after the renames.

**Fixed:**

- **`/thank-you/` and `/404` were indexable.** Both are dead ends; a
  confirmation page in the index is a junk result. `Layout` gained a
  `noindex` prop and both pages set it. Neither was in the sitemap already.
- **Long titles were losing their tail to the brand suffix.** A blog post ran
  to 106 characters, of which 21 were "· blogging@Felix Paul". The suffix is
  now dropped once the title alone reaches 45 characters — the page title is
  worth more than the brand in a 60-character SERP line.
- **Home page over the limits**: title 63 → 57, description 180 → 162. The
  site tagline is shorter ("Keynotes, Bildungsangebote & IT-Beratung").
- **`/education/` description** 238 → under 165.
- **`/education/` h1 still said "verständlich für die Schule"**, contradicting
  the Bildungsangebote repositioning. Now "verständlich erklärt".
- **Stale label on the home page**: the `#bildung` CTA still read "Projekte &
  Referenzen"; the offer pages linked "Referenzen & durchgeführte Workshops".

**Verified clean:** og:title matches `<title>` on every page (0 mismatches);
every schema.org `Offer` URL resolves; the graph is
Person/Organization/WebSite plus the right page node everywhere; no noindex
page appears in the sitemap; no occurrence of "Schulworkshop", "Referenzen"
or an old subdomain remains anywhere in the built site.

**Left alone — your content, not markup:**

Five blog post titles still exceed 62 characters and eleven descriptions
exceed 165. They come from `description:` in the post frontmatter and
`teaser:` in the offer frontmatter. Over-long descriptions are not a ranking
penalty — Google simply truncates the snippet, and often writes its own
anyway — so this is a display question, not a defect. The worst are
`how-to-mislead-ai` (247), `how-easy-is-it-to-fall-for-phishing` (240) and
`social-media-ai-smartphone-elternabend` (240).

---

## 15. Ninth pass — audience band and two new formats

### "Nicht nur für Schulen" band

The offers are written for the school context, which made the whole section
read as school-only. A static band now sits **above** the offer grid on both
`/education/` and the home page's `#bildung`, in three columns: Schulen &
Lehrkräfte, Privatpersonen, Unternehmen — the last linking to `#speaking`,
since a company can book the keynote topics as a workshop.

It is one component (`src/education/components/ZielgruppenHinweis.astro`)
rendered in both places, **verified byte-identical**, so the two pages cannot
drift. Green ground against the white offer cards, so it reads as framing
rather than as a seventh offer.

The adjacent heading was updated to match: "Angebote für Schulen, Lehrkräfte,
Eltern und Erwachsene" → "Angebote für Schulen, Unternehmen und
Privatpersonen".

### Two new offers, and the AG format

| entry | order | note |
|---|---|---|
| `vibe-coding-ag.md` | 6 | Programmieren mit KI — AG, Projekttag oder Kompaktkurs |
| `zehnfingersystem-kurs.md` | 7 | Blind tippen — AG oder Kompaktkurs |

Both name the **AG über ein Halbjahr** explicitly in `dauer` and in the Format
section, which is what puts the recurring-AG format on the site at all; the
existing five are all one-off events.

Two icons were added to `AngebotCard` for them (`code`, `keyboard`).

**`preis` is "auf Anfrage" on both** — deliberately. Duration and price for an
AG depend on term length and group size, and inventing numbers for offers that
have not been priced would be worse than leaving the field honest. The price
table on `/education/` picks the value up automatically and shows "auf
Anfrage"; replace it with a range whenever the figures exist.

Both offers appear on `/education/`, in the price table, on the home page's
`#bildung`, and in the sitemap — all of it from the one collection, no
manual wiring.

### Still school-framed

`/education/`'s "Warum ich" heading still reads "Doppelqualifikation, die
Schulen heute brauchen". It sits well below the band and is positioning copy
rather than an offer description, so it was left alone — but it is the one
remaining place where the page contradicts the new framing.

---

## 16. Tenth pass — school-first ordering, contrast, blog prominence

Context: schools are the target for the current outreach; adult education and
companies come later. That sequencing decides several of these.

### The "Warum ich" suggestion was withdrawn

§15 flagged "Doppelqualifikation, die Schulen heute brauchen" as inconsistent
with the wider framing. **Left exactly as it is.** It is the sharpest sentence
on the page for the buyer being chased right now, and M.Ed. + M.Sc. Informatik
is a specific, evidenced claim. Widening it would trade that for a vague one,
in exchange for a segment with no customers yet. Revisit when company outreach
actually starts.

### Audience block: position now differs by page, on purpose

- **`/education/` — below the offers.** This is the page linked in school
  outreach. Opening it with a headline saying "Nicht nur für Schulen" told the
  primary target the page was not specifically for them. Now: offers in their
  terms first, the wider applicability after.
- **Home page — above the offers.** That page serves a mixed audience, so
  naming who the formats are for belongs up front.

Same component, same text, one source. Only the position differs, because the
two pages have different jobs.

The heading changed from the negation "Nicht nur für Schulen" to
"Auch außerhalb der Schule".

### Contrast fixed

The block was `emerald-900/80` on `emerald-50` — translucent dark text on a
tinted ground, genuinely hard to read. Now white cards with a coloured top bar
and a solid-colour label chip, matching the pillar cards. No translucent text
remains in the section.

Each audience carries the colour it already has elsewhere on the site, so the
colours mean something rather than merely differing:

| audience | colour | why |
|---|---|---|
| Schulen & Lehrkräfte | emerald | the education area in the overview strip |
| Unternehmen | brand blue | Keynotes & Fachvorträge, where the company topics live |
| Privatpersonen | amber | the third pillar |

### Home page shows two offers, not seven

The catalogue grew from five to seven, which made `#bildung` the heaviest block
on a page where education is one of three areas — and it reproduced nearly all
of `/education/`, leaving little reason to click through.

Now: the audience cards, the first two offers, and a **"+5 weitere Angebote"**
tile as the third cell of the row — a visible route rather than a link under
the cards. 183 → 133 words.

This narrows §12's reasoning rather than reversing it: the point there was
that education must not look thinner than the five keynote topics. The
audience cards plus the counted tile carry that now, and the offers still
appear by name — just on the page built to convert them.

### Blog block toned down

It was a dark blue gradient card, the loudest element on the page — while the
overview strip deliberately renders the blog as a quiet grey row because it is
not an offer. The page contradicted its own hierarchy.

Now a normal section in the page rhythm: three post cards and an "Alle
Beiträge" button. Same content, same three posts, no shouting.

---

## 17. Eleventh pass — audience pages

### Structure

Bildungsangebote is now three pages, one per audience, and the header entry
became a dropdown rather than a fourth and fifth top-level tab:

```
Keynotes & Fachvorträge | Bildungsangebote ▾        | Blog | Mehr ▾ | [Kontakt]
                          ├ Überblick (#bildung)
                          ├ Schulen & Lehrkräfte  /education/
                          ├ Unternehmen & Universitäten  /unternehmen/
                          └ Privatpersonen  /privatpersonen/
```

`/education/` is **unchanged** and stays school-first: school offers, then the
"Auch außerhalb der Schule" block below them, "Doppelqualifikation, die
Schulen heute brauchen" intact. The two new pages are siblings, not children,
so nothing dilutes the page used for school outreach.

The audience cards now each link to their own page instead of being text only.

### Wording

The generic description is "Workshops, Vorträge und Fortbildungen – für
Schulen, Universitäten, Unternehmen und Privatpersonen" — no topics named at
that level. Topics still appear on `/education/`, where they are the offer.

### `/unternehmen/`

Three cuts, because the question differs fundamentally with organisation size:

| cut | question it answers |
|---|---|
| Einzelpersonen & Führungskräfte | the individual role: where does AI make my own work faster, what can be automated |
| Kleine & mittelständische Unternehmen | the whole company is still small enough to see at once |
| Großkonzerne (full width) | one real bottleneck, usually scaling: integration patterns, tool availability, governance |

Plus a "Grundlagen" list — IAM in the AI context, governance that scales, cost
visibility via snapshots of AI-touching applications, shadow IT, integration
patterns — and a pointer that every keynote topic can be held as a workshop.

### `/privatpersonen/`

Framed as Erwachsenenbildung: understand what actually happens, find your own
use, stay safe, stay employable as the market shifts. Points back at
`/education/` for the courses that transfer directly (Zehnfingersystem, Vibe
Coding).

### Both pages

No packages, no durations, no prices — a short "Angebote nur auf Anfrage"
block with a link to the contact form instead. That was the explicit brief and
it is also the honest state: neither audience has a customer yet.

### Open

One topic from the brief could not be transcribed with confidence — something
like "wie begegnet man dem …-Effekt" in the company context. Not guessed at,
so it is missing from the Grundlagen list.

---

## 18. Twelfth pass — blog anchor, and the company fundamentals

### Blog links land on the section first

In the header bar and in the overview strip, "Blog" pointed straight at
`/blog/` while every neighbouring entry was an anchor into the home page. Both
are now `#blog`, so the behaviour matches: you land on the teaser section, and
the section's own "Alle Beiträge" button takes you to the blog. From a
sub-page the anchor resolves to `/#blog` as usual.

The footer still links `/blog/` directly — a footer is a list of destinations,
not a tour of the current page.

### `/unternehmen/` fundamentals, expanded

Now seven entries, led by the **Lethal Trifecta** — Simon Willison's
observation that an agent turns dangerous once access to sensitive data,
exposure to untrusted content, and an outbound channel meet. It is not
re-explained here: the item links to `how-to-mislead-ai`, where it already
appears with the source. Same reason the offers are not duplicated on the home
page — one place per fact.

The rest: IAM in the AI context, keeping an overview of tools / MCP servers /
agents and who may use them, integration patterns (API vs. agent vs. neither),
governance that scales, cost visibility via snapshots, and shadow IT.

The list items are HTML strings rendered with `set:html`, which is what allows
the inline link. Fine here because the content is authored in the file, not
user input.

---

## 19. Thirteenth pass — naming the excerpt, folding the footer

### The home-page excerpt says whose workshops it shows

`#bildung` opens with three audience cards (Schulen, Unternehmen,
Privatpersonen) and then shows two offers. Those two are school workshops, but
nothing said so — after three audiences, a reader could reasonably take them
for the whole catalogue across all three.

Added above the tiles: **"Ein Ausschnitt aus den Workshops für Schulen"**, and
the surrounding labels now name the audience too — "+5 weitere
Schulworkshops", "Alle Schulworkshops ansehen", "Einblicke aus
Schulworkshops".

### Footer folded back to five rows

Three separate "Bildungsangebote: …" rows had grown the footer to seven
destinations. `Area` gained an optional `items`, so Bildungsangebote is one row
with its three audience pages indented beneath it behind a left rule:

```
Startseite                 Software
Keynotes & Fachvorträge    Blog
Bildungsangebote
  │ Schulen & Lehrkräfte
  │ Unternehmen & Universitäten
  │ Privatpersonen
```

The parent links to `#bildung` — the overview on the home page — so the row is
a real destination rather than a dead label. Still one component with no props,
verified byte-identical across all 24 pages.

---

## 20. Fourteenth pass — English routes, shared navigation

### Route segments are English and name the audience

`/education/` was named after the topic while `/companies/` and
`/individuals/` named the audience, and the German segments sat oddly next to
the English ones. Rule applied: **route segments are structure, so English;
visible copy stays German.**

| was | now |
|---|---|
| `/education/` | `/schools/` |
| `/education/angebote/<slug>/` | `/schools/workshops/<slug>/` |
| `/education/projekte/` | `/schools/insights/` |
| `/unternehmen/` | `/companies/` |
| `/privatpersonen/` | `/individuals/` |

**Two deliberate exceptions.** `/impressum/` and `/datenschutz/` stay German:
those are the terms German visitors and authorities look for, and an English
rename would cost recognition for nothing. The workshop slugs
(`ki-lehrerworkshop`, …) stay German too — they are the offers' own names, not
structure.

`public/education/` moved to `public/schools/` so the section's assets match
its URL. The source folder `src/education/` keeps its name: it holds the whole
education domain, including the components shared by all three audience pages.

Old URLs are covered by 301s in `public/_redirects`, including a splat rule for
the workshop slugs. Seven hardcoded `/education/` links in blog posts and one
news entry were repointed rather than left to bounce through a redirect.
`llms.txt` now lists all three audience pages.

### One navigation for the whole site

The blog header had **no nav at all** — a reader arriving from search could
reach the contact form and nothing else, not even the workshops the post was
about. The schools header had only Start/Einblicke, with no way back to the
main site. Both used the footer as their only escape.

Both now use the site navigation while keeping their own wordmark and favicon,
so the section still feels like itself. The schools bar prepends its own
"Einblicke". No "Startseite" tab is needed, because the shared bar has none.

### A bug this introduced, and the fix

Sharing the nav broke the anchors: `SiteHeader` prefixed in-page anchors with
its `home` prop, so `#speaking` became `/blog/#speaking` on a blog post and
`/schools/#speaking` on a schools page — pointing at sections those pages do
not have. The link checker missed it because `/blog/#speaking` strips to
`/blog/`, which exists.

`SiteHeader` now takes **`anchorBase`** separately from `home`: `home` is where
the brand mark links, `anchorBase` is the page that owns the anchors. The blog
and schools headers pass `/`. All cross-page anchors resolve again.

### `/companies/`: technical depth for universities

Rather than a third audience page, the university angle became a section on
the existing page — IAM from first principles, token flows (Authorization Code
with PKCE, Client Credentials, Device Code), Token Exchange (RFC 8693) and
delegation, OAuth 2.1 / OIDC / SAML compared, and why AI integrations fail on
identity and operations rather than on the model.

---

## 21. Fifteenth pass — schools navigation, mermaid rendering

### The schools bar navigates the schools area

Giving every section the site navigation (§20) made the schools bar too full
and stopped signalling that the page is for schools. It now navigates the
schools area itself, with everything else folded into one dropdown:

```
Angebote │ Preise │ Ablauf │ Aus der Praxis │ Mehr von Felix Paul ▾ │ [Anfrage senden]
                                                ├ Startseite
                                                ├ Keynotes & Fachvorträge
                                                ├ Für Unternehmen & Universitäten
                                                ├ Für Privatpersonen
                                                └ Blog
```

The first three are in-page anchors; four section ids (`preise`, `warum`,
`haltung`, `ablauf`) had to be added, only `angebote` existed. From
`/schools/insights/` and the workshop pages they resolve to `/schools/#…`
because the header's anchor base is the section root there — the blog keeps
`anchorBase="/"` since it uses the site nav.

"Einblicke" became **"Aus der Praxis"**.

### Mermaid: not a syntax problem

All **31 diagrams parse cleanly** — verified by running `mermaid.parse()`
against every block headlessly (jsdom, installed with `--no-save` and not
committed). Two real defects were behind the bad rendering:

**1. Diagrams were shrunk, not scrolled.** `svg { max-width: 100% }` plus
mermaid's own `useMaxWidth` default scaled every diagram down to the 48rem
prose column — and on a phone, down to about 360px, where a wide flowchart is
unreadable. Now `useMaxWidth: false` for flowchart, sequence and xychart, the
SVG keeps its natural size, and the container scrolls horizontally.

**2. One broken diagram could hide all the others.** The CSS hides
`.mermaid:not([data-processed])` so raw source never flashes before rendering.
But `mermaid.run()` stops at the first failure, so every diagram after a bad
one keeps no `data-processed` attribute — and stays permanently invisible. A
blank gap, with nothing in the console for a reader to notice.

Now `run()` gets `suppressErrors: true`, and a `finally` block marks anything
still unprocessed with `data-mermaid-failed`, which the CSS renders as a
readable monospace block. A diagram that fails degrades to its source instead
of disappearing.

### Job title

"Enterprise Architect" became "Solution Architect" — Felix's own edit, checked
across the whole source: five files, no stale occurrence left in the build,
including the schema.org `jobTitle`.

---

## 22. Sixteenth pass — the practice page, reachable and named

Renamed from "Aus der Praxis" to **"Vergangene Workshops"** — the old label
said how the content came about rather than what it is, so nobody could tell
what was behind it.

It is now reachable from every page: added to the **Bildungsangebote dropdown**
in the site navigation, and as a fourth child under Bildungsangebote in the
footer. The dropdown rather than the top-level bar, because a fifth top-level
entry would recreate exactly the crowding that was just fixed on the schools
bar.

Labels aligned so nav, page and CTA agree: nav "Vergangene Workshops", page
title "Vergangene Workshops & Projekte", eyebrow "Vergangene Workshops",
home-page button "Vergangene Workshops ansehen". `PATHS.pastWorkshops` is the
single definition.

### Worth a decision: the page lists three things, one of which is not a workshop

| entry | actually |
|---|---|
| NECK | learning software, built alongside the teaching work |
| Codenight | genuinely a workshop series (März 2022) |
| ReadMyBook | a discontinued dSolve Android app — never a workshop |

Under the old vague label this passed. Under "Vergangene Workshops" it is a
visible mismatch, and it is one this log introduced when ReadMyBook was added
to that page (§15). Options: widen the page to "Workshops & Projekte", move
ReadMyBook somewhere else, or leave it and accept that the third card explains
itself. Not decided here — it is a content call.

### The URL still says insights

`/schools/insights/` no longer matches the label. Left alone rather than
churning a URL that changed one commit ago; it would need another redirect for
no reader-visible gain.

---

## 23. Seventeenth pass — the practice page scoped back, Software given a section

### Vergangene Workshops belongs to the schools area

§22 put it in the site-wide dropdown and the footer. Reverted: the page shows
past **school** workshops, so it is linked from the schools bar and from the
`#bildung` block on the home page, and nowhere else. Verified: it now appears
only on `index.html` and the `/schools/` pages.

Relabelled to **"Workshops & Materialien"** (page title: "Vergangene Workshops
& Materialien"), which covers what is actually on it — Codenight was a workshop
series, NECK is software that came out of the teaching work, ReadMyBook is a
reference. That resolves the mismatch §22 flagged without moving anything off
the page.

### Software was the least represented of the three areas

Measured before changing anything:

| | Keynotes | Bildungsangebote | Software |
|---|---|---|---|
| own section on the home page | yes | yes | **no** |
| entry in the header | yes | yes (dropdown) | **no** |
| elsewhere | — | 3 audience pages | one strip row, one footer link |

And his own built software — NECK with two handbooks, ReadMyBook — was
reachable from exactly one page on the whole domain (`/schools/insights/`),
framed there as workshop material rather than as software.

So yes, under-represented. But a section that only points at d-solve.de would
have been the weakest block on the page: an outbound link with nothing to show.
**`#software` shows the software instead** — dSolve (external), NECK (opens in
the browser, on this domain) and ReadMyBook — so the section has substance.

Software is now **top-level in the bar**, not inside "Mehr": it is one of the
three business areas, while "Mehr" holds things about Felix (Über mich,
Publikationen, Aktuelles, Pressekit). The bar is Keynotes & Fachvorträge ·
Bildungsangebote ▾ · Software · Blog · Mehr ▾.

The overview strip's Software row now anchors to `#software` instead of
jumping straight to d-solve.de, matching how the other rows behave. And the
schools "Mehr von Felix Paul" dropdown gained Software, which it was missing
entirely.

Inserting a section broke the light/dark rhythm again — `#software` and
`#publikationen` both ended up white. Re-alternated; zero adjacent repeats.

### Note

NECK and ReadMyBook now appear in two places: `#software` (as software he
built) and `/schools/insights/` (as what came out of the teaching work). Two
framings of the same artefacts, deliberately — neither list claims to be
complete.

---

## 24. Eighteenth pass — link checking, and the mobile menu

### Why the 404s were invisible to the old check

It asked "does this path exist in `dist/`". A **folder without an
`index.html` exists on disk and is served as a 404** — so `/projects/neck/css`
and `/projects/neck/js` passed locally and failed live. Both were links this
log created in §20 while "fixing" the NECK handbook: a folder cannot be a page,
so they are `<code>` spans now.

`scripts/check-links.mjs` resolves links the way the host does — trailing
slash, implicit `.html`, implicit `index.html`, folder-without-index — follows
relative links (the old check skipped them entirely), covers the reference
projects, and verifies `#anchors` exist on the target page. `--live` fetches
every built page from the deployed site.

**The checker had a bug of its own first.** Relative links on a directory URL
were resolved against the parent directory, which reported 275 problems. After
fixing that, the real count was 14 — a reminder to verify the tool before
acting on its output.

Of those 14: 6 were the NECK links. The remaining 8 are pre-existing gaps in
the reference projects with no recoverable file, and **one is deliberate** — a
Codenight page teaching alt texts deliberately shows a missing image. They sit
in `KNOWN` with a reason each, so the gate can be green without hiding
anything.

`.githooks/pre-push` runs check, build and link check; `git config
core.hooksPath .githooks` activates it.

### Mobile menu: groups were flattened

On the phone the dropdowns collapsed into the list, so the four audience pages
under Bildungsangebote sat at the same level as Software and Blog — twelve
equal rows with no visible hierarchy.

Groups are `<details>` on mobile now too, closed by default, with their
children indented behind a left rule in smaller type. **12 rows → 6**, on
every section:

| | before | after |
|---|---|---|
| home / blog | 12 flat | 6 visible, 8 nested |
| schools | 11 flat | 6 visible, 6 nested |

The desktop bar is unchanged.

### Software section

dSolve is the block; NECK is one sentence underneath as something to try
without installing; ReadMyBook removed. Two equal cards beside dSolve made a
section about the company look like a project list.

---

## 25. Metadaten an die kuratierten Inhalte angeglichen

Vorgabe: sichtbare Inhalte nicht anfassen, Metadaten daran ausrichten. Geprüft
wurde jede Description gegen den tatsächlichen Text der gebauten Seite.

### Was nicht mehr zusammenpasste

| Seite | Description versprach | Seite zeigt |
|---|---|---|
| `/individuals/` | „verstehen, wie KI funktioniert … sicher unterwegs sein" – Grundlagenkurs | Individualberatung: Wettbewerbsfähigkeit, Wertschöpfungsketten, Monetarisierung, Skalierung |
| `/schools/` | Cybersicherheit, Medienkompetenz, Eltern und Erwachsene | Lehrerfortbildungen, Schülerworkshops, Kursserien, Elternabende zu KI und IT-Security |
| `/blog/` | „Teaching und spannende IT-Projekte" | „Felix Pauls persönlicher Tech Blog" |
| `/companies/` | „vom Einzelgespräch bis zum Konzernthema", „Fachvorträge" | eigene Rolle / ganzes Unternehmen / konkreter Engpass, Workshops |
| `/schools/insights/` | NECK „zum Anfassen" | NECK ist eine „Lernwebsite … spielerisch erkunden" |

Angepasst wurden ausschließlich `description`, `tagline` und die daraus
abgeleiteten OG- und schema.org-Felder — kein sichtbarer Text.

### Eine Ausnahme: der Jobtitel

`education/components/Hero.astro` zeigte „Enterprise-Architekt
(Finanzindustrie)", während `/schools/index.astro`, `llms.txt` und das
schema.org-`jobTitle` bereits „Solution Architect" sagten. Das war ein
Widerspruch **im sichtbaren Inhalt**; auf Nachfrage freigegeben und auf
Solution-Architekt vereinheitlicht. Auch die Schreibweise „IT-Security" in
`SITE.description` wurde auf „IT-Sicherheit" gezogen, wie es auf der Seite steht.

### Zur Prüfmethode

Der erste Durchlauf verglich Wortformen exakt und meldete 7 Seiten. Nach den
Korrekturen meldete er weiterhin 7 — die Treffer waren aber Flexionen
(„skalieren" vs. „Skalierung") und Bindestrich-Komposita, die die
Tokenisierung zerlegt („IT-Security" → „IT" + „Security"). Stichprobe: alle
vier verbleibenden Begriffe stehen wörtlich auf ihren Seiten.

Festgehalten, weil die naheliegende Reaktion — weiter umformulieren, bis der
Prüfer schweigt — die Descriptions verschlechtert hätte. Eine Description soll
den Inhalt zusammenfassen, nicht ihn zitieren.

---

## 26. Mermaid-Diagramme skalieren statt zu scrollen

Vorher scrollten breite Diagramme horizontal. Der Grund war ein echter
Zielkonflikt: skaliert man ein Flowchart auf die Textspalte (48rem, auf dem
Handy ~360px), wird die Beschriftung unlesbar.

Die Auflösung ist nicht „doch wieder schrumpfen", sondern **dem Diagramm mehr
Platz geben als dem Fließtext**:

- `useMaxWidth: true` für flowchart, sequence und xychart – mermaid skaliert
  das SVG wieder auf die Containerbreite.
- Der Container ist aber breiter als die Textspalte: er bricht seitlich aus
  ihr aus, bis 64rem und auf schmalen Geräten bis an den Bildschirmrand.

Zwei Details, die beim Bauen auffielen:

`100cqw` in der Breitenberechnung wäre ohne `container-type` auf einem
Vorfahren ungültig gewesen und hätte die ganze `width`-Deklaration gekippt –
entfernt.

`margin: auto` zentriert nur Elemente, die **schmaler** sind als ihr Container.
Ein ausbrechendes Element wäre nach rechts gelaufen. Stattdessen
`margin-left: 50%` plus `transform: translateX(-50%)`.

Geprüft, dass kein Vorfahre den Ausbruch abschneidet: die Kette ist
`main → .mx-auto.max-w-3xl → .prose-content`, kein `overflow: hidden`.

Das `overflow-x: auto` im Fehler-Fallback (`[data-mermaid-failed]`) bleibt –
dort steht roher Quelltext mit langen Zeilen.

**Nicht verifiziert:** die tatsächliche Darstellung. Mermaid rendert im
Browser, und die Chrome-Anbindung war in dieser Sitzung nicht verfügbar.
Geprüft wurden Konfiguration, CSS-Gültigkeit und Container-Kette.

---

## 27. Dark Mode

~590 Farbklassen liegen im Markup verstreut. Eine `dark:`-Variante je Klasse
wäre unwartbar gewesen, deshalb schalten die **Tokens** um, nicht das Markup:
`@theme` verweist auf CSS-Variablen, die in `:root` und
`:root[data-theme="dark"]` verschieden belegt sind.

Der Kniff ist die **invertierte ink-Skala**: `ink-900` heißt weiterhin
„stärkster Textkontrast", `ink-50` weiterhin „dezenteste Fläche". Weil die
Skala im Projekt konsequent semantisch benutzt wird, musste keine einzige
Textklasse angefasst werden. `brand`, `emerald` und `amber` wurden aufgehellt —
gesättigte Dunkeltöne haben auf dunklem Grund zu wenig Kontrast.

Nicht über Tokens lösbar und deshalb ersetzt:

| war | ist | Anzahl |
|---|---|---|
| `bg-white` | `bg-surface` | 61 |
| `via-white to-white` | `via-canvas to-canvas` | 5 |

`text-white` blieb bewusst: es steht ausnahmslos auf farbigem Grund und ist
dort in beiden Schemata korrekt. Nachgeprüft — der einzige Treffer außerhalb
eines farbigen Containers war ein Filter-Button auf `/blog/`, der gleichzeitig
`bg-brand-700` gesetzt bekommt.

Das Schema wird **inline im `<head>`** gesetzt, vor dem Body. Ein gebündeltes
Modul käme zu spät und die Seite würde kurz im falschen Schema aufblitzen.
`color-scheme` und zwei `theme-color`-Angaben sorgen dafür, dass auch
Formularelemente und die Browser-Leiste mitziehen.

Mermaid brennt Farben fest ins SVG. Die Diagramme werden daher bei einem
Wechsel neu gerendert; dafür wird der Quelltext vor dem ersten Rendern
zwischengespeichert, weil mermaid den Inhalt des Elements ersetzt.

**Nicht verifiziert:** das visuelle Ergebnis. Die Chrome-Anbindung war in
dieser Sitzung nicht verfügbar; geprüft wurden Build, Typen und dass keine
nicht umschaltbaren Farbwerte übrig sind.
