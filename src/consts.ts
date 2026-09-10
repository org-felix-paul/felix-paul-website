// Site-wide identity. felix-paul.de is now ONE origin serving three sections
// (main site at "/", blog at "/blog", education at "/education") plus the
// untouched reference projects under "/projects". Everything that describes
// *the domain* — name, author, address, social profiles — lives here exactly
// once; anything that describes a single section lives in that section's own
// consts file (src/blog/consts.ts, src/education/consts.ts).
export const SITE = {
  name: "Felix Paul",
  tagline: "Keynote-Speaker · Schulworkshops · IT Security & KI",
  description:
    "Keynote-Speaker & Schulworkshops zu KI, IT Security, Kryptographie & Medienkompetenz. Software über d-solve.de Enterprise Architect bei der Atruvia AG.",
  url: "https://felix-paul.de",
  author: "Felix Peter Paul",
  email: "contact@felix-paul.de",
  linkedin: "https://www.linkedin.com/in/felix-paul-6134a9251",
  github: "https://github.com/d-solve-de",
  dSolveSite: "https://d-solve.de",
  plz: "55481",
  city: "Kirchberg (Hunsrück)",
  street: "Theodor-Heuss-Straße",
  houseNumber: "36",
  region: "Rheinland-Pfalz",
  country: "Deutschland",
  phone: "4917661851281",
} as const;

// The URL layout, in one place. Every cross-section link goes through these
// constants, so moving a section is a one-line change here instead of a
// find-and-replace across the repo.
/** The one portrait used across the site. Was duplicated seven times (three
 *  AVIF, four PNG, all byte-identical) before the sections were merged. */
export const PORTRAIT = {
  /** Display image, used by every hero and the "Über mich" section. */
  image: "/img/felix-paul.avif",
  /** Press download; keeps its root URL because the filename is user-facing
   *  and it is the `image` of the Person node in the schema.org graph. */
  press: "/pressefoto-felix-paul.png",
} as const;

export const PATHS = {
  home: "/",
  blog: "/blog/",
  education: "/education/",
  projects: "/projects/",
  impressum: "/impressum/",
  datenschutz: "/datenschutz/",
  /** The one contact form on the domain: the #kontakt block on the home page.
   *  The education section used to carry a second copy at /education/kontakt/. */
  kontakt: "/#kontakt",
  /** The one confirmation page every form returns to. */
  thankYou: "/thank-you/",
} as const;

/** Per-section browser-tab icon. Same files that serve as each section's
 *  wordmark, so a section has exactly one visual mark. */
export const FAVICONS = {
  main: "/favicon.svg",
  blog: "/blog/logo.svg",
  education: "/education/logo.svg",
} as const;

// Reference projects: plain static sites copied verbatim into public/projects/.
// They are linked, never imported — see claude-behavior.md.
export const PROJECTS = {
  neck: `${PATHS.projects}neck/`,
  neckUserHandbook: `${PATHS.projects}neck/docs/user-handbook/book/index.html`,
  neckDevHandbook: `${PATHS.projects}neck/docs/developer-handbook/book/index.html`,
  codenight: `${PATHS.projects}codenight/`,
  tierpark: `${PATHS.projects}tierpark/UnsereTierwelt.html`,
  // Discontinued dSolve product (Android app that reads children's books
  // aloud). Archived here so the page stays reachable — see claude-behavior.md
  // for the note that its branding still points at d-solve.de.
  readmybook: `${PATHS.projects}readmybook/`,
} as const;

// Main-site navigation: anchors on the one-page home, plus the two sections
// that are now real paths on the same domain.
export const NAV = [
  { href: "#ueber-mich", label: "Über mich" },
  { href: "#speaking", label: "Speaking & Consulting" },
  { href: "#publikationen", label: "Publikationen" },
  { href: PATHS.blog, label: "Blog" },
  { href: "#presse", label: "Pressekit" },
] as const;
