//returnt Error für einen spezifischen Output
function quadraticError(outputValues, targetValues) {
    if(outputValues.length !== targetValues.length) {
        throw new Error("Number of Output Values (" +outputValues.length+ ") is not the same size as number of target Value (" + targetValues.length + ")")
    }
    let error = 0;
    for (let i = 0; i<outputValues.length; i++){
        error += (outputValues[i] - targetValues[i]) ** 2;
    }
    return 1/2 * error;
}

//gibt den MaximalenFehler für einen spezifischen Output zurück
function maximumError(outputValues, targetValues) {
    if(outputValues.length !== targetValues.length) {
        throw new Error("Number of Output Values (" +outputValues.length+ ") is not the same size as number of target Value (" + targetValues.length + ")")
    }
    let errorList = [];
    for (let i = 0; i<outputValues.length; i++){
        errorList.push(Math.abs(outputValues[i] - targetValues[i]));
    }
    return Math.max(...errorList);
}

errorMethods = [quadraticError, maximumError];