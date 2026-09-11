/**
 * Welche Umgebung wird hier gerade gebaut?
 *
 * Cloudflare Pages setzt `CF_PAGES_BRANCH` bei jedem Build auf den Branch,
 * aus dem deployt wird. Damit lässt sich eine Vorschau-Deployment von der
 * Produktionsseite unterscheiden, ohne dafür Code in einem Branch zu ändern —
 * genau das hatte der frühere `int`-Branch getan, und deshalb ist er mit jedem
 * Merge in Konflikt geraten.
 *
 * Die Variable wird beim Build statisch eingesetzt (Astro/Vite), die Seite
 * bleibt also vollständig statisch.
 */
/** Der Produktions-Branch. Wird er umbenannt, muss er hier mit umbenannt
 *  werden — sonst zeigt die Live-Seite plötzlich das Vorschau-Banner. */
const PRODUCTION_BRANCH = "main";

const branch = import.meta.env.CF_PAGES_BRANCH as string | undefined;

/** Branch, aus dem deployt wurde — lokal `null`. */
export const DEPLOY_BRANCH = branch ?? null;

/**
 * Kein Banner, wenn nicht sicher ist, dass es eine Vorschau ist: ein Banner,
 * das versehentlich in der Produktion auftaucht, ist schlimmer als eines, das
 * auf einer Vorschau fehlt. Lokal beim `astro dev` wird es trotzdem gezeigt,
 * damit man es beim Entwickeln sieht.
 */
export const DEPLOY_ENV: { kind: "production" | "preview" | "dev"; label: string } =
  import.meta.env.DEV
    ? { kind: "dev", label: "Lokale Entwicklung" }
    : branch && branch !== PRODUCTION_BRANCH
      ? { kind: "preview", label: `Vorschau · Branch ${branch}` }
      : { kind: "production", label: "Produktion" };

export const SHOW_ENV_BANNER = DEPLOY_ENV.kind !== "production";
