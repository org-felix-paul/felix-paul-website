function removeAllCanvasElements(removeMatrices = false) {
    for (const key in canvas_elements) {
        if (canvas_elements[key].type ==2 && removeMatrices === false){
            continue;
        }
        if (canvas_elements[key].constructor.name === 'Line'){
            continue;
        }
        canvas_elements[key].remove();
    }
    if(removeMatrices === true){
        for (const matrixId in matrix_list){
            matrix_list[matrixId].remove(false);
        }
    }
}