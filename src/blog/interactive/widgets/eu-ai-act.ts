// EU AI Act quick-check. Only the logic of this element lives here; the
// frame, caption, view switch and JavaScript notice come from ../Interactive.astro.
// Data is in ./eu-ai-act-data.ts, unchanged from the workshop tool.
import { GROUPS, TIER_INFO, SEVERITY_ORDER, EDU_NOTE, type Tier } from "./eu-ai-act-data";
import type { Mode, WidgetMount } from "../types";
import { BADGE, BOX, BOX_ACCENT, BTN_GHOST, BTN_PRIMARY, CHECKBOX, HEADING, MUTED, NOTE, TEXT, el } from "../ui";

export const mount: WidgetMount = (root, options) => {
  let mode: Mode = options.mode;
  let step = 0;
  const checked = new Set<string>(); // criterion ids; survives a mode switch

  const form = el("form");
  form.noValidate = true;
  const result = el("section", "mt-6");
  result.hidden = true;
  result.tabIndex = -1;
  result.setAttribute("aria-live", "polite");
  root.replaceChildren(form, result);

  function render() {
    form.replaceChildren();
    result.hidden = true;
    const groups = mode === "all" ? GROUPS : [GROUPS[step]];

    for (const g of groups) {
      const fs = el("fieldset", `mb-5 ${BOX}`);
      fs.append(el("legend", `px-1 ${HEADING}`, g.legend));
      fs.append(el("p", `mb-3 ${MUTED}`, g.hint));
      for (const c of g.criteria) {
        const label = el("label", "flex cursor-pointer gap-3 py-1.5");
        const input = el("input", CHECKBOX);
        input.type = "checkbox";
        input.value = c.id;
        input.checked = checked.has(c.id);
        input.addEventListener("change", () => (input.checked ? checked.add(c.id) : checked.delete(c.id)));
        const body = el("span");
        body.append(el("span", `block ${TEXT}`, c.label));
        if (c.note) body.append(el("span", `block ${MUTED}`, c.note));
        label.append(input, body);
        fs.append(label);
      }
      if (g.filterNote) fs.append(el("p", `mt-3 ${MUTED}`, "Hinweis: " + g.filterNote));
      form.append(fs);
    }

    const actions = el("div", "flex flex-wrap gap-2");
    if (mode === "steps") {
      actions.append(el("span", `self-center ${MUTED}`, `Schritt ${step + 1} von ${GROUPS.length}`));
      const back = el("button", BTN_GHOST, "Zurück");
      back.type = "button";
      back.disabled = step === 0;
      back.addEventListener("click", () => { step--; render(); });
      actions.append(back);
      if (step < GROUPS.length - 1) {
        const next = el("button", BTN_PRIMARY, "Weiter");
        next.type = "button";
        next.addEventListener("click", () => { step++; render(); });
        actions.append(next);
      }
    }
    if (mode === "all" || step === GROUPS.length - 1) {
      const done = el("button", BTN_PRIMARY, "Auswerten");
      done.type = "submit";
      actions.append(done);
    }
    const reset = el("button", BTN_GHOST, "Zurücksetzen");
    reset.type = "button";
    reset.addEventListener("click", () => { checked.clear(); step = 0; render(); });
    actions.append(reset);
    form.append(actions);
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    evaluate();
  });

  function evaluate() {
    const byTier = new Map<Tier, string[]>();
    for (const g of GROUPS) for (const c of g.criteria) {
      if (checked.has(c.id)) byTier.set(g.tier, [...(byTier.get(g.tier) ?? []), c.label]);
    }
    const triggered = SEVERITY_ORDER.filter((t) => byTier.has(t));
    const overall: Tier = triggered[0] ?? "minimal";

    result.replaceChildren();
    result.append(el("h3", "font-display text-xl font-bold text-ink-900", "Ergebnis"));
    const verdict = el("p", "mt-2 flex flex-wrap items-center gap-2 text-ink-700");
    verdict.append(el("span", BADGE, GROUPS.find((g) => g.tier === overall)?.badge ?? "Minimal risk"));
    verdict.append(el("span", "", overall === "minimal"
      ? "Kein Kriterium einer regulierten Stufe angekreuzt."
      : "Höchste zutreffende Stufe." + (triggered.length > 1 ? " Weitere Stufen gelten zusätzlich, siehe unten." : "")));
    result.append(verdict);

    for (const tier of triggered.length ? triggered : ["minimal" as Tier]) {
      const info = TIER_INFO[tier];
      const card = el("div", `mt-4 ${BOX_ACCENT}`);
      card.append(el("h4", "font-semibold text-ink-900", info.title));
      card.append(el("p", MUTED, info.meta));
      const ul = el("ul", "mt-2 list-disc space-y-1 pl-5 text-sm text-ink-800");
      for (const line of info.lines) ul.append(el("li", "", line));
      card.append(ul);
      const hits = byTier.get(tier);
      if (hits?.length) card.append(el("p", `mt-2 ${MUTED}`, "Ausgelöst durch: " + hits.join("; ") + "."));
      result.append(card);
    }
    const edu = el("div", `mt-4 ${NOTE}`);
    edu.innerHTML = EDU_NOTE; // own constant, contains <strong> only
    result.append(edu);
    result.append(el("p", `mt-3 ${MUTED}`,
      "Unabhängig von der Stufe gilt die DSGVO, sobald personenbezogene Daten verarbeitet werden. Lehrmittel, keine Rechtsberatung."));
    result.hidden = false;
    result.focus();
  }

  render();
  return {
    setMode(m) {
      mode = m;
      step = 0;
      render();
    },
  };
};
