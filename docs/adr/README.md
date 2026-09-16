# Architecture decision records

Short records of the decisions that shape this repository: what was decided,
why, and what it costs. Add a new file when a decision changes the
structure; never edit an accepted record's decision, supersede it with a new
one.

| # | Decision | Status |
|---|---|---|
| [0001](0001-one-astro-project-one-domain.md) | One Astro project, one domain, sections as paths | accepted 2026-09-10 |
| [0002](0002-shared-layout-owns-the-head.md) | The shared layout owns the `<head>` and the site identity | accepted 2026-09-10 |
| [0003](0003-english-routes-with-german-fallback.md) | English under `/en/` with German fallback, translation state computed from files | accepted 2026-09-10 |
| [0004](0004-formsubmit-contact-form.md) | Contact form via FormSubmit, no backend | accepted 2026-05-27 |
| [0005](0005-reference-projects-on-github-pages.md) | Reference projects live on GitHub Pages, this site only links | accepted 2026-09-10 |
| [0006](0006-dark-mode-via-colour-tokens.md) | Dark mode by switching colour tokens, not `dark:` variants | accepted 2026-09-10 |
| [0007](0007-link-checker-and-pre-push-hook.md) | Own link checker, run by a tracked pre-push hook | accepted 2026-09-10 |

Template for a new record:

```md
# NNNN. Title

Status: accepted YYYY-MM-DD

## Context
## Decision
## Consequences
```
