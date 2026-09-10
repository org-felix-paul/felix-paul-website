// Blog-owned configuration. Site identity (author, address, social profiles)
// is NOT repeated here — it lives once in src/consts.ts. Only what is specific
// to the blog section belongs in this file, so the whole section stays
// extractable into its own repo later.
import { PATHS } from "../consts";

export const BLOG = {
  /** Brand used in <title> and og:site_name for this section only. */
  name: "blogging@Felix Paul",
  tagline: "Felix Pauls persönlicher Tech Blog",
  description:
    "Felix Pauls persönlicher Tech Blog – Beiträge zu KI, IT-Sicherheit und IT in der Bildung. Für Professionals, Lehrkräfte, Eltern und Schüler:innen.",
  /** Section root; every blog URL is built from this. */
  base: PATHS.blog,
  ogImage: "/blog/og-default.png",
  logo: "/blog/logo.svg",
} as const;

/** Absolute path of a post, derived from its slug. */
export const postPath = (slug: string) => `${BLOG.base}${slug}/`;

// Single source of truth for the two filter dimensions.
// Used by the content schema, the filter UI and the posts' frontmatter.
export const AUDIENCES = ["professionals", "teachers", "parents", "students"] as const;
export const TOPICS = ["general", "security", "ai"] as const;
// A post is either fully published or a "preview" – a teaser for something
// I plan to write next. Preview posts only show their title plus a
// "Coming soon …" placeholder, both on the list and on their detail page.
export const STATUSES = ["published", "preview"] as const;

export type Audience = (typeof AUDIENCES)[number];
export type Topic = (typeof TOPICS)[number];
export type Status = (typeof STATUSES)[number];

export const AUDIENCE_LABELS: Record<Audience, string> = {
  students: "Für Schüler:innen",
  parents: "Für Eltern",
  teachers: "Für Lehrkräfte",
  professionals: "Für Professionals",
};

export const TOPIC_LABELS: Record<Topic, string> = {
  ai: "KI",
  security: "IT-Sicherheit",
  general: "Allgemein",
};

export const STATUS_LABELS: Record<Status, string> = {
  published: "Veröffentlicht",
  preview: "Preview",
};

// Placeholder shown instead of the body/description for preview posts.
export const COMING_SOON_TEXT = "Coming soon …";
