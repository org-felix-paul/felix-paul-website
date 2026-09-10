function getMatrixSize() {
    const matrix = getCurrentMatrix();
    if (matrix === undefined) {
        return {
            n: null,
            m: null
        };
    }
    return {
        n: matrix.n,
        m: matrix.m
    };
}

function setMatrixSize(n = 2, m = 2) {
    for(const [id, matrix] of Object.entries(matrix_list)){
        matrix.resize(n,m,false);
    }
    updateSidebar();
}

function clearCanvasMatrixLines() {
    //lösche die Inputs an den Neuronen die von der Matrix kommen
    getCanvasElements('Neuron').forEach(neuron => {
        neuron.inputs.forEach(
            input => {
                if(input.canvasElementId === canvasMatrix.id){
                    neuron.removeInput(canvasMatrix)
                }
            }
        )
    })

    globalThis.canvasMatrixOutputLines.forEach(outputLine => {
        canvas_elements[outputLine.lineId].remove();
    });
    globalThis.canvasMatrixOutputLines = [];
}

function updateCanvasMatrix() {
    const oldN = globalThis.canvasMatrix.DOM.querySelectorAll('tr').length;
    const oldM = globalThis.canvasMatrix.DOM.querySelectorAll('tr:first-of-type td').length;

    const currentMatrix = getCurrentMatrix()
    
    if (oldN !== currentMatrix.n || oldM !== currentMatrix.m) {
        clearCanvasMatrixLines();
        for (let i = 0; i < currentMatrix.n; i++) {
            const line = new Line();
            globalThis.canvasMatrixOutputLines.push({
                lineId: line.id,
                type: 'row',
                row: i
            });
            for (let j = 0; j < currentMatrix.m; j++) {
                const line = new Line();
                globalThis.canvasMatrixOutputLines.push({
                    lineId: line.id,
                    type: 'entry',
                    row: i,
                    col: j
                });
            }
        }
    }

    let ihtml = '<table>';
    for (let i = 0; i < currentMatrix.n; i++) {
        ihtml += '<tr>';
        for (let j = 0; j < currentMatrix.m; j++) {
            ihtml += '<td><input value="'+currentMatrix.values[i][j]+'" data-col="'+i+'" data-row="'+j+'"/></td>';
        }
        ihtml += '</tr>';
    }
    globalThis.canvasMatrix.DOM.innerHTML = ihtml;

    for (let i = 0; i < currentMatrix.n; i++) {
        for (let j = 0; j < currentMatrix.m; j++) {
            globalThis.canvasMatrix.DOM.querySelector('[data-col="'+i+'"][data-row="'+j+'"]').onclick = () => {
                globalThis.selectedRow = i;
                globalThis.selectedCol = j;
            }
        }
    }

    //update den soll Wert der EOutputs
    getCanvasElements('EOutput').forEach(eoutput => {
        for(const labelId in currentMatrix.labels){
            if(eoutput.id === labelId){
                eoutput.setExpectedValue(currentMatrix.labels[labelId]);
            }
        }
    })

    adjustCanvasMatrixLines();
}

function adjustCanvasMatrixLines() {
    const boxReferencePoint = document.getElementById('referencePoint').getBoundingClientRect();
    const boxMatrix = globalThis.canvasMatrix.DOM.getBoundingClientRect();
    //zeichne die Linien die fest an der Matrix sind korrekt
    globalThis.canvasMatrixOutputLines.forEach(outputLine => {
        const line = canvas_elements[outputLine.lineId];
        const boxRow = globalThis.canvasMatrix.DOM.querySelectorAll('table tr')[outputLine.row].getBoundingClientRect();
        switch (outputLine.type) {
            case 'row':
                line.start = [(1/canvasScale) * (boxRow.left+boxRow.width-boxReferencePoint.left), (1/canvasScale) * (boxRow.top+boxRow.height/2-boxReferencePoint.top)];
                line.end = [line.start[0]+(getCurrentMatrix().n-outputLine.row)*60,line.start[1]];
                break;
            case 'entry':
                line.start = [(1/canvasScale) * (boxRow.left+boxRow.width-boxReferencePoint.left)+(getCurrentMatrix().n-outputLine.row)*60, (1/canvasScale) * (boxRow.top+boxRow.height/2-boxReferencePoint.top)];
                line.end = [line.start[0]+(getCurrentMatrix().n+outputLine.row)*30, line.start[1]+(outputLine.row*getCurrentMatrix().m + outputLine.col)*60];
                break;
        }
        line.draw(false);
    });
    //zeiche Linien zu den Neuronen korrekt
    getCanvasElements('Neuron').forEach(
        neuron => {
            neuron.inputs.forEach(
                input => {
                    //schaue für jeden Neuronen input ob er von einer Matrix kommt
                    if(input.col !== null && input.row !== null){
                        //finde die passende Output-Line der Matrix dazu
                        const correspondingMatrixLine = globalThis.canvasMatrixOutputLines.filter(
                            line => {
                                return line.type === 'entry' && line.row === input.row && line.col === input.col
                            }
                        )[0]
                        const line = canvas_elements[input.lineId];
                        line.start =canvas_elements[correspondingMatrixLine.lineId].end;
                        line.draw(false);
                    }
                }
            )
        }
    )
}

