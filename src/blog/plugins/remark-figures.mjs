/**
 * Figures, tables, anchors and cross-references in posts, like \label/\ref
 * in LaTeX. Runs on the mdast, after remark-directive parsed the syntax.
 *
 * Syntax an author writes (see docs/how-to/write-a-blog-post.md):
 *
 *   :::figure{#abb-nutzung short="Anteil der Lehrkräfte mit KI-Nutzung"}
 *   Long description, one or more paragraphs, before the image.
 *   ![alt text](/blog/img/nutzung.png)
 *   :::
 *
 *   :::table{#tab-honorare short="Honorare nach Format"}
 *   | Format | Honorar |
 *   |---|---|
 *   Long description, after the table.
 *   :::
 *
 *   :anchor[label]{#punkt-x}          manual anchor at an arbitrary point
 *   [](#abb-nutzung)                   empty link = auto label "Abbildung 1"
 *   [](#1-die-vier-stufen)             heading → its text
 *   [](#interaktiv-1)                  <Interactive id="interaktiv-1"> in .mdx → "Interaktiv 1"
 *
 * Numbering follows document order. An empty link to an unknown id fails
 * the build. The lists of figures and tables are passed to the page through
 * file.data.astro.frontmatter.figures / .tables and rendered by
 * src/pages/blog/[slug].astro after the content (and thus after the sources).
 */
import GithubSlugger from "github-slugger";
import { toString } from "mdast-util-to-string";

const FIGURE = "Abbildung";
const TABLE = "Tabelle";
const INTERACTIVE = "Interaktiv";

