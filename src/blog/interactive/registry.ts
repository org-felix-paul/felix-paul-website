// Every interactive element the blog knows. One line per widget.
// The name is what a post writes in <Interactive widget="…" />; an unknown
// name fails the build (see Interactive.astro).
import type { Mode, WidgetMount } from "./types";

export interface WidgetMeta {
  /** Loaded in the browser only on pages that use the widget. */
  load: () => Promise<{ mount: WidgetMount }>;
  /** Views the widget supports; the first one is the default. One entry = no switch shown. */
  modes: readonly Mode[];
}

export const WIDGETS = {
  "eu-ai-act": {
    load: () => import("./widgets/eu-ai-act"),
    modes: ["steps", "all"],
  },
} satisfies Record<string, WidgetMeta>;

export type WidgetName = keyof typeof WIDGETS;
