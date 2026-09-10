// Education-owned configuration. Site identity lives once in src/consts.ts;
// only section-specific values belong here, so the section stays extractable.
import { PATHS, PORTRAIT } from "../consts";

export const EDU = {
  /** Brand used in <title> and og:site_name for this section only. */
  name: "Felix Paul",
  tagline: "Bildungsangebote zu KI, Cybersicherheit & Medienkompetenz",
  description:
    "Felix Paul – Doppelqualifikation aus Lehramt und Informatik (B.Sc. + M.Sc.). Bildungsangebote zu KI, Cybersicherheit und Medienkompetenz: Workshops, Vorträge und Fortbildungen für Schulen, Lehrkräfte, Eltern, Schüler:innen und Erwachsene.",
  /** Section root; every education URL is built from this. */
  base: PATHS.education,
  ogImage: "/education/og-default.jpg",
  logo: "/education/logo.svg",
  // Shared with the main site — it was always the same photo, just copied.
  // If this section is ever extracted, copy that one file along with it.
  portrait: PORTRAIT.image,
} as const;

/** Absolute paths inside the education section. */
export const EDU_PATHS = {
  home: EDU.base,
  projekte: `${EDU.base}projekte/`,
  angebote: `${EDU.base}angebote/`,
  angebotAnchor: `${EDU.base}#angebote`,
  // Contact and the post-submit page are domain-wide, not section-owned:
  // this section used to duplicate both. Kept as aliases so callers here read
  // naturally and a future move is one edit.
  kontakt: PATHS.kontakt,
  danke: PATHS.thankYou,
} as const;

/** Absolute path of an offer detail page, derived from its slug. */
export const angebotPath = (slug: string) => `${EDU_PATHS.angebote}${slug}/`;

export const NAV = [
  { href: EDU_PATHS.home, label: "Start" },
  { href: EDU_PATHS.projekte, label: "Referenzen" },
] as const;
