class Neuron extends CanvasElement {
    constructor(left = 0, top= 0, color = 'white', bias=0, id=-1, layer=-1, biasLocked = false) {
        /* erstelle ein neues CanvasElement */
        super(`
            <div class="neuron-footer">
                <div class="neuron-inputs"><div class="neuron-input free">
                    <div class="neuron-input-icon"></div>
                    <input class="neuron-input-weight" value='10'/>
                </div></div>
            </div>
            <div class="neuron-body">
                <input class="bias-input-value" value="0"/>
                <div class="neuron-bias-icon"></div>
            </div>
            <div class="neuron-head">
                <i style="font-size: 40px;" class="text-white bi bi-node-plus-fill"></i>
                <div class="neuron-output"></div>
            </div>`
            ,left,top, 0, id
        );
        this.setDraggable(true); // erlaubt das Bewegen mit dem Verschiebe-Werkzeug
        this.setDeleteable(true); // erlaubt das Löschen mit dem Entfernen-Werkzeug
        this.setUpdateable(true); //erlaubt das Updaten mit dem Netz-updaten-Werkzeug
        this.DOM.classList.add('neuron'); // fügt dem DOM-Objekt die Klasse "neuron" hinzu, um CSS-Styling zu ermöglichen

        const element = this.DOM.querySelector('.neuron-input-weight');
        element.value= initializeWeights();
        element.active = true;  // notwendig damit lock richtig initialisiert ist
        this.initializeLockFieldEventListener(element);

        const biasInputField = this.DOM.querySelector('.bias-input-value');
        biasInputField.active = true;
        this.initializeLockFieldEventListener(biasInputField);
        /* Optionen Start */
        this.type=0;
        this.inputs = [];
        this.setBias(bias, biasLocked);
        this.layer=layer;
        this.value=0;
        //TODO Muss auch wieder auf false gesetzt werden wenn die Linie gelöscht wurde
        this.matrixConnected = false;
        /* Optionen Ende */


        /* initialisieren Start */
        this.ondrag = () => { // alles, was passieren soll, wenn das Neuron bewegt wird
            this.adjustLines(); // sorge dafür, dass beim verschieben die Linien angepasst werden
        }

        this.onremove = () => { // alles, was passieren soll, wenn das Neuron gelöscht wird
            this.clear(); // hebe beim Löschen alle Verknüpfungen auf
        }

        this.DOM.onclick = () => { // Funktionen bei Klicken
            if (activeTool === 'link') {
                switch (getLinkingToolStatus()) {
                    case 'select-input':
                        this.addInput(canvas_elements[globalThis.selectedCanvasElementId],1, globalThis.selectedRow, globalThis.selectedCol); // füge das markierte Neuron diesem Neuron als Input hinzu
                        globalThis.selectedCanvasElementId = null; // entferne die Markierung an dem anderen Neuron
                        globalThis.selectedRow = null;
                        globalThis.selectedCol = null;
                        setLinkingToolStatus('select-output');
                        break;
                    default: // normalerweise select-output
                        globalThis.selectedCanvasElementId = this.id; // markiere dieses Neuron als ausgewählt
                        updateSidebar();
                        setLinkingToolStatus('select-input');
                }
            }

            if (activeTool === 'resetWeightsSingleNeuron') {
                console.log("neuron wurde gewicht zurückgesetzt");
                initializeWeightsOfSingleNeuron(this);
            }
        }

        this.DOM.addEventListener('change', e => {
            this.onChange();
        });

        this.setColor(color);
        this.update(); // berechne den Ausgabewert des Neurons
    
        /* initialisieren Ende */
    }

    // Ändere die Farbe des Neurons
    setColor(color = '') {
        if(color==''){            
            let min = parseFloat(document.getElementById("min-farb").value);
            let max = parseFloat(document.getElementById("max-farb").value )- min;
            let i = (this.value - min)/max;
            let green = 255 * i;
            let red = 255 -green;
            color= 'rgb('+ red + ',' + green + ',0)';
        }
        this.color = color;
        this.DOM.querySelector('.neuron-output').style.backgroundColor = this.color;
        for (const [id, canvasElement] of Object.entries(canvas_elements)) {
            if (canvasElement.constructor.name === 'Neuron') {
                for (let i = 0; i < canvasElement.inputs.length; i++) {
                    if (canvasElement.inputs[i].canvasElementId === this.id) {
                        canvasElement.DOM.querySelectorAll('.neuron-input-icon')[i].style.backgroundColor = this.color;
                        canvas_elements[canvasElement.inputs[i].lineId].setColor(this.color);
                    }
                }
            }
            if (canvasElement.constructor.name === 'Output' || canvasElement.constructor.name === 'EOutput' ) {
                if (canvasElement.inputId === this.id) {
                    canvas_elements[canvasElement.lineId].setColor(this.color);
                }
            }
        }
    }

