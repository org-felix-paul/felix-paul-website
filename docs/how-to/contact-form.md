# How to set up and fix the contact form

The form in `src/components/ContactForm.astro` posts to `/api/contact`, the
Pages Function in `functions/api/contact.ts`. That file only holds this
form's configuration: recipient, fields, subject, thank-you pages, error
text. The logic (Turnstile, honeypot, Zoho Mail API, token cache, test mode)
is the package [contact-form](https://github.com/org-d-solve/contact-form),
pinned to a tag in `package.json`. Why: [ADR 0010](../adr/0010-own-contact-form-function.md).

## Change texts, fields or the recipient

Edit `functions/api/contact.ts`; options are listed in the package README.
A field added to the form must also be added under `fields`, otherwise it is
not in the mail. A second form (feedback, …) is a second file, e.g.
`functions/api/feedback.ts`, with its own configuration and recipient.

## Update the package

Raise the tag in `package.json` (`github:org-d-solve/contact-form#vX.Y.Z`),
`npm install`, `npm run verify`, push.

## Setup

Turnstile widget, Zoho refresh token, KV binding and Pages environment: package
README, section "Setup per site". Values for this site (site key, account,
folder IDs): `administration/adrs/contact-forms.md` (private repo). The
public site key is `TURNSTILE_SITE_KEY` in `src/consts.ts`.

## Tests

`npm run check:form:live` sends one enquiry in test mode to felix-paul.de and
waits for the mail in the Zoho folder `felix-paul/test`; it runs daily on
GitHub Actions. Credentials: `.env`, template `.env.example`; for GitHub the
same values are repository secrets (`gh secret set -f .env`). The logic's
unit tests live in the package. Overview: [testing.md](../reference/testing.md).

## When it breaks

The error page ends with the failed step, e.g. `(400: turnstile …)`. Causes
are listed in the package README. Logs: Pages project → Deployments → the
deployment → Functions → Real-time logs (live only).
