# Experiment 3 — Redaktionelles Layout

Branch: `experimental-version-3`, aufgesetzt auf `7dbc216`.

Dies ist einer von vier Experimentierzweigen. **Dieser Zweig ändert
ausschließlich das Layout.** Die Palette in `src/styles/global.css` bleibt
Wert für Wert unangetastet — keine einzige `--c-*`-Variable wurde angefasst.
Das ist Absicht: die Zweige 1 und 2 testen Farbe. Wer hier reagiert, reagiert
auf die Anordnung, nicht auf einen neuen Farbton.

## These

Die alte Startseite war ein Stapel gleich aussehender Kästen: Eyebrow,
zentrierte Überschrift, zentrierter Lead, darunter ein Raster aus umrandeten
Karten mit Schlagschatten. Jeder Abschnitt sah aus wie jeder andere. Damit war
nichts wichtiger als etwas anderes — und das Beiwerk war lauter als der Inhalt.

Dieser Zweig liest Apples „Deference" wörtlich: **die Typografie trägt die
Hierarchie, der Weißraum trennt, und Tiefe entsteht aus Haarlinien und
Transparenz statt aus Schlagschatten.** Konkret:

- Eine echte Anzeigenskala (`--step-display` bis `--step-body`), die von
  `clamp(2.75rem, …, 6rem)` für die Eröffnung entschieden nach unten geht.
- Fließtext bei 17–19px (`--step-body`), Zeilenhöhe 1.7, Zeilenlänge auf
  `68ch` gedeckelt (`--measure`).
- **Null Schlagschatten auf der ganzen Domain.** Wo eine Fläche nötig ist,
  reicht eine Haarlinie; wo eine Trennung nötig ist, reicht Abstand.
- Die Mittelachse ist gebrochen: Abschnittsmarke und Überschrift stehen links,
  der Lead läuft rechts daneben und sitzt auf dessen Grundlinie auf.
- Radien nach Flächengröße: `2rem` für große Flächen (Porträt, CTA-Block,
  Consulting-Fläche), `0.5rem` für kleine (Vorschaubilder, Eingabefelder).
  Nicht mehr ein Radius für alles.
- Abschnitte bekommen unterschiedlich viel Luft. `Section` hat dafür ein
  neues `tone`: `major` (Speaking, Bildung, Kontakt) gegen `minor` (Überblick,
  Software, Blog, Presse). Beim Scrollen ist spürbar, was zählt.

## Was sich abschnittsweise strukturell geändert hat

**Kopfleiste** (`SiteHeader.astro`) — schlank, durchscheinend,
backdrop-blurred, ohne eigene Kante solange die Seite oben steht. Beim Scrollen
zieht sie sich von 4.5rem auf 3.5rem zusammen und setzt eine Haarlinie
(`[data-scrolled]`, gesetzt per `requestAnimationFrame`-gedrosseltem
Scroll-Listener). Der aktive Eintrag wird durch eine Haarlinie markiert, die
aus dem Nichts aufzieht, statt durch einen 2px-Balken, der auch im
Ruhezustand Platz beansprucht. Navigationsstruktur, Scroll-Spy,
Aufklappgruppe, Sprachlink und Themenschalter sind unverändert in ihrer
Funktion; Escape schließt jetzt zusätzlich das Handy-Menü und gibt den Fokus
an den Knopf zurück.

**Hero** (`components/Hero.astro`) — war: zwei Spalten, links Text, rechts ein
quadratisches Porträt in abgerundeter Box mit Schlagschatten und zwei
geblurrten Farbkreisen dahinter. Ist: eine typografische Aussage („Felix Paul"
über `--step-display`), darunter der Untertitel eine Stufe kleiner und in
`ink-500`, darunter eine Haarlinie, erst dahinter Lead und Handlung. Das
Porträt steht als hohe Spalte (4/5) daneben und läuft unten aus dem Abschnitt
heraus; auf Tablet/Handy wird es zum breiten Band (3/2 bzw. 4/3) unter dem
Text. Die Farbkreise sind durch einen einzigen weichen Verlauf ersetzt.

**Überblick (`#saeulen`)** — war eine umrandete Kartenliste mit Schatten. Ist
ein Register über die volle Satzbreite: laufende Nummer plus kurzer
Farbstrich, Bereichsname, Beschreibung, Pfeil — Zeilen durch Haarlinien
getrennt. Liest sich als Inhaltsverzeichnis der Seite. Die Nummern sind
`aria-hidden`, damit sie Dekoration bleiben und den Textbestand nicht ändern.

