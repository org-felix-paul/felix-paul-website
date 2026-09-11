# Experiment 2 — Hartes Licht, ein lauter Akzent

Zweig: `experimental-version-2`, abgezweigt von `7dbc216`.

Einer von vier Gestaltungsversuchen für felix-paul.de. Dieser hier isoliert
**eine einzige Frage**: *Was passiert, wenn die Seite deutlich kontrastreicher
wird?* Layout, Typografie, Abstandsraster, Reihenfolge der Abschnitte, jeder
Satz Text — alles bleibt, wie es war. Geändert wird ausschließlich Farbe,
Kantenstärke und Tönung.

---

## Die These

Apples erstes Prinzip ist **Klarheit**. Die Produktionsfassung setzt es weich
um: Azurblau auf Weiß, kühle Blaugrautöne, Haarlinien in `ink-200`, die auf
Weiß bei 1,41:1 praktisch verschwinden, weiche Farbverlaufs-Wolken und
Schlagschatten, die die Trennarbeit übernehmen. Eine Karte ist dann keine
Karte, sondern ein Fleck, den ein Schatten zusammenhält.

Dieser Zweig nimmt Klarheit wörtlich:

1. **Kanten statt Schatten.** Jede Linie, die im Markup Struktur trägt, hält
   mindestens 3:1 gegen ihren Grund. Eine Karte ist als Karte erkennbar, das
   Tabellengitter als Gitter — auch ohne Schatten. Die beiden großen
   Bildschatten (`shadow-xl`, `shadow-lg`) sind durch `ring-2` ersetzt.
2. **Fließtext auf AAA.** Nicht 4,5:1, sondern über 14:1. Überschriften über
   18:1. Der Linkton über 7,7:1 — in beiden Schemata.
3. **Ein lauter Akzent.** Statt Azurblau ein gesättigtes **Indigo-Violett**.
   Es ist auf Weiß eine AAA-Linkfarbe *und* trägt weiße Knopfschrift mit
   demselben Wert (7,74:1 — beides ist dasselbe Verhältnis).
4. **Dunkelmodus auf echtem Schwarz.** `canvas` ist `#000000`, darüber zwei
   klar getrennte Ebenen (`#0e0e12`, `#17171d`). Kein flaches Einheitsgrau.
5. **Keine reinen Extreme für Schrift.** Weder `#000` auf `#fff` noch `#fff`
   auf `#000`: das flimmert über große Flächen. `ink-900` ist `#101017` bzw.
   `#f4f4f8` — die letzten zwei Prozent Kontrast sind absichtlich verschenkt.

---

## Was das System jetzt kann, was es vorher nicht konnte

Die Skalen folgen **einer Regel**, in allen vier Familien und in beiden
Schemata identisch:

| Stufe | Rolle | Anspruch |
| --- | --- | --- |
| `50` / `100` | Flächen — leise Tönungen, tragen nie Struktur | keiner |
| `200` / `300` | Linien — Rahmen, Ringe, Fokusringe | **≥ 3:1** gegen den Grund, auf dem sie liegen |
| `400` – `950` | Schrift und gefüllte Flächen | 4,5:1 bzw. 7:1 je nach Rolle |

Deshalb liegen `200` und `300` dichter beieinander als in einer üblichen
Tailwind-Rampe: beide sind im Markup Rahmen (`border-ink-200`,
`border-brand-200`, `ring-brand-200`, `border-emerald-300` …), und ein Rahmen,
den man nicht sieht, ist kein Rahmen.

### Zwei echte Fehler, die dabei aufgefallen sind

**1. Jeder Knopf war im Dunkelmodus unlesbar.** Die Markenskala kippt im
Dunkeln mit (`brand-700` ist dort ein *heller* Ton, damit `text-brand-700` als
Linkfarbe funktioniert). Im Markup steht aber an 41 Stellen
`bg-brand-700 … text-white`. Weiß auf `#93cff7` sind **1,68:1**. Das betrifft
jeden CTA-Knopf, jedes Markenabzeichen und beide Verlaufsflächen — in der
Produktionsfassung, heute.

