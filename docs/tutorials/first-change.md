# Tutorial: your first change

About twenty minutes. You will run the site locally, change a sentence, add
a blog post, run the checks and push a branch. No Astro knowledge needed.

## 1. Run the site

```bash
git clone git@github.com:org-felix-paul/felix-paul-website.git
cd felix-paul-website
npm install
git config core.hooksPath .githooks
npm run dev
```

Open <http://localhost:4321>. The amber strip "Lokale Entwicklung" at the
top tells you this is not the live site. Leave the dev server running: every
saved file reloads the browser.

## 2. Change a sentence on the home page

The home page is assembled from one file per section in `src/home/`. The
"Über mich" section is `src/home/About.astro`. Open it. The top part between
the two `---` lines is TypeScript that prepares data; the part below is
HTML-like markup.

Find the German text object `de` and change `antrieb:`. Save. The browser
shows the new sentence. Now find `en:` a few lines below and change the
English counterpart. TypeScript insists that every key in `de` also exists
in `en`, so a missing translation is a build error rather than an empty spot
on the English page.

Look at <http://localhost:4321/en/> to see the English version.

## 3. Add a blog post

Create `src/blog/content/posts/mein-erster-beitrag.md`:

```md
---
title: "Mein erster Beitrag"
description: "Ein Satz, der in der Liste und als Meta-Beschreibung erscheint."
pubDate: 2026-09-12
audience: ["teachers"]
topics: ["general"]
---

Hallo Welt. **Markdown** funktioniert, Überschriften mit `##`.
```

The file name is the URL: <http://localhost:4321/blog/mein-erster-beitrag/>.
The post also appears in the list at `/blog/` and, because it is the newest,
in the "Blog" section of the home page. Nothing else to register.

Try setting `audience: ["everyone"]`. The terminal running `npm run dev`
reports that `everyone` is not an allowed value, because the schema in
`src/blog/collection.ts` only accepts the values listed in
`src/blog/consts.ts`. Change it back.

## 4. Run the checks

```bash
npm run verify
```

This runs `astro check` (types), `astro build` (the real output into `dist/`)
and the link checker. The link checker resolves every internal link the way
Cloudflare Pages does. Break a link on purpose in your post, for example
`[x](/gibt-es-nicht/)`, run `npm run check:links` again and read the report.
Then fix it.

## 5. Push a branch

```bash
git checkout -b post/mein-erster-beitrag
git add -A
git commit -m "Ersten Beitrag hinzugefügt"
git push -u origin post/mein-erster-beitrag
```

`git push` runs the same three checks through the pre-push hook and refuses
to push if one fails. Merge the branch into `main` on GitHub; Cloudflare Pages
builds `main` and the post is live a minute later. Delete the branch after
the merge.

## Where to go from here

- Every content type and its frontmatter: [how-to/add-content.md](../how-to/add-content.md)
- What to change where: [how-to/change-text-and-navigation.md](../how-to/change-text-and-navigation.md)
- Why the project is built like this: [explanation/architecture.md](../explanation/architecture.md)