    getInputNeurons(recursive = false, result = []) {
        this.inputs.forEach(input => {
            const neuron = canvas_elements[input.canvasElementId];
            if (result.indexOf(neuron) === -1) {
                result.push(neuron);
            }
            if (recursive) {
                result.concat(neuron.getInputNeurons(true,result));
            }
        });
        return result;
    }


    getInputMatrixCells() {
        let cells = []
        this.inputs.forEach(input => {
            if(canvas_elements[input.canvasElementId].constructor.name === 'Matrix'){
                cells.push(input.row.toString() + "," + input.col.toString());
            }
        });
        return cells;
    }

    getOutputNeurons(recursive = false, result = []) {
        for (const [id, canvasElement] of Object.entries(canvas_elements)) {
            if (canvasElement.constructor.name === 'Neuron') {
                canvasElement.inputs.forEach(input => {
                    if (input.canvasElementId === this.id) {
                        if (result.indexOf(canvasElement) === -1) {
                            result.push(canvasElement);
                        }
                        if (recursive) {
                            result.concat(canvasElement.getOutputNeurons(true,result));
                        }
                    }
                });
            }
        }
        return result;
    }


    checkInputAvailable(canvasElement, row, col) {
        switch (canvasElement.constructor.name){
            case 'Neuron':
                return ((canvasElement.id !== this.id) && (this.getInputNeurons(false).indexOf(canvasElement) === -1) && (this.getOutputNeurons(true).indexOf(canvasElement) === -1));
                break;
            default: // Matrix
                return (this.getInputMatrixCells().indexOf(row.toString() + "," +col.toString()) === -1);
        }
    }

    // Füge einen Input hinzu (aktuell muss der Input ein Neuron sein)
    addInput(canvasElement, weight = initializeWeights(), row = null, col = null, locked=false) {
        if (this.checkInputAvailable(canvasElement, row, col)) { // prüfe, ob neuron als Input legal ist
            const line = new Line(); // erstelle eine neue Linie

            this.inputs.push({
                canvasElementId : canvasElement.id,
                weights : [weight],
                lineId : line.id,
                row: row,
                col: col
            });

            if(canvasElement.id === 'unique_id_1'){
                this.matrixConnected = true;
            }

            line.setColor(canvasElement.color); // setze die Farbe der Linie auf die Farbe des ausgehenden CanvasElements

            // markiere den freien Input dieses Neurons als belegt und färbe Ihn so, wie das Input-Neuron
            const inputElement = this.DOM.querySelector('.neuron-inputs').lastChild;
            inputElement.querySelector('.neuron-input-icon').style.backgroundColor = canvasElement.color;
            inputElement.classList.remove('free');
            //beim laden des netzes: stelle gesperrte Gewichte wieder her
            if(locked === true){
                inputElement.children.item(1).classList.add('locked');
            }
            
            // erstelle einen neuen freien Input
            const newInputElement = document.createElement('div');
            newInputElement.innerHTML = '<div class="neuron-input-icon"></div><input class="neuron-input-weight" value="'+weight+'"/></div>';
            newInputElement.classList.add('neuron-input','free');
            const lockElementField = newInputElement.querySelector('.neuron-input-weight');
            lockElementField.active= true;
            this.initializeLockFieldEventListener(lockElementField);
            this.DOM.querySelector('.neuron-inputs').appendChild(newInputElement);

            this.resizeInputs(); // passe die größe der Inputs an

            // animiere die Linien
            const intervalId = setInterval(() => {
                this.adjustLines();
            },10);
            setTimeout(() => {
                clearInterval(intervalId);
            },110);

            line.DOM.addEventListener('click',() => {
                if (activeTool === 'delete') {
                    this.removeInput(canvasElement); // entferne den Input, wenn mit dem Löschen-werkzeug auf die Linie geklickt wird
                }
            });
        } else {
            alert('Diese Verknüpfung ist illegal!');
        }
    }

    //sperrt einzelne Inputfelder
    initializeLockFieldEventListener(element){
        element.addEventListener('click', () => {
            if(globalThis.activeTool === "lock-values"){
                element.classList.toggle('locked');
            }
        })
    }