Reparatur ohne eine einzige Klassenänderung: `--color-white` ist keine Farbe
mehr, sondern eine **Rolle** — „Schrift auf gefüllter Akzentfläche".

```css
@theme { --color-white: var(--c-on-accent); }
:root                    { --c-on-accent: #ffffff; }
:root[data-theme="dark"] { --c-on-accent: #0b0a12; }
```

Das ist zulässig, weil `text-white` im ganzen Repo **ausnahmslos** auf
`bg-brand-600/700`, auf dem `brand-700→900`-Verlauf oder auf `bg-emerald-600`
steht (geprüft: 41 Stellen, keine Ausnahme; `bg-white` / `border-white` /
`ring-white` gibt es nirgends). Ergebnis: im Dunkelmodus ist der CTA eine
leuchtend violette Platte mit fast schwarzer Schrift — **7,66:1** statt 1,68:1.

**2. `emerald-400` und `emerald-600` fehlten im `@theme`-Block.** Beide werden
im Markup benutzt (`hover:border-emerald-400`, `bg-emerald-600`) und fielen
deshalb auf Tailwinds eingebautes Emerald zurück — im Dunkelmodus also auf
einen Hellmodus-Wert, der nicht mitschaltet. Beide Stufen sind jetzt Teil der
Skala.

---

## Token-Tabelle: vorher → nachher

### Helles Schema

| Token | vorher | nachher | Rolle / Wirkung |
| --- | --- | --- | --- |
| `brand-50` | `#f0f7ff` | `#f4f2ff` | Fläche |
| `brand-100` | `#e0effe` | `#e5e0ff` | Fläche |
| `brand-200` | `#bae0fd` | `#9581ef` | **Linie + Fokusring** · 1,38:1 → **3,15:1** |
| `brand-300` | `#7cc7fb` | `#866ee9` | Linie · 1,84:1 → **3,87:1** |
| `brand-400` | `#36abf7` | `#7859e2` | |
| `brand-500` | `#0d8fe8` | `#6c4bd9` | Fokusrahmen, Akzentbalken |
| `brand-600` | `#0072c6` | `#6240d0` | gefüllte Kachel |
| `brand-700` | `#015aa0` | `#5934c4` | **Link + Knopf** · 7,07:1 → **7,74:1**, jetzt Violett |
| `brand-800` | `#064c84` | `#47279e` | Hover |
| `brand-900` | `#0a406d` | `#371e7b` | Link-Hover, Schrift auf Markenfläche |
| `brand-950` | `#072849` | `#20134c` | |
| `ink-50` | `#f6f7f9` | `#f4f4f6` | gedämpfte Fläche |
| `ink-100` | `#ebeef2` | `#e7e7ec` | Chipfläche — ist **keine** Linie mehr |
| `ink-200` | `#d3dae3` | `#898994` | **Linie** · 1,41:1 → **3,33:1** |
| `ink-300` | `#adb9c8` | `#74747f` | gestrichelte Linie, Checkbox |
| `ink-400` | `#8092a8` | `#5e5e6a` | Kleinschrift · 3,18:1 → **6,39:1** |
| `ink-500` | `#61748d` | `#4b4b56` | gedämpfter Lead · 4,78:1 → **8,61:1** |
| `ink-600` | `#4d5d75` | `#3a3a45` | Lead · 6,69:1 → **11,22:1** |
| `ink-700` | `#404c5f` | `#2a2a33` | **Fließtext** · 8,69:1 → **14,21:1** |
| `ink-800` | `#384151` | `#1d1d25` | |
| `ink-900` | `#1f2733` | `#101017` | **Überschriften** · 15,04:1 → **18,94:1** |
| `ink-950` | `#0f141c` | `#000000` | (im Markup unbenutzt) |
| `emerald-50` | `#ecfdf5` | `#e9faf1` | Fläche |
| `emerald-100` | `#d1fae5` | `#d6f4e5` | Chipfläche |
| `emerald-200` | `#a7f3d0` | `#1e8f6b` | Ring · 1,2:1 → **3,45:1** auf dem Chip |
| `emerald-300` | `#6ee7b7` | `#17805f` | Linie · 1,7:1 → **4,90:1** |
| `emerald-400` | *fehlte im `@theme`* | `#117053` | Hover-Linie — neu |
| `emerald-500` | `#10b981` | `#0d6248` | Akzentbalken · 2,3:1 → **7,35:1** |
| `emerald-600` | *fehlte im `@theme`* | `#0b5540` | gefüllter Knopf — neu |
| `emerald-700` | `#047857` | `#094834` | Schrift · 5,4:1 → **10,56:1** |
| `emerald-800` | `#065f46` | `#073a2a` | |
| `emerald-900` | `#064e3b` | `#052c20` | |
| `amber-50` | `#fffbeb` | `#fff7e8` | Chipfläche |
| `amber-100` | `#fef3c7` | `#ffe8bd` | Fläche |
| `amber-200` | `#fde68a` | `#e0a63a` | (im Markup unbenutzt) |
| `amber-300` | `#fcd34d` | `#bf7d00` | **Linie** · 1,44:1 → **3,42:1** |
| `amber-400` | `#fbbf24` | `#b87800` | Entwicklungsbanner |
| `amber-500` | `#f59e0b` | `#9c6400` | Akzentbalken · 2,15:1 → **4,96:1** |
| `amber-700` | `#b45309` | `#7a4e00` | Chipschrift |
| `amber-800` | `#92400e` | `#613e00` | Chipschrift · 7,09:1 → **9,56:1** |
| `amber-900` | `#78350f` | `#492e00` | |
| `amber-950` | `#451a03` | `#1f1300` | Bannerschrift |
| `surface` | `#ffffff` | `#ffffff` | unverändert |
| `canvas` | `#ffffff` | `#ffffff` | unverändert |
| `on-accent` | *gab es nicht* | `#ffffff` | Schrift auf Akzentfläche |
| `code-bg` | *gab es nicht* | `#16161b` | Codeplatte |

