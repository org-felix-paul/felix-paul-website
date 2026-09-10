// Site-wide identity. felix-paul.de is now ONE origin serving three sections
// (main site at "/", blog at "/blog", education at "/education") plus the
// untouched reference projects under "/projects". Everything that describes
// *the domain* — name, author, address, social profiles — lives here exactly
// once; anything that describes a single section lives in that section's own
// consts file (src/blog/consts.ts, src/education/consts.ts).
export const SITE = {
  name: "Felix Paul",
  tagline: "Keynotes, Bildungsangebote & IT-Beratung",
  description:
    "Keynotes, Fachvorträge und Bildungsangebote zu KI, IAM, IT-Sicherheit und Kryptographie – für Unternehmen, Universitäten und Schulen. Solution Architect bei Atruvia.",
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
  // Route segments are English throughout — they are structure, not copy.
  // Exceptions kept in German on purpose: /impressum/ and /datenschutz/ are
  // the terms German visitors and authorities look for, and the content slugs
  // under /schools/workshops/ are the offers' own names.
  schools: "/schools/",
  /** Vergangene Schul-Workshops und was daraus entstanden ist. Gehört zur
   *  Schul-Seite und wird bewusst nur von dort verlinkt — die Seite zeigt
   *  Schul-Workshops, nicht die Bildungsangebote insgesamt. */
  pastWorkshops: "/schools/insights/",
  companies: "/companies/",
  individuals: "/individuals/",
  projects: "/projects/",
  impressum: "/impressum/",
  datenschutz: "/datenschutz/",
  /** The one contact form on the domain: the #kontakt block on the home page.
   *  The education section used to carry a second copy at /schools/kontakt/. */
  kontakt: "/#kontakt",
  /** Home-page anchors that the rest of the site links back to. */
  speaking: "/#speaking",
  software: "/#software",
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
  schools: "/schools/logo.svg",
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
  /** Audience pages under this area. Rendered indented in the footer, so one
   *  area stays one row rather than three. */
  items?: readonly { href: string; label: string }[];
}

export const AREAS: readonly Area[] = [
  {
    href: PATHS.speaking,
    label: "Keynotes & Fachvorträge",
    note: "Vorträge und Beratung",
  },
  {
    href: PATHS.bildung,
    label: "Bildungsangebote",
    note: "Workshops, Vorträge und Fortbildungen",
    items: [
      { href: PATHS.schools, label: "Schulen & Lehrkräfte" },
      { href: PATHS.companies, label: "Unternehmen & Universitäten" },
      { href: PATHS.individuals, label: "Privatpersonen" },
    ],
  },
  {
    href: SITE.dSolveSite,
    label: "Software",
    note: "Softwareprodukte und Projekte über dSolve",
    external: true,
  },
  {
    href: PATHS.blog,
    label: "Blog",
    note: "Mein persönlicher Blog",
  },
];

// Header navigation.
//
// Two levels on purpose: the three things someone might want to book or read
// stay in the bar, everything else that lives on the home page sits behind
// "Mehr". Without that, either the bar gets long or those sections are
// invisible unless you happen to scroll past them.
//
// `spy` names the home-page section an entry represents. It is separate from
// `href` because "Blog" links to the blog *page* but marks the blog *teaser*
// while you scroll past it — the scroll indicator tracks where you are, the
// link decides where you go.
export interface NavItem {
  href: string;
  label: string;
  spy?: string;
}

export interface NavGroup {
  label: string;
  items: readonly NavItem[];
}

export const NAV: readonly (NavItem | NavGroup)[] = [
  { href: "#speaking", label: "Keynotes & Fachvorträge", spy: "speaking" },
  {
    label: "Bildungsangebote",
    items: [
      { href: "#bildung", label: "Überblick", spy: "bildung" },
      { href: PATHS.schools, label: "Schulen & Lehrkräfte" },
      { href: PATHS.companies, label: "Unternehmen & Universitäten" },
      { href: PATHS.individuals, label: "Privatpersonen" },
    ],
  },
  { href: "#software", label: "Software", spy: "software" },
  // Anchor, not the path: clicking Blog lands on the teaser section like
  // every other bar entry, and the section itself links on to /blog/.
  { href: "#blog", label: "Blog", spy: "blog" },
  {
    label: "Mehr",
    items: [
      { href: "#ueber-mich", label: "Über mich", spy: "ueber-mich" },
      { href: "#publikationen", label: "Publikationen", spy: "publikationen" },
      // "Aktuelles" ist auf der Startseite auskommentiert (siehe index.astro).
      // Der Menüpunkt muss mitgehen, sonst zeigt er auf einen Abschnitt, den
      // es nicht gibt — wieder einbauen, sobald der Abschnitt zurückkommt.   { href: "#aktuelles", label: "Aktuelles", spy: "aktuelles" },
      { href: "#presse", label: "Material für Veranstalter", spy: "presse" },
    ],
  },
];