    removeInput(canvasElement) {
        let matrixConnected = false;
        for (let i = 0; i < this.inputs.length; i++) {
            if (this.inputs[i].canvasElementId === canvasElement.id) {
                canvas_elements[this.inputs[i].lineId].remove(); // entfernt die Verbindungslinie von der Canvas
                this.DOM.querySelectorAll('.neuron-input')[i].remove(); // entfernt das Input-Symbol (Dreieck)
                this.inputs.splice(i,1); // entfernt den Input aus der Input-Liste
                i--;
                this.resizeInputs();
            }
            else if(this.inputs[i].row !== null){
                matrixConnected = true;
            }     
        }
        this.matrixConnected= matrixConnected;
        this.adjustLines();
    }

    // Muss ausgeführt werden, wenn sich die Anzahl der Inputs ändert
    resizeInputs() {
        this.DOM.querySelectorAll('.neuron-input').forEach(inputDOM => {
            inputDOM.style.maxHeight = 'calc((100% - 30px) / '+this.inputs.length+')';
        });
    }

    // Passe die Linien so an, dass sie genau an den Inputs anliegen
    adjustLines() {
        const boxReferencePoint = document.getElementById('referencePoint').getBoundingClientRect();
        // Input-Linien anpassen
        for (let i = 0; i < this.inputs.length; i++) {
            const boxInput = this.DOM.querySelectorAll('.neuron-input')[i].getBoundingClientRect();
            const end = [(1/canvasScale) * (boxInput.left-boxReferencePoint.left), (1/canvasScale) * (boxInput.top+boxInput.height/2-boxReferencePoint.top)];
            let start;
            const inputElement = canvas_elements[this.inputs[i].canvasElementId];
            // prüfe um welches CanvasElement es sich als Input handelt
            switch (inputElement.constructor.name) {
                case 'Neuron':
                    const boxOutput = canvas_elements[this.inputs[i].canvasElementId].DOM.querySelector('.neuron-output').getBoundingClientRect();
                    start = [(1/canvasScale) * (boxOutput.left+boxOutput.width-boxReferencePoint.left), (1/canvasScale) * (boxOutput.top+boxOutput.height/2-boxReferencePoint.top)];
                    break;
                default: // Matrix
                    //filtere nach der richtigen Linie der Matrix
                    const matrixOutput = globalThis.canvasMatrixOutputLines.filter(line => {
                        return line.type === 'entry' && line.row===this.inputs[i].row && line.col ===this.inputs[i].col
                    });
                    const matrixOutputLineId = matrixOutput[0].lineId;
                    start = canvas_elements[matrixOutputLineId].end;
                    break;
            }
            const line = canvas_elements[this.inputs[i].lineId];
            line.start = start;
            line.end = end;
            line.draw(false);
        }

        // Output-Linien anpassen
        const boxOutput = this.DOM.getBoundingClientRect();
        for (const [id, canvasElement] of Object.entries(canvas_elements)) {
            if (canvasElement.constructor.name === 'Neuron') {
                for (let i = 0; i < canvasElement.inputs.length; i++) {
                    if (canvasElement.inputs[i].canvasElementId === this.id) {
                        const boxInput = canvasElement.DOM.querySelectorAll('.neuron-input')[i].getBoundingClientRect();
                        const start = [(1/canvasScale) * (boxOutput.left+boxOutput.width-boxReferencePoint.left), (1/canvasScale) * (boxOutput.top+boxOutput.height/2-boxReferencePoint.top)];
                        const end = [(1/canvasScale) * (boxInput.left-boxReferencePoint.left), (1/canvasScale) * (boxInput.top+boxInput.height/2-boxReferencePoint.top)];
                        const line = canvas_elements[canvasElement.inputs[i].lineId];
                        line.start = start;
                        line.end = end;
                        line.draw(false);
                    }
                }
            }
            if(canvasElement.constructor.name==='Output'|| canvasElement.constructor.name === 'EOutput'){
                if(canvasElement.inputId===this.id){
                    const boxInput = canvasElement.DOM.querySelector('.output-icon').getBoundingClientRect();
                    const start = [(1/canvasScale) * (boxOutput.left+boxOutput.width-boxReferencePoint.left), (1/canvasScale) * (boxOutput.top+boxOutput.height/2-boxReferencePoint.top)];
                    const end = [(1/canvasScale) * (boxInput.left-boxReferencePoint.left), (1/canvasScale) * (boxInput.top+boxInput.height/2-boxReferencePoint.top)];
                    const line = canvas_elements[canvasElement.lineId];
                    line.start = start;
                    line.end = end;
                    line.draw(false);
                }
            }
        }
    }