### Dunkles Schema

| Token | vorher | nachher | Rolle / Wirkung |
| --- | --- | --- | --- |
| `canvas` | `#0d1117` | **`#000000`** | Seitengrund, OLED |
| `surface` | `#131820` | `#0e0e12` | Karten und helle Abschnitte |
| `ink-50` | `#171c25` | `#17171d` | gedämpfte Abschnitte, Fußzeile, `th` |
| `ink-100` | `#1e242f` | `#21212a` | Chipfläche |
| `ink-200` | `#2b3341` | `#6d6d78` | **Linie** · 1,49:1 → **4,11:1** |
| `ink-300` | `#3d4859` | `#82828d` | |
| `ink-400` | `#5b6b83` | `#9c9ca8` | Kleinschrift · 3,29:1 → **7,09:1** |
| `ink-500` | `#8093ab` | `#b4b4c0` | gedämpfter Lead · 6,02:1 → **10,23:1** |
| `ink-600` | `#a3b3c7` | `#c9c9d3` | Lead |
| `ink-700` | `#bcc9d8` | `#dedee6` | **Fließtext** · 11,25:1 → **15,70:1** |
| `ink-800` | `#d3dce7` | `#ececf2` | |
| `ink-900` | `#eef2f7` | `#f4f4f8` | **Überschriften** · **19,14:1** |
| `ink-950` | `#ffffff` | `#ffffff` | unverändert |
| `brand-50` | `#0a2540` | `#1a1145` | Fläche, `aria-current`-Chip |
| `brand-100` | `#0d3355` | `#251a63` | Fläche |
| `brand-200` | `#14497a` | `#6547d8` | **Linie + Fokusring** · 1,92:1 → **3,16:1** |
| `brand-300` | `#1d6aad` | `#7a5ee6` | Linie · **4,19:1** |
| `brand-400` | `#2f8ad2` | `#8e73ef` | |
| `brand-500` | `#4aa8ea` | `#9c82f4` | Fokusrahmen, Akzentbalken |
| `brand-600` | `#6dbdf2` | `#a68cf9` | gefüllte Kachel |
| `brand-700` | `#93cff7` | `#ab90ff` | **Link + Knopffläche** · **8,16:1** auf Schwarz |
| `brand-800` | `#b6e0fa` | `#c2adff` | Hover |
| `brand-900` | `#d5eefd` | `#ddd2ff` | |
| `brand-950` | `#eaf6fe` | `#efeaff` | |
| `emerald-50…900` | `#06281d`…`#d1fae5` | `#05201a`…`#d3f9ea` | eigene Rampe, keine Spiegelung |
| `emerald-400` / `-600` | *fehlten* | `#26b98a` / `#55dcae` | neu |
| `amber-50…950` | `#2a1c05`…`#fef8e7` | `#201400`…`#fffaf0` | Bannerpaar auf **4,92:1** gezogen |
| `on-accent` | *gab es nicht* | `#0b0a12` | **behebt die 1,68:1-Knöpfe** |
| `code-bg` | *gab es nicht* | `#08080b` | Codeplatte |

