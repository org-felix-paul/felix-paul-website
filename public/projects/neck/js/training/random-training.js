// geht in einer runde alle matrizen durch und berechnet deren gesamtfehler
async function calculateTotalError() {
	let newError = 0;
	for (const matrixId in matrix_list) {
		//Training Finished das heißt Training soll abgebrochen werden
		if (trainingFinished) {
			return null;
		}
		const currentMatrix = matrix_list[matrixId];
		currentMatrix.display(animation); // also updates network
		getCanvasElements("EOutput").forEach((output) => {
			newError += output.error;
		});
		if (getRoundDuration() != 0) {
			await pause(getRoundDuration());
		}
	}
	return newError;
}

async function randomTraining(layers, oldError) {
	// Liste der Errors
	/*
    let oldValue = 0;
    getCanvasElements('EOutput').forEach(output => {
        oldValue += parseFloat(output.value[output.value.length -1]);
    })
    console.log("oldval ", oldValue)
    */
	// checke ob es freie gewichte gibt
	const chosenWeight = selectUnlockedWeight();
	if (chosenWeight === null) {
		alert("Es gibt keine freien Gewichte, Training wird abgebrochen");
		return null;
	}
	//entfärbe das letzte geänderte Gewicht
	unvisualizeSelectedWeight();
	const oldWeightValue = chosenWeight.value; //Wert vom ausgewählten Gewicht
	// berechne changeRate und passe HeatFaktor an
	const changeRate =
		(Math.floor(Math.random() * 201 - 100) / 100) * setHeatFactor(); //neuesGewicht wird zufällig gesetzt im Intervall [alt-heatFactor, alt+heatFactor]
	const newWeightValue = (
		parseFloat(oldWeightValue) + parseFloat(changeRate)
	).toFixed(3);
	chosenWeight.value = newWeightValue;
	//chosenWeight.classList.add('chosenWeight');
	//lies die Gewichte der Neuronen ein
	onChangeNeurons();
	// berechne new output - geht automatisch per onChange
	// output besser - nächste runde
	const newError = await calculateTotalError();
	if (newError === null) {
		alert("Training abgebrochen");
		return null;
	}
	/*
        let newValue = 0;
        getCanvasElements('EOutput').forEach(output => {
            newValue += parseFloat(output.value[output.value.length -1]);
        })
        console.log("newval ", newValue);
        */
	// output schlechter - wirf random zahl um zu gucken ob man schlechteres akzeptiert
	// behalte altes oder passe gewicht dementsprechend an
	if (newError > oldError) {
		const zahl = Math.random();
		//if (zahl > annealingCalculateAcceptMoreError(roundNumber, oldValue, newValue))
		if (zahl > getCalculationAcceptMoreError()) {
			chosenWeight.value = oldWeightValue;
			if (animation) chosenWeight.classList.add("same");
			onChangeNeurons();
			updateNetwork(layers);
			setCalculationAcceptMoreError();
			return oldError;
		}
	}
	if (animation) {
		if (newWeightValue > oldWeightValue) {
			chosenWeight.classList.add("higher");
		} else if (newWeightValue < oldWeightValue) {
			chosenWeight.classList.add("lower");
		} else {
			chosenWeight.classList.add("same");
		}
	}

	// nächste runde
	// passe Akzeptierte Verschlechterungswahrscheinlichkeit nach der Runde an
	setCalculationAcceptMoreError();
	return newError;
}

//returne ein ungesperrtes freies Gewicht
function selectUnlockedWeight() {
	let weights;
	if (document.getElementById("inputBiasActive").checked) {
		weights = Array.from(
			this.document.querySelectorAll(".neuron-input-weight, .bias-input-value")
		);
	} else {
		weights = Array.from(
			this.document.querySelectorAll(".neuron-input-weight")
		);
	}
	const unlockedFreeWeights = weights
		.filter((weight) => !weight.attributes[0].nodeValue.includes("locked")) //ungesperrte Gewichte
		.filter((weight) => !weight.parentElement.className.includes("free")); //freie Gewichte
	if (unlockedFreeWeights.length === 0) {
		return null;
	}
	let randomNumber = Math.floor(Math.random() * unlockedFreeWeights.length);
	const chosenInputWeight = unlockedFreeWeights[randomNumber];
	return chosenInputWeight;
}

function unvisualizeSelectedWeight() {
	const highlightedWeight = document.querySelector(".chosenWeight");
	if (highlightedWeight) highlightedWeight.classList.remove("chosenWeight");
}