function initCanvasMatrix(matrix, left = 0, top = 0, canvasMatrixId = -1) {
    // Startmatrix
    globalThis.currentMatrix = matrix;

    globalThis.canvasMatrix = new CanvasElement(undefined, left, top, 2, canvasMatrixId);
    globalThis.canvasMatrix.setDraggable(true);
    globalThis.canvasMatrix.DOM.classList.add('matrix');
    globalThis.canvasMatrix.type = 2;

    globalThis.canvasMatrixOutputLines = [];

    getCurrentMatrix().display();

    canvasMatrix.DOM.addEventListener('change',() => {
        let valuesTmp = [];
        for (let i = 0; i < getCurrentMatrix().n; i++) {
            valuesTmp.push([]);
            for (let j = 0; j < getCurrentMatrix().m; j++) {
                const element = canvasMatrix.DOM.querySelector('[data-col="'+i+'"][data-row="'+j+'"]');
                valuesTmp[i].push(parseFloat(element.value));
                if (isNaN(valuesTmp[i][j])) {
                    valuesTmp[i][j] = 0;
                    element.value = valuesTmp[i][j];
                }
            }
        }
        getCurrentMatrix().values = valuesTmp;
        getCurrentMatrix().draw();
    });

    canvasMatrix.ondrag = () => {
        adjustCanvasMatrixLines();
    }

    canvasMatrix.onremove = () => {
        clearCanvasMatrixLines();
    }

    canvasMatrix.DOM.addEventListener('click', () => {
        switch (getTool()) {
            case 'move':
                globalThis.selectedCanvasElementId = canvasMatrix.id;
                break;
            case 'link':
                if (getLinkingToolStatus() === 'select-output') {
                    globalThis.selectedCanvasElementId = canvasMatrix.id;
                    setLinkingToolStatus('select-input');
                }
        }
    });
}




function getCurrentMatrix() {
    return globalThis.currentMatrix;
}


function newMatrix(display = true, update_sidebar = true) {
    const matrix = new Matrix(getMatrixSize().n, getMatrixSize().m, [[]], {}, -1, (update_sidebar && !display));
    if (display) {
        matrix.display(update_sidebar);
    }
}


function  resizeMatrix(update_sidebar = true) {
    var n = parseInt(document.getElementById("nVal").value);
    var m = parseInt(document.getElementById("mVal").value);

    for(const[id, matrix] of Object.entries(matrix_list)){
        let resize_matrix = [];
        for(let i = 0; i < n; i++){
            resize_matrix.push([]);
            for(let j = 0; j < m; j++){
                if(typeof matrix_list[matrix.id].values[i] === 'undefined'){
                    resize_matrix[i].push(0);
                    continue;
                }
                if(typeof matrix_list[matrix.id].values[i][j] === 'undefined'){
                    resize_matrix[i].push(0);
                }
                else{
                    resize_matrix[i].push(matrix_list[matrix.id].values[i][j]);
                }
            }
        }
        matrix_list[matrix.id].n = n;
        matrix_list[matrix.id].m = m;
        matrix_list[matrix.id].values = resize_matrix;
    }

    let tmp_layers = []
    for(const[id, canvas] of Object.entries(canvas_elements)){
        if(canvas_elements[canvas.id].constructor.name === 'Neuron'){
            tmp = canvas_elements[canvas.id];
            if(tmp.matrixConnected == true){
                tmp_layers.push(tmp);
            }
        }
    }

    updateCanvasMatrix();

    if (update_sidebar) {
        updateSidebar();
    }

    for(let k = 0; k < getCurrentMatrix().n; k++){
        for(let z = 0; z < getCurrentMatrix().m; z++){
            for(let t = 0; t < tmp_layers.length; t++){
                tmp_layers[t].addInput(globalThis.canvasMatrix, initializeWeights(), k, z);
            }
        }
    }
}


