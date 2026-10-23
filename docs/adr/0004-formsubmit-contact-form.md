# 0004. Contact form via FormSubmit, no backend

Status: accepted 2026-05-27

## Context

The site is fully static. A working contact form needs something that
receives the POST. Options were a Cloudflare Worker, a hosted form service,
or a mailto link.

## Decision

The form posts to `https://formsubmit.co/<e-mail>`. Configuration is hidden
fields in `src/components/ContactForm.astro`: `_subject`, `_template=table`,
`_captcha=true`, `_next` (the thank-you page in the form's language),
`_autoresponse`, and a `_honey` honeypot. The visible e-mail input is named
`email`, which makes FormSubmit set `Reply-To` and route the auto-reply.
There is exactly one form on the domain, the `#kontakt` block on the home
page; every "Anfrage" button links there.

## Consequences

- No account, no key, no cost. The first submission triggers a one-time
  activation mail; after long inactivity it may have to be repeated.
- FormSubmit keeps submissions for 30 days; the inbox is the archive.
- The auto-reply requires reCAPTCHA on and a non-AJAX POST; both hold.
- FormSubmit is named in the Datenschutz page. Replacing it later is one
  `action` attribute plus that paragraph.
