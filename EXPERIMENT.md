# Experiment 1 — „Petrol & Sand"

Branch: `experimental-version-1` (Basis: `7dbc216` auf `exp`)

Dieser Branch ist ein **reines Farbexperiment**. Das Layout ist unangetastet:
kein verschobener Abschnitt, keine geänderte Abstands- oder Typo-Skala, keine
neue oder entfernte Komponente. Wer den Diff liest, sieht im Wesentlichen
`src/styles/global.css` plus eine Handvoll dekorativer Tönungen. Die Frage, die
dieser Branch isoliert beantworten soll, lautet ausschließlich: **Wie sähe die
Seite in einer anderen Farbe aus?**

---

## Die These

Die bisherige Seite ist kühles, ziemlich gesättigtes Azurblau (`#0072c6`) auf
reinem Weiß, mit blaustichigen Grautönen. Das ist die Defaultfarbe des
Web-Tech-Sektors — sie signalisiert „Software", nicht „Person, die etwas zu
sagen hat".

Dieser Entwurf tauscht das gegen **tiefes Petrol auf warmem Papier**:

* **Marke = Petrol/Teal**, die Farbe von oxidiertem Kupfer oder tiefem Wasser.
  Gedämpfter als das alte Azur, dadurch ruhiger, und für einen IT-Berater
  ungewöhnlich genug, um nach einer Entscheidung auszusehen — ohne unseriös zu
  werden.
* **Neutrale Töne = warm.** Ein Hauch Braun/Oliv im Grau statt des bisherigen
  Blaustichs. Das ist der eigentliche Hebel: warme Grautöne neben einer
  petrolfarbenen Marke lassen eine Seite nach Papier aussehen, kühle Grautöne
  nach Benutzeroberfläche.
* **Kein reines Weiß mehr.** `--c-canvas` ist ein warmes Off-White, `--c-surface`
  liegt eine Spur darüber, `--c-ink-50` eine Spur darunter. Daraus entsteht eine
  echte Schichtung (Band/Fußzeile < Seite < Karte), für die es bisher einen
  Schatten brauchte.
* **Akzente erden statt leuchten.** Amber wird Terrakotta, Emerald wird
  Moos/Salbei.

Gesamteindruck: ruhiger, redaktioneller, weniger gesättigt, warm statt kalt.

### Wie die Paletten entstanden sind

Alle vier Skalen sind in **OKLCH** konstruiert (gleichmäßige Helligkeitsschritte,
kontrollierter Farbton- und Chroma-Verlauf) und erst danach nach sRGB
umgerechnet, inklusive Gamut-Mapping über Chroma-Reduktion. Ein bloßes Drehen
der alten Hex-Werte hätte matschige Mitteltöne ergeben, weil eine Hue-Rotation
in sRGB die wahrgenommene Helligkeit nicht erhält.

Wichtig für die Akzente: Marke und Emerald lagen im Farbton bisher weit
auseinander (Blau vs. Grün) und tun das jetzt nicht mehr — nur noch rund 55°.
Sie unterscheiden sich deshalb bewusst über **Sättigung und Helligkeit**: Petrol
trägt ein Chroma um 0.08, Salbei nur um 0.05, und die hellen Salbei-Stufen
ziehen zusätzlich ins Gelbgrüne, damit `bg-emerald-100` nicht wie ein blasses
`bg-brand-100` aussieht.

---

## Vorher / Nachher — vollständige Token-Tabelle

### Hell