Die Konvention aus `global.css` bleibt: `ink-900` ist weiterhin „stärkster
Textkontrast", `ink-50` weiterhin „dezenteste Fläche". Keine Klasse im Markup
bedeutet etwas anderes als vorher.

---

## Gemessene Kontraste

Gerechnet nach WCAG 2.1 (relative Luminanz, `(L1+0.05)/(L2+0.05)`),
halbtransparente Tönungen (`bg-brand-50/60` usw.) vorher auf ihren Grund
gerechnet. Das Skript liest die Werte aus `src/styles/global.css` — Palette und
Prüfung können nicht auseinanderlaufen:

```
node scripts/check-contrast.mjs          # volle Tabelle, Exit-Code
node scripts/check-contrast.mjs --quiet  # nur Verstöße
```

**Ergebnis: 124 geprüfte Paare, alle über Ziel.** Der Anspruch dieses Zweigs:
Fließtext ≥ 7:1 wo erreichbar, nie unter 4,5:1, Linien ≥ 3:1.

| Paar | hell | dunkel | Ziel |
| --- | ---: | ---: | ---: |
| Fließtext `ink-700` auf `canvas` | **14,21:1** | **15,70:1** | 7 |
| Fließtext `ink-700` auf `surface` | 14,21:1 | 14,40:1 | 7 |
| Fließtext `ink-700` auf `ink-50` | 12,94:1 | 13,34:1 | 7 |
| Überschrift `ink-900` auf `canvas` | **18,94:1** | **19,14:1** | 7 |
| Überschrift `ink-900` auf `surface` | 18,94:1 | 17,56:1 | 7 |
| Überschrift `ink-900` auf `ink-50` | 17,25:1 | 16,27:1 | 7 |
| Fließtext `ink-800` auf `surface` | 16,74:1 | 16,37:1 | 7 |
| Lead `ink-600` auf `canvas` | 11,22:1 | 12,78:1 | 7 |
| Lead `ink-600` auf `ink-50` | 10,22:1 | 10,86:1 | 7 |
| Gedämpft `ink-500` auf `canvas` | 8,61:1 | 10,23:1 | 7 |
| Gedämpft `ink-500` auf `ink-50` | 7,84:1 | 8,69:1 | 7 |
| Kleinschrift `ink-400` auf `surface` | 6,39:1 | 7,09:1 | 4,5 |
| Kleinschrift `ink-400` auf `ink-50` | 5,82:1 | 6,57:1 | 4,5 |
| Chip `ink-500` auf `ink-100` | 6,98:1 | 7,78:1 | 4,5 |
| Link `brand-700` auf `canvas` | **7,74:1** | **8,16:1** | 7 |
| Link `brand-700` auf `surface` | 7,74:1 | 7,49:1 | 7 |
| Link `brand-700` auf `ink-50` | 7,05:1 | 6,94:1 | 4,5 |
| Link `brand-700` auf `brand-50` | 7,00:1 | 6,75:1 | 4,5 |
| Link-Hover `brand-900` auf `surface` | 12,85:1 | 13,52:1 | 7 |
| **Knopfschrift auf `brand-700`** | **7,74:1** | **7,66:1** *(vorher 1,68:1)* | 4,5 |
| Knopfschrift auf `brand-800` (Hover) | 10,23:1 | 10,05:1 | 4,5 |
| Kachelschrift auf `brand-600` | 6,64:1 | 7,26:1 | 4,5 |
| Verlaufsschrift auf `brand-700` / `-900` | 7,74 / 12,85 | 7,66 / 13,82 | 4,5 |
| Verlauf-Lead `brand-100` auf `brand-700` | 6,06:1 | 5,80:1 | 4,5 |
| Chip `brand-800` auf `brand-50` | 9,26:1 | 8,86:1 | 4,5 |
| Chip `brand-900` auf `brand-100` (70 %) | 10,83:1 | 11,59:1 | 4,5 |
| Umkehrknopf `brand-800` auf `surface` | 10,23:1 | 9,83:1 | 4,5 |
| **Rahmen `ink-200` auf `canvas`** | **3,33:1** | **4,11:1** | 3 |
| **Rahmen `ink-200` auf `surface`** | **3,33:1** | 3,77:1 | 3 |
| **Rahmen `ink-200` auf `ink-50`** | **3,03:1** | 3,49:1 | 3 |
| Rahmen `ink-300` auf `surface` | 4,62:1 | 5,07:1 | 3 |
| Rahmen `ink-300` auf `ink-50` | 4,20:1 | 4,70:1 | 3 |
| Rahmen / Fokusring `brand-200` auf `surface` | 3,15:1 | 3,16:1 | 3 |
| Rahmen `brand-300` auf `surface` | 3,87:1 | 4,19:1 | 3 |
| Rahmen `brand-300` auf `brand-50` (60 %) | 3,64:1 | 3,97:1 | 3 |
| Fokusrahmen `brand-500` auf `surface` | 5,76:1 | 6,34:1 | 3 |
| Rahmen `emerald-300` auf `surface` | 4,90:1 | 5,82:1 | 3 |
| Rahmen `emerald-400` auf `surface` (Hover) | 6,06:1 | 7,69:1 | 3 |
| Ring `emerald-200` auf `emerald-100` | 3,45:1 | 3,33:1 | 3 |
| Ring `emerald-200` auf `surface` | 4,04:1 | 4,46:1 | 3 |
| Rahmen `amber-300` auf `surface` | 3,42:1 | 3,36:1 | 3 |
| Rahmen `amber-300` auf `amber-50` | 3,21:1 | 3,15:1 | 3 |
| `emerald-700` auf `surface` | 10,56:1 | 13,12:1 | 4,5 |
| `emerald-800` auf `surface` | 12,75:1 | 15,02:1 | 4,5 |
| `emerald-900` auf `emerald-100` | 12,92:1 | 12,68:1 | 4,5 |
| Knopfschrift auf `emerald-600` | 8,80:1 | 11,47:1 | 4,5 |
| Knopfschrift auf `emerald-700` (Hover) | 10,56:1 | 13,41:1 | 4,5 |
| `amber-700` auf `amber-50` | 6,76:1 | 9,03:1 | 4,5 |
| `amber-800` auf `amber-50` | 8,98:1 | 11,45:1 | 4,5 |
| `amber-800` auf `surface` | 9,56:1 | 12,20:1 | 4,5 |
| Banner `amber-950` auf `amber-400` | 4,97:1 | 4,92:1 | 4,5 |
| Tabellenrahmen `ink-200` auf `ink-50` (`th`) | 3,03:1 | 3,49:1 | 3 |
| Tabellenschrift `ink-700` auf `ink-50` (`th`) | 12,94:1 | 13,34:1 | 7 |
| Codeplatte: Shiki-Text `#e1e4e8` auf `code-bg` | 14,14:1 | 15,68:1 | 4,5 |
| Codeplattenkante `ink-200` auf `surface` | 3,33:1 | 3,77:1 | 3 |
| Codeplattenkante `ink-200` auf `code-bg` | 5,52:1 | 3,91:1 | 3 |

