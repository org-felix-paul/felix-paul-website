# Dokumentation für Entwickler*innen

## Wo finde ich was?

- Die Datei [index.html](../index.html) ist unser Haupt-Dokument. von hier aus werden alle weiteren Skripte geladen. Die Datei lässt sich direkt im Browser ausführen.
- Im `css`-Ordner können individuelle Design-Änderungen via CSS3 vorgenommen werden. Neue Skripte sollten im head-Tag der index.html-Datei verknüpft werden.
- Im `js`-Ordner können neue JavaScript Dateien angelegt werden. Diese sollten ganz am Ende des body-Tags geladen werden.

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

# Tools und Klassen neu implementieren



## Tools

- Um ein neues Werkzeug zu erstellen füge diesen Code in den HTML-Code der Toolbar ein:
    ```
    <div class="tool" data-tool="tool-name">
        <i class="bi bi-tools"></i> Anzeigename
    </div>
    ```
- Um abzufragen, welches Tool gerade ausgwählt wurde, verwende activeTool in JavaScript:
  ```
  console.log('Aktives Werkzeug: ',activeTool);
  ```
- Um CSS-Styles auf das verwendete Werkzeug anzupassen verwende [data-active-tool] in CSS:
  ```
  [data-active-tool='move'] .canvas-element {
    cursor: move;
  }
  ```
***

## Klassen verwenden

### Neuron

- Ein neues Neuron mit x- und y-Koordinate (in Pixeln) erstellen:
    ```
    const x = 15;
    const y = 15;
    
    const neuron1 = new Neuron(x,y);
    ```
- Neuronen verknüpfen; Verknüpfe neuron1 und neuron2 so, dass die Ausgabe von neuron1 ein Eingabewert von neuron2 wird: 
    ```
    const neuron2 = new Neuron(300,300);
    
    neuron2.addInput(neuron1);
    ```
- Aktivierung berechnen und ausgeben:
    ```
    neuron2.update();
    console.log(neuron2.value);
    ```
- Gewichte auslesen:
    ```
    console.log(neuron2.inputs[0].weight);
    ```
- Gewichte bearbeiten:
    ```
    console.log(neuron2.value);
    neuron2.inputs[0].weight = 5;
    neuron2.update();
    console.log(neuron2.value);
    ```
- Neuronen entfernen:
    ```
    neuron1.remove();
    neuron2.remove();
    ```

### Linie

- Zeichne eine Linie mit Start- und Zielkoordinaten (in Pixeln):
  ```
  const line = new Line([0,0],[100,100]);
  ```
- Verschiebe den Startpunkt:
  ```
  line.setStart([0,300]);
  ```
- Verschiebe den Endpunkt:
  ```
  line.setEnd([400,400]);
  ```
- Linienstärke ändern:
  ```
  line.setWidth(5);
  ```
- Linienfarbe ändern:
  ```
  line.setColor('green');
  ```
- Linie entfernen:
  ```
  line.remove();
  ```

***

## Neue Klassen erstellen, die auf der Leinwand abgebildet werden sollen

- Erben von der Klasse CanvasElement:
  ```
  class EigenerKlassenName extends CanvasElement {
    constructor(left = 0, top = 0) {
        super('Füge hier eigenen HTML-Code ein.', left, top);
        
        /* AB HIER OPTIONAL */
        this.setDraggable(true); // Soll das Element uber das Verschiebe-Werkzeug bewegt werden können?
        this.ondrag = () => {
          // was soll passieren, wenn das Element bewegt wird?
        }
  
        this.setDeleteable(true); // Soll das Element uber das Löschen-Werkzeug entfernt werden können?
        this.onremove = () => {
          // was soll passieren, wenn das Element gelöscht wird?
        }
        /* BIS HIER OPTIONAL */
    }
  }
  ```