| Token | vorher | nachher |
|---|---|---|
| `--c-brand-50` | `#f0f7ff` | `#f0f9f7` |
| `--c-brand-100` | `#e0effe` | `#def2ed` |
| `--c-brand-200` | `#bae0fd` | `#c0e5dd` |
| `--c-brand-300` | `#7cc7fb` | `#9ad0c7` |
| `--c-brand-400` | `#36abf7` | `#6eb6ac` |
| `--c-brand-500` | `#0d8fe8` | `#42968e` |
| `--c-brand-600` | `#0072c6` | `#277f7a` |
| `--c-brand-700` | `#015aa0` | `#0c6865` |
| `--c-brand-800` | `#064c84` | `#085655` |
| `--c-brand-900` | `#0a406d` | `#054444` |
| `--c-brand-950` | `#072849` | `#032829` |
| `--c-ink-50` | `#f6f7f9` | `#eeece8` |
| `--c-ink-100` | `#ebeef2` | `#e6e4de` |
| `--c-ink-200` | `#d3dae3` | `#d5d1ca` |
| `--c-ink-300` | `#adb9c8` | `#ada9a2` |
| `--c-ink-400` | `#8092a8` | `#848078` |
| `--c-ink-500` | `#61748d` | `#68645d` |
| `--c-ink-600` | `#4d5d75` | `#58534d` |
| `--c-ink-700` | `#404c5f` | `#4b453f` |
| `--c-ink-800` | `#384151` | `#3e3831` |
| `--c-ink-900` | `#1f2733` | `#2a241e` |
| `--c-ink-950` | `#0f141c` | `#130e09` |
| `--c-emerald-50` | `#ecfdf5` | `#f2f6eb` |
| `--c-emerald-100` | `#d1fae5` | `#e4edd9` |
| `--c-emerald-200` | `#a7f3d0` | `#cfdfc1` |
| `--c-emerald-300` | `#6ee7b7` | `#b2c8a5` |
| `--c-emerald-400` | *(fehlte)* | `#92ad89` |
| `--c-emerald-500` | `#10b981` | `#779572` |
| `--c-emerald-600` | *(fehlte)* | `#597758` |
| `--c-emerald-700` | `#047857` | `#466349` |
| `--c-emerald-800` | `#065f46` | `#37513c` |
| `--c-emerald-900` | `#064e3b` | `#29402f` |
| `--c-amber-50` | `#fffbeb` | `#fcf4ee` |
| `--c-amber-100` | `#fef3c7` | `#fbe8da` |
| `--c-amber-200` | `#fde68a` | `#f6d2bc` |
| `--c-amber-300` | `#fcd34d` | `#e7b499` |
| `--c-amber-400` | `#fbbf24` | `#d4987a` |
| `--c-amber-500` | `#f59e0b` | `#c18063` |
| `--c-amber-700` | `#b45309` | `#89543f` |
| `--c-amber-800` | `#92400e` | `#704233` |
| `--c-amber-900` | `#78350f` | `#5a3429` |
| `--c-amber-950` | `#451a03` | `#321a15` |
| `--c-surface` | `#ffffff` | `#fcfbf6` |
| `--c-canvas` | `#ffffff` | `#f7f3ec` |
| `--c-on-fill` | *(neu)* | `#ffffff` |

### Dunkel

| Token | vorher | nachher |
|---|---|---|
| `--c-brand-50` | `#0a2540` | `#142c2d` |
| `--c-brand-100` | `#0d3355` | `#173c3c` |
| `--c-brand-200` | `#14497a` | `#1b5150` |
| `--c-brand-300` | `#1d6aad` | `#266d6a` |
| `--c-brand-400` | `#2f8ad2` | `#3a8d87` |
| `--c-brand-500` | `#4aa8ea` | `#56a9a1` |
| `--c-brand-600` | `#6dbdf2` | `#74beb4` |
| `--c-brand-700` | `#93cff7` | `#90cfc5` |
| `--c-brand-800` | `#b6e0fa` | `#b0e0d6` |
| `--c-brand-900` | `#d5eefd` | `#ccede5` |
| `--c-brand-950` | `#eaf6fe` | `#e3f7f2` |
| `--c-ink-50` | `#171c25` | `#1f292a` |
| `--c-ink-100` | `#1e242f` | `#273132` |
| `--c-ink-200` | `#2b3341` | `#343e3e` |
| `--c-ink-300` | `#3d4859` | `#495252` |
| `--c-ink-400` | `#5b6b83` | `#6b7271` |
| `--c-ink-500` | `#8093ab` | `#8f918f` |
| `--c-ink-600` | `#a3b3c7` | `#adaca8` |
| `--c-ink-700` | `#bcc9d8` | `#c6c4be` |
| `--c-ink-800` | `#d3dce7` | `#dcd9d1` |
| `--c-ink-900` | `#eef2f7` | `#f1ece3` |
| `--c-ink-950` | `#ffffff` | `#ffffff` |
| `--c-emerald-50` | `#06281d` | `#1b2b1f` |
| `--c-emerald-100` | `#083a2a` | `#253a29` |
| `--c-emerald-200` | `#0d5540` | `#344e35` |
| `--c-emerald-300` | `#14855f` | `#4a6848` |
| `--c-emerald-400` | *(fehlte)* | `#65855e` |
| `--c-emerald-500` | `#2fcf95` | `#829f76` |
| `--c-emerald-600` | *(fehlte)* | `#9cb48c` |
| `--c-emerald-700` | `#6ee7b7` | `#b3c5a0` |
| `--c-emerald-800` | `#a7f3d0` | `#cbd8b9` |
| `--c-emerald-900` | `#d1fae5` | `#e0e9d2` |
| `--c-amber-50` | `#2a1c05` | `#32201b` |
| `--c-amber-100` | `#3d2907` | `#472b22` |
| `--c-amber-200` | `#5c3d0a` | `#61392b` |
| `--c-amber-300` | `#8a5c0f` | `#834e38` |
| `--c-amber-400` | `#c08519` | `#9e5f43` |
| `--c-amber-500` | `#e5a72c` | `#c58566` |
| `--c-amber-700` | `#f6c964` | `#e4b196` |
| `--c-amber-800` | `#fbdd97` | `#efcab4` |
| `--c-amber-900` | `#fdecc6` | `#f7dfd0` |
| `--c-amber-950` | `#fef8e7` | `#fdf1e8` |
| `--c-surface` | `#131820` | `#182121` |
| `--c-canvas` | `#0d1117` | `#101818` |
| `--c-on-fill` | *(neu)* | `#071516` |

