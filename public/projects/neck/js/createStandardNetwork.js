function getInformationToCreateNetwork() {
    let nNeurons = parseInt(document.getElementById("nNeurons").value);
    let mLayer = parseInt(document.getElementById("mLayers").value);
    if (nNeurons > 30) nNeurons=30;
    if (mLayer > 30) mLayer = 30;
    if (nNeurons <1) nNeurons = 2;
    if (mLayer <1) mLayer=2;
    if (isNaN(mLayer) || isNaN(nNeurons)){
        alert("Anzahl Layer oder Neuronen war leer. Setze Anzahl auf 2");
        nNeurons = 2;
        mLayer= 2;  
    }
    mLayer--;
    // läsche Neuronen und Linien
    
    neuronen = getCanvasElements("Neuron");
    for (let i=0; i< neuronen.length; i++) {
        neuronen[i].remove();
    }
    lines = getCanvasElements("Lines");
    for (let i=0; i< lines.length; i++) {
        lines[i].remove();
    }
    
    
    
    // [[layer0], ..., [layerm-1]]
    // erzeuge Neuronen
    layers = []
    for (let i=0; i< mLayer; i++) {
        let layer = [];
        for (let j=0; j<nNeurons; j++) {
            layer.push(new Neuron(1*((2+i*3)*225)+(200),(60+j*250)+60));
        }
        layers.push(layer);
    }

    // verbinde Neuronen
    for (let i = 1; i < layers.length; i++) {
        const layer = layers[i];
        const prev_layer = layers[i-1];
        layer.forEach(outputNeuron => {
            prev_layer.forEach(inputNeuron => {
                outputNeuron.addInput(inputNeuron);
            });
        });
    }
    // verbinde Matrix mit Neuronen des ersten Layer
    for (let i = 0; i < getCurrentMatrix().n; i++) {
        for (let j = 0; j < getCurrentMatrix().m; j++) {
            layers[0].forEach(neuron => {
                neuron.addInput(globalThis.canvasMatrix, (2*Math.random()/10 - 0.1), i, j);
            });
        }
    }
    max_x = 1*((2+(mLayer-1)*3)*225)+(200);
    // erzeuge layer der outputneuronen
    outputLayer = [];
    for (let i=0; i< Object.keys(getCurrentMatrix().labels).length ; i++) {
        outputLayer.push(new Neuron(max_x+800, 250*(i+1)));
    }
    eoutputs = getCanvasElements('EOutput');
    for(let i=0; i< eoutputs.length; i++) {
        eoutput = eoutputs[i];
        eoutput.setInput(outputLayer[i]);
    }

    // verbinde neuronen der vorletzten ebene mit den output neuronen
        const layer = outputLayer;
        const prev_layer = layers[layers.length -1];
        layer.forEach(outputNeuron => {
            prev_layer.forEach(inputNeuron => {
                outputNeuron.addInput(inputNeuron);
            });
        });
    sortNetwork(true);
}