Die knappsten Werte sind `ink-200` auf `ink-50` im hellen Schema (**3,03:1**)
und die beiden Fokusringe `brand-200` (**3,15 / 3,16:1**). Sie halten, aber
ohne Reserve: wer an `ink-50` oder `surface` dreht, muss die Linie mitziehen.
Das Skript sagt es sofort.

---

## Prüfungen

| Prüfung | Ergebnis |
| --- | --- |
| `npm run verify` (astro check + build + interne Links) | ✅ sauber — 30 Seiten, 2004 interne Links |
| `node scripts/check-contrast.mjs` | ✅ 124 Paare, keines unter Ziel |
| Horizontaler Überlauf bei 380 px | ✅ keiner — 7 Seiten × 2 Schemata, `scrollWidth == innerWidth == 380` |
| `/`, `/schools/`, `/blog/`, `/companies/`, `/impressum/` und zwei Blogbeiträge in beiden Schemata | ✅ per Headless-Chrome (CDP) angesehen |

Die Screenshots unter `screenshots/` sind echte Vollseiten-Aufnahmen
(`captureBeyondViewport`), dazu Ausschnitte für die drei Stellen, an denen ein
Hochkontrastschema zuerst bricht: **Kontaktformular**, **Blogtabelle**,
**Codeblock** — jeweils hell und dunkel, plus zwei Handyaufnahmen bei 380 px.