    archiveInputWeights() {
        this.inputs.forEach(input => {
            input.weights.push(input.weights[input.weights.length-1]);
        });
    }

    // setze Gewicht des Inputs "index" auf Wert "value" und zeige letztes Gewicht (zu testzwecken) an.
    setInputWeight(index, value = 0) {
        // this.DOM.querySelectorAll('.neuron-input-last-weight')[index].innerHTML = this.inputs[index].weights[this.inputs[index].weights.length-1];
        this.inputs[index].weights[this.inputs[index].weights.length-1] = value;
        this.DOM.querySelectorAll('input.neuron-input-weight')[index].value = value;
        // todo: lösche die folgezeile wenn man nicht mehr debugged
        this.DOM.querySelectorAll('.neuron-input-weight')[index].value = value;
    }

    setBias(value = 0, locked= false) {
        this.bias = value;
        this.DOM.querySelector('.bias-input-value').value = value;
        if(locked === true){
            this.DOM.querySelector('.bias-input-value').classList.add('locked');
        }
    }

    onChange() {
        const weightInputs = this.DOM.querySelectorAll('input.neuron-input-weight');
        for (let i = 0; i < weightInputs.length-1; i++) {
            let value = parseFloat(weightInputs[i].value);
            if (isNaN(value)) {
                value = 0;
                weightInputs[i].value = value;
            }
            this.inputs[i].weights[this.inputs[i].weights.length-1] = value;
        }

        const biasInput = this.DOM.querySelector('.bias-input-value');
        let newBias = parseFloat(biasInput.value);
        if (isNaN(newBias)) {
            biasInput.value = this.bias;
        } else {
            this.bias = newBias;
        }
        updateSidebar();
    }

    // aktualisiere den Ausgabewert this.value
    update() {
        let sum = 0;
        if(document.getElementById('inputBiasActive').checked){
            sum = this.bias;
        }
        this.inputs.forEach(inputItem => {
            const inputWeight = inputItem.weights[inputItem.weights.length-1];
            switch (canvas_elements[inputItem.canvasElementId].type){
                case 0: // Neuron
                    sum += inputWeight * canvas_elements[inputItem.canvasElementId].value;
                    break;
                case 2: // Matrix
                    sum += inputWeight * getCurrentMatrix().getValue(inputItem.row,inputItem.col);
                    break;
            }
        });
        this.netValue = sum;
        this.value = linearityFunctions[getSelectedLinearityFunction()](sum);
        this.setColor('');
        updateSidebar();
    }

    // hebe alle Verknüpfungen auf
    clear() {
        // entferne Input-Linien
        this.inputs.forEach(inputItem => {
            canvas_elements[inputItem.lineId].remove();
        });

        // entferne Output-Linien
        for (const [id, canvasElement] of Object.entries(canvas_elements)) {
            if (canvasElement.constructor.name === 'Neuron') {
                for (let i = 0; i < canvasElement.inputs.length; i++) {
                    if (canvasElement.inputs[i].canvasElementId === this.id) {
                        canvasElement.removeInput(this);
                        i--;
                    }
                }
            }
            if(canvasElement.constructor.name === 'Output' || canvasElement.constructor.name === 'EOutput'){
                if(canvasElement.inputId===this.id){
                    canvasElement.removeInput();
                }
            }
        }

    }
}

function initializeWeights() {
    minValue = parseFloat(document.getElementById('minWeight').value);
    maxValue = parseFloat(document.getElementById('maxWeight').value);
    return Math.random()*(maxValue-minValue)+ minValue;
}

function initializeWeightsOfSingleNeuron(neuron) {
    const neuronInputList = neuron.DOM.querySelectorAll(".neuron-input-weight");
    for (let j = 0; j < neuronInputList.length - 1; j++) {
        const input = neuron.inputs[j];
        neuron.setInputWeight(j, initializeWeights());
    }
    neuron.setBias(initializeWeights());

}

function initializeAllNeurons() {
    neuronIds = getCanvasElements('Neuron');
    for (let i = 0; i < neuronIds.length; i++) {
        neuron = neuronIds[i];
        initializeWeightsOfSingleNeuron(neuron);
    }
    return;
}