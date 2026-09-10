# Eine Übersicht über den Code

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

