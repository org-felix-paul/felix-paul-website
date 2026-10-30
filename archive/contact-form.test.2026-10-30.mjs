// Unit-Tests für functions/api/contact.ts. Zoho, Turnstile und KV sind
// nachgebaut, es geht nichts ins Netz; deshalb laufen sie bei jedem Push mit.
// Ob die echte Kette (Secrets, Zoho, Mailregel) funktioniert, prüft
// scripts/check-contact-form.mjs gegen die deployte Seite.
import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { onRequestPost } from "../functions/api/contact.ts";

let aufrufe, turnstileOk, mailStatus, abgelehnt, tokenNr;

beforeEach(() => {
  aufrufe = { turnstile: 0, token: 0, mails: [] };
  turnstileOk = true;
  mailStatus = 200;
  abgelehnt = "";
  tokenNr = 0;
  globalThis.fetch = async (url, init) => {
    if (url.includes("siteverify")) {
      aufrufe.turnstile++;
      return Response.json({ success: turnstileOk });
    }
    if (url.includes("oauth")) {
      aufrufe.token++;
      return Response.json({ access_token: `tok${++tokenNr}`, expires_in: 3600 });
    }
    const token = init.headers.Authorization.split(" ")[1];
    aufrufe.mails.push({ token, ...JSON.parse(init.body) });
    return new Response("", { status: token === abgelehnt ? 401 : mailStatus });
  };
});

const ENV = {
  TURNSTILE_SECRET: "s",
  ZOHO_CLIENT_ID: "c",
  ZOHO_CLIENT_SECRET: "c",
  ZOHO_REFRESH_TOKEN: "r",
  ZOHO_ACCOUNT_ID: "1",
  CONTACT_TO: "contact@felix-paul.de",
  FORM_TEST_TOKEN: "geheim",
};

const GUELTIG = { name: "Max", email: "max@example.com", message: "Hallo", privacy: "yes", "cf-turnstile-response": "t" };

function sende(felder = {}, { env = ENV, header = {} } = {}) {
  const form = new FormData();
  for (const [k, v] of Object.entries({ ...GUELTIG, ...felder })) if (v !== undefined) form.set(k, v);
  const request = new Request("https://felix-paul.de/api/contact", { method: "POST", body: form, headers: header });
  return onRequestPost({ request, env });
}

function kv() {
  const daten = new Map();
  return {
    daten,
    get: async (k) => daten.get(k) ?? null,
    put: async (k, v) => void daten.set(k, v),
    delete: async (k) => void daten.delete(k),
  };
}

test("gültige Anfrage: Mail an mich, Weiterleitung auf die deutsche Dankeseite", async () => {
  const antwort = await sende();
  assert.equal(antwort.status, 303);
  assert.equal(antwort.headers.get("Location"), "https://felix-paul.de/thank-you/");
  assert.equal(aufrufe.mails.length, 1);
  const mail = aufrufe.mails[0];
  assert.equal(mail.toAddress, "contact@felix-paul.de");
  assert.equal(mail.fromAddress, "contact@felix-paul.de");
  assert.match(mail.subject, /max@example\.com/);
  assert.match(mail.content, /^Name: Max\nE-Mail: max@example\.com/);
});

test("die Adresse aus dem Formular wird nie Empfänger", async () => {
  await sende({ email: "opfer@example.com" });
  assert.ok(aufrufe.mails.every((m) => m.toAddress === ENV.CONTACT_TO));
});

test("englisches Formular landet auf der englischen Dankeseite", async () => {
  const antwort = await sende({ lang: "en" });
  assert.equal(antwort.headers.get("Location"), "https://felix-paul.de/en/thank-you/");
});

test("Honeypot: Dankeseite, aber keine Mail und keine Turnstile-Prüfung", async () => {
  const antwort = await sende({ _honey: "bot" });
  assert.equal(antwort.status, 303);
  assert.equal(aufrufe.mails.length, 0);
  assert.equal(aufrufe.turnstile, 0);
});

for (const [fall, felder] of [
  ["ohne Namen", { name: "" }],
  ["ungültige E-Mail", { email: "kein-at" }],
  ["ohne Nachricht", { message: " " }],
  ["ohne Datenschutz-Haken", { privacy: undefined }],
]) {
  test(`ungültig (${fall}): 400, keine Mail`, async () => {
    const antwort = await sende(felder);
    assert.equal(antwort.status, 400);
    assert.equal(aufrufe.mails.length, 0);
  });
}

test("Turnstile abgelehnt: 400, keine Mail", async () => {
  turnstileOk = false;
  const antwort = await sende();
  assert.equal(antwort.status, 400);
  assert.equal(aufrufe.mails.length, 0);
});

test("Zoho-Fehler: 502 mit Hinweis auf die Mailadresse", async () => {
  mailStatus = 500;
  const antwort = await sende();
  assert.equal(antwort.status, 502);
  assert.match(await antwort.text(), /contact@felix-paul\.de/);
});

test("Testmodus: richtiger Header überspringt Turnstile, fester Betreff", async () => {
  turnstileOk = false;
  const antwort = await sende({}, { header: { "X-Form-Test": "geheim" } });
  assert.equal(antwort.status, 303);
  assert.equal(aufrufe.turnstile, 0);
  assert.equal(aufrufe.mails[0].subject, "Testmail form logic");
});

test("Testmodus: falscher Header oder kein Token konfiguriert ändert nichts", async () => {
  turnstileOk = false;
  assert.equal((await sende({}, { header: { "X-Form-Test": "falsch" } })).status, 400);
  const { FORM_TEST_TOKEN, ...ohneToken } = ENV;
  assert.equal((await sende({}, { env: ohneToken, header: { "X-Form-Test": "" } })).status, 400);
  assert.equal(aufrufe.mails.length, 0);
});

test("ohne KV: ein neues Token pro Anfrage", async () => {
  await sende();
  await sende();
  assert.equal(aufrufe.token, 2);
});

test("mit KV: ein Token für mehrere Anfragen", async () => {
  const cache = kv();
  const env = { ...ENV, ZOHO_TOKEN_CACHE: cache };
  for (let i = 0; i < 3; i++) assert.equal((await sende({}, { env })).status, 303);
  assert.equal(aufrufe.token, 1);
  assert.equal(cache.daten.get("zoho_access_token"), "tok1");
});

test("mit KV: widerrufenes Token wird einmal ersetzt", async () => {
  const cache = kv();
  const env = { ...ENV, ZOHO_TOKEN_CACHE: cache };
  await sende({}, { env });
  abgelehnt = "tok1";
  assert.equal((await sende({}, { env })).status, 303);
  assert.equal(cache.daten.get("zoho_access_token"), "tok2");
  assert.deepEqual(aufrufe.mails.map((m) => m.token), ["tok1", "tok1", "tok2"]);
});
