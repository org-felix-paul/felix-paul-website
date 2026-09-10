/**
 * Legt um jede Markdown-Tabelle einen scrollbaren Rahmen.
 *
 * Grund: eine vierspaltige Tabelle ist auf dem Handy breiter als der
 * Bildschirm. Ohne Rahmen läuft sie aus dem Dokument heraus und lässt die
 * GANZE Seite seitlich scrollen – gemessen 185px Überlauf auf 500px Breite.
 * Der Text springt dann beim Wischen mit, obwohl nur die Tabelle zu breit ist.
 *
 * Warum ein Wrapper und nicht `table { display: block; overflow-x: auto }`:
 * `display: block` nimmt dem Element seine Tabellenrolle, und Screenreader
 * kündigen es dann nicht mehr als Tabelle an. Der Wrapper lässt die Tabelle
 * eine Tabelle bleiben.
 *
 * tabindex und role machen den Rahmen per Tastatur scrollbar – ein scrollbarer
 * Bereich, den man nur mit der Maus erreicht, ist für Tastaturnutzer eine
 * Sackgasse.
 */
export default function rehypeTableScroll() {
  return (tree) => {
    const gehen = (knoten) => {
      if (!knoten.children) return;
      knoten.children = knoten.children.map((kind) => {
        gehen(kind);
        if (kind.type !== "element" || kind.tagName !== "table") return kind;
        return {
          type: "element",
          tagName: "div",
          properties: {
            className: ["table-scroll"],
            tabIndex: 0,
            role: "region",
            "aria-label": "Tabelle, seitlich scrollbar",
          },
          children: [kind],
        };
      });
    };
    gehen(tree);
  };
}