---

## Was absichtlich nicht angefasst wurde

* **Kein Wort Text.** Keine Überschrift, kein Absatz, kein Linktext, kein
  `alt`-Attribut, keine Rechtsseite. `git diff` zeigt keinen geänderten Satz.
* **Kein Layout.** Kein verschobener Abschnitt, keine neue oder entfernte
  Komponente, kein geändertes Abstandsraster, keine geänderte Typo-Skala, kein
  geändertes DOM.
* **Die Dekorationselemente bleiben im DOM.** Die weichen Farbwolken im Hero
  sind nicht gelöscht, nur heruntergedimmt (`opacity-60` → `opacity-20`,
  Tönungen von `brand-200/40` auf `brand-100/30`). Wer sie zurück will, dreht
  eine Zahl.
* **`shadow-sm` / `shadow-md` / `shadow-lg` an Karten und Dropdowns bleiben.**
  Ersetzt sind nur die beiden *großen* Bildschatten, wo der Schatten die
  eigentliche Kantenarbeit machte.
* **Shiki bleibt `github-dark`.** Nur der Plattengrund wird überschrieben
  (`!important`, weil Shiki inline schreibt) — die Token-Farben sind Shikis.
* **Die Umkehrkonvention der `ink`-Skala** aus `global.css` gilt unverändert.

### Vollständige Liste der Änderungen außerhalb von `global.css`

| Datei | Änderung |
| --- | --- |
| 10 `.astro`-Dateien | `border-ink-100` → `border-ink-200`, `divide-ink-100` → `divide-ink-200` (22 Stellen) — Linienstärke, siehe unten |
| `components/Hero.astro`, `education/components/Hero.astro` | Wolken-Opazität gesenkt, `shadow-xl ring-1` → `ring-2` am Porträt |
| `pages/index.astro`, `pages/en/index.astro` | `shadow-lg ring-1` → `ring-2` am Buchcover |
| `layouts/Layout.astro` | die zwei `theme-color`-Metas: `#015aa0` / `#0d1117` → `#5934c4` / `#000000` |
| `pages/blog/[slug].astro` | mermaid-`themeVariables` auf die neue Palette — mermaid schreibt Farben fest ins SVG und löst keine CSS-Variablen auf |
| `scripts/check-contrast.mjs` | neu — der Kontrastprüfer |

**Warum `ink-100` → `ink-200` bei Linien:** `ink-100` diente doppelt, als
Chipfläche *und* als Trennlinie. Beides zugleich geht in einem
Hochkontrastschema nicht — eine Farbe, die als Linie 3:1 auf Weiß hält, ist als
Chiphintergrund ein dunkles Grau. Die Skala ist deshalb sauber aufgeteilt:
`ink-50` / `ink-100` sind Flächen, `ink-200` / `ink-300` sind Linien. Die 22
Klassenwechsel sind genau diese Aufteilung, sonst nichts.

---

## Wo das Schema am schwächsten ist — ehrlich

