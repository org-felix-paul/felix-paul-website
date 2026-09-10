// haben als Informationen layers, roundNumber, oldError zu Verfügung
    // und natürlich kann man auf jedes Element der Website zugreifen und dieses auslesen
    // sie Beispielcode unten um auf Neuronen der versch. Ebenen zuzugreifen und deren Gewichte, Vorgängerneuronen etc. 
    // man muss nur eine Runde des Verfahrens implementieren - mehrere Runden zu trainieren geht dann automatisch
    console.log("starte Skript das aus externer Datei geladen wurde aus Datensätze/scripte ordner")
    //update Network damit outputs stimmen
    updateNetwork(layers);
    numberOfLayers = Object.keys(layers).length
    // gehe Layer durch - das sind die Spalten in denen die Neuronen aufgeteilt sind
    for (let i = 0; i < numberOfLayers; i++) {
        layer = layers[i];
        // gehe Neuronen des Layers durch
        for (let j = 0; j < layer.length; j++) {
            neuronId = layer[j];
            const neuron = canvas_elements[neuronId];
            // hole dir alle Gewichte des Neurons
            const neuronInputList = neuron.DOM.querySelectorAll(".neuron-input-weight");
            for (let k = 0; k < neuronInputList.length - 1; k++) {
                // hole dir das inputneuron oder den inputeintrag der matrix zu dem gewicht
                const input = neuron.inputs[k];
                // nur wenn neuron nicht gesperrt ist
                if (!neuronInputList[k].className.includes('locked')) {
                    let inputWeight = input.weights[input.weights.length - 1];
                    let InputWertVonVorgänger = 0;
                    switch (canvas_elements[input.canvasElementId].type) {
                        case 0: // Neuron
                            InputWertVonVorgänger = canvas_elements[input.canvasElementId].value;
                            break;
                        case 2: // Matrix
                            InputWertVonVorgänger = getCurrentMatrix().getValue(input.row, input.col);
                            break;
                    }
                    // hole die die aktuelle Lernrate - diese bleibt konstant, wenn man getStartingHeatFactor verwendet
                    // verwendet man setHeatFactor() so nimmt die Lernrate mit den Runden ab
                    learningRate = getStartingHeatFactor() / 1000;
                    // hier haben wir ein einfaches Verfahren implementiert was nicht lernt, sondern nur als Gewicht
                    // den Wert vom Neuron oder der Matrix davor verwendet
                    inputWeight = InputWertVonVorgänger;
                    // hier wird das Gewicht tatsächlich verändert 
                    neuron.setInputWeight(k, inputWeight);
                }
            }
        }
    }
    //lies die neuen Gewichte der Neuronen ein
    onChangeNeurons();
    // berechne den neuen Fehler in Abhängigkeit der Fehlermetrik, dieser newError muss berechnet werden,
    // damit das Programm mehrere Runden trainieren kann mit deinem Verfahren
    newError = calculateTotalError(); // der muss berechnet werden damit man mehrere Runden trainieren kann!
    newError + 0; // diese Zeile ist notwendig, damit der newError durch eine interne eval Funktion in das Programm übergeben werden kann