**Über mich** — Porträt links in schmaler Spalte, Text rechts. Die
Studienabschlüsse standen vorher in farbigen Kästchen, die wie eine Infografik
wirkten und den Text übertönten; jetzt sind sie eine `<dl>` mit drei Gruppen
unter Haarlinien, jede mit ihrem Farbstrich. Dieselben Wörter, dieselbe
Gruppierung — nur lesbar statt zerlegt.

**Speaking** — der luftigste Abschnitt der Seite. Sechs gleich große Karten
sind zu einem Werkverzeichnis geworden: Titel links, Beschreibung rechts,
Haarlinien dazwischen. „Weitere Themen" ist dieselbe Zeilenform, sichtbar
zurückgenommen. Consulting bekommt eine eigene ruhige Fläche mit großem
Radius statt eines blauen Kastens mit Rahmen.

**Bildungsangebote** — `ZielgruppenHinweis` (geteilt mit `/schools/` und
`/en/`) wurde von drei Karten zu drei offenen Spalten unter Haarlinien mit
Farbstrich. Die beiden Workshop-Teaser und der Katalog-Absprung sind ein
dreispaltiges Register; die gestrichelte „+5"-Sonderkachel ist weg.

**Software** — kurzer Abschnitt, deshalb `tone="minor"` und kein
zweispaltiger Kopf: eine einzige große Aussage unter einer 2px-Amber-Linie.

**Publikationen** — das Buchcover ist das Objekt und braucht keinen Kasten;
nur eine Haarlinie am Bild. Die beiden Paper nutzen dieselbe Zeilenform wie
die Vortragsthemen, damit die Seite eine Sprache spricht.

**Blog / Kontakt / Presse** — Blog als Datumsregister (`tone="minor"`).
Kontakt: Formular ohne Kasten, Felder tragen die Struktur selbst; die
Direktkontakte rechts als Haarlinienliste. Presse als Nebenabschnitt.

**`Section.astro`** (geteilt von zehn Seiten) und
**`education/components/Section.astro`** — neue Props `tone`, `width` und
`headerLayout`, alle mit Vorgabewerten, sodass bestehende Aufrufe
unverändert funktionieren. Das gedämpfte Band bekommt Haarlinien oben und
unten: im dunklen Schema trennen `ink-50` und `canvas` nur wenige Prozent
Helligkeit, ohne Linie verschwände es.

**Unterseiten** — `/companies/`, `/individuals/`, `/schools/`,
`/schools/insights/`, `/blog/`, Blogbeitrag, Workshop-Detailseite, `/404`,
`/thank-you/` sowie alle `/en/`-Spiegel wurden mitgezogen: Karten zu offenen
Blöcken, Schaltflächen zu Pillen mit 44px Mindesthöhe, Farbverlauf-CTAs zu
ruhigen Flächen. Die Rechtstexte (`/impressum/`, `/datenschutz/` und ihre
englischen Fassungen) bekommen `width="narrow"` und einen linksbündigen Kopf —
ein Impressum ist Fließtext und braucht Zeilenlänge, keine Zweispaltigkeit.

**`global.css`** — die Typo-Skala, die `u-*`-Hilfsklassen, `--measure`,
`scroll-padding-top: 6rem` (Sprungziele landeten vorher unter der klebenden
Leiste), ein globaler `:focus-visible`-Ring auf allem Fokussierbaren, und ein
`prefers-reduced-motion`-Block, der sämtliche Übergänge stilllegt. Die
Prose-Tabellen haben nur noch waagerechte Haarlinien statt Gitternetz.

## Der Text ist unverändert

Kein deutscher und kein englischer Satz wurde angefasst — keine Überschrift,
kein Listenpunkt, kein Linktext, kein Alt-Text, keine Formularbeschriftung,
keine Rechtsseite.

Das ist nicht nur behauptet, sondern nachgemessen: der Basisstand `7dbc216`
wurde separat gebaut und der sichtbare Text **aller 51 erzeugten Seiten**
gegen diesen Zweig verglichen (Textknoten plus `alt`, `aria-label` und
`placeholder`, ohne `aria-hidden`-Teilbäume). Ergebnis: **0 Seiten mit
abweichendem Satzbestand.**

Zwei Seiten melden „umsortiert": auf den beiden Startseiten steht die
Gruppenbezeichnung jetzt vor ihren Abschlüssen, der Workshop-Kicker vor
seinem Titel und die dSolve-Marke vor der Abschnittsüberschrift. Das ist
Umgruppierung vorhandener Blöcke, kein Eingriff in die Formulierung.

