// The only classes a widget uses for its own controls. Colour tokens from
// global.css, so light and dark mode need nothing in the widget. Change the
// look of every interactive element here, nowhere else.
export const BTN_PRIMARY =
  "rounded-lg bg-brand-700 px-4 py-2 text-sm font-medium text-on-accent shadow-sm transition hover:bg-brand-800 disabled:opacity-50";
export const BTN_GHOST =
  "rounded-lg border border-ink-200 bg-surface px-4 py-2 text-sm font-medium text-ink-800 shadow-sm transition hover:border-brand-300 hover:text-brand-700 disabled:opacity-50 aria-pressed:border-brand-700 aria-pressed:text-brand-700";
export const BADGE = "inline-block rounded-full bg-brand-700 px-2.5 py-0.5 text-xs font-semibold text-on-accent";
export const BOX = "rounded-xl border border-ink-200 bg-surface p-4";
export const BOX_ACCENT = "rounded-xl border border-ink-200 border-l-4 border-l-brand-700 bg-surface p-4";
export const NOTE = "rounded-xl bg-brand-50 p-4 text-sm text-ink-800";
export const HEADING = "font-display text-base font-bold text-ink-900";
export const TEXT = "text-ink-900";
export const MUTED = "text-sm text-ink-700";
export const CHECKBOX = "mt-1 h-4 w-4 shrink-0 accent-brand-700";

/** Small DOM helper so widgets stay framework-free and short. */
export function el<K extends keyof HTMLElementTagNameMap>(tag: K, cls = "", text = ""): HTMLElementTagNameMap[K] {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text) e.textContent = text;
  return e;
}
