# 0006. Dark mode by switching colour tokens, not `dark:` variants

Status: accepted 2026-09-10

## Context

The markup uses about 590 Tailwind colour classes. Tailwind's usual dark
mode adds a `dark:` variant next to each, doubling the classes and making
every future colour change a two-place edit.

## Decision

The Tailwind palettes in `@theme` point at CSS variables. `:root` holds the
light values, `:root[data-theme="dark"]` the dark ones. Every existing class
switches automatically. The grey scale is inverted in dark mode so class
names keep their meaning; the accent palettes are lightened. `bg-white`
became `bg-surface`, gradients use `canvas`, and text on filled accent
surfaces uses `on-accent`, because the accent colours flip to light in dark
mode and white text on them fell to 1.68:1. An inline script sets the theme
before the body renders; the toggle stores the choice in `localStorage`,
otherwise the system setting applies.

## Consequences

- No `dark:` variant anywhere; a colour change is one value per theme.
- `npm run check:contrast` verifies WCAG AA for every pair in both themes;
  several dark mode defects were only found by measuring.
- Mermaid diagrams are re-rendered on a theme change because their colours
  are baked into the SVG.
