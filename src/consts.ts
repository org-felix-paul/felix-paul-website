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
    "Keynotes, Fachvorträge und Bildungsangebote zu KI, IAM, IT-Sicherheit und Kryptographie – für Unternehmen, Universitäten und Schulen. Solution Architekt bei Atruvia.",
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

/** GitHub Pages der Referenzprojekte. Sie liegen in eigenen Repositories und
 *  werden dort auch veröffentlicht — diese Seite verlinkt sie nur noch. */
export const GITHUB_PAGES = "https://github.felix-paul.de";

// Referenzprojekte. Bis September 2026 lagen sie als Kopien in
// public/projects/ (36 MB, drei Viertel der Auslieferung) und wurden bei
// jedem Deploy erneut hochgeladen, obwohl sie sich nie ändern. Jetzt zeigen
// die Links auf die GitHub Pages der jeweiligen Repositories.
//
// Achtung bei NECK: der Pfad ist GROSSGESCHRIEBEN. GitHub Pages unterscheidet
// Groß- und Kleinschreibung, /neck/ liefert dort einen 404.
export const PROJECTS = {
  neck: `${GITHUB_PAGES}/NECK/`,
  neckUserHandbook: `${GITHUB_PAGES}/NECK/docs/user-handbook/book/index.html`,
  neckDevHandbook: `${GITHUB_PAGES}/NECK/docs/developer-handbook/book/index.html`,
  codenight: `${GITHUB_PAGES}/codenight/`,
  tierpark: `${GITHUB_PAGES}/tierpark-websites/UnsereTierwelt.html`,
  /** Eingestelltes dSolve-Produkt (Android-App, die Kinderbücher vorliest). */
  readmybook: `${GITHUB_PAGES}/readmybook/`,
} as const;

// The four areas of the business, named once. Every header, footer and
// overview block on the site uses these exact labels, so a visitor meets the
// same four words everywhere. "Bildungsangebote" rather than "Schulworkshops":
// the offer is meant to cover adult education too.
export interface Area {
  href: string;
  label: string;
  /** Englische Beschriftung. Steht bewusst direkt neben der deutschen: eine
   *  getrennte Übersetzungstabelle läuft irgendwann auseinander, zwei Felder
   *  in derselben Zeile fallen beim Ändern ins Auge. Fehlt sie, wird die
   *  deutsche verwendet — sichtbar falsch ist besser als `undefined`. */
  labelEn?: string;
  note: string;
  noteEn?: string;
  /** Leaves this domain — gets target="_blank". */
  external?: boolean;
  /** Audience pages under this area. Rendered indented in the footer, so one
   *  area stays one row rather than three. */
  items?: readonly { href: string; label: string; labelEn?: string }[];
}

export const AREAS: readonly Area[] = [
  {
    href: PATHS.speaking,
    label: "Keynotes & Fachvorträge",
    labelEn: "Keynotes & talks",
    note: "Vorträge und Beratung",
    noteEn: "Talks and consulting",
  },
  {
    href: PATHS.bildung,
    label: "Bildungsangebote",
    labelEn: "Training & workshops",
    note: "Workshops, Vorträge und Fortbildungen",
    noteEn: "Workshops, talks and professional training",
    items: [
      { href: PATHS.schools, label: "Schulen & Lehrkräfte", labelEn: "Schools & teachers" },
      { href: PATHS.companies, label: "Unternehmen & Universitäten", labelEn: "Companies & universities" },
      { href: PATHS.individuals, label: "Privatpersonen", labelEn: "Individuals" },
    ],
  },
  {
    href: SITE.dSolveSite,
    label: "Software",
    labelEn: "Software",
    note: "Softwareprodukte und Projekte über dSolve",
    noteEn: "Software products and projects, built through dSolve",
    external: true,
  },
  {
    href: PATHS.blog,
    label: "Blog",
    labelEn: "Blog",
    note: "Mein persönlicher Blog",
    noteEn: "My personal blog — written in German",
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
  labelEn?: string;
  spy?: string;
  /** Leaves this domain — gets target="_blank" and an external-link marker. */
  external?: boolean;
  /** Ziel ist nicht in der Sprache der Seite. Der Header hängt dann einen
   *  dezenten Sprachhinweis an, statt den Leser hineinlaufen zu lassen. */
  fremdsprachig?: boolean;
}

export interface NavGroup {
  label: string;
  labelEn?: string;
  items: readonly NavItem[];
}

export const NAV: readonly (NavItem | NavGroup)[] = [
  { href: "#speaking", label: "Keynotes & Fachvorträge", labelEn: "Keynotes & talks", spy: "speaking" },
  {
    label: "Bildungsangebote",
    labelEn: "Training",
    items: [
      { href: "#bildung", label: "Überblick", labelEn: "Overview", spy: "bildung" },
      { href: PATHS.schools, label: "Schulen & Lehrkräfte", labelEn: "Schools & teachers" },
      { href: PATHS.companies, label: "Unternehmen & Universitäten", labelEn: "Companies & universities" },
      { href: PATHS.individuals, label: "Privatpersonen", labelEn: "Individuals" },
    ],
  },
  // Software und Blog führen direkt ans Ziel, nicht auf den Teaser-Abschnitt
  // der Startseite. Der Umweg über den Anker kostete einen zusätzlichen Klick
  // für etwas, das der Eintrag im Menü bereits verspricht.
  //
  // `spy` bleibt trotzdem gesetzt: beim Scrollen über den jeweiligen Abschnitt
  // leuchtet der Menüpunkt weiterhin auf. Das ist Orientierung, unabhängig
  // davon, wohin der Klick geht.
  { href: SITE.dSolveSite, label: "Software", labelEn: "Software", spy: "software", external: true },
  { href: PATHS.blog, label: "Blog", labelEn: "Blog", spy: "blog" },
  {
    label: "Mehr",
    labelEn: "More",
    items: [
      { href: "#ueber-mich", label: "Über mich", labelEn: "About me", spy: "ueber-mich" },
      { href: "#publikationen", label: "Publikationen", labelEn: "Publications", spy: "publikationen" },
      // "Aktuelles" ist auf der Startseite auskommentiert (siehe index.astro).
      // Der Menüpunkt muss mitgehen, sonst zeigt er auf einen Abschnitt, den
      // es nicht gibt — wieder einbauen, sobald der Abschnitt zurückkommt.   { href: "#aktuelles", label: "Aktuelles", spy: "aktuelles" },
      { href: "#presse", label: "Material für Veranstalter", labelEn: "Material for organisers", spy: "presse" },
    ],
  },
];
