> Scope: this section only. Repo-wide setup, deployment and the SEO
> review checklist live in the root `README.md`; the merge history is in
> `claude-behavior.md`.

# Education section (`/education/`)

Static marketing site for Felix Paul's speaker / workshop offering. Built on the stack
agreed in `../README.md`:

- **Astro 6** (content collections, zero-JS by default)
- **Tailwind CSS 4** (via `@tailwindcss/postcss`)
- **Markdown content** for all Angebote – edit a `.md` file, the site rebuilds
- **Static output** – deploy to **Cloudflare Pages**, no backend in v1

No template was used as a base. The structure is hand-rolled and intentionally small
(≈10 components, 8 pages) so it stays AI-editable and free of unused landing-page sections.

---

## 0. Recent changes (educational-projects branch)

This round of edits made the homepage the core of the site and tightened the ecosystem
cross-linking. Concretely:

- **Angebote moved onto the start page, removed from the navbar.** `src/education/consts.ts` `NAV`
  no longer contains an `Angebote` entry. The offers grid on `/` (`src/pages/index.astr1o`)
  is the prominent core of the homepage; the detail pages `/angebote/<slug>/` stay reachable
  via the cards. The standalone `/angebote/` index page (`src/pages/education/angebote/index.astro`)
  is **kept** (still reachable, just not in the nav) because the offer detail pages link
  back to it ("← Alle Angebote") and it holds the long-form Honorartabelle.
- **Price overview on the start page.** A new "Preise auf einen Blick" section on `/` renders
  a compact table directly from the `preis`/`dauer` fields of each `src/education/content/angebote/*.md`
  file (it iterates the live content collection, so it never drifts from the source). It
  states the values are Netto-Orientierungswerte zzgl. Reisekosten and references the
  § 4 Nr. 21 UStG exemption (brutto = netto for schools).
- **"Workshops auf Anfrage" note** added to the offers section on `/`, with a link to
  `/kontakt/`.
- **Nav label "Projekte" renamed to "Referenzen"** in `src/education/consts.ts` and in the footer.
  The route stays `/projekte/` (no broken links); the page content is unchanged.
- **Header/Footer branding** now reads **"Teaching@Felix Paul"** and the old "FP" text badge
  was replaced by the actual `/favicon.svg` image (`<img>`) in both `Header.astro` and
  `Footer.astro`. No "FP" text badge remains.
- **Clickable project images** on `/projekte/`: NECK image → `https://neck.felix-paul.de/`;
  the Codenight lion + the four workshop thumbnails → `https://codenight.felix-paul.de/`.
  Each is wrapped in an `<a target="_blank" rel="noopener noreferrer">` with a subtle
  `transition hover:opacity-90` / `cursor-pointer` affordance. Alt text preserved.
- **Footer ecosystem cross-links.** The footer links UP to the hub `felix-paul.de`
  (`SITE.mainSite`) and DOWN to edu's own small project pages
  (neck.felix-paul.de, codenight.felix-paul.de, tierparks.felix-paul.de/UnsereTierwelt.html).
  It does **not** link to other main sites (d-solve.de, felix-paul.de/blog).

The per-offer prices used in the start-page table (read from the Markdown frontmatter):

| Format (order) | Dauer | Honorar (`preis`) |
|---|---|---|
| KI in der Schule – Pädagogischer Tag (1) | 4–6 Stunden | 1.500–2.500 € |
| KI verstehen … – Schüler-Workshop (2) | 90 Min bis Halbtag | 250–900 € |
| Cybermobbing-Prävention – Workshop (3) | 90 Min bis Halbtag | 250–900 € |
| Cybersecurity & Phishing-Demo – Workshop (4) | Halbtag bis Projekttag | 450–1.400 € |
| Elternabend (5) | 90 Minuten | 350–600 € |

### Manual follow-up steps (owner must do by hand)

- [ ] **Verify the price-overview values.** The start-page table pulls `preis`/`dauer`
  straight from `src/education/content/angebote/*.md`. Confirm these spans are still current; editing
  the Markdown frontmatter updates both the cards and the table automatically.
- [ ] **Supply real references / testimonials.** `/projekte/` still shows the placeholder
  "Referenzen & Stimmen aus Schulen" block ("Hier sammeln sich künftig Rückmeldungen…").
  Replace with real quotes/logos once available.
- [ ] **Supply real workshop/project photos** if the current screenshots in
  `public/img/neck/` and `public/img/codenight/` should be refreshed.
- [ ] **Favicon still shows "FP".** `public/favicon.svg` is the blue rounded square with
  "FP". It is now used as the header/footer logo image. If a dedicated teaching mark is
  wanted, replace `public/favicon.svg` (header/footer pick it up automatically).
- [ ] **Run `npm run build` and confirm a clean build** before deploying (the agent could
  not run it in this environment due to a sandbox restriction).

