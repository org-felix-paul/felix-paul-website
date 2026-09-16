// Content collection definition for the schools section (the workshop offers).
import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

export const angebote = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/schools/content/angebote" }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string(),
    zielgruppe: z.string(),
    dauer: z.string(),
    preis: z.string(),
    teaser: z.string(),
    icon: z.string(),
    order: z.number().default(99),
    // Preview-Angebot: wird als "In Vorbereitung" markiert und ist nicht klickbar
    // (keine Detailseite, nicht in der Preisübersicht).
    preview: z.boolean().default(false),
  }),
});
