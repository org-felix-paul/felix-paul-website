//neues canvas-element durch Klicken hinzufügen
function addCanvasElement(event) {
    const mousePos = getCanvasMousePos (event) ;
    const left = calculateStickedCoordinates (mousePos.left) ;
    const top = calculateStickedCoordinates (mousePos.top) ;
    if (globalThis.activeTool === "add-neuron") {
       new Neuron (left, top) ;
    }
    if (globalThis.activeTool === "add-output") {
       new Output (left, top) ;
    }
    if (globalThis.activeTool === "add-eoutput") {
       new EOutput(left, top) ;
    }
}