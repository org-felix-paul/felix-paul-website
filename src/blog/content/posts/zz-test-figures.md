---
title: "Test figures"
description: "temporary"
pubDate: 2026-09-17
---

Intro, siehe [](#abb-eins), [](#tab-eins), [](#punkt-x) und [](#1-erster-abschnitt).

## 1. Erster Abschnitt

:::figure{#abb-eins short="Ein Testbild"}
Lange Beschreibung des Bildes, **mit Markdown**, vor dem Bild.
![Alt-Text des Testbilds](/blog/logo.svg)
:::

:::figure{#abb-zwei short="Ein Diagramm"}
Diagramm als Mermaid.
```mermaid
flowchart LR
  A --> B
```
:::

Ein Satz mit :anchor[markierter Stelle]{#punkt-x} im Text.

:::table{#tab-eins short="Eine Testtabelle"}
| Format | Honorar |
|---|---|
| Vortrag | 500 € |

Lange Beschreibung der Tabelle, nach der Tabelle.
:::

Quelle[^q].

## Quellen

[^q]: Eine Quelle.
