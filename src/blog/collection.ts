// Content collection definition for the blog. Kept inside the section folder
// so src/content.config.ts stays a thin aggregator and the section can be
// lifted out in one piece.
import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { AUDIENCES, TOPICS } from "./consts";

export const posts = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/blog/content/posts" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    audience: z.array(z.enum(AUDIENCES)).default([]),
    topics: z.array(z.enum(TOPICS)).default([]),
    draft: z.boolean().default(false),
    // Preview posts are shown publicly as a "Coming soon …" teaser –
    // a transparent look ahead at what I plan to write next.
    preview: z.boolean().default(false),
  }),
});