## Was bewusst liegen geblieben ist

- **Die Palette.** Siehe oben — das ist der Kern des Versuchsaufbaus.
- **Die Navigationsstruktur.** `NAV` und `AREAS` in `src/consts.ts` sind
  unberührt; die Gruppen, der Scroll-Spy und die Sprachlogik arbeiten wie
  vorher.
- **`src/consts.ts`, `i18n/`, die Content-Collections, `astro.config.mjs`.**
  Kein Inhalt, keine Route, kein Schema angefasst.
- **Der auskommentierte „Aktuelles"-Block** auf der Startseite. Er ist auf
  die neue Zeilenform mitgezogen worden, bleibt aber auskommentiert.
- **Die YouTube-Einbettungen** im Speaking-Abschnitt: ebenfalls mitgezogen,
  aber weiterhin ausgeblendet.
- **Die Drohnen-Demoseiten** unter `public/blog/demos/`. Das sind statische
  Fixtures, keine Astro-Seiten — sie hatten schon vorher keinen Sprunglink
  und wurden nicht angefasst.

## Geprüft

- `npm run verify` (astro check + build + interner Linkcheck): sauber,
  30 Seiten, 2004 interne Links, keine gebrochenen.
- **78 Aufnahmen** unter `screenshots/`: 13 Seiten × 3 Breiten
  (1440 / 768 / 380) × hell und dunkel. Bei jeder einzelnen wurde
  `scrollWidth` gegen `clientWidth` gemessen — **kein waagerechtes Scrollen
  auf keiner Seite, keiner Breite, in keinem Schema.**
- Struktur gegen den Basisstand geprüft: genau ein `<h1>` je Seite,
  **keine neuen Sprünge** in der Überschriftenreihenfolge, Sprunglink auf
  jeder Astro-Seite der erste Link im Body, **null verbliebene
  `shadow-*`-Klassen** im gesamten erzeugten Markup.

## Wo es am schwächsten ist

1. **Der Bereich zwischen 768px und 1024px.** Die zwölfspaltigen Aufteilungen
   greifen jetzt erst ab `lg:` (1024px), weil sie bei 768px zu schmale
   Spalten ergaben. Dadurch ist das Tablet-Layout ehrlich, aber lang: fast
   alles steht untereinander. Ein echter Zwischenschritt — etwa ein
   8-Spalten-Raster für `md:` — wäre die sauberere Antwort.
2. **Der Hero auf sehr breiten Schirmen.** Über rund 1600px wächst der
   Weißraum links über der Aussage stärker als die Aussage selbst, weil das
   Porträt die Zeilenhöhe bestimmt. Ein `max-height` am Porträt oder eine
   Verankerung der Textspalte an der Oberkante wäre hier besser als
   `items-end`.
3. **Die Haarlinien im dunklen Schema.** `ink-100` auf `canvas` ist sehr
   zart; auf einem schlecht kalibrierten Schirm verschwinden die Trenner
   zwischen den Zeilen fast. Ein eigenes `--rule`-Wertepaar (statt der
   Ableitung aus `ink-100`/`ink-200`) wäre der richtige nächste Schritt —
   das ginge auch, ohne die Marke neu einzufärben.
4. **Die Buchvorschauen.** Drei Scans weißer Buchseiten hinter einer
   Haarlinie sehen im dunklen Schema aus wie drei leere Kästen. Sie brauchten
   vorher den Rahmen als Hilfe; jetzt bräuchten sie eher einen eigenen
   gedämpften Untergrund.
5. **Das Kontaktformular.** Es ist das einzige Element, das noch umrandete
   Felder hat. Das ist eine bewusste Entscheidung (ein Eingabefeld, das nicht
   wie eines aussieht, hat versagt), aber es sticht im ansonsten rahmenlosen
   Layout heraus.

## Was ich mit mehr Zeit machen würde

- Ein eigenes `md:`-Raster statt des Sprungs von einspaltig auf zwölfspaltig.
- Ein Haarlinien-Token (`--c-rule-strong` / `--c-rule-soft`), das im dunklen
  Schema etwas kräftiger liegt als die abgeleiteten `ink`-Werte.
- Den Scroll-Spy-Marker in der Kopfleiste an die neue Haarlinienlogik
  angleichen — er nutzt noch dieselbe Farbe wie der Hover-Zustand.
- Das Porträt in zwei Zuschnitten ausliefern (hoch für `lg:`, breit darunter),
  statt einen quadratischen Ausschnitt dreimal unterschiedlich zu beschneiden.
