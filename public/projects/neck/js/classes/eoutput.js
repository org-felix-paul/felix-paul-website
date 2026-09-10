class EOutput extends CanvasElement { 
    constructor(left = 0, top= 0, id=-1, initializeMatrixLabels=true) {
        super(`
            <div class="output-icon free">
            
            </div>
            <div class="output-value">
                <div class="output-value-t output-text">
                    Output
                </div>
                <div class="output-value-v output-text">
                
                </div>
            </div>
            <div class="output-soll">
                <div class="output-soll-t output-text">
                     <input id="outputLabelForm" class="labelform" type="text" value='Sollwert'>
                </div>
                <input class="output-soll-v" type='number' value='0'>
            </div>
            <div class="output-diff">
                <div class="output-diff-t output-text">
                    Differenz
                </div>
                <div class="output-diff-v output-text">
                
                </div>
            </div>
            <div class="output-2diff">
                <div class="output-2diff-t output-text">
                    Fehler
                </div>
                <div class="output-2diff-v output-text">
                
                </div>
            </div>
        `
            ,left,top, 1, id
        );
        this.setDraggable(true); // erlaubt das Bewegen mit dem Verschiebe-Werkzeug
        this.setDeleteable(true); // erlaubt das Löschen mit dem Entfernen-Werkzeug
        this.setUpdateable(true); //erlaubt das Updaten mit dem Netz-updaten-Werkzeug
        this.DOM.classList.add('eoutput');// fügt dem DOM-Objekt die Klasse "neuron" hinzu, um CSS-Styling zu ermöglichen

        this.type=1;
        this.inputId=null;
        this.lineId=null;
        this.value=[];
        this.soll=[];
        this.len=0;
            this.error = 0;

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
        this.DOM.addEventListener('change', e => {
            this.onChange();
        });

        //gibt an ob Matrix Labels für den EOutput auf 0 gesetzt werden sollen
        //beim laden eines gespeicherten Netzes darf das nicht passieren
        if(initializeMatrixLabels === true){
            this.initializeMatrixLabels();
        }
        this.update(); // berechne den Ausgabewert des Neurons
        /* initialisieren Ende */
    };
    
    clear(){
        if(this.lineId!=null){
            canvas_elements[this.lineId].remove();
        }
        //lösche die Labels der Matrizen
        for(const matrixId in matrix_list){
            matrix_list[matrixId].removeLabel(this.id);
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
            this.value[this.len]=parseFloat(canvas_elements[this.inputId].value).toFixed(3);
            this.DOM.querySelector(".output-value-v").innerHTML=this.value[this.len];
            const element=this.DOM.querySelector(".output-soll-v");
            this.soll[this.len]=element.value;
            
            this.DOM.querySelector(".output-diff-v").innerHTML= Math.abs(this.value[this.len] - this.soll[this.len]).toFixed(3);
            this.error = errorMethods[getSelectedErrorFunction()]([this.value[this.len]], [this.soll[this.len]]);
            this.DOM.querySelector(".output-2diff-v").innerHTML= this.error.toFixed(3);
            this.len++;
            this.setColor();
        }   
        
    }

    onChange(){
        const expectedValue = this.DOM.querySelector('.output-soll-v').value;
        this.soll.push(expectedValue);
        getCurrentMatrix().setLabel(this.id, expectedValue);
    }

    setExpectedValue(value = 0){
        this.soll.push(value.toString());
        this.DOM.querySelector('.output-soll-v').value = value;
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

    getTargetValue(){
        return this.soll[this.soll.length - 1];
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

    initializeMatrixLabels(){
        for(const matrixId in matrix_list){
            matrix_list[matrixId].setLabel(this.id, 0);
        }
    }
}