#!/usr/bin/env node
/**
 * Prüft das Kontaktformular von Anfang bis Ende an der deployten Seite:
 * schickt eine Anfrage im Testmodus ab und wartet, bis die Mail im
 * Zoho-Ordner "felix-paul/test" liegt (Zoho-Regel auf den Betreff
 * "Testmail form logic").
 *
 *   npm run check:form:live                              # felix-paul.de
 *   npm run check:form:live -- https://<branch>.felix-paul-website.pages.dev
 *
 * Braucht in .env (Vorlage: .env.example): FORM_TEST_TOKEN, ZOHO_CLIENT_ID,
 * ZOHO_CLIENT_SECRET, ZOHO_READ_REFRESH_TOKEN (Scope ZohoMail.messages.READ),
 * ZOHO_ACCOUNT_ID. Die Logik selbst prüfen die Unit-Tests in tests/.
 */
const basis = process.argv[2] ?? "https://felix-paul.de";
const TEST_ORDNER = "7881373000000075001"; // /felix-paul/test
const WARTEZEIT_MS = 90_000;

const fehlend = ["FORM_TEST_TOKEN", "ZOHO_CLIENT_ID", "ZOHO_CLIENT_SECRET", "ZOHO_READ_REFRESH_TOKEN", "ZOHO_ACCOUNT_ID"].filter(
  (n) => !process.env[n],
);
if (fehlend.length) abbruch(`fehlt in .env: ${fehlend.join(", ")}`);

// Eindeutige Kennung, damit eine alte Testmail nie als Erfolg zählt.
const kennung = `form-check-${Date.now()}`;
const start = Date.now();

const form = new URLSearchParams({
  name: kennung,
  email: "form-check@felix-paul.de",
  message: `Automatischer Test von ${basis}`,
  privacy: "yes",
});
const antwort = await fetch(`${basis}/api/contact`, {
  method: "POST",
  body: form,
  headers: { "X-Form-Test": process.env.FORM_TEST_TOKEN },
  redirect: "manual",
});
const ziel = antwort.headers.get("Location") ?? "";
if (antwort.status !== 303 || !ziel.endsWith("/thank-you/")) {
  abbruch(`Formular antwortet ${antwort.status} ${ziel || (await antwort.text())}`);
}
console.log(`✓ Formular angenommen (${antwort.status} → ${new URL(ziel).pathname})`);

const token = await zohoToken();
while (Date.now() - start < WARTEZEIT_MS) {
  await new Promise((r) => setTimeout(r, 5_000));
  const liste = await fetch(
    `https://mail.zoho.eu/api/accounts/${process.env.ZOHO_ACCOUNT_ID}/messages/view?folderId=${TEST_ORDNER}&limit=20`,
    { headers: { Authorization: `Zoho-oauthtoken ${token}` } },
  ).then((r) => r.json());
  if (!Array.isArray(liste.data)) abbruch(`Zoho-Liste: ${JSON.stringify(liste.status ?? liste)}`);
  if (liste.data.some((m) => m.summary?.includes(kennung))) {
    console.log(`✓ Mail nach ${Math.round((Date.now() - start) / 1000)} s im Ordner test`);
    process.exit(0);
  }
}
abbruch(`keine Mail mit ${kennung} im Ordner test nach ${WARTEZEIT_MS / 1000} s`);

async function zohoToken() {
  const r = await fetch("https://accounts.zoho.eu/oauth/v2/token", {
    method: "POST",
    body: new URLSearchParams({
      refresh_token: process.env.ZOHO_READ_REFRESH_TOKEN,
      client_id: process.env.ZOHO_CLIENT_ID,
      client_secret: process.env.ZOHO_CLIENT_SECRET,
      grant_type: "refresh_token",
    }),
  }).then((r) => r.json());
  if (!r.access_token) abbruch(`Zoho-Token: ${r.error ?? "unbekannt"}`);
  return r.access_token;
}

function abbruch(text) {
  console.error(`✖ Kontaktformular: ${text}`);
  process.exit(1);
}