### Zwei Tokens, die es vorher nicht gab

`--color-emerald-400` und `--color-emerald-600` standen nicht im `@theme`-Block.
`hover:border-emerald-400` und der Knopf `bg-emerald-600` fielen deshalb auf
Tailwinds eingebautes Smaragdgrün zurück und schalteten im Dark Mode gar nicht
um. Mit der gedämpften Moos-Skala wäre dieser Ausrutscher sofort sichtbar
gewesen, deshalb sind beide Stufen jetzt definiert. **Das ist ein Bugfix, keine
Designentscheidung — er gehört unabhängig von diesem Experiment in die
Produktion.**

### `--c-on-fill`: eine neue semantische Rolle (bitte bewusst entscheiden)

Im dunklen Schema kippt jede Markenfläche ins Helle: `bg-brand-700` wird zu
einem hellen Petrol. Das Markup schreibt darauf aber `text-white` — 31 Knöpfe,
die Sprungmarke „Zum Inhalt springen", die beiden CTA-Kästen. Weiß auf
Hellpetrol sind **1,6:1** und damit unlesbar.

Dieser Fehler steckt bereits in der bisherigen Fassung (dort weiß auf hellblau),
und er ist durch Farbwahl allein *nicht* behebbar: `brand-700` ist gleichzeitig
Linkfarbe auf dunklem Grund und Knopffläche für weiße Schrift, und diese beiden
Rollen schließen sich rechnerisch aus. Damit eine Farbe *X* als Link auf dunklem
Grund 4,5:1 erreicht, braucht sie Luminanz ≥ 0,22; damit Weiß auf *X* 4,5:1
erreicht, ≤ 0,18. Es gibt kein *X*.

