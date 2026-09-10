# Tools und Klassen neu implementieren

## Tools

Mit Tools kann man neue Funktionen ähnlich denen in der linken Sidebar erstellen. Folge der unteren Anleitung um ein neues Tool zu erstellen. Erstellst du ein Tool wie unten angegeben erscheint ein Button, der jedoch noch keinerlei Funktionalität aufweist, außer Styling und das Abfragen, ob der Button gedrückt wurde und das Tool damit aktiviert ist. 


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
