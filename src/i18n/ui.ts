/**
 * Die Beschriftungen, die nicht aus `consts.ts` kommen: Fußzeile, Formular,
 * Kopfzeile. Strukturen mit eigener Bedeutung (AREAS, NAV) tragen ihre
 * englische Beschriftung direkt neben der deutschen — hier steht nur, was
 * sonst nirgends hingehört.
 *
 * Der Rückfall sitzt bewusst IM Übersetzer, nicht beim Aufrufer: fehlt ein
 * Schlüssel im Englischen, erscheint das deutsche Wort. Ohne den Rückfall
 * stünde `undefined` in der Seite, und das fällt beim Bauen nicht auf.
 */
export type Sprache = "de" | "en";

export const UI = {
  de: {
    alleBereiche: "Alle Bereiche",
    startseite: "Startseite",
    startseiteNote: "Überblick, Hintergrund und Kontakt",
    tagline: "Keynotes & Fachvorträge, Bildungsangebote und Software",
    rechteVorbehalten: "Alle Rechte vorbehalten.",
    kontakt: "Kontakt",
    impressum: "Impressum",
    datenschutz: "Datenschutz",
    menueOeffnen: "Menü öffnen",
    // Kontaktformular
    formName: "Name",
    formEmail: "E-Mail",
    formBetreff: "Betreff",
    formNachricht: "Nachricht",
    formSenden: "Nachricht senden",
    formPflicht: "Pflichtfeld",
  },
  en: {
    alleBereiche: "All areas",
    startseite: "Home",
    startseiteNote: "Overview, background and contact",
    tagline: "Keynotes, training and software",
    rechteVorbehalten: "All rights reserved.",
    kontakt: "Contact",
    impressum: "Legal notice",
    datenschutz: "Privacy",
    menueOeffnen: "Open menu",
    formName: "Name",
    formEmail: "Email",
    formBetreff: "Subject",
    formNachricht: "Message",
    formSenden: "Send message",
    formPflicht: "Required",
  },
} as const;

export type Schluessel = keyof (typeof UI)["de"];

/** Gibt einen Übersetzer zurück, der auf Deutsch zurückfällt. */
export function uebersetzer(sprache: Sprache) {
  return (schluessel: Schluessel): string =>
    (UI[sprache] as Record<Schluessel, string>)[schluessel] ?? UI.de[schluessel];
}
