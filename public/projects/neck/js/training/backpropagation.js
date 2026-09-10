// todo: teste warum backpropagation nur den bias lernt
// beobachtung
// - bias wird mit und ohne animation identisch angepasst

// returned ein array mit den Ids der Output Neuronen
// siehe debug lines um das neuron zu erhalten
function getOutputNeurons() {
	let outputNeurons = [];
	eoutputs = getCanvasElements("EOutput");
	for (let i = 0; i < eoutputs.length; i++) {
		outputNeurons.push(eoutputs[i].inputId);
		// start debug
		neuron = canvas_elements[eoutputs[i].inputId];
		if (animation) neuron.DOM.classList.add("isInOutputNeuronenListe");
		// end debug
	}
	return outputNeurons;
}

async function updateWeightsOfOneNeuron(neuron) {
	const learningRate = getStartingHeatFactor();
	neuron.DOM.classList.add("visitedNeuron");
	const neuronInputList = neuron.DOM.querySelectorAll(".neuron-input-weight");
	// hier gehen wir die input weights durch
	for (let k = 0; k < neuronInputList.length - 1; k++) {
		//Training Finished das heißt Training soll abgebrochen werden
		if (trainingFinished) {
			return null;
		}
		const input = neuron.inputs[k];
		if (!neuronInputList[k].className.includes("locked")) {
			let inputWeight = input.weights[input.weights.length - 1];
			let x_ij = 0;
			switch (canvas_elements[input.canvasElementId].type) {
				case 0: // Neuron
					x_ij = canvas_elements[input.canvasElementId].value;
					if (animation)
						canvas_elements[input.canvasElementId].DOM.classList.add(
							"vorgaengerneuron"
						);
					break;
				case 2: // Matrix
					x_ij = getCurrentMatrix().getValue(input.row, input.col);
					break;
			}
			const changeOfWeight = learningRate * x_ij * neuron.delta;
			const selectedInput = neuron.DOM.querySelectorAll(
				"input.neuron-input-weight"
			)[k];
			if (animation) {
				if (changeOfWeight > 0) {
					// wird kleiner
					selectedInput.classList.add("lower");
				} else {
					if (changeOfWeight < 0) {
						// wird größer
						selectedInput.classList.add("higher");
					} else {
						selectedInput.classList.add("same");
					}
				}
			}
			inputWeight -= changeOfWeight;
			neuron.setInputWeight(k, inputWeight);
			if (animation) selectedInput.classList.add("gewichtaktualisiert");
		} // end if
		if (animation) await pause(getRoundDuration());
		for (
			let index = 0;
			index < Object.values(canvas_elements).length;
			index++
		) {
			Object.values(canvas_elements)[index].DOM.classList.remove(
				"vorgaengerneuron"
			);
		}
	}
	// passe bias auch an wenn bias aktiviert ist und nicht gelockt ist
	if (
		document.getElementById("inputBiasActive").checked &&
		!neuron.DOM.querySelector(
			".bias-input-value"
		).attributes[0].nodeValue.includes("locked")
	) {
		neuron.setBias(neuron.bias - learningRate * 1 * neuron.delta);
		if (animation)
			neuron.DOM.querySelector(".bias-input-value").classList.add(
				"gewichtaktualisiert"
			);
		if (animation) await pause(getRoundDuration());
	}
}

// aktualisiere die gewichte
//für jedes unlocked und nicht freie Gewicht aktualisiere Gewicht
//Heatfaktor zwischne 0 und 1
//delta_w_i_j = Heatfaktor * temp_i * value_i_j
async function updateEachWeight(layers) {
	const numberOfLayers = Object.keys(layers).length;
	for (let i = 0; i < numberOfLayers; i++) {
		layer = layers[i];
		for (let j = 0; j < layer.length; j++) {
			neuronId = layer[j];
			const neuron = canvas_elements[neuronId];
			await updateWeightsOfOneNeuron(neuron); // input weights schleife
			// end input weight schleife
			removeDebuggingColor();
		}
	}
} // layer schleife

function removeDebuggingColor(inputWeights = false) {
	for (let index = 0; index < Object.values(canvas_elements).length; index++) {
		Object.values(canvas_elements)[index].DOM.classList.remove(
			"OutputToCurrentOutputNeuron"
		);
		Object.values(canvas_elements)[index].DOM.classList.remove(
			"isInOutputNeuronenListe"
		);
		Object.values(canvas_elements)[index].DOM.classList.remove("visitedNeuron");
		Object.values(canvas_elements)[index].DOM.classList.remove(
			"nachfolgeneuron"
		);
		Object.values(canvas_elements)[index].DOM.classList.remove(
			"vorgaengerneuron"
		);
		if (inputWeights) {
			Object.values(canvas_elements)
				[index].DOM.querySelectorAll(
					"input.neuron-input-weight, .bias-input-value"
				)
				.forEach((inputweight) =>
					inputweight.classList.remove("gewichtaktualisiert")
				);
		}
	}
}