let matrix_list = {};

class Matrix {
    constructor(n = 2,m = 2, values=[[]], labels = {}, id = -1, update_sidebar = true) {
        this.n = n;
        this.m = m;
        this.isTestMatrix = false;
        if(id === -1 || document.getElementById(id) !== null ) {
            this.id = generateUniqueId();
        }
        else {
            this.id = id
        }

        this.labels = labels;
        
        matrix_list[this.id] = this;

        this.values = values;

        this.resize(this.n,this.m,update_sidebar);
    } // Ende Constructor

    draw(update_sidebar = true) {
        if (this.isDisplayed()) {
            updateCanvasMatrix(this.n,this.m);
        }

        if (update_sidebar) {
            updateSidebar();
        }
    }

    resize(n = 2,m = 2, update_sidebar = true) {
        this.n = Math.max(n,1);
        this.m = Math.max(m,1);
        let valuesTmp = [];
        for (let i = 0; i < this.n; i++) {
            valuesTmp.push([]);
            for (let j = 0; j < this.m; j++) {
                valuesTmp[i].push(this.getValue(i,j) !== null ? this.getValue(i,j) :  1);
            }
        }

        this.values = valuesTmp;

        this.draw(update_sidebar);
    }

    setValue(row = 0, col = 0, value = 0, update_sidebar = true) {
        this.values[row][col] = value;
        if (this.isDisplayed()) {
            this.display(update_sidebar);
        }
    }

    getValue(row = 0, col = 0) {
        if (this.values[row] != null && this.values[row][col] != null) {
            return this.values[row][col];
        }
        return null;
    }

    getMinValue() {
        let min = Infinity;
        this.values.forEach(row => {
            row.forEach(entry => {
                min = Math.min(min, entry);
            });
        });
        return min;
    }

    getMaxValue() {
        let max = 0;
        this.values.forEach(row => {
            row.forEach(entry => {
                max = Math.max(max, entry);
            });
        });
        return max;
    }

    //setze das Label für den EOutput mit der uniqueId uniqueIdOfLabel
    setLabel(uniqueIdOfEOutput, value = 0) {
        this.labels[uniqueIdOfEOutput] = value;
    }

    getLabel(unique_id = 0) {
        return this.labels[unique_id] || 0;
    }

    removeLabel(unique_id){
        delete this.labels[unique_id];
    }

    isDisplayed() {
        return (getCurrentMatrix() === this);
    }

    display(update_sidebar = true) {
        globalThis.currentMatrix = this;
        this.draw(update_sidebar);
        let layers = sortNetwork(false)[0];
        updateNetwork(layers);
    }

    remove(update_sidebar = true) {
        //Displayed Matrix wird nicht gelöscht, aber ihre Werte werden auf 0 zurückgesetzt
        if (this.isDisplayed()){
            for(let i = 0; i < matrix_list[this.id].n; i++){
                for(let j = 0; j < matrix_list[this.id].m; j++){
                    matrix_list[this.id].values[i][j] = 0;
                }
            }
            updateCanvasMatrix();
            return;
        }
        delete matrix_list[this.id];
        delete this;
        if (update_sidebar) {
            updateSidebar();
        }
        return true;
    }
}

function getGlobalMinValue() {
    let min = Infinity;
    for (const [id, matrix] of Object.entries(matrix_list)) {
        min = Math.min(min, matrix.getMinValue());
    }
    return min;
}

function getGlobalMaxValue() {
    let max = 0;
    for (const [id, matrix] of Object.entries(matrix_list)) {
        max = Math.max(max, matrix.getMaxValue());
    }
    return max;
}