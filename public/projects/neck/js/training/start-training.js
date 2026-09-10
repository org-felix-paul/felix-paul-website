/*
wie kann ich ein programm pausieren?

1) setTimer(function,delay)
    wartet mit der Ausführung der funktion function bis delay verstrichen
    ABER: führt ohne delay alles darunter aus! 
    nur rekursiv hält alles an
2) BESSER!
    promise: gibt zurück ob es fertig ausgeführt ist (resolve ...) nach resolve wird weiter ausgeführt deshalb return danach
    await: warte auf die funktion bis dieser promise fullfilled ist
    async: die funktion die await beinhaltet muss async sein damit sie warten kann
    
    unsere pause Funktion: rufe sie einfach aus einer async funktion auf die dann time pausiert
 */

// todo: sigmoid richtig anwenden - dokumentation berücksichtigen
function annealingCalculateAcceptMoreError(roundNumber, oldValue, newValue) {
	const c = 1;
	// roundNumber is number of iterations
	// c is a meta variable
	// oldValue is old output value
	// new ""
	if (oldValue === 0) {
		alert("divide by zero may occur");
		return 1;
	}
	return Math.E ** ((-roundNumber / c) * ((oldValue - newValue) / oldValue));
}

// updatet alle Neuronen und outputs (nur die values) nicht die Gewichte
function updateNetwork(layers) {
	// layer ist ein key
	for (const layer in layers) {
		for (let j = 0; j < layers[layer].length; j++) {
			let neuronId = layers[layer][j];
			canvas_elements[neuronId].update();
		}
	}
	getCanvasElements("Output", "EOutput").forEach((output) => {
		output.update();
	});
}

function unvisualizeAllWeightColor() {
	const allWeights = document.querySelectorAll(
		".chosenWeight, .higher, .lower, .same"
	);
	allWeights.forEach((weight) => {
		weight.classList.remove("chosenWeight", "higher", "lower", "same");
	});
}

//synchronisiere die internen gespeicherten Gewichte der Neuronen
//mit den Werten der Inputfelder
function onChangeNeurons() {
	const neuronList = getCanvasElements("Neuron");
	neuronList.forEach((neuron) => {
		neuron.onChange();
	});
}

trainingsMethods = [
	globalThis.randomTraining,
	globalThis.backpropagation,
	globalThis.ownTrainingOneRound,
];
trainingFinished = false;

function stopTraining() {
	trainingFinished = true;
}
animation = true;
async function initialTraining(roundNumber) {
	unvisualizeAllWeightColor();
	removeDebuggingColor(true);
	trainingFinished = false;
	//setze Heatfactor und AcceptWrongValues zurück
	document.getElementById("currentHeatFactor").innerHTML =
		getStartingHeatFactor();
	document.getElementById("currentAcceptMoreError").innerHTML =
		getStartingCalculationAcceptMoreError();

	// sortiere nach Layer
	// layers = [[neuronen ebene1], [neuronen ebene2]]
	let layers = sortNetwork(false)[0];
	let oldError = Infinity;
	// das visualisiert das Durchgehen der Matrizen einmal
	if (getSelectedTrainingMethod() != 1) {
		// todo: anmerkung in die dokumentation dass bei einer trainingsrunde zweimal animiert wird da man sich die ersten outputvalues berechnen muss
		document.getElementById("currentRound").innerHTML =
			"aktuelle Runde: initiale Fehlerberechnung";
		oldError = await calculateTotalError(); // berechne fehler
		if (oldError === null) {
			alert("Training abgebrochen.");
			return;
		}
	}

	// alle neuronen sind verbunden, da unverbundene neuronen gelöscht wurden

	for (let i = 0; i < roundNumber; i++) {
		document.getElementById("currentRound").innerHTML =
			"aktuelle Runde: " + (i + 1);
		await pause(1); //damit der Timer visuell geupdatet wird
		animation = true;
		if (getRoundDuration() == 0) {
			animation = false;
		}
		oldError = await trainingsMethods[getSelectedTrainingMethod()](
        layers,
			oldError
		);
		//wenn Training abgebrochen werden soll
		if (!oldError) {
			return;
		}

	}
	trainingFinished = true;
	alert("Training beendet!");
}
