# Experiment 4 — Das Dokument als Instrument

Zweig: `experimental-version-4`, Basis `7dbc216`.
Eines von vier parallelen Layout-Experimenten. **Nur das Layout ist neu.
Die Farbpalette und jeder einzelne Satz bleiben unverändert.**

---

## Die These

Die bisherige Startseite ist ein Stapel gleich breiter, zentrierter Kästen:
`max-w-6xl`, Überschrift mittig, darunter ein Raster weicher Karten mit runden
Ecken und Schlagschatten. Sie ist angenehm — und vollkommen austauschbar. Man
kann sie nicht *benutzen*: es gibt keinen Ort, an dem man sieht, wo man ist, wie
viel noch kommt oder wie die Teile zueinander stehen.

Dieses Experiment dreht das um: **die Gliederung wird sichtbar und tragend.**
Die Seite ist ein gesetztes Dokument mit Inhaltsverzeichnis, nummerierten
Abschnitten, einem gemeinsamen Raster und Haarlinien, die dieses Raster zeigen.
Nicht Luft trennt die Teile, sondern Struktur. Karten werden zu Rasterzellen,
Prospektblöcke werden zu Verzeichniszeilen, der Hero wird zur Titelseite.

Drei Regeln, aus denen alles Übrige folgt:

1. **Linksbündig.** Keine zentrierte Überschrift, kein zentrierter Fließtext,
   keine zentrierte Schaltflächenreihe. Alles hängt an einer gemeinsamen Kante.
