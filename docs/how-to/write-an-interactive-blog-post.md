# How to write an interactive blog post

An interactive element is a small form, quiz or classifier inside a post: the
EU AI Act quick-check, a "does the CRA apply to me" check, a quiz at the end
of a post. Decision and reasoning: [ADR 0009](../adr/0009-include-websites-in-posts.md).

Two places, nothing else:

| What | Where | Who touches it |
|---|---|---|
| The frame: collapsible box, caption, view switch, JavaScript notice, colours, lazy loading | `src/blog/interactive/Interactive.astro`, `ui.ts`, `types.ts` | once, for all elements |
| The element itself: its questions, logic and result | `src/blog/interactive/widgets/<name>.ts` plus one line in `registry.ts` | per element |

A post never contains frame HTML, CSS classes or notice text. If the blog's
design changes, `ui.ts` and `Interactive.astro` change; every post follows.

## What the frame provides, for every element

Provided once, never written by a post or a widget:

- **Collapsible box** with the caption "Interaktiv: `<title>`" and an anchor `id`, collapsed by default, `open` on request.
- **View switch** "Schritt für Schritt / Alles auf einmal", shown only if the widget declares more than one mode; the frame calls the widget's `setMode` and marks the active button.
- **Lazy loading**: the widget's code is loaded only on pages that use it, after the page is shown.
- **Re-mounting after page transitions** (`astro:page-load`), and a guard so nothing mounts twice.
- **JavaScript notice**: without JavaScript the box shows "Dieses interaktive Element kann nicht angezeigt werden, weil JavaScript in deinem Browser nicht verfügbar ist." There is no static fallback; interactive means JavaScript.
- **Build-time checks**: an unknown `widget` name or a `mode` the widget does not declare fails the build.
- **Design**: spacing, border, background and every class a widget may use come from `ui.ts` on the site's colour tokens, so light and dark mode need nothing in the widget.
- **DOM helper** `el(tag, classes, text)` so a widget stays short and framework-free.

The widget receives an empty container and one option, `mode`, and returns one function, `setMode`. Everything inside the container is the widget's own: its data, its logic, its controls, its result.

## Using an existing element in a post

The post must be an `.mdx` file (`src/blog/content/posts/<slug>.mdx`).
Everything else about the post is as in [write-a-blog-post.md](write-a-blog-post.md).

```mdx
---
title: "…"
…
---
import Interactive from "../../interactive/Interactive.astro";

Text before. Siehe [Interaktiv 1](#interaktiv-1).

<Interactive widget="eu-ai-act" id="interaktiv-1" title="EU AI Act Quick-Check" />

Text after.
```

| Prop | Required | Meaning |
|---|---|---|
| `widget` | yes | Name from `registry.ts`. An unknown name fails the build. |
| `id` | yes | Anchor. Number them per post: `interaktiv-1`, `interaktiv-2`. |
| `title` | yes | Caption; shown as "Interaktiv: title>'". |
| `mode` | no | Initial view, `steps` or `all`; default is the widget's first mode. |
| `open` | no | Expanded on load. Default collapsed. |

Conventions:

- Reference the element from the text like a figure, before it appears, with
  an empty link that is filled at build time: "Siehe [](#interaktiv-1)."
  renders as "Siehe Interaktiv 1." (see the references section in
  [write-a-blog-post.md](write-a-blog-post.md#references-in-the-text)).
- The element supports the text; the argument stays in the text, where
  search engines read it.
- MDX is stricter than Markdown: a bare `{` or `<` in prose breaks the build.
  Put such characters in backticks.

## Adding a new element

1. **Write the widget** `src/blog/interactive/widgets/<name>.ts`. It exports
   one function that follows `WidgetMount` from `types.ts`:

   ```ts
   import type { Mode, WidgetMount } from "../types";
   import { BTN_PRIMARY, BOX, MUTED, el } from "../ui";

   export const mount: WidgetMount = (root, options) => {
     let mode: Mode = options.mode;
     function render() { /* build the UI into root with el() and the classes from ui.ts */ }
     render();
     return { setMode(m) { mode = m; render(); } };
   };
   ```

   Rules for the widget:
   - Only classes from `ui.ts`. No colours, no fonts, no `style=`. That is
     what keeps every element consistent and dark-mode safe.
   - Keep data (questions, texts) in a sibling file `<name>-data.ts`, logic in
     `<name>.ts`.
   - Keep the reader's answers when `setMode` is called.
   - No network requests, no backend, no third-party script.
   - Native form controls, so keyboard and screen readers work.
   - Text the reader sees is German; code and comments are English.

2. **Register it** with one line in `src/blog/interactive/registry.ts`:

   ```ts
   "<name>": { load: () => import("./widgets/<name>"), modes: ["steps", "all"] },
   ```

   `modes` lists the views the widget supports; one entry means no switch is
   shown.

3. **Try it** in both modes and both themes with `npm run dev`, then
   `npm run verify`.

## Rules for an AI session

- A new element means exactly two changes: the widget file (plus its data
  file) and one line in the registry. Nothing in `Interactive.astro`,
  `ui.ts`, the post template or `global.css` if not necessary. Ask the user beforde especially if an element in ui.ts is missing.
- Never write `<details>`, classes or notice text into a post. If the frame
  needs something new, change the frame once and say so.
- Reuse an existing widget before writing a new one; a second post may embed
  the same widget with another `title` and `mode`.
