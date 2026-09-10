# Dokumentation für Entwickler*innen

## Wo finde ich was?

- Die Datei [index.html](../../../index.html) ist unser Haupt-Dokument. von hier aus werden alle weiteren Skripte geladen. Die Datei lässt sich direkt im Browser ausführen.
- Im [css Ordner](../../../css) können individuelle Design-Änderungen via CSS3 vorgenommen werden. Neue Skripte sollten im head-Tag der index.html-Datei verknüpft werden.
- Im [js Ordner](../../../js) können neue JavaScript Dateien angelegt werden. Diese sollten ganz am Ende des body-Tags geladen werden.

***

## Hilfreiche Links

Vorab hier noch zwei Dokumentationen, die sehr hilfreich sein werden:
- [Bootstrap Cheatsheet](https://getbootstrap.com/docs/5.0/examples/cheatsheet/) & [Dokumentation](https://getbootstrap.com/docs/5.0) | Bootstrap ist ein freies Frontend-CSS-Framework, das ich bereits installiert habe. Es ermöglicht schnelles schreiben von schönen HTML-Websites, die auf allen gängigen Browsern möglichst stabil laufen und beinhaltet viele Standard-Elemente, wie Tabellen, Formulare und Pop-Ups. Wir verwenden Version 5.
- [Bootstrap Icons Dokumentation](https://icons.getbootstrap.com/) | Dies ist eine ebenfalls freie Icon-Bibliothek, die ich installiert habe. So könnte in HTML z.B. ein Smile eingefügt werden:
    ```
    <i class="bi bi-emoji-smile-upside-down-fill"></i>
    ```
- [CSS Diner](https://flukeout.github.io/) ist ein kleines "Spiel", mit dem man die Verwendung von Selektoren üben kann :) Die gleichen Selectoren funktionieren übrigens auch in JavaScript z.B. so:
    ```
    document.querySelectorAll('.classname[data-attribute="test"]');
    ```

***
