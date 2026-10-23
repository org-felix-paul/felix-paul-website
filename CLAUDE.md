# felix-paul-website

- Daily use: `README.md`. How the site is built and why: `docs/README.md`.
- Writing or editing a blog post: read `docs/how-to/write-a-blog-post.md` first, then `docs/how-to/add-content.md`.
- An interactive element (quiz, form, classifier) in a post: `docs/how-to/write-an-interactive-blog-post.md`. Only `src/blog/interactive/widgets/<name>.ts` and one registry line; never frame HTML in a post.
- Before pushing: `npm run verify` (the pre-push hook runs it as well). Never push to `main` directly.
