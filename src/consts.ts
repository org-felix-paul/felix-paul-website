// Site-wide identity. felix-paul.de is now ONE origin serving three sections
// (main site at "/", blog at "/blog", education at "/education") plus the
// untouched reference projects under "/projects". Everything that describes
// *the domain* — name, author, address, social profiles — lives here exactly
// once; anything that describes a single section lives in that section's own
// consts file (src/blog/consts.ts, src/education/consts.ts).
export const SITE = {
  name: "Felix Paul",
  tagline: "Keynotes · Bildungsangebote · IT Security & KI",
  description:
    "Keynotes, Fachvorträge und Bildungsangebote zu KI, IT Security, Kryptographie und Medienkompetenz. Software über d-solve.de. Hauptberuflich Enterprise Architect bei der Atruvia AG.",
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
  /** Home-page anchors that the rest of the site links back to. */
  speaking: "/#speaking",
  bildung: "/#bildung",
  ueberMich: "/#ueber-mich",
  publikationen: "/#publikationen",
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

// The four areas of the business, named once. Every header, footer and
// overview block on the site uses these exact labels, so a visitor meets the
// same four words everywhere. "Bildungsangebote" rather than "Schulworkshops":
// the offer is meant to cover adult education too.
export interface Area {
  href: string;
  label: string;
  note: string;
  /** Leaves this domain — gets target="_blank". */
  external?: boolean;
}

export const AREAS: readonly Area[] = [
  {
    href: PATHS.speaking,
    label: "Keynotes & Fachvorträge",
    note: "Vorträge und Beratung zu KI, Security, Cloud und Kryptographie",
  },
  {
    href: PATHS.education,
    label: "Bildungsangebote",
    note: "Workshops und Fortbildungen für Schulen, Lehrkräfte und Erwachsene",
  },
  {
    href: SITE.dSolveSite,
    label: "Software",
    note: "Produkte und Projekte über dSolve",
    external: true,
  },
  {
    href: PATHS.blog,
    label: "Blog",
    note: "Mein persönlicher Blog zu KI, IT-Sicherheit und Bildung",
  },
];

// Header navigation: the four areas plus the two home-page anchors that carry
// the credibility story.
export const NAV = [
  { href: "#ueber-mich", label: "Über mich" },
  { href: "#speaking", label: "Keynotes & Fachvorträge" },
  { href: "#bildung", label: "Bildungsangebote" },
  { href: "#publikationen", label: "Publikationen" },
  { href: PATHS.blog, label: "Blog" },
] as const;
