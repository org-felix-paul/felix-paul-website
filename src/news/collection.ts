// "Aktuelles" — a running log of talks, workshops, releases and publications.
// Own folder so it follows the same shape as the blog and schools sections:
// content next to its schema, aggregated by src/content.config.ts.
import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

/** Kind of entry — drives the little coloured label on the card. */
export const NEWS_KINDS = ["workshop", "vortrag", "publikation", "software"] as const;
export type NewsKind = (typeof NEWS_KINDS)[number];

export const NEWS_KIND_LABELS: Record<NewsKind, string> = {
  workshop: "Workshop",
  vortrag: "Vortrag",
  publikation: "Publikation",
  software: "Software",
};

export const news = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/news/content" }),
  schema: z.object({
    title: z.string(),
    /** When it happened. Sorted newest first. */
    date: z.coerce.date(),
    kind: z.enum(NEWS_KINDS),
    /** One or two sentences. Keep it short — this is a list, not an article. */
    summary: z.string(),
    /** Where it happened, if that adds anything ("Gymnasium Nieder-Olm"). */
    location: z.string().optional(),
    /** Optional link out (slides, recording, product page, paper). */
    url: z.string().optional(),
    urlLabel: z.string().optional(),
    /** Hide without deleting. */
    draft: z.boolean().default(false),
  }),
});
