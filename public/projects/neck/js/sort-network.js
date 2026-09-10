// sortiert die Neuronen und passt deren x, y - Koordinate an
// löscht unverbundene Neuronen!
function sortNetwork(printNetwork = true) {
    for (const unique_id in canvas_elements) {
        switch (canvas_elements[unique_id].constructor.name) {
            case 'Neuron':
                const neuron = canvas_elements[unique_id];
                // Filtere alle Matrixinputs der Neuronen
                const matrixInputs = neuron.getInputNeurons().filter(element => {
                    return element.type === 2 // Matrix
                })
                //wenn es Matrixinputs hat, ist es Ebene 0
                if ( matrixInputs.length > 0){
                    neuron.layer = 0;
                    updateLayer(neuron);
                }
        }
    }
    // layerProperties[0] = layers, layerProperties[1] = layersizes, layerProperties[2] =  biggestLayerSize
    const layerProperties = sortNeuronsByLayer();
    // alle neuronen haben den richtigen layer - plotte hier
    if(printNetwork){
        printSortedNetwork(layerProperties[0], layerProperties[1], layerProperties[2]);
    }
    else {
        return layerProperties;
    }
}

// berechnung der Layer jedes Neurons
// rekursive anpassung der Layer der Kinder
function updateLayer(neuron) {
    const children = neuron.getOutputNeurons();
    for (const i in children) {
        const child = children[i];
        child.layer = Math.max(neuron.layer + 1, child.layer);
        updateLayer(child);
    }
}

// berechnet metadaten für eine erfolgreiche anpassung der x,y koordinaten
// layers ist ein Dictionary das als keys den layer hat und als values die neuronenids die dieses layer haben
// biggestLayerSize ist die max anzahl an Neuronen über alle Layer - nutze dies um Layer zu zentrieren
// layersizes enthält für alle Layer die Anzahl an Neuronen des Layers
function sortNeuronsByLayer() {
    let layers = {};
    for (const unique_id in canvas_elements) {
        switch (canvas_elements[unique_id].constructor.name) {
            //Fall wenn es ein Neuron ist
            case 'Neuron':
                const neuron = canvas_elements[unique_id];
                if(neuron.layer === -1){
                    // lösche neuronen die nicht nachfolger einer matrix sind
                    neuron.remove();
                }
                else {
                    if (layers[neuron.layer]) {
                        layers[neuron.layer] = layers[neuron.layer].concat([unique_id]);
                    } else {
                        layers[neuron.layer] = [unique_id]
                    }
                }
        }
    }
    let layersizes = [];
    for (const key in layers) {
        layersizes.push(layers[key].length);
    }
    const biggestLayerSize = Math.max(...layersizes);
    return [layers, layersizes, biggestLayerSize];
}

//verschiebt die Matrix und gibt die rechte Position zurück
function moveMatrix() {
    return new Promise(async resolve => {
        const matrix = document.querySelector('.matrix');
        matrix.style.left = 0 +'px';
        matrix.style.top = 0 +'px' ;
        await pause(300); //warte dass die Matrix visuell verschoben ist
        adjustCanvasMatrixLines();
        await pause(300); //warte dass die Linien der Matrix visuell verschoben sind
        const matrixLine =globalThis.canvasMatrixOutputLines.find(line =>{
            return line.type === 'entry'
        })
        resolve(canvas_elements[matrixLine.lineId].end[0]);
    })
}

function moveNeurons(layers, layersizes, biggestLayerSize, leftBorderSize) {
    return new Promise(resolve => {   
        const maxHeigth = biggestLayerSize * 150 + (biggestLayerSize -1) * 50 //size 150 für jeder Neuron und 50 für die Abstände zwischen den Neuronen
        const topBorderSize = 50; //Abstand oberster Neuronen zum oberen Rand
        for (const layer in layers){
            const n = layersizes[layer]; // Anzahl von Neuronen in Layer0
            let spaceBetween = 0;
            if(n !== 1){
                spaceBetween = (maxHeigth- (n * 150)) / (n-1); 
            }
            let counter = 0;
            for (const i in layers[layer]){
                const neuron = canvas_elements[layers[layer][i]];
                if(n !== 1){                
                    neuron.DOM.style.top = calculateStickedCoordinates((counter* spaceBetween + 150* counter)+topBorderSize)+'px';
                }
                else{
                    neuron.DOM.style.top = calculateStickedCoordinates(maxHeigth/ 2 - 75 +topBorderSize)+'px';
                    //gesamthöhe minus der Hälfte der Neuronhöhe plus Abstand des Netzes zum oberen Rand
                }
                neuron.DOM.style.left = calculateStickedCoordinates((neuron.layer * 500)+ leftBorderSize)+'px';
                setTimeout(()=> {neuron.adjustLines(), resolve("finished")}, 300)               
                counter += 1;
            }
        }
    })
}

//Outputs verschieben, Outputs ohne Inputs werden gelöscht
function moveOutputs() {
    getCanvasElements('Output', 'EOutput').forEach(output => {
        if(output.inputId){
            const inputNeuron = canvas_elements[output.inputId];
            output.DOM.style.left = (parseFloat(inputNeuron.DOM.style.left) + 300) + 'px';
            output.DOM.style.top = (parseFloat(inputNeuron.DOM.style.top) + 50) + 'px';
            setTimeout(()=> {output.adjustLines()}, 300)
        }
        else {
            output.remove();
        }
    })
}

// passt nur die x und y Koordinate der Neuronen an
async function printSortedNetwork(layers, layersizes, biggestLayerSize) {
    //TODO:  sortierung seitlich passt aber es löscht nicht die unnötigen neuronen korrekt wenn diese vorher verbunden waren
    const leftBorderSize = await moveMatrix() + 200; //rightPositionOfMatrix + 100 //Abstand nach rechts
    await moveNeurons(layers, layersizes, biggestLayerSize, leftBorderSize)
    moveOutputs();    
}