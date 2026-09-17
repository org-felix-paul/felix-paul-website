// Contract between the generic frame (Interactive.astro) and a widget.
// A widget is one module in ./widgets/<name>.ts that exports `mount`.

/** "steps": one part at a time. "all": everything on one screen. */
export type Mode = "steps" | "all";

export const MODE_LABELS: Record<Mode, string> = {
  steps: "Schritt für Schritt",
  all: "Alles auf einmal",
};

export interface WidgetOptions {
  mode: Mode;
}

export interface WidgetHandle {
  /** Called by the frame when the reader switches the view. Keep the state. */
  setMode(mode: Mode): void;
}

export type WidgetMount = (root: HTMLElement, options: WidgetOptions) => WidgetHandle;
