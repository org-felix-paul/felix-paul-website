// Die Gliederung einer Seite — als Daten, nicht als Handarbeit.
//
// Sowohl das Abschnittsverzeichnis in der Seitenspalte als auch die Nummer
// über jeder Überschrift kommen aus derselben Liste. Wer einen Abschnitt
// einfügt, verschiebt oder entfernt, ändert genau eine Stelle; die
// Nummerierung zieht mit. Handgezählte „03" im Markup laufen sonst beim ersten
// Umbau auseinander — und genau die Nummern sind hier das, woran der Leser
// sich orientiert.

export interface RailItem {
  /** id des Abschnitts. Zugleich Ankerziel (#id) und Spy-Schlüssel. */
  id: string;
  /** Beschriftung im Verzeichnis. Das Mikro-Label des Abschnitts. */
  label: string;
}

/** Laufende Nummer als gesetztes Element: 0 → „01". */
export const nummer = (index: number) => String(index + 1).padStart(2, "0");

/**
 * Liefert zu einer Gliederung eine Funktion `nr(id)`, die die Nummer eines
 * Abschnitts zurückgibt — oder `undefined`, wenn der Abschnitt nicht im
 * Verzeichnis steht (dann bekommt er auch keine Nummer, was richtig ist).
 */
export const nummernGeber = (outline: readonly RailItem[]) => (id: string) => {
  const i = outline.findIndex((eintrag) => eintrag.id === id);
  return i < 0 ? undefined : nummer(i);
};