async function backpropagation(layers, oldError) {
	//gehe für jede Matrix durch
	for (const matrixId in matrix_list) {
		const currentMatrix = matrix_list[matrixId];
		currentMatrix.display(animation); // also updates network
		// todo: noch implementieren
		//update Network damit outputs stimmen
		updateNetwork(layers);
		removeDebuggingColor(true);
		//entferne visualisierung von ausgewählten Gewichten
		unvisualizeSelectedWeight();
		//finde alle Outputneuronen
		// in dieser liste stehen nur deren ids
		outputNeurons = getOutputNeurons();
		// -----------------------------------!PASST!-----------------------------------
		const numberOfLayers = Object.keys(layers).length;
		// gehe layer von hinten nach vorne durch

		// BERECHNE DELTA FÜR ALLE NEURONEN
		for (let i = numberOfLayers - 1; i >= 0; i--) {
			//TODO verbiete das Neuron ein Outputneuron und ein Neuron eines Hidden Layers ist
			//gehe jedes Neuron des Layers durch
			for (let j = 0; j < layers[i].length; j++) {
				//Training Finished das heißt Training soll abgebrochen werden
				if (trainingFinished) {
					alert("Training abgebrochen.");
					return null;
				}
				// lösche formatierung um alles für nächstes neuron zu testen
				removeDebuggingColor();
				neuronId = layers[i][j];
				neuron = canvas_elements[neuronId];
				neuron.DOM.classList.add("visitedNeuron");
				//wenn Outputneuron berechne delta
				//delta=output(1-output)(zielWert - output)
				//Soll[-1] weil soll ein Array ist
				// finde output zu outputneuron
				if (outputNeurons.includes(neuronId)) {
					const targetEOutput = getCanvasElements("EOutput").find(
						(output) => output.inputId === neuronId
					);
					const targetValue = targetEOutput.getTargetValue();
					// hier mit ableitung der aktivierungsfunktion
					neuron.delta =
						derivationLinearityFunctions[getSelectedLinearityFunction()](
							neuron.netValue
						) *
						(neuron.value - targetValue); // VL Formel: neuron.value * (1 - neuron.value) * (targetValue - neuron.value);
					// start debug
					if (animation)
						targetEOutput.DOM.classList.add("OutputToCurrentOutputNeuron");
					// pause hier
					if (animation) await pause(getRoundDuration());
					// end debug
				}
				//wenn Neuron des hidden layers berechne delta:
				//delta = output(1-output)*summeÜberNachfolgendeNeuronen(gewicht_Kante_Aktuell_Nacholger * delta_von_Nachfolger)
				else {
					//bekomme alle nachfolgenden Neuronen um deren delta zu bekommen
					let summeIndelta = 0;
					getCanvasElements("Neuron").forEach(async (checkNeuron) => {
						const inputs = checkNeuron.inputs;
						for (const input in checkNeuron.inputs) {
							// neuron ist ein nachfolgeneuron
							if (inputs[input].canvasElementId === neuronId) {
								summeIndelta +=
									inputs[input].weights[inputs[input].weights.length - 1] *
									checkNeuron.delta;
								if (animation) checkNeuron.DOM.classList.add("nachfolgeneuron");
								if (animation) await pause(getRoundDuration());
								break;
							}
						}
					});
					// bias bei delta berechnung irrelevant weil keine kante von neuron - checkneuron auf einen bias geht
					// bias nur für output des neurons relevant und da wird er automatisch berücksichtigt oder eben nicht
					delta = summeIndelta;
					neuron.delta =
						derivationLinearityFunctions[getSelectedLinearityFunction()](
							neuron.netValue
						) * delta;
					if (animation) neuron.DOM.classList.add("visitedNeuron");
					if (animation) await pause(getRoundDuration());
				} // end else zweig
			} // end gehe durch neuronen des layers
		} // end gehe durch layer
		removeDebuggingColor();
		await updateEachWeight(layers);
		//Training Finished das heißt Training soll abgebrochen werden
		if (trainingFinished) {
			alert("Training abgebrochen.");
			return null;
		}
		predictNetwork();
	}
	return Infinity;
}
