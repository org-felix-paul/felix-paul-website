// Education-owned configuration. Site identity lives once in src/consts.ts;
// only section-specific values belong here, so the section stays extractable.
import { PATHS, PORTRAIT } from "../consts";

export const EDU = {
  /** Brand used in <title> and og:site_name for this section only. */
  name: "Felix Paul",
  tagline: "Bildungsangebote für Schulen zu KI & IT-Security",
  description:
    "Lehrerfortbildungen, Schülerworkshops, Kursserien und Elternabende zu KI und IT-Security – vom Pädagogischen Tag bis zur AG. Von einem Informatiker mit Lehramtsabschluss.",
  /** Section root; every education URL is built from this. */
  base: PATHS.schools,
  ogImage: "/schools/og-default.jpg",
  logo: "/schools/logo.svg",
  // Shared with the main site — it was always the same photo, just copied.
  // If this section is ever extracted, copy that one file along with it.
  portrait: PORTRAIT.image,
} as const;

/** Absolute paths inside the education section. */
export const EDU_PATHS = {
  home: EDU.base,
  insights: `${EDU.base}insights/`,
  workshops: `${EDU.base}workshops/`,
  angebotAnchor: `${EDU.base}#angebote`,
  // Contact and the post-submit page are domain-wide, not section-owned:
  // this section used to duplicate both. Kept as aliases so callers here read
  // naturally and a future move is one edit.
  kontakt: PATHS.kontakt,
  danke: PATHS.thankYou,
} as const;

/** Absolute path of an offer detail page, derived from its slug. */
export const angebotPath = (slug: string) => `${EDU_PATHS.workshops}${slug}/`;

export const NAV = [
  { href: EDU_PATHS.home, label: "Start" },
  { href: EDU_PATHS.insights, label: "Workshops & Materialien" },
] as const;