export default function remarkFigures() {
  return (tree, file) => {
    const labels = new Map(); // id -> label text for [](#id)
    const figures = [];
    const tables = [];
    const errors = []; // reported by [slug].astro, which fails the build
    let interactive = 0;
    const slugger = new GithubSlugger();
    const where = () => (file?.path ? `${file.path}: ` : "");
    const fail = (message) => { errors.push(message); return null; };

    const text = (value) => ({ type: "text", value });
    const strong = (value) => ({ type: "strong", children: [text(value)] });
    const paragraph = (children) => ({ type: "paragraph", children });
    const isImageParagraph = (n) =>
      n.type === "paragraph" && n.children.length === 1 && n.children[0].type === "image";
    const isDiagram = (n) =>
      (n.type === "code" && n.lang === "mermaid") ||
      (n.type === "html" && /^<pre class="mermaid">/.test(n.value));

    // Authors often put the image directly under the description without a
    // blank line; Markdown then makes one paragraph of both. Split it.
    const splitImages = (children) => {
      const out = [];
      for (const c of children) {
        if (c.type !== "paragraph" || !c.children.some((k) => k.type === "image")) {
          out.push(c);
          continue;
        }
        const rest = [];
        for (const k of c.children) {
          if (k.type === "image") {
            if (rest.some((r) => r.type !== "break" && (r.type !== "text" || r.value.trim()))) out.push(paragraph(rest.splice(0)));
            else rest.length = 0;
            out.push(paragraph([k]));
          } else rest.push(k);
        }
        if (rest.some((r) => r.type !== "break" && (r.type !== "text" || r.value.trim()))) out.push(paragraph(rest));
      }
      return out;
    };

    const requireAttrs = (node, kind) => {
      const id = node.attributes?.id;
      const short = node.attributes?.short;
      if (!id || !short) {
        return fail(`${where()}:::${kind} needs {#id short="…"}, got ${JSON.stringify(node.attributes ?? {})}`);
      }
      if (labels.has(id)) return fail(`${where()}anchor "${id}" is defined twice`);
      return { id, short };
    };

    const caption = (label, short, long) => ({
      type: "figcaption",
      data: { hName: "figcaption" },
      children: [paragraph([strong(`${label}: ${short.replace(/[.!?]$/, "")}.`)]), ...long],
    });

    // Pass 1: transform directives, collect anchors ------------------------
    const walk = (node) => {
      if (!node || !Array.isArray(node.children)) return;
      node.children = node.children.map((child) => {
        if (child.type === "heading") {
          const t = toString(child);
          labels.set(slugger.slug(t), t);
          return child;
        }
        if (child.type === "containerDirective" && child.name === "figure") {
          const attrs = requireAttrs(child, "figure");
          if (!attrs) return child;
          const { id, short } = attrs;
          const n = figures.length + 1;
          const parts = splitImages(child.children);
          const media = parts.filter((c) => isImageParagraph(c) || isDiagram(c));
          const long = parts.filter((c) => !isImageParagraph(c) && !isDiagram(c));
          if (media.length !== 1) {
            return fail(`${where()}:::figure{#${id}} must contain exactly one image or mermaid block, found ${media.length}`) ?? child;
          }
          const body = isImageParagraph(media[0]) ? media[0].children[0] : media[0];
          labels.set(id, `${FIGURE} ${n}`);
          figures.push({ id, n, short });
          return {
            type: "figure",
            data: { hName: "figure", hProperties: { id, className: ["figure"] } },
            children: [caption(`${FIGURE} ${n}`, short, long), body],
          };
        }
        if (child.type === "containerDirective" && child.name === "table") {
          const attrs = requireAttrs(child, "table");
          if (!attrs) return child;
          const { id, short } = attrs;
          const n = tables.length + 1;
          const table = child.children.filter((c) => c.type === "table");
          const long = child.children.filter((c) => c.type !== "table");
          if (table.length !== 1) {
            return fail(`${where()}:::table{#${id}} must contain exactly one table, found ${table.length}`) ?? child;
          }
          // A description written directly under the table, without a blank
          // line, is swallowed by GFM as one more row with empty cells. Catch
          // the typical shape of that mistake instead of publishing it.
          const rows = table[0].children;
          const last = rows[rows.length - 1];
          const lastCells = last?.children ?? [];
          if (rows.length > 1 && lastCells.length > 1 && lastCells.slice(1).every((c) => toString(c).trim() === "")) {
            return fail(`${where()}:::table{#${id}}: the last table row has only its first cell filled ("${toString(lastCells[0]).slice(0, 40)}…"). If that is the description, put a blank line between the table and the description.`) ?? child;
          }
          labels.set(id, `${TABLE} ${n}`);
          tables.push({ id, n, short });
          return {
            type: "figure",
            data: { hName: "figure", hProperties: { id, className: ["table-figure"] } },
            children: [table[0], caption(`${TABLE} ${n}`, short, long)],
          };
        }
        if (child.type === "textDirective" && child.name === "anchor") {
          const id = child.attributes?.id;
          if (!id) return fail(`${where()}:anchor[…] needs {#id}`) ?? child;
          if (labels.has(id)) return fail(`${where()}anchor "${id}" is defined twice`) ?? child;
          const label = toString(child) || id;
          labels.set(id, label);
          return {
            type: "anchor",
            data: { hName: "span", hProperties: { id, className: ["anchor"] } },
            children: child.children,
          };
        }
        if (child.type === "mdxJsxFlowElement" && child.name === "Interactive") {
          const id = child.attributes?.find((a) => a.name === "id")?.value;
          if (typeof id === "string") {
            interactive += 1;
            labels.set(id, `${INTERACTIVE} ${interactive}`);
          }
          return child;
        }
        walk(child);
        return child;
      });
    };
    walk(tree);

    // Pass 2: fill empty links [](#id) -------------------------------------
    const fill = (node) => {
      if (!node || !Array.isArray(node.children)) return;
      for (const child of node.children) {
        if (child.type === "link" && child.url.startsWith("#") && child.children.length === 0) {
          const id = child.url.slice(1);
          const label = labels.get(id);
          if (!label) {
            fail(`${where()}reference [](#${id}) points to nothing. Known anchors: ${[...labels.keys()].join(", ")}`);
            child.children = [text(`#${id}`)];
          } else {
            child.children = [text(label)];
          }
        }
        fill(child);
      }
    };
    fill(tree);

    file.data.astro ??= {};
    file.data.astro.frontmatter ??= {};
    file.data.astro.frontmatter.figures = figures;
    file.data.astro.frontmatter.tables = tables;
    file.data.astro.frontmatter.figureErrors = errors;
  };
}
