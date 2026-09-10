// todo: speichere lernnrate aktuelle aktivierungsfunktion etc.
function saveNetwork() {
    //erstelle neues Dokument zum Downloaden
    let textDoc = document.createElement("a");
    JSONForSaving = getAllCanvasElementsForSaving()
    //gibt an das wir JSONForSaving als JSON speichern wollen
    textDoc.href = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(JSONForSaving));
    
    textDoc.target = '_blank'; //gibt an dass das Dokument im neuen Tab geöffnet wird - bei Text Datei aber anscheinend unnötig
    textDoc.download = "NECK.json"; //Dateiname
    textDoc.click(); //starte den Download
}

function getAllCanvasElementsForSaving() {
    //TODO also store locked field
    //erstelle ein neues Dictionnary um es später als JSON zu speichern
    let saved_Json = {};
    
    //speichere id_counter dass die Matrixlinien der Canvas Matrix keine benutzten
    //IDs überschreiben
    saved_Json['id_counter'] = ID_canvasScale;

    saved_Json['bias_active'] = getIsBiasActive();

    saved_Json['current_matrix_id'] = getCurrentMatrix().id;

    matrixSize = getMatrixSize();
    saved_Json['n'] = matrixSize.n;
    saved_Json['m'] = matrixSize.m;
    
    //die canvas Matrix speichern
    const canvasMatrix  = globalThis.canvasMatrix;
    saved_Json['canvas_matrix'] = {
        left: parseInt(canvasMatrix.DOM.style.left),
        top: parseInt(canvasMatrix.DOM.style.top),
        id: canvasMatrix.id,
    }
    //alle anzeigbaren MatrixValues speichern
    for(const matrix_id in matrix_list) {
        const matrix = matrix_list[matrix_id];
        saved_Json[matrix_id] = {
            id: matrix.id,
            values: matrix.values,
            labels: matrix.labels,
            class: 'Matrix'
        }
    }
    //iteriere über alle canvas elemente
    for (const unique_id in canvas_elements) {
        switch (canvas_elements[unique_id].constructor.name) {
            //Fall wenn es ein Neuron ist
            case 'Neuron':
                const neuron = canvas_elements[unique_id];
                //schaue welche der Inputs gesperrt sind
                const neuronInputList = neuron.DOM.querySelectorAll(".neuron-input-weight");
                let inputsForSaving = [];
                for(let i = 0; i<neuron.inputs.length; i++){
                    const input = neuron.inputs[i];
                    inputsForSaving.push(
                        {
                            canvasElementId: input.canvasElementId,
                            weights: input.weights,
                            row: input.row,
                            col: input.col,
                            locked: neuronInputList[i].className.includes('locked')
                        }
                    )
                }
                //gibt an ob der Bias des Neurons gepserrt ist
                const biasField = neuron.DOM.querySelector(".bias-input-value");
                const biasLocked = biasField.className.includes('locked');
                saved_Json[unique_id] = {
                    left: parseInt(neuron.DOM.style.left),
                    top: parseInt(neuron.DOM.style.top),
                    bias: neuron.bias,
                    biasLocked: biasLocked,
                    color: neuron.color,
                    inputs: inputsForSaving,
                    id: neuron.id,
                    class: 'Neuron',
                };
                break
            //Linien müssen wir nicht speichern
            //wir konstruieren die Linien beim Laden aus den anderen Canvas Elementen
            case 'EOutput':
                const eoutput = canvas_elements[unique_id];
                saved_Json[unique_id] = {
                    left: parseInt(eoutput.DOM.style.left),
                    top: parseInt(eoutput.DOM.style.top),
                    inputId: eoutput.inputId,
                    class: 'EOutput',
                };
                break
            case 'Output':
                const output = canvas_elements[unique_id];
                saved_Json[unique_id] = {
                    left: parseInt(output.DOM.style.left),
                    top: parseInt(output.DOM.style.top),
                    inputId: output.inputId,
                    class: 'Output',
                }
                break
        };
    }
    return saved_Json;
}