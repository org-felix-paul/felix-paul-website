/**
 * Legt um jede Markdown-Tabelle einen Rahmen.
 *
 * Grund: eine vierspaltige Tabelle ist auf dem Handy breiter als der
 * Bildschirm. Ohne Rahmen läuft sie aus dem Dokument heraus und lässt die
 * GANZE Seite seitlich scrollen – gemessen 185px Überlauf auf 500px Breite.
 * Der Text springt dann beim Wischen mit, obwohl nur die Tabelle zu breit ist.
 *
 * Der Rahmen fängt diesen Überlauf ab und darf dafür seitlich aus der
 * Textspalte ausbrechen (siehe .table-wrap in global.css). Gescrollt wird in
 * ihm nichts mehr: die Tabelle passt sich inzwischen der verfügbaren Breite an
 * und bricht ihre Zellen um, statt Spalten aus dem Bild zu schieben. Deshalb
 * trägt der Rahmen auch kein tabindex/role="region" mehr – ein fokussierbarer
 * Bereich, in dem es nichts zu scrollen gibt, wäre für Tastatur- und
 * Screenreader-Nutzer nur eine leere Station.
 *
 * Warum überhaupt ein Wrapper und nicht `table { display: block }`:
 * `display: block` nimmt dem Element seine Tabellenrolle, und Screenreader
 * kündigen es dann nicht mehr als Tabelle an. Der Wrapper lässt die Tabelle
 * eine Tabelle bleiben.
 */
export default function rehypeTableWrap() {
  return (tree) => {
    const gehen = (knoten) => {
      if (!knoten.children) return;
      knoten.children = knoten.children.map((kind) => {
        gehen(kind);
        if (kind.type !== "element" || kind.tagName !== "table") return kind;
        return {
          type: "element",
          tagName: "div",
          properties: { className: ["table-wrap"] },
          children: [kind],
        };
      });
    };
    gehen(tree);
  };
}