2. **Rechtwinklig.** Kein Eckenradius, kein Schlagschatten, kein Farbverlauf.
   Tiefe entsteht aus Haarlinien und Flächen (Apple HIG: „hairlines and
   translucency over drop shadows").
3. **Beschriftet.** Jeder Block trägt ein Mikro-Label in Monospace: versal,
   gesperrt, klein. Dieselbe Familie trägt die Abschnittsnummern und die
   Datumsspalten — Ziffern sind hier ein gestaltetes Element, kein Beiwerk.

Zur Abgrenzung: Experiment 3 geht bewusst in die entgegengesetzte Richtung
(luftig, redaktionell, Weißraum als Hierarchie). Wenn beide nebeneinander
liegen, sollen sie sich gegenseitig beantworten, nicht ähneln.

---

## Neue Bausteine

| Datei | Was sie tut |
|---|---|
| `src/components/DocGrid.astro` | Der Rahmen der Startseite: ab 1024px ein Raster aus 14rem Seitenspalte und Inhaltsspalte. Nimmt die Gliederung als Daten entgegen. |
| `src/components/SectionRail.astro` | Das mitlaufende Abschnittsverzeichnis. **Ein** Markup, zwei Erscheinungsformen (siehe unten). |
| `src/components/outline.ts` | Die Gliederung als Datenstruktur plus `nummernGeber()`. Verzeichnis und Abschnittsnummern kommen aus derselben Liste und können nicht auseinanderlaufen. |

Dazu vier Rasterprimitive als CSS-Klassen in `src/styles/global.css`
(`.doc`, `.doc-section`, `.cellgrid`, `.recordlist`/`.record`, `.label`) —
einmal definiert statt als Klassenwolke in zehn Seiten kopiert.

### Das Verzeichnis läuft mit, ohne einen zweiten Beobachter

Der Scroll-Spy in `SiteHeader.astro` markiert alles, was `data-spy` trägt. Die
Einträge der Seitenspalte tragen dieselben Marken — **es gibt also weiterhin
genau einen Beobachter**, und Kopfzeile und Seitenspalte können nicht
widersprüchlich leuchten. Dabei ist ein bestehender Fehler aufgefallen und
behoben: die Abschnitte wurden in der Reihenfolge der *Menüeinträge* sortiert,
nicht in Dokumentreihenfolge. Solange nur die Kopfzeile Marken setzte, fiel das
kaum auf; mit dem Verzeichnis, das mehr Abschnitte kennt, wäre „der oberste
sichtbare gewinnt" schlicht falsch geworden. Jetzt wird per
`compareDocumentPosition` sortiert.

### Der Bruch unter 1024px ist gestaltet, nicht übrig

Die Seitenspalte kann auf dem Handy nicht überleben. Statt sie auszublenden,
wird aus derselben Liste eine **waagerecht scrollende Chipleiste**, die unter
der Kopfzeile klebt: gleiche Nummern, gleiche Beschriftungen, gleiche
Markierung (2px-Kante, jetzt unten statt rechts). Ein kleines Skript schiebt
den aktiven Chip in den sichtbaren Bereich, wenn er herausgelaufen ist — über
`scrollLeft` und nicht über `scrollIntoView`, weil letzteres die ganze Seite
mitscrollen kann. `prefers-reduced-motion` schaltet das Gleiten ab.

Bewusst **ein** DOM-Baum für beide Formen: zwei hätten zwei
Navigations-Landmarken mit demselben Namen ergeben und zwei Stellen, an denen
dieselbe Liste gepflegt werden müsste.

---

## Das Haarlinien-Token

Ein Layout, dessen Struktur von Linien getragen wird, steht und fällt damit,
ob man die Linien sieht. `border-ink-200` schafft auf Weiß **1,4:1** — als
weiche Kastenkante genügt das, als Rasterlinie nicht (WCAG 1.4.11 verlangt 3:1
für bedeutungstragende UI-Grenzen).

Deshalb gibt es zwei neue semantische Tokens, in derselben Architektur wie alles
andere (`--c-*` in `:root`, im Dunkelschema überschrieben, über `@theme` auf
Tailwind-Namen gelegt):

| Token | hell | dunkel | gemessen |
|---|---|---|---|
| `--c-rule` (tragende Rasterlinie) | `#7a8a9e` | `#6b7c95` | hell 3,5:1 auf `surface`, 3,3:1 auf `ink-50`; dunkel 4,2:1 bzw. 4,0:1 |
| `--c-rule-soft` (Zeilentrenner zweiter Ordnung) | `#c3ccd8` | `#333d4d` | leiser, steht immer neben einer Linie erster Ordnung |

`border-ink-200` bleibt, wo es eine weiche Kante sein soll. Die Palette selbst
ist unangetastet — es kommt kein neuer Farbton dazu, nur zwei Graustufen aus
dem vorhandenen Bereich mit einer eigenen Bedeutung.

---

## Abschnitt für Abschnitt

**Kopfzeile** (`SiteHeader.astro`) — feste Höhe (`--header-h`, 4,25rem) statt
Innenabstand, damit ein Navigationseintrag bis an die Unterkante reicht und
seine 2px-Markierung *auf* der Rasterlinie liegt statt darüber zu schweben.
Markenzeichen quadratisch, Aufklappmenü als Rasterfeld ohne Schatten,
Berührungsziele auf 44px gebracht (Menüknopf, Thema-Umschalter, Sprachwechsel,
jeder Menüeintrag).

**Masthead** (`Hero.astro`) — war ein Farbverlauf mit zwei weichgezeichneten
Kreisen und einem schwebenden, abgerundeten Porträtquadrat. Jetzt: Mikro-Label,
Haarlinie, der Name als Titel über die volle Breite (bis 8xl), Haarlinie, dann
zwei Felder auf gemeinsamer Kante — links Vorspann, Arbeitgeberzeile und
Schaltfläche, rechts das Porträt als Rasterfeld mit derselben Kante wie jede
andere Zelle.

**Abschnitt** (`Section.astro`) — der eigentliche Hebel, weil fünf Seiten ihn
benutzen. Oben eine durchgehende Haarlinie; innen zwei Spalten: links und
schmal (13,5rem) Nummer, Label und Überschrift, rechts und breit Vorspann und
Inhalt. Der Kopf klebt mit, so dass bei einem langen Abschnitt sichtbar bleibt,
worüber man liest. Der Umbruchpunkt ist eine **Container-Query**, keine Media
Query: mit Seitenspalte hat ein Abschnitt deutlich weniger Platz als ohne, und
eine Fensterbreite würde das verwechseln und bei 1024px zwei Spalten in 460px
pressen.

**01 Überblick** — die vier Bereiche waren eine Liste gerundeter Zeilen in einem
Kasten; jetzt Verzeichniszeilen, die farbige Bereichsmarke als volle
Spaltenhöhe am Zeilenanfang.

**02 Über mich** — der „Hintergrund" war eine Anordnung von sieben frei
stehenden Kästen, deren Unterkanten nur zufällig zusammenpassten. Jetzt eine
Tabelle: eine Zeile pro Strang, links die Bezeichnung als Mikro-Label, rechts
die Abschlüsse als gleich große Rasterfelder. Als Daten, nicht als
siebenfach kopiertes Markup.

**03 Speaking** — sechs Karten werden sechs Rasterzellen (`.cellgrid`: 1px
Abstand, der den Rahmenhintergrund zeigt und dadurch selbst zur Linie wird —
keine doppelten Kanten, jede Spaltenzahl möglich). Consulting-Block als flache
Fläche mit 2px-Oberkante statt gerundeter Box.

**04 Bildung** — Zielgruppenhinweis und Workshop-Zellen im selben Raster, das
Mikro-Label führt jetzt die Überschrift an statt ihr zu folgen.

**05 Software** — ein Feld mit 2px-Oberkante in Amber, Adresse in Monospace.

**06 Publikationen** — das Buch bleibt ein zweispaltiges Feld; die beiden Paper
waren zwei fette Karten und sind jetzt **Datensätze**: links die Kennung in der
Monospalte, rechts Titel, Einordnung und Belege.

**07 Blog** — drei gleich hohe Kacheln für drei unterschiedlich lange Titel
erzeugten vor allem Leerraum. Jetzt Verzeichniszeilen mit durchlaufender
Datumsspalte (tabellarische Ziffern).

**08 Kontakt / 09 Presse** — Formular und Direktkontakt nebeneinander,
Kontaktwege und Downloads als Datensatzzeilen mit Mikro-Label-Spalte.

**Weitere Seiten** — `/companies/` (Grundlagen als nummeriertes Verzeichnis,
Hochschulblock als gerahmter Bereich statt getönter Box), `/individuals/`
(vier nummerierte Zellen, weil die Bausteine aufeinander aufbauen),
`/schools/` (Preistabelle als echte Tabelle mit Versalienkopf und
rechtsbündiger Honorarspalte, Buchungsschritte mit `01/02/03` statt Kreisen),
`/schools/insights/`, Workshop- und Blog-Detailseiten (Titelseiten in derselben
Form), `/blog/` (Beitragsliste als Verzeichnis, Filter als eckige Schalter),
`/404`, `/thank-you/` (aus zentrierten Seiten werden linksbündige Meldungen im
Raster), Fußzeile (Bereichsliste mit Haarlinien, gleiche Rasterbreite).

Die Abschluss-Handlungsaufforderungen auf `/companies/`, `/individuals/` und
`/schools/` waren Farbverläufe (`from-brand-700 to-brand-900`); sie sind jetzt
flache `bg-brand-800`-Flächen. Der Farbwert kommt aus der bestehenden Palette.

---

## Was sonst noch in `global.css` dazukam

- `--header-h` und `--railbar-h` als geteilte Maße, damit Anker, Chipleiste und
  `scroll-margin-top` dieselbe Zahl benutzen statt sie fünfmal zu raten.
- `--font-mono` als bewusst gesetzte Schrift für Nummern, Labels und
  Datumsspalten (tabellarische Ziffern sind der Grund).
- Ein sichtbarer `:focus-visible`-Ring auf **allem**, was Fokus bekommen kann.
  Vorher hing das an einzelnen `focus:ring`-Klassen und fehlte auf den meisten
  Links.
- `prefers-reduced-motion`: schaltet Übergänge, Animationen **und** das bisher
  bedingungslose `scroll-behavior: smooth` ab.
- Fließtext in `.prose-content` auf 17px (HIG-Untergrenze für Lesetext auf
  Armlänge). Der Rest der Seite ist dichter geworden — der Lesetext nicht.

`src/education/components/Section.astro` war eine byteidentische Kopie von
`src/components/Section.astro`. Zwei Kopien desselben Rasterbausteins wären beim
ersten Umbau auseinandergelaufen — genau das wäre hier passiert. Die Datei
bleibt als Einstiegspunkt des Bereichs bestehen, reicht aber an die geteilte
Komponente durch.

---

## Der Text ist unangetastet

Jeder deutsche und englische Satz, jede Überschrift, jeder Listenpunkt, jeder
Linktext, jeder Alt-Text, jede Formularbeschriftung und beide Rechtsseiten sind
**wortgleich**. Blöcke wurden umgruppiert und umsortiert, nicht umformuliert.

Nachgewiesen, nicht behauptet: ein Skript vergleicht den sichtbaren Text plus
alle `alt`-, `aria-label`- und `placeholder`-Werte aller 51 gebauten Seiten
gegen den Basis-Build, als Multimenge. Ergebnis — **kein einziger entfernter
oder geänderter Satz auf keiner Seite.** Die einzigen Unterschiede sind
Hinzufügungen, und zwar ausschließlich:

- die Abschnittsnummern `01`–`09` als typografische Elemente,
- die Einträge des Abschnittsverzeichnisses (sie benutzen die **bestehenden**
  Mikro-Labels wortgleich, erscheinen im Vergleich nur als zweites Vorkommen),
- auf `/schools/` die Buchungsschritte `1 2 3`, neu gesetzt als `01 02 03`,
- ein `aria-label` für die neue Navigations-Landmarke
  („Abschnitte dieser Seite" / „Sections on this page").

---

## Was bewusst liegen blieb

- **Die Palette.** Kein `--c-*`-Farbwert wurde umgefärbt. Die beiden neuen
  Tokens sind Graustufen mit eigener Bedeutung, kein neuer Markenton. Zweig 1
  und 2 testen Farbe; wenn hier auch die Farbe neu wäre, könnte der Eigentümer
  nicht sagen, worauf er reagiert.
- **Die Inhaltsarchitektur.** Gleiche Abschnitte, gleiche Reihenfolge, gleiche
  `id`s — die Anker aus Navigation, Fußzeile und `consts.ts` greifen unverändert.
- **Der auskommentierte Aktuelles-Abschnitt** bleibt auskommentiert, wurde aber
  im Kommentar auf das neue Datensatz-Markup mitgezogen, damit er beim
  Reaktivieren nicht aus der Zeit fällt.
- **Die Seitenspalte gibt es nur auf `/` und `/en/`.** `/schools/` hat ihre fünf
  Abschnitte schon im Bereichsmenü; ein zweites Verzeichnis daneben wäre
  Doppelung. Die Nummerierung bekommt sie trotzdem.

---

## Bekannt offen (Stand dieses ersten Commits)

Der Zweig ist gebaut, geprüft und lauffähig; die folgenden Punkte waren als
zweiter Durchgang eingeplant und stehen hier, damit sie nicht untergehen:

1. **Wortmarke bei 380px.** „Felix Paul persönlich" bricht in der Kopfzeile um
   und die erste Zeile wird von der festen Kopfhöhe abgeschnitten. Braucht eine
   kleinere Schriftgröße unterhalb `sm` und `whitespace-nowrap`.
2. **Formularrahmen.** Die Eingabefelder tragen noch `border-ink-200` und wirken
   neben dem übrigen Raster blass — sie gehören auf `border-rule`.
3. **Screenshots** unter `screenshots/`.

---

## Wo das Layout schwach ist

- **Die schmale Kopfspalte ist ein Weißraum-Risiko.** Bei einem kurzen Abschnitt
  stehen links zwei Zeilen und rechts daneben nichts. Das ist Schweizer
  Satzpraxis und gewollt — aber es ist die Stelle, an der sich die Geister
  scheiden werden.
- **Zwei geschachtelte asymmetrische Raster kosten Breite.** Seitenspalte plus
  Abschnittskopf lassen bei 1024px wenig für den Inhalt übrig; deshalb greift
  die Kopfspalte erst ab 52rem Containerbreite, und dreispaltige Zellraster erst
  ab `xl`. Zwischen 1024 und 1280px ist die Seite dadurch eher zweispaltig als
  dreispaltig.
- **Die Chipleiste ist ein zweites klebendes Element.** Kopfzeile plus Leiste
  belegen auf dem Handy rund 116px Höhe. Vertretbar, aber es ist der teuerste
  Teil des Entwurfs.
- **Die Dichte ist eine Haltung.** Wer die alte, freundlich-luftige Seite mochte,
  wird das hier als streng empfinden. Das ist der Punkt des Experiments — aber
  es ist eine Entscheidung, keine Verbesserung.
