// liest die ausgewählte trainingsdaten auswahl funktion aus als index 
function getSelectedTrainingDataChooseFunction() {
    return document.getElementById('testDataChoosingFunction').selectedIndex;
}

//liest die ausgewählte Trainingsmethode aus - es ist immer eine ausgewählt
function getSelectedTrainingMethod() {
    return document.getElementById('trainingMethod').selectedIndex;
}

function getSelectedErrorFunction() {
    return document.getElementById('errorMetrik').selectedIndex;
}

//liest die ausgewählte Trainingsmethode aus - es ist immer eine ausgewählt
function getSelectedLinearityFunction() {
    return document.getElementById('linearityFunction').selectedIndex;
}

//gibe den Heatfaktor zurück
function getStartingHeatFactor(){
    return document.getElementById('heatFactor').value;
}

//setHeatFactor setzt Heatfactor zwischen 0 und 100
function setHeatFactor() {
    let currentHeatFactor = document.getElementById('currentHeatFactor').innerHTML;
    currentHeatFactor= currentHeatFactor ? currentHeatFactor : getStartingHeatFactor();
    document.getElementById('currentHeatFactor').innerHTML = (currentHeatFactor * getCalculationHeatFactorRate()).toFixed(3);
    return document.getElementById('currentHeatFactor').innerHTML;
}

//gibe den Heatfaktor zum berechnen zurück (nicht der angezeigte heatFaktor)
function getCalculationHeatFactorRate(){
    const shownRate = document.getElementById('heatFactorRate').value;
    return (100- shownRate) / 100;
}
// get Rundendauer
function getRoundDuration(){
    return document.getElementById('duration').value;
}

// ist schon durch 100 geteilt also fertig zum berechnen
function getStartingCalculationAcceptMoreError(){
    return document.getElementById('acceptMoreError').value;
}

function setCalculationAcceptMoreError() {
    let currentAcceptMoreError = document.getElementById('currentAcceptMoreError').innerHTML;
    currentAcceptMoreError= currentAcceptMoreError ? currentAcceptMoreError : getStartingCalculationAcceptMoreError();
    document.getElementById('currentAcceptMoreError').innerHTML = (currentAcceptMoreError * getCalculationHeatFactorRate()).toFixed(3);
    return document.getElementById('currentAcceptMoreError').innerHTML;
}

// number between 0 and 1
// reduced each round by heatfactorrate
function getCalculationAcceptMoreError() {
    return document.getElementById('currentAcceptMoreError').innerHTML / 100;
}

//gib die Anzahl an ausgewählten Trainingsrunden zurück
function getTrainingRoundNumber() {
    return document.getElementById('roundNumber').valueAsNumber;
}