- Hier ein Beispiel:
  ```
  class TestElement extends CanvasElement {
    constructor(left = 0, top = 0) {
        super('<div class="rounded bg-primary">Hallo Welt!</div>', left, top);
        
        this.setDraggable(true);
        this.ondrag = () => {
          console.log('Dieses Element wird bewegt: ',this);
        }
        
        this.setDeleteable(true);
        this.onremove = () => {
          alert('Dieses Element wird gelöscht.');
        }
    }
  }
  ```
- Erzeuge eine Instanz der Klasse, um das Element abzubilden:
  ```
  const neuesElement = new TestElement();
  ```
- Verwende element.DOM, um direkt per JavaScript auf des entsprechende [DOM Objekt](https://wiki.selfhtml.org/wiki/JavaScript/DOM) in HTML zuzugreifen. So lässt es sich z.B. in der Konsole begutachten:
  ```
  console.log(neuesElement.DOM);
  ```

  ## Typen von Canvas Elementen
  -Actuell gibt es drei Typen von Elementen
    Type 0: Neuron
    Type 1: Output
    Type 2: Matrix
  
  Die Typen sind relevant um in der Sidebar angeclickte Elemente anzeigen zu lassen

## Erklärung der Skripte

#### canvaselements-functions/:
> add-canvaselement.js  remove-all-canvaselements.js

Hinzufügen und Löschen eines canvas-elements und da alle anderen Klassen davon erben wird hier eine Index-Struktur implementiert um eine Übersicht zu haben, was alles an Objekten gerade exisitert. 

#### classes/:
> canvaselement.js  colorScale.js  eoutput.js  line.js  matrix.js  neuron.js  output.js  sidebar.js

​	Jede Klasse hat ihre eigene Datei, wobei fast jede Klasse von canvaselement erbt!

#### plot/:
>  myPlot.js  openPlotWindow.js  plot.html

Hier sind nur ungenutze Code-Relikte.

#### save-load-file/:
> load-dataset.js  load-file.js  save-file.js  splitData.js

- In der Datei **load-file** ist der Code zum Laden eines gespeicherten Neuronalen Netzes. Beachte, dass hier nicht das Lernverfahren gespeichert wird, sondern nur die Struktur des Netzwerks und der Eingabematrizen. 

- In der Datei **save-file** wird das Netzwerk entsprechend im json Format gespeichert. 

- In der Datei **load-dataset** gibt es verschiedene Methoden die aufeinander aufbauen. Diese Dokumentation ist etwas ausführlicher, da sie während der Entwicklung gut gepflegt wurde.

      csvToArray
          wandelt die gegebene Datei in ein array um, wo jede zeile ein array ist
          gibt labelvektor zurück
      
      addEventListener
          liest Datei ein
          wandelt sie in array um - csvToArray
          macht Matrix draus - createMatrix
          nutzt csvToArray, createMatrix
      
      TransformRowToMatrix
          wandelt gegebene Zeile des Datensazes in matrixarray um und labelvektor
          nutzt keine andere funktion
      
      transformDataToMatrics
          wandelt alle zeilen eines datensatzes in matrixarray, labelvektor um 
          benutzt transformRowToMatrix
      
      create Matrix
          lösche alte matrizen
          erstelle neue Matirzen auf canvas
          lösche outputs
          erstelle neue outputs
          setze alle label der outputs richtig
          nutzt transformDataToMatrics 
      
      loadScriptFile
          lade skript datei in textfeld 

- In der Datei **splitData** werden die Eingabematrizen aufteilt in Test und Trainingsmatrizen. Hierbei handelt es sich jedoch um ein voll funktionsfähiges Relikt, dass wegen der fehlenden Möglichkeit der Evaluation der Modelle nicht genutzt wird. 

#### training/:
> backpropagation.js  calculate-error.js  eigenesTraining.js  random-training.js  start-training.js  training-getter.js

In den Dateien

- random-training
- backpropagation
- eigenes-Training

sind jeweils die spezifischen Lernverfahren implementiert.

Die Datei start-training ist Lernverfahren unabhängig und ruft rundenbasiert das jeweils ausgewählte Lernverfahren auf und achtet auf die serielle Ausführung mittels der pause Funktion, sodass auch bei großen Rundendauern bei der Animation nichts falsch läuft durch synchrone Ausführungen des Codes. Diese Datei ist also die Trainings-Masterdatei. 

In der Datei training-getter sind nur Hilfsfunktionen die die gewählten Parameter des Nutzers abfragen.

In der Datei calculate-error sind zwei Fehlermetriken implementiert. Dabei nimmt der maximumError den größten Fehler alles Eingabematrizen, sodass mit dieser Metrik die schlechteste Eingabematrix optimiert wird. Der quadraticError ist einfach der Standardfehler im Maschinellen Lernen.

#### andere Skripte

- createStandardNetwork.js

  erstelle das Standardnetzwerk

  - frage Parameter ab
  - lösche alle alten Neuronen, Linien
  - erstelle Neuronen und verbinde sie (ohne Neuronen des letzten Layers)
  - verbinde Neuronen mit Eingabematrix
  - erstelle so viele Neuronen im letzten Layer wie Ergebnis-Outputs existieren
  - verbinde Neuronen des letzten Layers mit Ergebnis-Outputs (diese wurden extra nicht gelöscht)
  - verbinde Neuronen des letzten Layers mit den restlichen Neuronen
  - sortiere Netzwerk

-   init.js      

  Initialisierung der Website und der Tools 

- main.js      

  Erstelle Anfangsnetz manuell damit die Website nicht leer ist und man sofort starten kann      

- mouse-pos.js         

  Maus Handling

- onload.js       

  Verhalten der Website beim Neu-Laden      

- sort-network.js

  sortiert das Netzwerk für eine schöne Darstellung 

  unnötige Elemente können wahlweise gelöscht werden

- functions.js    

  Zoom- Funktionen und einzelne Getter          

- linearity.js  

  Aktivierungsfunktionen werden hier implementiert und ihre Ableitung

- math-functions.js  

  hat nur eine Funktion - calculateStickedCoordinates damit die Neuronen immer auf einem Raster angeordnet sind

- normalizeDataSet.js  

  normalisiert die Eingabewerte aller Matrizen - normalisiert aber nicht die zu vorhersagenden Werte einer Matrix

  updatet danach die Darstellung in der rechten Sidebar

- showUnshowOptions.js  

  Zeigt einzelne html-Elemente der index.html an bzw. löscht oder fügt sie hinzu je nachdem welches Lernverfahren etc. gewählt wurde

- tools.js

  implementiert die Tool-Funktionen, damit ein Tool wie z.B. das Hinzufügen von Neuronen aktiv bleibt, wenn man ein Neuron hinzugefügt hat und man nicht immer neu auf den Button *Neuron hinzufügen* klicken muss


### Code-Relikte

- Der gesamte Ordner **plot/** ist nicht in Nutzung. Hier sollte die Evaluation der Modelle grafisch geschehen, indem man die Fehlerentwicklung gegen die Rundenzeit live während des Trainings in einem eigenen Fenster plottet. Dies konnte jedoch leider nicht fertiggestellt werden.

- **save-load-file/splitData** enthält Funktionen zum Aufteilen der Eingabematrizen in Test und Trainingsmatrizen. Dafür gibt es verschiedene Methoden:
        setAllMatricesToTrainMatrix um keine Testmatrizen mehr zu haben (reset Funktion)
        
    
      getRandomSubarray
      
      getRandomSubarray(arr,size)
      
      getLastElements(arr, size)
      
      getFirstElements(arr, size)
      
      getEveryNthElement(arr,percentage) 
      
      setTestMatrices
      
      printAllMatrices
  
  Die Namen der Funktionen sollten selbsterklärend sein und sind im Code gut dokumentiert. Man kann also eine zufällige Auswahl der Testmatrizen vornehmen, die ersten oder letzten n-Matrizen oder jede n-te Matrix. Die Auswahl wird in einem Attribut der Matrizen gespeichert aber im weiteren nicht mehr genutzt, weshalb es sich um ein Relikt handelt.