Der Entwurf löst das mit einem eigenen Token `--c-on-fill` („Schrift auf einer
gefüllten Marken-/Akzentfläche") plus **einer** kurzen Regel in `global.css`,
die genau die vorkommenden Kombinationen abdeckt (`bg-brand-600/700/800`,
`bg-emerald-600`, `from-brand-700`, die Sprungmarke). Im hellen Schema ist
`--c-on-fill` schlicht Weiß, es ändert sich also nichts; im dunklen wird es das
dunkelste Petrol.

Das ist der einzige Punkt, an dem dieser Branch die *Bedeutung* einer
Markup-Klasse verschiebt, statt nur einen Wert zu tauschen. Es passiert
ausschließlich in `global.css`, ist dort in einem Block dokumentiert und lässt
sich durch Löschen dieses Blocks vollständig zurücknehmen. **Wer nur die Farben
übernehmen will, kann ihn weglassen — muss dann aber wissen, dass der Dark Mode
unlesbare Knöpfe hat.**

---

## Gemessene Kontraste

Berechnet nach WCAG 2.x (relative Luminanz aus linearisiertem sRGB), nicht
geschätzt. Das Prüfskript deckt **51 Paare je Schema, 102 insgesamt** ab; hier
die geforderten plus die kritischen. Ziel: Fließtext 4,5:1, große Schrift und
UI-Ränder 3:1.

### Hell

| Paar | Vordergrund auf Hintergrund | Ratio | Ziel |
|---|---|---|---|
| Fließtext `ink-700` auf `canvas` | `#4b453f` / `#f7f3ec` | **8,54:1** | 4,5 ✓ |
| Fließtext `ink-700` auf `ink-50` | `#4b453f` / `#eeece8` | **8,01:1** | 4,5 ✓ |
| Fließtext `ink-700` auf `surface` | `#4b453f` / `#fcfbf6` | **9,12:1** | 4,5 ✓ |
| Überschrift `ink-900` auf `canvas` | `#2a241e` / `#f7f3ec` | **13,86:1** | 4,5 ✓ |
| Überschrift `ink-900` auf `surface` | `#2a241e` / `#fcfbf6` | **14,80:1** | 4,5 ✓ |
| Lead `ink-600` auf `canvas` | `#58534d` / `#f7f3ec` | **6,88:1** | 4,5 ✓ |
| Lead `ink-600` auf `surface` | `#58534d` / `#fcfbf6` | **7,35:1** | 4,5 ✓ |
| Gedämpft `ink-500` auf `canvas` | `#68645d` / `#f7f3ec` | **5,32:1** | 4,5 ✓ |
| Gedämpft `ink-500` auf `surface` | `#68645d` / `#fcfbf6` | **5,68:1** | 4,5 ✓ |
| Gedämpft `ink-500` auf `ink-50` (Fußzeile) | `#68645d` / `#eeece8` | **4,99:1** | 4,5 ✓ |
| Link `brand-700` auf `canvas` | `#0c6865` / `#f7f3ec` | **5,96:1** | 4,5 ✓ |
| Link `brand-700` auf `ink-50` | `#0c6865` / `#eeece8` | **5,59:1** | 4,5 ✓ |
| Link `brand-700` auf `surface` | `#0c6865` / `#fcfbf6` | **6,37:1** | 4,5 ✓ |
| Link-Hover `brand-900` auf `canvas` | `#054444` / `#f7f3ec` | **9,91:1** | 4,5 ✓ |
| Knopfschrift auf `brand-700` | `#ffffff` / `#0c6865` | **6,60:1** | 4,5 ✓ |
| Knopfschrift auf `brand-800` (Hover) | `#ffffff` / `#085655` | **8,49:1** | 4,5 ✓ |
| Knopfschrift auf `brand-600` (Kachel) | `#ffffff` / `#277f7a` | **4,77:1** | 4,5 ✓ |
| Knopfschrift auf `emerald-600` | `#ffffff` / `#597758` | **4,99:1** | 4,5 ✓ |
| Knopfschrift auf `emerald-700` (Hover) | `#ffffff` / `#466349` | **6,68:1** | 4,5 ✓ |
| CTA-Text `brand-100` auf `brand-700` | `#def2ed` / `#0c6865` | **5,66:1** | 4,5 ✓ |
| Abschluss-Badge `emerald-900` auf `emerald-100` | `#29402f` / `#e4edd9` | **9,32:1** | 4,5 ✓ |
| Text `amber-800` auf `amber-50` | `#704233` / `#fcf4ee` | **7,68:1** | 4,5 ✓ |
| Kleinschrift `ink-400` auf `canvas` | `#848078` / `#f7f3ec` | **3,56:1** | 3 ✓ |
| Fokusring `brand-500` auf `canvas` | `#42968e` / `#f7f3ec` | **3,17:1** | 3 ✓ |
| Fokusring `brand-500` auf `surface` | `#42968e` / `#fcfbf6` | **3,39:1** | 3 ✓ |
| Schichtung `surface` ↔ `canvas` | `#fcfbf6` / `#f7f3ec` | 1,07:1 | dezent, gewollt |
| Schichtung `surface` ↔ `ink-50` | `#fcfbf6` / `#eeece8` | 1,14:1 | dezent, gewollt |
| Haarlinie `ink-200` auf `surface` | `#d5d1ca` / `#fcfbf6` | 1,47:1 | dekorativ |

### Dunkel

| Paar | Vordergrund auf Hintergrund | Ratio | Ziel |
|---|---|---|---|
| Fließtext `ink-700` auf `canvas` | `#c6c4be` / `#101818` | **10,33:1** | 4,5 ✓ |
| Fließtext `ink-700` auf `ink-50` | `#c6c4be` / `#1f292a` | **8,55:1** | 4,5 ✓ |
| Fließtext `ink-700` auf `surface` | `#c6c4be` / `#182121` | **9,42:1** | 4,5 ✓ |
| Überschrift `ink-900` auf `canvas` | `#f1ece3` / `#101818` | **15,31:1** | 4,5 ✓ |
| Überschrift `ink-900` auf `surface` | `#f1ece3` / `#182121` | **13,96:1** | 4,5 ✓ |
| Lead `ink-600` auf `canvas` | `#adaca8` / `#101818` | **7,93:1** | 4,5 ✓ |
| Lead `ink-600` auf `surface` | `#adaca8` / `#182121` | **7,23:1** | 4,5 ✓ |
| Gedämpft `ink-500` auf `canvas` | `#8f918f` / `#101818` | **5,67:1** | 4,5 ✓ |
| Gedämpft `ink-500` auf `surface` | `#8f918f` / `#182121` | **5,17:1** | 4,5 ✓ |
| Gedämpft `ink-500` auf `ink-50` (Fußzeile) | `#8f918f` / `#1f292a` | **4,70:1** | 4,5 ✓ |
| Link `brand-700` auf `canvas` | `#90cfc5` / `#101818` | **10,22:1** | 4,5 ✓ |
| Link `brand-700` auf `ink-50` | `#90cfc5` / `#1f292a` | **8,46:1** | 4,5 ✓ |
| Link `brand-700` auf `surface` | `#90cfc5` / `#182121` | **9,32:1** | 4,5 ✓ |
| Link-Hover `brand-900` auf `canvas` | `#ccede5` / `#101818` | **14,42:1** | 4,5 ✓ |
| Knopfschrift auf `brand-700` (via `on-fill`) | `#071516` / `#90cfc5` | **10,57:1** | 4,5 ✓ |
| Knopfschrift auf `brand-800` (Hover) | `#071516` / `#b0e0d6` | **12,84:1** | 4,5 ✓ |
| Knopfschrift auf `brand-600` (Kachel) | `#071516` / `#74beb4` | **8,66:1** | 4,5 ✓ |
| Knopfschrift auf `emerald-600` | `#071516` / `#9cb48c` | **8,26:1** | 4,5 ✓ |
| Knopfschrift auf `emerald-700` (Hover) | `#071516` / `#b3c5a0` | **10,12:1** | 4,5 ✓ |
| CTA-Text `brand-100` auf `brand-700` | `#173c3c` / `#90cfc5` | **6,82:1** | 4,5 ✓ |
| Abschluss-Badge `emerald-900` auf `emerald-100` | `#e0e9d2` / `#253a29` | **9,76:1** | 4,5 ✓ |
| Text `amber-800` auf `amber-50` | `#efcab4` / `#32201b` | **10,14:1** | 4,5 ✓ |
| Kleinschrift `ink-400` auf `canvas` | `#6b7271` / `#101818` | **3,66:1** | 3 ✓ |
| Fokusring `brand-500` auf `canvas` | `#56a9a1` / `#101818` | **6,51:1** | 3 ✓ |
| Fokusring `brand-500` auf `surface` | `#56a9a1` / `#182121` | **5,93:1** | 3 ✓ |
| Schichtung `surface` ↔ `canvas` | `#182121` / `#101818` | 1,10:1 | dezent, gewollt |
| Haarlinie `ink-200` auf `surface` | `#343e3e` / `#182121` | 1,49:1 | dekorativ |

**Ergebnis: alle 102 geprüften Paare erfüllen ihr Ziel.** Die beiden knappsten
Werte — `ink-500` auf `ink-50` mit 4,99:1 (hell) bzw. 4,70:1 (dunkel) — sind
bewusst so gesetzt: `ink-500` ist die gedämpfte Kleinschrift in der Fußzeile,
und die Fußzeile ist die dunkelste helle Fläche der Seite. Zwei Werte wurden
während der Konstruktion gezielt nachgezogen, um genau diese Grenzen zu halten:
`brand-500` (Fokusring, hell) und `amber-400` im dunklen Schema (das
Vorschau-Banner, das sonst bei 4,01:1 gelandet wäre).

---

## Prüfungen

* `npm run verify` (astro check + astro build + interner Linkcheck) läuft sauber:
  **0 Fehler, 0 Warnungen**, 51 Seiten und 2004 interne Links geprüft, keine
  gebrochenen Links. `check:links --live` wurde nicht ausgeführt.
* **Kein seitliches Scrollen bei 380 px.** Gemessen mit echtem 380-px-Viewport
  (Headless-Chrome klemmt Fenster bei 500 px, deshalb über einen gleich breiten
  iframe): `/`, `/schools/`, `/blog/`, `/companies/`, `/impressum/` und ein
  Blogbeitrag mit Tabellen und Mermaid-Diagrammen ergeben jeweils
  `scrollWidth = clientWidth = 380`.
* Sichtprüfung in **beiden** Schemata über Headless-Chrome-Screenshots:
  `screenshots/` enthält `{home, schools, blog, companies, impressum,
  blogpost}-{light,dark}.png` sowie `home-380-{light,dark}.png`.

---

## Was bewusst *nicht* angefasst wurde

* **Layout, Markup, Struktur.** Keine verschobenen Abschnitte, keine geänderte
  Abstands- oder Typo-Skala, keine neue oder gelöschte Komponente. Die einzigen
  Änderungen außerhalb von `global.css` sind Farbwerte.
* **Der Text.** Kein deutscher oder englischer Satz, keine Überschrift, kein
  Alt-Text, keine Rechtsseite wurde angefasst.
* **Die Token-Architektur.** `@theme` zeigt weiter auf `--c-*`, `:root` hält
  Hell, `:root[data-theme="dark"]` Dunkel. Die Invertierungs-Konvention gilt
  unverändert: `ink-900` bleibt „stärkster Textkontrast", `ink-50` bleibt
  „dezenteste Fläche". Keine einzige `dark:`-Klasse im Markup.
* **Bilder, Favicons, Logos.** Das Bildungs-Favicon (`favicon-2.svg`) ist ein
  SVG mit fest eingebauten Farben (Schiefer + `#14B8A6` Teal). Es passt zufällig
  besser zu Petrol als zum alten Azur, wurde aber nicht angerührt — Assets sind
  nicht Teil dieses Experiments. Ebenso die OG-Bilder (`/og-default.png`), die
  weiterhin die alte Markenfarbe tragen.
* **Schatten, Radien, Rahmenstärken.** Unverändert. Die Schichtung kommt hier
  aus dem Farbton, nicht aus zusätzlichen Schatten — aber die bestehenden
  `shadow-sm` stehen noch da.

### Was außerhalb von `global.css` doch geändert wurde, und warum

1. `src/layouts/Layout.astro` — die beiden `<meta name="theme-color">` codierten
   `#015aa0` / `#0d1117` hart; jetzt `#0c6865` / `#101818`.
2. `src/pages/blog/[slug].astro` — Mermaid nimmt nur Literale, nicht
   `var(--…)`. Die 20 Diagrammfarben (hell und dunkel) sind auf die neuen Token
   gezogen und jeweils mit dem Tokennamen kommentiert. Die Linienfarbe hell
   steht jetzt auf `brand-600` statt `brand-400`: das gedämpfte Petrol trägt auf
   warmem Papier weniger als das alte Azur, eine Kante muss aber sichtbar
   bleiben.
3. `src/components/Hero.astro` und `src/education/components/Hero.astro` — nur
   die dekorativen Tönungen. Bei der geringeren Sättigung verschwanden die
   Blobs fast: `opacity-60 → 70`, `bg-brand-200/40 → /55`, und der zweite Blob
   wechselt von `brand-100/60` auf `brand-200/45`, weil `brand-100` praktisch
   deckungsgleich mit dem Canvas geworden wäre. Der Porträt-Schimmer geht von
   `from-brand-200/50 to-brand-100/30` auf `from-brand-300/45 to-brand-200/30`.
   Kein DOM-Knoten wurde dabei angefasst.

---

## Wo der Entwurf am schwächsten ist — ehrlich

1. **Der Konflikt um `brand-700` ist umgangen, nicht gelöst.** `--c-on-fill`
   plus eine CSS-Regel ist eine Notlösung für ein Architekturproblem: eine
   Farbe, die gleichzeitig Linkfarbe *und* Knopffläche ist, kann im dunklen
   Schema nicht beides bedienen. Sauber wäre ein eigenes Rollen-Token im Markup
   (`bg-brand-fill` / `text-on-fill`) statt `bg-brand-700 text-white`. Das ist
   eine Markup-Änderung und gehört damit nicht in diesen Branch.
2. **Die Schichtung `surface`/`canvas` ist sehr dezent (1,07:1).** Auf einem
   guten Schirm liest sie sich als Papierlage, auf einem billigen TN-Panel oder
   bei hoher Umgebungshelligkeit möglicherweise gar nicht — dann fällt die Seite
   optisch auf „ein Weiß" zurück und die Karten brauchen wieder ihren Schatten.
   Mehr Abstand wäre möglich, erzeugt aber an der Kante zwischen Hero
   (`to-canvas`) und dem ersten `bg-surface`-Abschnitt eine sichtbare Naht.
3. **`ink-400` bleibt der schwächste Text.** 3,56:1 hell, 3,66:1 dunkel — das
   reicht für UI-Grafik, nicht für Fließtext. Betroffen sind die
   „in German"-Marker (0,65 rem) und Eingabe-Platzhalter. Besser als vorher
   (2,85:1), aber immer noch keine AA-Fließtextfarbe. Wer diese Marker als
   Inhalt betrachtet, sollte im Markup auf `ink-500` gehen.
4. **Petrol und Salbei sind sich nahe.** Der ursprüngliche Entwurf setzte auf
   Blau vs. Grün — zwei Familien, die niemand verwechselt. Jetzt trennen sie nur
   Sättigung und Helligkeit. In den Abschluss-Kacheln funktioniert das (siehe
   `screenshots/home-light.png`), aber es ist fragiler: wer später eine weitere
   Fläche in `emerald-100` neben eine in `brand-100` setzt, muss hinsehen. Bei
   Rot-Grün-Sehschwäche dürfte der Unterschied weitgehend verschwinden — die
   Seite kodiert allerdings nirgends Bedeutung allein über diese beiden Farben.
5. **Der CTA-Kasten wird im Dunkelmodus zu einer hellen Fläche auf dunkler
   Seite.** Das ist die bestehende Invertierungs-Konvention, nicht neu, aber im
   Petrol fällt es stärker auf als im Blau, weil die helle Petrolfläche mehr
   „ausschlägt". Zu sehen in `screenshots/companies-dark.png`.
6. **Die OG-Bilder passen nicht mehr.** Beim Teilen zeigt die Seite weiterhin
   ein azurblaues Vorschaubild. Reine Bildarbeit, hier nicht in Reichweite.

## Was ich mit mehr Zeit machen würde

* Die Rollen-Token im Markup einführen (Punkt 1) und `bg-brand-700 text-white`
  durch eine semantische Knopf-Klasse ersetzen. Das räumt den einzigen Hack
  dieses Branches weg und behebt gleichzeitig einen echten Dark-Mode-Bug der
  Produktion.
* Die Paletten als OKLCH statt Hex ausliefern (`oklch(0.47 0.078 191)`). Alle
  Zielbrowser können das, die Werte blieben lesbar und ableitbar, und ein
  Wide-Gamut-Display bekäme das echte Petrol statt der sRGB-Näherung.
* Ein Favicon- und OG-Bild-Set in Petrol.
* Die Haarlinien (`ink-100`/`ink-200`, 1,2–1,5:1) gegen eine leicht kräftigere
  Stufe prüfen: auf warmem Papier tragen sie weniger als auf Weiß, einige
  Kartenränder sind jetzt sehr leise.

---

## Das Werkzeug

Die Skalen wurden nicht von Hand geraten. Das Generator- und Prüfskript
(OKLCH → sRGB mit Gamut-Mapping, plus WCAG-Kontrastmatrix über alle 102 Paare)
lag im Scratchpad der Sitzung und ist bewusst nicht Teil dieses Branches — es
ist Arbeitsmaterial, kein Produktionscode. Die Konstruktionsparameter stehen
vollständig in den Kommentaren in `src/styles/global.css`.
