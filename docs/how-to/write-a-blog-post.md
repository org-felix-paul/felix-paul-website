# How to write a blog post

The rules for the *content* of a post: voice, structure, sources, graphics,
demos. The mechanics (frontmatter fields, where images go, how Mermaid is
rendered) are in [add-content.md](add-content.md#blog-post) and are not
repeated here. This file is written for a human author and for an AI session
alike; an AI session reads it before touching `src/blog/content/posts/`.

## What a post is for

A post explains one thing so well that the given audience understands it. (professionals,  teachers, parents or pupil).
If prior knowledge is assumed state it concrete. 
It is the proof of expertise behind the workshops. It sells nothing. The workshop
offer is one paragraph at the end, never woven into the text.

## Voice

- **Write like a researcher who can teach.** Claims are backed by a source or
  by a reproducible example. Opinions are marked as opinions.
- **No marketing.** No superlatives, no "revolutionary", no urgency, no
  promises. If a sentence could appear in an ad, delete it.
- **Every step follows from the previous one.** A reader who skips a section
  should notice. If a section can be removed without loss, remove it.
- **Simple language, exact terms.** Explain each technical term once, then use
  it. Do not replace a term with a German paraphrase when the term is what
  professionals say ("Prompt Injection", "Crawling"); do explain it.
- **German**, second person singular ("du"), gender-inclusive with colon
  ("Schüler:innen"). Legal and product names stay as they are.
- **Honest about limits.** Where evidence is thin or comes from industry
  analyses rather than primary sources, say so in the text, not only in the
  source list.

## Structure

Look at `how-google-search-works.md` or `how-to-mislead-ai.md` as a model.
Every post has, in this order:

1. **Frontmatter** (see add-content.md). The `description` is one or two
   sentences of at most about 160 characters and is what search engines and
   the list page show. `pubDate` is the publication date, ISO format.
2. **Opening paragraph**: the question the post answers and why it matters
   to the reader, in three to five sentences. No heading above it.
3. **Method note** as a blockquote, `> **Hinweis zur Methode:** …`, when the
   post rests on specific sources, data, or an experiment: what was used,
   what was not, what the date of the data is.
4. **`## Gliederung`**: a numbered list linking to every section anchor.
   `npm run slug -- "1. Die vier Stufen"` prints the exact anchor id.
5. **Numbered sections** `## 1. …`, `## 2. …`. One idea per section. A
   section that needs sub-points uses `###`. Every section starts with the
   point, then the explanation, then the evidence.
6. **Worked example** where possible: a real, reproducible case the reader
   can repeat (own website, a demo page, a screenshot with numbers). This is
   what distinguishes the post from a summary.
7. **`## Einen Workshop buchen`**: one paragraph, links to the offer. The only
   place the workshops are mentioned.
8. **`## Quellen`**: footnotes, see below. The feedback and license note is
   added by the template automatically; do not write it into the post.

Length: most posts are 1,500 to 3,500 words. Shorter is fine when the topic
is small; longer needs a reason.

## Sources

- Every factual claim, number and quotation has a footnote: `[^key]` in the
  text, `[^key]: …` under `## Quellen`. Keys are short and readable
  (`[^jim-2025]`, `[^helpful]`).
- A footnote names **author or organisation, title, what it supports**, then
  in italics the **publication or survey date** and the **access date**
  (`abgerufen 2026-06-10`), then the URL in angle brackets. Documentation
  without a date says so: *Laufend gepflegte Dokumentation, ohne festes
  Datum*.
- **Primary sources first**: official documentation, laws, peer-reviewed
  papers, official statistics (JIM, KIM, BSI, Destatis, Eurostat). Industry
  analyses and press articles are allowed when marked as such in the text.
- Wikipedia only for definitions, never for numbers.
- **Never invent a number, a study or a quotation.** If no source can be
  found, the claim is dropped or rewritten as an open question. An AI session
  lists every source it could not open in its final message, so the author
  can verify them before the post goes live.
- The intro to `## Quellen` states the common access date and any caveat
  about the source mix.

## Graphics and diagrams

- A diagram earns its place when it shows a mechanism, a sequence or a
  comparison that the text would need a paragraph for. Decorative graphics
  are not used.
- Use **Mermaid** in a fenced ```` ```mermaid ```` block. It renders in the
  browser, in light and dark mode, only on pages that contain one. Keep
  diagrams narrow enough for a phone: flowcharts top to bottom, few words per
  node.
- Screenshots and images go to `src/blog/content/posts/img/` or
  `public/blog/img/`, are compressed (AVIF or WebP where possible), and have
  an alt text that states what the image shows, not "Screenshot".
- Tables are fine; the layout wraps them for small screens.

## Interactive demos inside a post

A small static app can live with the post, as the drone comparison in
`how-to-mislead-ai.md` does:

- Put the files (plain HTML, CSS, JS, relative paths only, no build step,
  no keys) under `public/blog/demos/<post-slug>/`.
- Link to it from the text, or embed it in place with
  `<iframe src="/blog/demos/<post-slug>/" title="…" loading="lazy"></iframe>`.
  Raw HTML is allowed in the Markdown.
- The demo needs its own `index.html` with a short explanation, because
  people share the demo URL without the post.
- Content that must be found by search engines stays in the post text, not
  in the demo.

## Before it goes live

- `draft: true` while writing; the post is not built. `preview: true` shows a
  "coming soon" teaser without a page.
- `npm run verify` passes (types, build, internal links). The pre-push hook
  runs it anyway.
- Read the post once on a phone-sized window; check every Mermaid diagram in
  dark mode.
- Every source opened once; every number checked against its source.
- One person who is not the author has read it. The feedback note at the end
  of every post exists so that readers can send corrections as issues or pull
  requests.

## Working with an AI session

An AI session that writes or edits a post follows everything above, and:

- Reads two existing posts first, to match voice and structure.
- Writes into `src/blog/content/posts/<slug>.md` with `draft: true`, on a
  branch, never directly to `main`.
- Does not change the slug of a published post; the slug is the URL.
- Ends with a list of the sources used, marked as opened or not opened, and
  of every claim it could not source.
