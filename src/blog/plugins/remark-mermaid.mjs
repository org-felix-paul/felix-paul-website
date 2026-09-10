/**
 * Wandelt ```mermaid-Codeblöcke noch im mdast (also vor Astros Shiki-Syntax-
 * highlighting) in einen rohen `<pre class="mermaid">…</pre>`-Block um.
 *
 * Vorteile:
 *  - Shiki fasst den Block nicht an (er ist kein `code`-Node mehr).
 *  - Der client-seitige mermaid-Renderer findet `.mermaid` und ersetzt den
 *    Inhalt durch ein SVG.
 *
 * Der Diagrammtext wird HTML-escaped, damit z. B. `<br/>` in Knoten-Labels
 * korrekt als Textinhalt ankommt (der Browser dekodiert `&lt;br/&gt;` wieder
 * zu `<br/>`, das mermaid dann auswertet).
 */
export default function remarkMermaid() {
  const escape = (s) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const walk = (node) => {
    if (!node || !Array.isArray(node.children)) return;
    node.children = node.children.map((child) => {
      if (child.type === "code" && child.lang === "mermaid") {
        return {
          type: "html",
          value: `<pre class="mermaid">${escape(child.value)}</pre>`,
        };
      }
      walk(child);
      return child;
    });
  };

  return (tree) => {
    walk(tree);
    return tree;
  };
}
