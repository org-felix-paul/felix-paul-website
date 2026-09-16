// Schools-owned configuration. Site identity lives once in src/consts.ts;
// only section-specific values belong here, so the section stays extractable.
import { PATHS, PORTRAIT } from "../consts";

export const SCHOOLS = {
  /** Brand used in <title> and og:site_name for this section only. */
  name: "Felix Paul",
  tagline: "Bildungsangebote für Schulen zu KI & IT-Security",
  description:
    "Lehrerfortbildungen, Schülerworkshops, Kursserien und Elternabende zu KI und IT-Security – vom Pädagogischen Tag bis zur AG. Von einem Informatiker mit Lehramtsabschluss.",
  /** Section root; every schools URL is built from this. */
  base: PATHS.schools,
  ogImage: "/schools/og-default.jpg",
  logo: "/schools/logo.svg",
  // Shared with the main site — it was always the same photo, just copied.
  // If this section is ever extracted, copy that one file along with it.
  portrait: PORTRAIT.image,
} as const;

/** Absolute paths inside the schools section. */
export const SCHOOLS_PATHS = {
  home: SCHOOLS.base,
  insights: `${SCHOOLS.base}insights/`,
  workshops: `${SCHOOLS.base}workshops/`,
  angebotAnchor: `${SCHOOLS.base}#angebote`,
  // Contact is domain-wide, not section-owned: this section used to carry
  // its own form. Kept as an alias so callers here read naturally.
  kontakt: PATHS.kontakt,
} as const;

/** Absolute path of a workshop detail page, derived from its slug. */
export const workshopPath = (slug: string) => `${SCHOOLS_PATHS.workshops}${slug}/`;
