// Thin aggregator. Each section defines its own collection next to its content
// (src/blog/collection.ts, src/education/collection.ts) so that pulling a
// section out into its own repo means copying one folder, not untangling a
// shared schema file.
import { posts } from "./blog/collection";
import { angebote } from "./education/collection";

export const collections = { posts, angebote };
