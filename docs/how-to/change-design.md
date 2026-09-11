# How to change the design

Styling is Tailwind utility classes in the markup (`class="mt-3 text-sm
text-ink-600"`) plus one stylesheet, `src/styles/global.css`, that defines the
colour palette and the styles for rendered Markdown.

## Colours and dark mode

`global.css` has three parts:

1. `@theme { --color-brand-700: var(--c-brand-700); … }` registers the
   palettes with Tailwind so that `bg-brand-700`, `text-ink-600` and so on
   exist as classes.
2. `:root { --c-brand-700: #015aa0; … }` holds the light values.
3. `:root[data-theme="dark"] { --c-brand-700: #93cff7; … }` holds the dark
   values.

Every class in the markup therefore points at a variable that changes with
the theme. There are no `dark:` variants anywhere, and none should be added.

Palettes:

| Palette | Used for |
|---|---|
| `brand-*` | blue: links, buttons, the speaking area |
| `ink-*` | grey: text and surfaces. **Inverted in dark mode**: `ink-900` is always the strongest text, `ink-50` always the quietest surface |
| `emerald-*` | green: the education area |
| `amber-*` | orange: the software area and the preview banner |
| `surface`, `canvas` | white card surface and page background (dark in dark mode) |
| `on-accent` | text on a filled accent surface; white in light mode, near-black in dark mode, because the accent colours flip to light there |
| `rule` | lines that carry structure (form borders, table grid) and need 3:1 contrast |

To change a colour, edit the hex value in `:root` and its counterpart in the
dark block, then run `npm run check:contrast`. The script reads the values
from `global.css`, collects every text/background pair that actually occurs
together in the markup and reports pairs under WCAG AA in either theme.

The theme toggle in the header (`src/components/ThemeToggle.astro`) stores
the choice in `localStorage`; without a choice the site follows the system.
A small inline script in `Layout.astro` sets `data-theme` before the body
renders so the wrong theme never flashes.

## Fonts and spacing

Inter is self-hosted (`@fontsource-variable/inter`, imported in
`Layout.astro`). The font stack is set in `@theme` (`--font-sans`,
`--font-display`). Spacing and sizes are plain Tailwind classes in the
components; `src/components/Section.astro` sets the common section padding
and the centred heading block, so most pages need no layout classes of their
own.

## Rendered Markdown

Blog posts and workshop bodies are wrapped in `.prose-content`. Its rules in
`global.css` style headings, lists, links, tables and Mermaid diagrams.
Tables and diagrams are allowed to grow wider than the text column (up to
64 rem) and shrink to the phone width; the comments in the CSS explain each
rule and the measurement that motivated it.

## Reusable pieces

| Component | Purpose |
|---|---|
| `Section` | section with optional eyebrow, title, lead; `as="h1"` on the one section that is the page heading |
| `SiteHeader` | header for all sections; branding and menu come in as props |
| `SiteFooter` | one footer, identical within a language |
| `ContactForm` | the one contact form, both languages |
| `CtaBanner` | the blue call-to-action block at the end of the audience pages |
| `ZielgruppenHinweis` | the three audience cards (schools, companies, individuals) |
| `EnvBanner`, `ThemeToggle`, `LanguageLink` | preview strip, dark mode switch, DE/EN switch |

A new component goes to `src/components/` if it is used by more than one
section, otherwise into that section's `components/` folder. Declare its
props in an `interface Props` at the top; that is what makes wrong usage a
build error.

Tailwind only picks up class names that appear literally in a file. Do not
build class names from pieces (`bg-${colour}-100`); write the full name.
