// matrix_list ist ein dictionary wo unique_id: matrixobjekt drin steht
function setAllMatricesToTrainMatrix() {
    for (let i=0; i< Object.keys(matrix_list).length; i++) {
        matrix = matrix_list[Object.keys(matrix_list)[i]];
        matrix.isTestMatrix = false;
    }
}

// wähle testdaten zufällig
function getRandomSubarray(arr,size) {
    var shuffled = arr.slice(0);
    let i = arr.length;
    let temp;
    let index;
    while (i--) {
        // tausche zwei einträge (index und i)
        index = Math.floor((i + 1)* Math.random());
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
    }
    if (size==0)  size=1;
    return shuffled.slice(0,size);
}

// wähle die letzten size daten als testdaten
function getLastElements(arr, size) {
    if (size ==0) size = 1;
    return arr.slice(arr.length- size, arr.length);
}

// wähle die ersten size daten als testdaten
function getFirstElements(arr, size) {
    if (size == 0) size = 1;
    return arr.slice(0,size);
}

// nehme jedes n-te element als testdaten
function getEveryNthElement(arr,percentage) {
    temp = [];
    const n = Math.floor(1/ percentage);
    for (let i=0; i< arr.length; i++) {
        if (i % n == 0) {
            temp.push(arr[i]);
        }
    }
    if (temp.length == 0) return arr.slice(0,1);
    return temp;
}

testDataFunctions = [getRandomSubarray, getLastElements, getFirstElements, getEveryNthElement]

// problem: fügt immer nur die letzte matrix den beiden listen hinzu
// muss testen ob immer eine testmatrix da ist
function setTestMatrices() {
    if (Object.keys(matrix_list).length <=1) {
        alert("zu wenige matrizen um aufzuteilen benötigen mind. 2 Matrizen - eine test und eine trainings");
        return;
    }
    setAllMatricesToTrainMatrix();
    const percentage = parseFloat(this.document.getElementById('testPercentage').value);
    let absoluteNumber = Math.floor(percentage* Object.keys(matrix_list).length);
    if (absoluteNumber == 0) absoluteNumber = 1;
    // baue ein index array auf - und wähle nur indizes aus bei der auswahl der testmatrizen 
    // mappe dass da in einem weiteren schritt auf die tatsächlichen matrizen
    let indexArray = []
    for (let i=0; i< Object.keys(matrix_list).length; i++) {indexArray.push(i);}
    if (getSelectedTrainingDataChooseFunction() == 3) {
        // percentage statt size als parameter
        testMatrixIndices = testDataFunctions[getSelectedTrainingDataChooseFunction()](indexArray, percentage);
    }
    else {
        // size als parameter
        testMatrixIndices = testDataFunctions[getSelectedTrainingDataChooseFunction()](indexArray, absoluteNumber);
    }
    let test_matrices = [];
    let train_matrices = [];
    for (let i=0; i< Object.keys(matrix_list).length; i++) {
        // setze die ausgewählten matrizen als testmatrizen
        if (testMatrixIndices.includes(i)){
            matrix = matrix_list[Object.keys(matrix_list)[i]];
            matrix.isTestMatrix = true;
        }
        else {
            matrix.isTestMatrix = false;
        }
    }
    printAllMatrices();
}

function printAllMatrices() {
    for (let i=0; i< Object.keys(matrix_list).length; i++){
        matrix = matrix_list[Object.keys(matrix_list)[i]]
        console.log("matrix", i, " ", matrix);
    }
}


// todo: Dokumentation brauchen mindestens 2 Matrizen - eine Trainings, und eine Test
/*
x = [1,2,3,4,5,6,7,8,9,10]
console.log("---------- random -------------")
console.log(getRandomSubarray(x,3));
console.log(getRandomSubarray(x,3));
console.log("---------- last -------------")
console.log(getLastElements(x,3));
console.log("---------- first -------------")
console.log(getFirstElements(x, 3));
console.log("---------- every nth -------------")
console.log("jedes. ", getEveryNthElement(x, 1));
console.log("jedes 2. ", getEveryNthElement(x, 0.5));
console.log("jedes 3. ", getEveryNthElement(x, 1/3));
console.log("jedes 4. ", getEveryNthElement(x, 0.25));
*/