function updatecolorScale(){
    for (const [id, canvasElement] of Object.entries(canvas_elements)) {
        if (canvasElement.constructor.name === 'Neuron') {
            canvasElement.setColor('');
        }else if(canvasElement.constructor.name === 'EOutput' || canvasElement.constructor.name === 'Output' ) {
            canvasElement.setColor();
        }
    }
}



let max = document.getElementById("max-farb");
let min = document.getElementById("min-farb")

max.onchange= () =>{
    if(parseFloat(max.value)<parseFloat(min.value)){
        alert("Der maximale Farbwert darf nicht kleiner sein, als der minimale!");
        max.value=10;
        min.value=-10;
    }
    updatecolorScale();
};

min.onchange= () =>{
    if(parseFloat(max.value)<parseFloat(min.value)){
        alert("Der maximale Farbwert darf nicht kleiner sein, als der minimale!");
        max.value=10;
        min.value=-10;
    }
    updatecolorScale();
};