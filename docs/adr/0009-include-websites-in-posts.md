# 0009. Interactive elements in posts: one generic frame, one widget module per element

Status: accepted 2026-09-17

## Context

I want to have interactive elements where readers not only see static text and images but can also make simple surveys that classify information for them, questionnaires, ...
like checking if the eu ai act applies, if cra applies, ... a little quiz at the end of a blog post.
Therefore interactive elements are needed.

Requirements from the discussion:

- The interactive part can always be collapsed inside the blog post.
- Two modes: (1) relevant content is shown one after another so the user only sees the relevant step, (2) everything is shown at once for an overview.
- No backend.
- Adapts to dark mode and light mode.
- Labeled and referenced from the blog post, like a figure ("Interaktiv 1: …").

Requirements added while comparing the options:

- **No external requests.** The element loads nothing from third-party hosts; the Datenschutz page stays true.
- **Says so without JavaScript.** Interactive means JavaScript; without it the box states that the element cannot be shown. No static fallback is maintained, because it would be a second implementation.
- **Usable on a phone and by keyboard.** Native form controls, visible focus, no hover-only interaction.
- **Content that must be found by search engines stays in the post text.** The element is an aid, not the article.
- **One implementation per element.** The same logic must not exist twice (once for the workshop, once for the blog).
- **Versioned with the post.** The element lives in this repository and changes with the text; no separate deploy.
- **Reusable across posts.** A second post can embed the same element with a different mode or caption without copying code.
- **Result state survives a mode switch.** Ticked answers stay ticked when the reader changes between step-by-step and overview.

The requirement that decided it, added last: **guaranteed consistency when an AI writes the element.** The AI writes the element's logic in one place; the frame around every element is defined once for all posts. A change of the blog's colours or of the frame must reach every post without editing posts.

The reference element is the EU AI Act quick-check from `workshop-material` (plain HTML, JS, CSS, no server). Options 1 to 3 were built side by side on the branch `discuss-embedding-of-websites-in-posts` (commit "ADR 0009: three ways to embed interactive elements") before the branch was reduced to the chosen shape.

## Options

### 1. Standalone page in an iframe

The element is copied unchanged to `public/blog/demos/<name>/` and the post embeds it with `<details>` and `<iframe>`.

- Author writes raw HTML in a `.md` post, two tags. Works today; matches the drone demo.
- Fails dark mode: the iframe is its own document and does not see the site's theme switch.
- Fails two modes and collapse unless the element implements them itself. Foreign styling, fixed height.
- Right for a whole site of its own or a third-party page.

### 2. Widget hook in the post template

The post keeps `.md` and contains `<div data-widget="eu-ai-act" data-mode="steps">fallback</div>` inside an author-written `<details>`. The template finds `[data-widget]` and dynamically imports the module, like the Mermaid rendering.

- Author writes about eight lines of raw HTML with classes per element.
- Meets the functional requirements, no new dependency.
- Frame and classes live in every post: consistency by discipline only, redesign means editing posts. A typo in an attribute falls back silently.

### 3. Component per element in an MDX post

`@astrojs/mdx` is added; the post is `.mdx` and writes `<EuAiActCheck mode="all" />`. The component renders frame and caption, the browser mounts the logic.

- Author writes one import and one tag; props are typed, a wrong value fails the build.
- The frame is repeated in every element's component.
- MDX is stricter than Markdown (`{` and `<` in prose break the build); only posts with an element need `.mdx`.

### 4. One generic frame, one widget module per element (option 3 generalised)

`src/blog/interactive/Interactive.astro` is the only frame: collapsible box, caption "Interaktiv: …", view switch, JavaScript notice, colour tokens, lazy mounting. `registry.ts` maps a name to a module and its modes; `ui.ts` holds the only classes a widget may use. An element is `widgets/<name>.ts` exporting `mount(root, { mode })` and returning `{ setMode }`. The post writes `<Interactive widget="eu-ai-act" id="interaktiv-1" title="…" />`.

- Author writes one import line and one tag with named props. No HTML, no classes.
- Consistency is structural: a post has nothing to deviate with. Redesign means editing `ui.ts` and the frame.
- Unknown widget name or unsupported mode throws in the component at build time.
- Same MDX strictness as option 3, only for posts with an element.

| Requirement | 1 iframe | 2 data-widget | 3 component per element | 4 generic frame |
|---|---|---|---|---|
| collapsible | author's `<details>` | author's `<details>` | in component | frame |
| two modes | no | yes | yes | yes, switch in frame |
| no backend | yes | yes | yes | yes |
| dark mode | **no** | yes | yes | yes |
| labeled, referenced | author's caption | author's caption | component caption | frame caption |
| no external requests | yes | yes | yes | yes |
| notice without JavaScript | link next to iframe | text in the div | text in component | frame |
| one implementation | copy in `public/` | widget module | widget module | widget module |
| build fails on typo | no | no | yes | yes |
| post stays `.md` | yes | yes | **no** | **no** |
| frame change reaches every post | never | no, per post | no, per element | **yes** |
| AI touches for a new element | copy files | widget + hook line | widget + component | widget + registry line |

## Decision

**Option 4.** One generic frame for all elements, one widget module per element, a registry line in between. Option 1 stays for whole standalone sites, as the drone demo already is. Options 2 and 3 were removed from the branch.

Why not 2: its frame is raw HTML written per post, so consistency depends on the author copying it right, and a design change means editing posts. Why not 3 as built: a component per element repeats the frame per element; the generalised form keeps the typed props and moves the frame to one place.

## Consequences

- Posts with an element are `.mdx`; all other posts stay `.md`. `@astrojs/mdx` is part of the site.
- `src/blog/interactive/`: `Interactive.astro`, `registry.ts`, `types.ts`, `ui.ts`, `widgets/<name>.ts` and `widgets/<name>-data.ts`. A widget uses only classes from `ui.ts`.
- A new element is two changes: the widget file(s) and one registry line. `docs/how-to/write-an-interactive-blog-post.md` is the guide; the repo `CLAUDE.md` points AI sessions at it.
- No standalone copy of an element. The one under `public/blog/demos/eu-ai-act-quickcheck/` was removed again: it was a second implementation and needed JavaScript itself. The workshop version in `workshop-material` was deleted earlier, so the widget is the only implementation.
- No demo post is kept; the usage example lives in the how-to. The first real use is the EU AI Act post.
