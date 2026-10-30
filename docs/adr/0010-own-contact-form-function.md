# 0010. Contact form via own Pages Function, Zoho Mail API and Turnstile

Status: accepted 2026-10-29. Supersedes [0004](0004-formsubmit-contact-form.md).

## Context

FormSubmit was unreachable too often, so enquiries got lost. The site stays
static; only the form needs something that receives the POST. Cloudflare
Pages runs a `functions/` folder as Workers with no extra deploy, and the
mailbox is Zoho, which has a send API on the existing plan.

## Decision

The form posts to `/api/contact`, a Pages Function in
`functions/api/contact.ts`. Since 2026-10-30 the logic is the shared package
`contact-form` (org-d-solve), so other sites and other forms (feedback)
reuse it; the file here only configures this form. It checks a honeypot and a Cloudflare Turnstile
token, then sends the enquiry with the Zoho Mail API from and to
`contact@felix-paul.de`, and redirects to the thank-you page in the form's
language. Zoho ZeptoMail was rejected because it costs money per mail
volume; Resend and form SaaS because they add a service.

## Consequences

- No cost: Pages Functions free tier, Turnstile free, Zoho Mail API in the plan.
- The recipient is fixed. Nothing is ever sent to the address typed into the
  form, so the endpoint cannot relay spam. That also means no auto-reply.
- The Zoho API has no `Reply-To`. The sender's address is in the subject and
  the first line of the body; reply by clicking it.
- Six secrets in the Pages environment; setup in
  [contact-form.md](../how-to/contact-form.md). A revoked Zoho refresh token
  breaks the form silently, so the after-deploy check sends one test enquiry.
- Zoho issues only about ten access tokens per refresh token in ten minutes.
  The function caches the token in the KV binding `ZOHO_TOKEN_CACHE` for its
  hour of validity and retries once with a fresh one on 401. Without the
  binding it fetches one per enquiry.
- A secret header (`FORM_TEST_TOKEN`) puts a request into test mode without
  Turnstile, so `npm run check:form:live` can test the real chain (daily in `.github/workflows/live-checks.yml`). Whoever
  has the token can only send mails to me, as with the form itself.
- Turnstile loads a script from `challenges.cloudflare.com`; named in the
  Datenschutz page.