1. **Bernstein ist kein Bernstein mehr.** Der teuerste Kompromiss. Bernstein
   hat von Natur aus hohe Luminanz; ein Ton, der als Linie 3:1 auf Weiß hält,
   liegt zwingend bei `#d97706` oder dunkler, also im Ocker. Der 4-px-Balken
   (`bg-amber-500`) ist dadurch satt statt leuchtend. Er ist `aria-hidden` und
   rein dekorativ — wer die Leuchtkraft zurück will, hebt **genau ein Token**
   (`--c-amber-500`) und verletzt dabei nichts, weil dieses Token weder Schrift
   noch Linie trägt. Abgeschwächt gilt dasselbe für `emerald-500`.

2. **Die violette Verlaufsfläche im Dunkelmodus ist laut.** Der
   `from-brand-700 to-brand-900`-CTA-Block wird im Dunkeln zu einer hellen
   Lavendelplatte mit fast schwarzer Schrift. Mit 7,66:1 einwandfrei lesbar und
   als CTA absichtlich dominant — aber es ist die größte helle Fläche auf einer
   sonst tiefschwarzen Seite und die Stelle, an der jemand zuerst „zu viel"
   sagen wird. Die milde Fassung wäre, im Dunkeln den Verlauf aus
   `brand-100`→`brand-50` statt `brand-700`→`brand-900` zu ziehen — das ginge
   aber nur mit Klassenwechseln und fiel damit aus dem Auftrag dieses Zweigs.

3. **`ink-200`-Rahmen auf `ink-50` haben keine Reserve** (3,03:1 hell). Wer die
   gedämpfte Fläche nur eine Nuance dunkler macht, kippt die Linie unter die
   Marke. Mit mehr Zeit würde ich `ink-50` auf `#f6f6f8` heben und `ink-200`
   auf `#858590` ziehen, um beidseitig Luft zu bekommen.

4. **Die Linienstufen `200` und `300` liegen dicht beieinander** (3,15 vs.
   3,87 hell). Direkte Folge davon, dass beide im Markup Rahmen sind — es macht
   die Rampe an dieser Stelle unrhythmisch. Sauberer wäre, im Markup eine der
   beiden Stufen aufzugeben und sie zu *einer* Linienfarbe zusammenzuführen.
   Das ist ein Markup-Eingriff und gehörte nicht hierher.

5. **Die Platzhalterfarbe in den Formularfeldern ist Browservorgabe.** Sie
   schaltet über `color-scheme` mit und ist in beiden Schemata lesbar, aber sie
   ist das einzige Stück Farbe auf der Seite, das die Palette nicht
   kontrolliert. Mit mehr Zeit bekäme sie ein eigenes Token.

6. **Die Grenze zwischen `canvas` (`#000`) und `surface` (`#0e0e12`)** ist im
   Dunkelmodus an manchen Abschnittsübergängen als feine Naht sichtbar, z. B.
   zwischen dem letzten Abschnitt und der Fußzeile. Das ist die gewollte
   Dreiebenen-Struktur; ob man sie *sehen* will, ist Geschmack.

**Halation** — der klassische Ausfallmodus dieses Stils — ist bewusst vermieden:
keine Fläche benutzt `#000` auf `#fff` oder umgekehrt. Fließtext liegt bei
`#2a2a33` bzw. `#dedee6`, Überschriften bei `#101017` bzw. `#f4f4f8`. Beim
Durchsehen der Vollseiten-Screenshots war keine Fläche unangenehm; die
textlastigste Seite (`/impressum/`) liest sich scharf, nicht grell.

---

## Was ich mit mehr Zeit machen würde

* Punkte 3 und 4: Linienstufen entzerren, `ink-50` / `ink-200` auseinanderziehen.
* Ein `--c-placeholder`-Token samt Regel.
* `scripts/check-contrast.mjs` in `npm run verify` hängen, damit eine
  Palettenänderung nicht stillschweigend unter die Marke fallen kann.
* Die mermaid-Farben aus `global.css` speisen statt sie in `blog/[slug].astro`
  zu duplizieren — das ist der einzige Ort, an dem die Palette zweimal steht.
* Prüfen, ob `--color-white` als Rolle zu clever ist. Es ist wasserdicht,
  solange `text-white` nur auf Akzentflächen steht — und genau das ist eine
  Zusicherung, die in einen Test gehört, nicht in einen Kommentar.
