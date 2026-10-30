// Kontaktformular unter /api/contact. Die Logik (Turnstile, Honeypot,
// Zoho-Versand, Token-Cache, Testmodus) steckt im Paket contact-form; hier
// steht nur, was für dieses Formular gilt. Secrets und KV-Bindung:
// docs/how-to/contact-form.md.
import { createFormHandler } from "contact-form";

export const onRequestPost = createFormHandler({
  to: "contact@felix-paul.de",
  from: "contact@felix-paul.de",
  fields: {
    name: { label: "Name", required: true, maxLength: 200 },
    email: { label: "E-Mail", required: true, type: "email", maxLength: 200 },
    lang: { label: "Sprache" },
    message: { label: "Nachricht", required: true },
    privacy: { required: true, equals: "yes" },
  },
  // Die Zoho-API kennt kein Reply-To; die Absenderadresse steht deshalb im
  // Betreff, dort verlinkt Zoho sie zum Antworten.
  subject: "Anfrage über felix-paul.de: {name} <{email}>",
  redirect: { de: "/thank-you/", en: "/en/thank-you/" },
  errorText: {
    de: "Ihre Nachricht konnte nicht gesendet werden. Bitte gehen Sie zurück und versuchen Sie es erneut, oder schreiben Sie direkt an contact@felix-paul.de.",
    en: "Your message could not be sent. Please go back and try again, or write to contact@felix-paul.de directly.",
  },
});