---

## Table of contents

1. [What was built](#1-what-was-built)
2. [File structure (with per-folder explanations)](#2-file-structure-with-per-folder-explanations)
3. [Pages](#3-pages)
4. [Edit content](#4-edit-content)
   - [4.1 Angebot-Icons hinzufügen oder ändern](#41-angebot-icons-hinzufügen-oder-ändern)
   - [4.2 Über-mich-Seite anpassen](#42-über-mich-seite-anpassen)
5. [Run locally and deploy](#5-run-locally-and-deploy)
6. [Contact form: FormSubmit and the honeypot field](#6-contact-form-formsubmit-and-the-honeypot-field)
7. [What is intentionally NOT in v1](#7-what-is-intentionally-not-in-v1)
8. [Open before going live](#8-open-before-going-live)
9. [Assets: OG-Bild und Favicon](#9-assets-og-bild-und-favicon)
10. [Testing](#10-testing)
    - [10.1 Automated checks (CI)](#101-automated-checks-ci)
    - [10.2 Manual test playbook](#102-manual-test-playbook)

---

## 1. What was built

A complete, deployable static website for Felix Paul as a speaker and workshop facilitator
for schools. Concretely:

- **Project scaffolding**: `package.json`, `astro.config.mjs`, `postcss.config.mjs`,
  `tsconfig.json`, `.gitignore`, Tailwind 4 wired in via the PostCSS plugin,
  `@astrojs/sitemap` integration, strict TypeScript.
- **Global theming**: custom `brand-*` (blue) and `ink-*` (neutral grey) color scales defined
  with the new Tailwind 4 `@theme` syntax in `src/styles/global.css`, Inter as the display
  font, basic `.prose-content` rules for the rendered Markdown.
- **Shared layout** (`src/education/EduLayout.astro`): HTML head with `<title>`, meta description,
  canonical URL, Open Graph + Twitter tags, German `<html lang="de">`, sitemap link,
  skip-to-content link for accessibility.
- **Components**:
  - `Header.astro` – sticky top nav with logo, desktop nav, mobile burger menu (active state
    based on URL, no framework needed – plain `<script>` toggles a class).
  - `Footer.astro` – three-column footer with navigation, contact and legal links, copyright.
  - `Hero.astro` – home page hero with headline, USP, dual CTA, three-column stats and a
    decorative blue "USP card" on the right.
  - `Section.astro` – reusable `<section>` wrapper with optional eyebrow / title / lead and
    a `background="white|muted"` switch. Used on every page to keep spacing consistent.
  - `AngebotCard.astro` – the offer card on the home and Angebote pages. SVG icon, subtitle,
    title, teaser, three-column meta footer (Zielgruppe / Dauer / Honorar), arrow link.
  - `ContactForm.astro` – three-field form (name, e-mail, message) plus mandatory privacy
    checkbox, hidden honeypot, hidden FormSubmit config fields. See section 6 below.
- **Content collection** (`src/content.config.ts` + `src/education/content/angebote/*.md`): five
  Angebote as Markdown files with a typed Zod schema. Adding a new `.md` file automatically
  produces a card on the home and Angebote pages plus a detail route.
- **Pages**: Start, Über mich, Angebote (list), Angebot detail (dynamic from Markdown),
  Kontakt, Impressum, Datenschutz, 404. See section 3.
- **SEO and discovery**: sitemap (`sitemap-index.xml` produced at build), `robots.txt`,
  Open Graph + Twitter Card meta on every page, canonical URLs.
- **Build verified**: `npx astro build` produced 12 HTML files with no warnings.

---

## 2. File structure (with per-folder explanations)

```
website-astro-agent-work/
├── astro.config.mjs        ← Astro config: site URL, sitemap integration
├── postcss.config.mjs      ← registers @tailwindcss/postcss so Tailwind 4 processes global.css
├── package.json            ← dependencies + npm scripts (dev / build / preview)
├── tsconfig.json           ← strict TypeScript, extends astro/tsconfigs/strict
├── .gitignore              ← ignores node_modules, dist, .astro, .env, .DS_Store
├── README.md               ← this file
│
├── public/                 ← copied 1:1 into the build, served at site root
│   ├── favicon.svg         ← blue rounded square with "FP" – also used as the Header/Footer logo image
│   └── robots.txt          ← allows all crawlers, points to sitemap
│
└── src/                    ← everything Astro processes
    │
    ├── consts.ts           ← global strings: name, email, LinkedIn URL, city, nav items.
    │                         Edit ONE file to change them everywhere.
    │
    ├── content.config.ts   ← Astro content-collection definition.
    │                         Declares the `angebote` collection with its Zod schema
    │                         (title, subtitle, zielgruppe, dauer, preis, teaser, icon, order).
    │                         The schema makes the Markdown frontmatter type-safe.
    │
    ├── content/
    │   └── angebote/       ← The five offers as Markdown. Each file = one offer.
    │       ├── ki-lehrkraefte.md         (Pädagogischer Tag, Kollegium)
    │       ├── ki-schueler.md            (Schüler-Workshop)
    │       ├── cybermobbing.md           (Schüler-Workshop)
    │       ├── cybersecurity-phishing.md (Schüler-Workshop, Klasse 9–13)
    │       └── elternabend.md            (Eltern, 90 Min)
    │
    ├── layouts/
    │   └── Layout.astro    ← The shared HTML shell. Every page uses this.
    │                         Sets <title>, meta description, OG/Twitter tags, canonical URL,
    │                         loads the Inter font, embeds Header + <slot/> + Footer.
    │
    ├── components/         ← Reusable UI building blocks. No business logic, just markup.
    │   ├── Header.astro
    │   ├── Footer.astro
    │   ├── Hero.astro
    │   ├── Section.astro
    │   ├── AngebotCard.astro
    │   └── ContactForm.astro
    │
    ├── pages/              ← Each file = one route. Astro's file-based routing.
    │   ├── index.astro              → /
    │   ├── ueber-mich.astro         → /ueber-mich/
    │   ├── kontakt.astro            → /kontakt/
    │   ├── impressum.astro          → /impressum/
    │   ├── datenschutz.astro        → /datenschutz/
    │   ├── 404.astro                → served on 404
    │   └── angebote/
    │       ├── index.astro          → /angebote/         (list of all offers)
    │       └── [slug].astro         → /angebote/<slug>/  (one page per .md file)
    │
    └── styles/
        └── global.css      ← Tailwind 4 entry point.
                              `@import "tailwindcss";` pulls in the framework.
                              `@theme { ... }` registers custom color scales and fonts.
                              `.prose-content` rules style the Markdown rendered on Angebot
                              detail pages.
```

### Why this layout

- **`consts.ts`**: any change to the name, email or LinkedIn URL happens in one place.
- **`content/angebote/`**: writing or editing an offer means editing one `.md` file. No
  TypeScript, no components, no rebuild config. AI-friendly.
- **`content.config.ts`**: the schema is enforced at build time. A typo in the frontmatter
  (e.g. forgetting `zielgruppe`) fails the build, not silently in production.
- **`components/` vs `pages/`**: components are dumb / reusable. Pages compose them and
  fetch content. This separation keeps each file under ~150 lines.
- **`public/`** is for files that must be served verbatim (favicon, robots.txt, future
  `og-default.png`). Everything else goes through Astro's build pipeline.

---

## 3. Pages

| Route | Purpose |
|---|---|
| `/` | Hero, Angebote-Übersicht (3-Spalten-Grid) + "Workshops auf Anfrage"-Hinweis, Preisübersicht-Tabelle, USP-Block (M.Ed./M.Sc./Praxis), 3-Schritte-Buchungsprozess, CTA-Banner |
| `/ueber-mich/` | Qualifikationen, Berufserfahrung, Interessen, "Auf einen Blick"-Card, LinkedIn-Link |
| `/angebote/` | Liste aller Angebote + Honorartabelle (nicht mehr in der Navigation, aber erreichbar) |
| `/angebote/[slug]/` | Detailseite je Angebot, gerendert aus dem Markdown-Body + Hero mit Meta-Daten + "Jetzt buchen"-Block |
| `/kontakt/` | Kontaktformular (3 Felder + Datenschutz-Checkbox) + Direktkontakt-Card + Reaktionszeit-Hinweis |
| `/impressum/` | § 5 DDG / § 18 MStV – mit Platzhaltern `[Straße]`, `[PLZ]`, `[Telefonnummer]` |
| `/datenschutz/` | DSGVO-Erklärung – Cloudflare-Hosting, FormSubmit, Betroffenenrechte, Beschwerderecht (LfDI RLP) |
| `/404` | Fehlerseite mit zwei CTAs zurück |

---

## 4. Edit content

All offer content lives in:

```
src/education/content/angebote/*.md
```

Each file has frontmatter (`title`, `subtitle`, `zielgruppe`, `dauer`, `preis`, `teaser`,
`icon`, `order`) and a Markdown body. Adding a new `.md` file automatically creates a new
card on the home page and a new detail route.

Global strings (name, email, LinkedIn URL, nav items) are in `src/education/consts.ts`.

### 4.1 Angebot-Icons hinzufügen oder ändern

Die kleinen Icons oben auf jeder Angebots-Karte (Start- und `/angebote/`-Seite) kommen
**nicht** aus einer externen Icon-Library. Sie sind als reine SVG-Pfade direkt im
Komponentencode hinterlegt:

```
src/education/components/AngebotCard.astro     ← Mapping "Name" → SVG-Pfad
src/education/content/angebote/<datei>.md      ← frontmatter-Feld `icon:` wählt das Mapping aus
```

Aktuell verfügbar: `ki`, `shield`, `people`, `lock`. Welches Icon ein Angebot bekommt,
steht im Frontmatter, z. B. `icon: shield`. Fällt der Wert auf einen unbekannten Namen,
wird `ki` als Fallback gezeigt (`icons[icon] ?? icons.ki`).

**Neues Icon hinzufügen – Schritt für Schritt:**

1. Bei [heroicons.com](https://heroicons.com) ein passendes Icon aussuchen. Stil:
   *Outline*, Größe 24 (das matcht `viewBox="0 0 24 24"` in `AngebotCard.astro`).
   Alternativ: [lucide.dev](https://lucide.dev) oder eigene SVGs – muss aber ein einzelner
   `<path d="...">`-Pfad in einer 24×24-Viewbox sein.
2. „Copy SVG" klicken und im kopierten Code den Wert des `d`-Attributs herausziehen
   (alles zwischen den Anführungszeichen).
3. In `src/education/components/AngebotCard.astro` im `icons`-Objekt eine neue Zeile ergänzen:

   ```ts
   const icons: Record<string, string> = {
     ki: "M9.813 15.904L9 18.75…",
     shield: "M9 12.75L11.25 15…",
     people: "M15.75 6a3.75 3.75…",
     lock: "M16.5 10.5V6.75a4.5…",
     book: "M12 6.042A8.967 …",      // ← neu
   };
   ```

4. Im Markdown des Angebots `icon: book` setzen. Beim nächsten Build erscheint das neue
   Icon automatisch auf Karte und Detailseite.

**Hinweis bei mehrteiligen SVGs:** Hat ein Icon mehrere `<path>`-Elemente (z. B. wegen
zweifarbiger Outlines), reicht das aktuelle Single-Path-Markup in `AngebotCard.astro`
nicht aus. Entweder ein anderes, einteiliges Icon wählen oder die `<svg>`-Struktur in
der Komponente erweitern (zweiten `<path>` + zweites Feld im Mapping).

Wenn das Icon-Set später größer werden soll, lohnt ein Umstieg auf
[`astro-icon`](https://github.com/natemoo-re/astro-icon) mit dem Heroicons- oder
Lucide-Set – dann sind tausende Icons per Name verfügbar, ohne Copy-Paste der Pfade.

### 4.2 Über-mich-Seite anpassen

Inhalt, Bild und Stammdaten der Seite verteilen sich auf vier Stellen:

| Datei | Was darin geändert wird |
|---|---|
| `src/pages/ueber-mich.astro` | Kompletter Seiteninhalt: Einleitung, Qualifikationen-Liste, Berufserfahrung, „Themen, die ich liebe", „Was mir wichtig ist", „Auf einen Blick"-Card, Position und Stil des Profilbilds. |
| `src/education/consts.ts` | Stammdaten, die die Seite über `SITE.author`, `SITE.city`, `SITE.region`, `SITE.email`, `SITE.linkedin` etc. zieht. Hier ändern, **nicht** in der `.astro`-Datei – sonst driften die Stellen auseinander (Footer, Kontakt, Impressum nutzen dieselben Werte). |
| `public/profile-picture.png` | Das Portrait. Einfach mit gleichem Namen überschreiben – der `<img src="/profile-picture.png">` in `ueber-mich.astro` greift dann automatisch das neue Bild. Empfohlen: quadratisch, mind. 640×640 px, unter 400 KB (vorher z. B. durch [tinypng.com](https://tinypng.com) jagen). |
| `src/education/EduLayout.astro` | Nur anfassen, wenn sich Meta-Tags für *alle* Seiten ändern sollen. Title und Description der Über-mich-Seite werden als Props in `ueber-mich.astro` (Zeile 7–10) übergeben – dort liegt der seitenspezifische SEO-Text. |

**Typische Anpassungen und wo sie hingehören:**

- Neuen Abschnitt einfügen → neue `<h2>…</h2>` + `<p>` innerhalb des `prose-content`-Divs in `ueber-mich.astro`.
- Qualifikation ergänzen → `<li>` in der ersten `<ul>` in `ueber-mich.astro` (B.Sc./M.Sc.-Liste).
- Eintrag in „Auf einen Blick" → die `<dl>`-Liste am Ende der `ueber-mich.astro` (zweite `<Section>`).
- Bild größer / kleiner anzeigen → die Tailwind-Klassen `w-48 sm:w-56` an der `<figure>` anpassen.
- Bild rund vs. eckig → `rounded-full` durch `rounded-2xl` ersetzen.

---

## 5. Run locally and deploy

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # outputs ./dist
npm run preview   # serves ./dist locally
```

Recommended deploy: connect this folder's git repo to **Cloudflare Pages**.

- Build command: `npm run build`
- Output directory: `dist`
- Node version: 20+

DNS for `felix-paul.de` already points to Cloudflare per the parent README.

---

## 6. Contact form: FormSubmit and the honeypot field

### What is FormSubmit?

[FormSubmit](https://formsubmit.co) is a free, account-less form-relay service. The form
on `/kontakt/` does this:

1. The user fills in name / e-mail / message and clicks submit.
2. The browser POSTs the form data to `https://formsubmit.co/<your-email>`.
3. FormSubmit forwards the data to that e-mail as a formatted message.
4. **First submission triggers an activation e-mail** that has to be confirmed once. After
   that, all subsequent submissions arrive directly.

It is used here because v1 of this site is fully static and has **no backend**. Without
a service like FormSubmit you would need a Cloudflare Worker, a FastAPI endpoint, or a
hosted form service like Formspree/Basin – all of which add either code or cost. FormSubmit
is the smallest possible step that lets the form actually work.

The hidden configuration fields in `ContactForm.astro`:

| Field | Effect |
|---|---|
| `_subject` | Subject line of the e-mail that arrives in the inbox |
| `_template` | `"table"` formats submissions as an HTML table – easier to read |
| `_captcha` | `"true"` enables FormSubmit's built-in captcha |
| `_next` | Redirect URL after a successful submission. Points to `https://felix-paul.de/thank-you/` (the domain-wide Thank-You page, replaces FormSubmit's default). |
| `_autoresponse` | Auto-confirmation e-mail sent back to the visitor's address. Requires `_captcha=true` and a non-AJAX POST (both are satisfied here). |
| `_honey` | Honeypot field – visible only to bots, dropped silently if filled. |

The visible **e-mail input** uses `name="email"`. FormSubmit semantically recognises a
field named "email" and does three things with it: (1) sets the `Reply-To` header on
the notification mail to the visitor's address — hitting "Reply" in the inbox replies
to the sender, not to FormSubmit; (2) routes the `_autoresponse` mail back to that
address; (3) renders an "Email" row in the body of the table-formatted notification, so
the sender's address is visible in the body itself as a fallback if any mail client ever
strips the `Reply-To` header.

(The `_replyto` field documented by FormSubmit *should* do the same when used as the
input's `name`, but in practice the auto-reply target and Reply-To header were not
reliably set. `name="email"` is FormSubmit's well-trodden convention and works.)

FormSubmit is the **v1 choice**. Once Felix's shared backend (`api.felix-paul.de`) exists,
swap the form's `action` to a Worker / FastAPI endpoint and remove the hidden config fields.
That migration is one line in `ContactForm.astro` plus deleting an external dependency
mention from `/datenschutz/`.

### FormSubmit free tier – what's included

Researched directly from `formsubmit.co` (verified 2026-05-27). FormSubmit advertises only
one tier, called "free". No paid plan is documented on the site.

**Quotas:**

- **No monthly submission cap.** The docs say literally: *"You can have unlimited
  submissions from unlimited forms you created."*
- **Data retention: 30 days.** Submissions are forwarded immediately by e-mail and then
  dropped from FormSubmit's storage after 30 days. Your inbox is the archive.
- **File uploads: yes, up to 10 MB total per submission.** Note: *"Uploaded files won't
  retain or can't access through the API."* – files are e-mailed, not stored.
- **API access: 5 calls per day.** Effectively means you can list recent submissions
  programmatically a few times a day; for normal usage the e-mail relay is the data path.
- **Scale signal:** 6+ million submissions across 400k+ websites (their own number).

**Features available without registration:**

| Special field   | What it does |
|---|---|
| `_subject`      | Sets the subject of the e-mail you receive |
| `_template`     | Choose one of 3 e-mail layouts (`table`, `box`, `basic`) |
| `_captcha`      | reCAPTCHA is on by default; set to `"false"` to disable |
| `_honey`        | Honeypot field – non-empty submissions are dropped silently |
| `_next`         | Redirect URL after successful submission (custom Thank-You page) |
| `_cc`           | Comma-separated additional recipients |
| `_replyto`      | Set the Reply-To header to the visitor's address |
| `_blacklist`    | Up to **20** spam phrases that cause a submission to be dropped |
| `_autoresponse` | Auto-reply text sent to the visitor. **Requires reCAPTCHA on**, **does not work with AJAX** |
| `_webhook`      | URL that gets POSTed on every submission – the path to your own automation |

Other characteristics:

- **CAPTCHA:** reCAPTCHA only. No hCaptcha or Turnstile option.
- **AJAX:** supported cross-origin, but disables `_autoresponse`.
- **No dashboard / admin UI** – configuration happens entirely via hidden form fields.
- **No account, no API key** – first submission triggers an activation e-mail; click the
  link once and the endpoint is live.

**Practical takeaway for this site:**

- For a single-person speaker site that gets a handful of leads per week, FormSubmit's
  free tier is sufficient indefinitely. There is no commercial pressure to upgrade.
- Watch for two limits in real use:
  1. If the autoresponder gets enabled later, AJAX submission has to stay off (it is
     currently a normal POST, so this is already fine).
  2. The 30-day retention means **the inbox is the only durable record** – every lead
     must be processed or saved elsewhere within 30 days.
- The webhook field is the migration shortcut: when `api.felix-paul.de` exists, point
  `_webhook` at it instead of swapping the whole form. You then get *both* the e-mail
  copy and a structured row in your own DB.

### What is the honeypot field?

A honeypot is a **hidden form field that real users never see or fill in, but spam bots
do**. The field in this form looks like this:

```html
<input type="text" name="_honey" tabindex="-1" autocomplete="off"
       class="hidden" aria-hidden="true" />
```

- `class="hidden"` (Tailwind utility for `display: none`) hides it from humans.
- `tabindex="-1"` prevents keyboard users from tabbing into it.
- `aria-hidden="true"` tells screen readers to ignore it.
- `autocomplete="off"` stops browsers from auto-filling it.

Naive spam bots scrape all form inputs and fill every one of them, so the `_honey` field
ends up with a value. FormSubmit (and most form services) recognise the special name
`_honey` and **silently discard any submission where it isn't empty**. The user sees no
difference; the spam never reaches your inbox.

The trick has two big advantages over a visible captcha:

- **Zero user friction** – legitimate users don't have to prove they're human.
- **No third-party tracking** – unlike reCAPTCHA, no data is sent to Google.

The drawback: sophisticated bots that render the page can detect that the field is
hidden and skip it. For those, the FormSubmit `_captcha` flag is the second line of
defence. Both together catch the vast majority of bot traffic for a single-person
speaker site like this.

---

## 7. What is intentionally NOT in v1

Following the parent README ("delete first"):

- **No login** – will be added via Cloudflare Access or shared Zitadel when needed.
- **No payments** – Stripe Payment Links will be added as Markdown links if needed.
- **No mandatory multi-field booking form** – three fields max (name, e-mail, message).
- **No CMS / admin UI** – Markdown in git is the editor.
- **No analytics / tracking cookies** – privacy-friendly by default.
- **No backend** – contact form posts to `formsubmit.co` for v1; replace with own
  `api.felix-paul.de` endpoint when the shared backend exists.

---

## 8. Open before going live

- [x] Replace `[Straße und Hausnummer]`, `[PLZ]`, `[Telefonnummer]` in `src/pages/impressum.astro`
- [x] Adjust supervisory authority in `src/pages/datenschutz.astro` if Felix moves out of RLP
- [x] Activate FormSubmit by submitting the form once and confirming the activation e-mail
- [x] Decide: keep FormSubmit or swap for a Cloudflare Worker before launch
- [x] Create `public/og-default.png` (1200×630) for nicer link previews — workflow in section 9
- [x] Anwaltliche Prüfung von Impressum + Datenschutz
- [ ] Bescheinigung nach § 4 Nr. 21 UStG beantragen (siehe parent README, To-dos kurzfristig)

---

## 9. Assets: OG-Bild und Favicon

### `public/og-default.png` (Open Graph link preview)

Used by every page as the default preview image when the URL is shared on WhatsApp,
LinkedIn, iMessage, Slack, Facebook etc. **Appears nowhere on the website itself** —
only inside third-party link previews. Wired up in `src/education/EduLayout.astro` via
`<meta property="og:image">` and the Twitter Card tags.

**Required spec:** 1200 × 630 px (aspect ratio 1.91:1), PNG or JPG, ideally under 300 KB.

**Workflow we used (Gemini → Canva → TinyPNG):**

1. **Generate** the base image with [Gemini](https://gemini.google.com) or, simpler
   for image-only output, [ImageFX](https://labs.google/fx/tools/imagefx) (aspect
   ratio is a dropdown there — pick *Widescreen 16:9*). Prompt template:
   > Professionelles Cover-Bild im Querformat 16:9 für die Website eines
   > Cybersecurity- und KI-Bildungsexperten namens Felix Paul. Moderner,
   > minimalistischer Stil, dunkelblauer Hintergrund mit subtilen digitalen
   > Akzenten. Platz links für Text. Hochwertig, seriös.
2. **Crop / layout to exactly 1200 × 630 px** in [Canva](https://www.canva.com)
   ("Design erstellen" → "Eigene Größe" → 1200 × 630). Drag the AI image in,
   optionally add name/tagline as overlay. Alternative without overlay:
   [iloveimg.com/resize-image](https://www.iloveimg.com/resize-image).
3. **Compress** via [tinypng.com](https://tinypng.com) — target 150–300 KB.
4. Save as `public/og-default.png`, overwriting the previous file. Commit.
5. **Test after deploy** (local doesn't work — scrapers need the public URL):
   - [opengraph.xyz](https://www.opengraph.xyz) — neutral cross-platform preview
   - [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) —
     also forces a re-scrape (Facebook caches aggressively; this is the only way
     to refresh it after an image update)
   - [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)

If a single page should get its own preview image, pass `ogImage="/path/to/file.png"`
as a prop to `<Layout>` in that page. The path is resolved against `SITE.url`.

### `public/favicon.svg` (browser tab icon)

SVG is preferred — stays crisp at any zoom, < 1 KB, easy to tweak by hand. Wired up
in `src/education/EduLayout.astro` via `<link rel="icon" type="image/svg+xml" href="/favicon.svg" />`.

PNG/ICO also work (browsers fall back automatically): drop `favicon.png` (32 × 32 or
64 × 64) into `public/` and change the `type` attribute to `image/png`. For maximum
legacy support, generate a multi-resolution `favicon.ico` at
[realfavicongenerator.net](https://realfavicongenerator.net) and add the matching
`<link>` tags.

---

## 10. Testing

Testing is split into automated CI checks and a manual playbook. CI catches
structural regressions on every push; the playbook catches things CI cannot
verify (real e-mail delivery, third-party preview rendering, real devices).

### 10.1 Automated checks (CI)

All wired in `.github/workflows/link-check.yml`. The workflow header documents
the split and limitations in detail; the summary:

- `internal-links` — every push to main + manual dispatch. Every relative
  href in `dist/` resolves to a real built page.
- `smoke-checks` — every push to main + manual dispatch. Asserts the
  FormSubmit form still has all hidden fields wired (`action`, `_next`,
  `_autoresponse`, `_captcha=true`, `_honey`, `name="email"` on the visible
  input), every page has `og:title / description / url / image` with `og:url`
  on `felix-paul.de/education`, the `og:image` file actually exists in `dist/`,
  every built route appears in `dist/sitemap-0.xml`, and every `<img>` has a
  non-empty `alt`.
- `external-links` — weekly cron (Mondays 06:00 UTC) + manual dispatch from
  the Actions tab. Checks absolute URLs including LinkedIn (accepts HTTP 200
  *or* 999 to tolerate LinkedIn's anti-bot response) and skips `formsubmit.co`
  (POST-only endpoint). Never runs on a PR — avoids flakes that have nothing
  to do with the code change.

### 10.2 Manual test playbook

Run this checklist **after every production deploy** (or before announcing a link
publicly). Covers what CI cannot verify: real mail delivery, third-party preview
rendering, and visual / semantic correctness on real devices.

Total time: ~10 minutes if everything works.

#### Contact form, end-to-end (~3 min)

1. Open `https://felix-paul.de/#kontakt` in a normal browser tab (NOT incognito —
   reCAPTCHA gets stricter there).
2. Fill in name, a personal e-mail you can read (e.g. your gmail), and a short
   message: *"Test submission, please ignore."*
3. Tick the Datenschutz checkbox. Submit.
4. ☐ Browser lands on `https://felix-paul.de/thank-you/` with the *"Nachricht
   gesendet."* card.
5. ☐ Within ~1 min: notification mail arrives at `contact@felix-paul.de`,
   table-formatted, subject *"Neue Anfrage über felix-paul.de/education"*.
6. ☐ Within ~1 min: auto-reply mail arrives at the visitor address with the
   German *"Vielen Dank für Ihre Anfrage…"* text.
7. ☐ In the notification mail, click Reply. The **To:** field must be the visitor
   address — NOT `noreply@formsubmit.co`. (If it is FormSubmit's address, the
   `name="email"` wiring on the e-mail input is broken — see §6.)
   ☐ Also verify the body table has an "Email" row showing the same address —
   that's the fallback if a mail client ever strips the Reply-To header.
8. Delete the test thread on both sides.

If step 5 fails: the FormSubmit endpoint may need re-activation (happens after
e-mail-address changes or long inactivity). Submit once more, look for the
activation e-mail, click the link, retry.

#### Open Graph / link preview (~2 min)

Run after any change to `astro.config.mjs#site`, `src/education/EduLayout.astro`, or
`public/og-default.png`.

1. Paste `https://felix-paul.de/education/` into
   [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) and
   click **"Scrape Again"** (forces Facebook to bypass its cache).
   - ☐ Image renders.
   - ☐ Title shows the site name + tagline.
   - ☐ `og:url` shows `felix-paul.de/education`, NOT the apex `felix-paul.de`.
2. Repeat with `https://felix-paul.de/#kontakt`.
   - ☐ Same image, `og:url` ends in `/kontakt/`.
3. Paste into [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/).
   - ☐ Same outcome.
4. (optional) Cross-platform sanity check on
   [opengraph.xyz](https://www.opengraph.xyz).

If the `og:url` still shows the apex on Facebook even though the HTML is correct,
that's FB's cache — "Scrape Again" resolves it. WhatsApp caches for ~7 days and
has no debugger, so accept that link previews on WhatsApp may lag a week.

#### Visual pass on real devices (~4 min)

1. **Desktop** (Firefox + Chrome, full window):
   - ☐ `/` — Hero, three Angebot-Karten, USP block and CTA-Banner render
     without layout breaks. Header nav highlights *Start*.
   - ☐ `/ueber-mich/` — profile picture loads, qualifications list renders.
   - ☐ `/angebote/` — five Angebote listed, honorary table readable.
   - ☐ Click one Angebot — detail page renders the Markdown body.
   - ☐ `/kontakt/`, `/impressum/`, `/datenschutz/` — prose formatted, no
     unexpanded `[Platzhalter]`-style placeholders.
2. **Mobile width** (DevTools "iPhone 14 Pro" or a real phone):
   - ☐ Header burger menu opens and closes; active item highlighted.
   - ☐ Hero stacks; no horizontal scroll on any page.
3. **Image fallback** (DevTools → Network tab → block `*.png`):
   - ☐ `/ueber-mich/` shows the alt text *"Portrait von Felix Peter Paul"* in
     place of the profile picture.

#### Discovery surfaces (~1 min)

Run after a DNS, Cloudflare-Pages or routing change.

1. ☐ `https://felix-paul.de/education/robots.txt` returns 200, lists the sitemap.
2. ☐ `https://felix-paul.de/education/sitemap-index.xml` returns valid XML with one
   `<loc>` pointing at `sitemap-0.xml` (that's a sitemap *index* — it is
   supposed to look "almost empty" with a single pointer). Then open
   `https://felix-paul.de/education/sitemap-0.xml` — that's the file with the actual
   12 URLs. The `smoke-checks` CI job already asserts every built page appears
   there; this manual step only confirms the deployed file matches the build.
3. ☐ `https://felix-paul.de/education/this-page-does-not-exist` shows the custom 404
   page with the two CTAs back.

If any step fails, fix before announcing the deploy.

---

## How to extend the site

Astro + Tailwind v4. Tokens `brand-*` / `ink-*` live in `src/styles/global.css`. Run
`npm run build` after any change. The navbar renders from `NAV` in `src/education/consts.ts`
(currently Start / Über mich / Referenzen — Kontakt was removed from the navbar; the
"Anfrage"/Kontakt button in the header still leads to `/kontakt/`).

### Add a new reusable component

Create `src/education/components/MyThing.astro` (typed `Props` in the frontmatter, markup below),
then import it in a page. Prefer composing with the existing components — `Section.astro`
(section wrapper with `eyebrow`/`title`/`lead` + `background="muted"`), `AngebotCard.astro`
(offer card), `Hero.astro`, `ContactForm.astro`. Match the surrounding Tailwind classes.

### Add a new Angebot (offer)

Offers are a **content collection**. The home page (offer grid + the "Preise auf einen
Blick" overview) and the detail pages are generated automatically — you only add a file.

1. Create `src/education/content/angebote/mein-angebot.md` with this frontmatter (schema lives in
   `src/content.config.ts`):
   ```md
   ---
   title: "KI verstehen und verantwortungsvoll nutzen"
   subtitle: "Schüler-Workshop"
   zielgruppe: "Klasse 7–10"
   dauer: "90 Min bis Halbtag"
   preis: "250–900 €"
   teaser: "Kurzbeschreibung, die auf der Karte erscheint."
   icon: "ki"            # one of the keys in AngebotCard.astro's icon map
   order: 6              # lower = earlier in the grid / price list
   ---

   ## Worum es geht
   Markdown-Fließtext für die Detailseite …
   ```
2. That's it: the card appears on `/`, the detail page at `/angebote/mein-angebot/`, and
   the price overview picks up `title` + `dauer` + `preis`.
3. If you need a new icon, add an entry to the `icons` map in
   `src/education/components/AngebotCard.astro` and reference its key via `icon:`.

### Add a new project / reference (Referenzen page)

The Referenzen page (`src/pages/education/projekte.astro`) is hand-written (not a collection).
Copy an existing `<article class="… rounded-3xl …">` block and adjust text, the image
(`/img/<project>/…` under `public/`) and the link. Keep project images **clickable** —
wrap the `<img>` in `<a href="https://…" target="_blank" rel="noopener noreferrer">` so a
click opens the live project (e.g. neck.felix-paul.de, codenight.felix-paul.de). Every
`<img>` needs a non-empty `alt`.
