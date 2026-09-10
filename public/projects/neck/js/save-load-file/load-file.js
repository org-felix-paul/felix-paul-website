//lädt eine Datei
function loadFile(event) {
	//im HTML wird bereits eine Datei ausgewählt, gespeichert im event
	const input = event.target;
	const file = input.files[0];
	//der reader erwartet ein blob objekt und kein JavaScript plain object => caste die Datei
	const fileBlobbed = new Blob([file], { type: "application/json" });
	//erstelle neuen FileReader um die Datei zu lesen
	let reader = new FileReader();
	//wird aufgerufen sobald die Datei erfolgreich eingelesen wurde
	reader.onload = function () {
		const readedJsonString = reader.result;
		createLoadedNetwork(JSON.parse(readedJsonString));
	};
	//lese die Datei ein
	reader.readAsText(fileBlobbed);
}

function createLoadedNetwork(savedJsonFile) {
	removeAllCanvasElements(true);
	ID_canvasScale = savedJsonFile["id_counter"];

	const n = savedJsonFile["n"];
	const m = savedJsonFile["m"];
	//zeigt an ob bei der geladenen Matrix initCanvasMatrix aufgerufen werden muss
	let firstMatrixToReload = true;
	//iteriere über alle gespeicherten Canvas-Elemente
	for (const unique_id in savedJsonFile) {
		//schaue um welchen Typen es sich handelt
		switch (savedJsonFile[unique_id].class) {
			case "Matrix":
				const savedMatrix = savedJsonFile[unique_id];
				const createdMatrix = new Matrix(
					n,
					m,
					savedMatrix.values,
					savedMatrix.labels,
					savedMatrix.id
				);
				if (firstMatrixToReload === true) {
					const savedCanvasMatrix = savedJsonFile["canvas_matrix"];
					initCanvasMatrix(
						createdMatrix,
						savedCanvasMatrix.left,
						savedCanvasMatrix.top,
						savedCanvasMatrix.id
					);
					firstMatrixToReload = false;
				}
				break;
			//case 0 = Neuron
			case "Neuron":
				const savedNeuron = savedJsonFile[unique_id];
				new Neuron(
					savedNeuron.left,
					savedNeuron.top,
					savedNeuron.color,
					savedNeuron.bias,
					savedNeuron.id,
					-1,
					savedNeuron.biasLocked
				);
				break;
			case "EOutput":
				const savedEOutput = savedJsonFile[unique_id];
				new EOutput(savedEOutput.left, savedEOutput.top, unique_id, false);
				break;
			case "Output":
				const savedOutput = savedJsonFile[unique_id];
				new Output(savedOutput.left, savedOutput.top, unique_id);
				break;
		}
	}
	//stelle die Verbindungen zwischen den Canvas-Elementen wieder her
	for (const unique_id in savedJsonFile) {
		//schaue um welchen Typen es sich handelt
		switch (savedJsonFile[unique_id].class) {
			case "Neuron":
				const savedNeuron = savedJsonFile[unique_id];
				//iteriere über alle Inputs die das Neuron hat und erstelle die Verknüpfung
				for (const input in savedNeuron.inputs) {
					const currentInput = savedNeuron.inputs[input];
					const inputNeuron = canvas_elements[currentInput.canvasElementId];
					canvas_elements[unique_id].addInput(
						inputNeuron,
						parseInt(currentInput.weights.pop()),
						currentInput.row,
						currentInput.col,
						currentInput.locked
					);
				}
				break;
			//für EOutput und Output passiert dasselbe
			case "EOutput":
			case "Output":
				const savedEOutput = savedJsonFile[unique_id];
				const inputNeuron = canvas_elements[savedEOutput.inputId];
				canvas_elements[unique_id].setInput(inputNeuron);
				break;
		}
	}

	//beim Speichern angezeigte Matrix wieder anzeigen
	const savedCurrentMatrixId = savedJsonFile["current_matrix_id"];
	const savedCurrentMatrix = matrix_list[savedCurrentMatrixId];
	savedCurrentMatrix.display();

	//Biasstatus laden
	document.getElementById("inputBiasActive").checked =
		savedJsonFile["bias_active"];
	onChangeBias();
	predictNetwork();
}
