class Output extends CanvasElement {
    constructor(left = 0, top= 0, id) {
        super(`
            <div class="output-icon free">
            
            </div>
            <div class="output-value output-text">
                10
            </div>
        `
            ,left,top, 1, id
        );
        this.setDraggable(true); // erlaubt das Bewegen mit dem Verschiebe-Werkzeug
        this.setDeleteable(true); // erlaubt das Löschen mit dem Entfernen-Werkzeug
        this.setUpdateable(true); //erlaubt das Updaten mit dem Netz-updaten-Werkzeug
        this.DOM.classList.add('output');// fügt dem DOM-Objekt die Klasse "neuron" hinzu, um CSS-Styling zu ermöglichen
        
        this.type=1;
        this.inputId=null;
        this.lineId=null;
        this.value=0;

        this.ondrag = () => { // alles, was passieren soll, wenn der Output bewegt wird
            this.adjustLines(); // sorge dafür, dass beim verschieben die Linien angepasst werden
        };

        this.onremove = () => { // alles, was passieren soll, wenn der Output gelöscht wird
            this.clear(); // hebe beim Löschen alle Verknüpfungen auf
        };

        this.DOM.onclick = () => { // Funktionenn bei Klicken
            switch (getTool()) { // prüfe, ob bereits ein Neuron als ausgewählt markiert wurde
                case 'link':
                    if (getLinkingToolStatus() === 'select-input') {
                        if (this.lineId != null) {
                            this.removeInput();
                        }
                        this.setInput(canvas_elements[globalThis.selectedCanvasElementId]);
                        globalThis.selectedCanvasElementId = null; // entferne die Markierung an dem anderen Neuron
                        document.getElementById('canvas').setAttribute('data-linking-tool-status', 'select-input');
                        setLinkingToolStatus('select-output');
                    }
                    break;
                case 'move':
                    globalThis.selectedCanvasElementId = this.id;
                    updateSidebar();
            }
        }
        this.update(); // berechne den Ausgabewert des Neurons
        /* initialisieren Ende */
    };
    
    clear(){
        if(this.lineId!=null){
            canvas_elements[this.lineId].remove();
        }
    }

    setColor(){//Bestimmt die Farbe
        if(this.inputId!=null){
            this.DOM.querySelector('.output-icon').style.backgroundColor=canvas_elements[this.inputId].color;
        }else{
            this.DOM.querySelector('.output-icon').style.backgroundColor="white";
        }
    }

    update(){//updated value, falls verbunden
        if(this.inputId!=null){
            this.value=canvas_elements[this.inputId].value;
            this.DOM.querySelector(".output-value").innerHTML=this.value;
            this.setColor();
        }
    }

    // Füge einen Input hinzu (aktuell muss der Input ein Neuron sein)
    setInput(neuron) {
        const line = new Line(); // erstelle eine neue Linie
        this.lineId=line.id;
        this.inputId=neuron.id;

        line.setColor(neuron.color); // setze die Farbe der Linie auf die Farbe des neurons

        //Entfernt class "free"
        this.DOM.querySelector('.output-icon').classList.remove('free');
        
        // animiere die Linien
        const intervalId = setInterval(() => {
            this.adjustLines();
        },10);
        setTimeout(() => {
            clearInterval(intervalId);
        },110);

        line.DOM.addEventListener('click',() => {
            if (activeTool === 'delete') {
                this.removeInput(); // entferne den Input, wenn mit dem Löschen-werkzeug auf die Linie geklickt wird
            }
        });    
        this.update();

        //stelle sicher dass jedes Neuron nur mit einem Output verknüpft ist
        getCanvasElements('Output', 'EOutput').forEach(output => {
            if(output.id !== this.id && output.inputId === this.inputId){
                output.removeInput();
            }
        })
    }

    adjustLines(){
        if(this.inputId!=null){
            const boxReferencePoint = document.getElementById('referencePoint').getBoundingClientRect();
            const boxInput = this.DOM.querySelector('.output-icon').getBoundingClientRect();
            const boxOutput = canvas_elements[this.inputId].DOM.querySelector('.neuron-output').getBoundingClientRect();
            const start = [(1/canvasScale) * (boxOutput.left+boxOutput.width-boxReferencePoint.left), (1/canvasScale) * (boxOutput.top+boxOutput.height/2-boxReferencePoint.top)];
            const end = [(1/canvasScale) * (boxInput.left-boxReferencePoint.left), (1/canvasScale) * (boxInput.top+boxInput.height/2-boxReferencePoint.top)];
            const line = canvas_elements[this.lineId];
            line.start = start;
            line.end = end;
            line.draw(false);
        }   
    }

    removeInput(){
        this.DOM.classList.add('free');
        this.inputId=null;
        canvas_elements[this.lineId].remove();
        this.lineId=null;
        this.DOM.querySelector('.output-icon').style.backgroundColor="";
    }
}