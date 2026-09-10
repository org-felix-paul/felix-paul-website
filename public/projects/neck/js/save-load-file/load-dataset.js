const myForm = document.getElementById("myForm");
const csvFile = document.getElementById("csvFile");

function csvToArray(str, delimiter = ",") {
    // slice from start of text to the first \n index
    // use split to create an array from string by delimiter
    const headers = str.slice(0, str.indexOf("\n")).split(delimiter);
    // slice from \n index + 1 to the end of the text
    // use split to create an array of each csv value row
    //console.log(str)
    const rows = str.slice(str.indexOf("\n") + 1).split("\n");
    return [headers,rows];
    }
myForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const input = csvFile.files[0];
    const reader = new FileReader();
    reader.onload = function (e) {
        const text = e.target.result;
        let alldata = csvToArray(text);
        let data = alldata[1];
        let labels = alldata[0];
        // Problem ist in jeder Zeile ist nur ein String der die Werte mit Komma trennt
        // wandele string in liste um und parse zu integern
        for (let i=0; i< data.length; i++) {
            data[i] = data[i].split(',');
            for (let j=0; j< data[i].length; j++){
                data[i][j] = parseFloat(data[i][j]);
            }
        }

        // die erste zeile soll nach n,m,k keine leeren strings enthalten
        data[0] = data[0].slice(0,3);
        // am ende war eine leere zeile die muss raus
        data = data.slice(0,-1);
        let metadaten = data[0];
        let inputdaten = [];
        for (let i=1; i< data.length; i++) {
            inputdaten.push(data[i]);
        }
        result = [metadaten, inputdaten];
        createMatrix(result, labels);
    };
    reader.readAsText(input);
    }
);

/*
Dateibeschreibung:
ES WIRD VON VOLLSTÄNDIGEN DATEN AUSGEGANGEN
daten haben die folgende Form:
sie wurden also einfach zeile für zeile aus der datei eingelesen
[ [n,m,k], zeile_1, ... , zeile_l ]
eine zeile = [matrix11, matrix12, ... , matrixn, label1, label2, ..., label k]
 --> transformiere automatisch zu
 [(matrix, labelvektor), .... , (matrix, labelvektor)]
 */

/*
bekommt eine zeile eines Datensatzes also bekommt:
n,m,k und
[eintrag_11, ..., eintrag_nm, label_1, ... label_k]
--> transformiere zu
Matrix=
[
    [eintrag_11, ..., eintrag_1m],
    [ ... ],
    [eintrag_n1, ..., eintrag_nm]
],
Labelvektor =  [label_1, ..., label_k]
--> returned also [matrix als verschachtelte liste, labelvektor]
 */
function transformRowToMatrix(row, n=1,m=1,k=1) {
    data = [];
    // gehe Zeilen durch
    if ((n*m+k) != row.length){
        console.log("fehler in transformRowtoMatrix, soll:" ,n*m+k," , ist: ", row.length)
        alert("Die angegebene Matrixgröße und Labelanzahl passt nicht zu den Maßen des Datensatzes! \n (siehe Datensatzzeile ["+row+ "])");
        return;
    }
    for (let i=0; i< n; i++) {
        dataRow = [];
        // fülle die Zeile mit Werten
        for (let j=0; j<m; j++) {
            dataRow.push(row[(i*(m)+j)]);
        }
        // hänge die Zeile in array an
        data.push(dataRow);
    }
    let labelVektor=[]
    for (let k= n*m; k< row.length; k++) {
        labelVektor.push(row[k])
    }
    return [data, labelVektor];
}

/*
bekommt eine zeile eines Datensatzes also bekommt:
[n,m,k],
[eintrag_11, ..., eintrag_nm, label_1, ... label_k]
--> transformiere zu
[
[matrix_1, labelvektor_1],
[...],
[matrix_l, labelvektor_l]
]
--> also liste mit jeweils listen die jeweils matrix, labelvektor enthalten
 */
function transformDataToMatrics(data) {
    const n = parseInt(data[0][0]);
    const m = parseInt(data[0][1]);
    const k = parseInt(data[0][2]);
    finalData = [];
    // lösche erste Zeile mit den Metadaten n,m,k
    data = data[1];
    for (let i=0; i< data.length; i++) {
        x = (transformRowToMatrix(data[i], n,m,k));
        if (x == null) {
            return;
        }
        finalData.push(x);
    }
    return [[n,m,k],finalData];
}
/*
bekommt nur daten in reinform übergeben
erzeuge aus den bisher nur als array erzeugten matrizen jetzt matrizen des Typ Matrix
damit man sie darstellen, verschieben usw kann
 */

/*
TEST:
row1 = [1,2,3,4,5,6,42,12]
row2 = [2,4,6,8,10,12,84,13]
row3 = [-1,-2,-3,-4,-5,-6,-12,14]
data = [[2,3,2], [row1, row2, row3]];
createMatrix(data);
 */

function createMatrix(data, labels) {
    /*[ [n,m,k],[[matrix_1, labelvektor_1], [...], [matrix_l, labelvektor_l]] ] */
    values = transformDataToMatrics(data);
    if (values == null){
        alert('Lade einen neuen Datensatz! Dieser war fehlerhaft');
        return;
    }
    const n= parseInt(values[0][0]);
    const m = parseInt(values[0][1]);
    const k = parseInt(values[0][2]);

    let mathMatrices = values[1]
    const anzahl = document.getElementById('numberDataloaded').value;
    if (mathMatrices.length > anzahl) {
        console.log('anzahl daten ist: ', anzahl);
        // alert("der Datensatz ist sehr groß und wird auf ', anzahl,  ' Einträge limitiert");
        mathMatrices = mathMatrices.slice(0,anzahl);
    }
    // mathMatrice ist eine Liste von Listen der folgenden Form
    // [ [Matrix, Labelvektor], ... , [Matrix, Labelvektor] ]

    // lösche alle bestehenden matrizen
    // die angezeigte matrix wird beim löschen nur ihre werte auf null setzen
    for (let key in matrix_list) {
        matrix_list[key].remove()
    };
    let shownMatrix = getCurrentMatrix();
    document.getElementById("nVal").value = n;
    document.getElementById("mVal").value = m;
    resizeMatrix();

    for (let i=0; i< mathMatrices.length; i++){
        // erstelle alle matrizen
        new Matrix(n,m, mathMatrices[i][0]);
    }
    // lösche alte verbleibende Matrix
    oldMatrix =getCurrentMatrix();
    // zeige zuletzt hinzugefügte Matrix an
    const lastMatrix = Object.values(matrix_list).pop();
    lastMatrix.display();
    // lösche alte Matrix aus den Datensätzen
    oldMatrix.remove();

    // wenn die Anzahl der bisherigen Outputs mit der geforderten Anzahl übereinstimmt, lasse outputs wie sie sind von Verknüpfung her
    eOutputList = getCanvasElements('EOutput');
    // wenn zu viele Outputs im Netz sind --> lösche überflüssige
    if (eOutputList.length > k){
        for (let i=k; i< eOutputList.length; i++) {
            eOutputList[i].remove();
        }
    }
    // wenn zu wenige Outputs da sind füge welche hinzu
    if (eOutputList.length < k){
        for (i=eOutputList.length; i<k; i++) {
            output = new EOutput(3*(2*225)+(200), 0.5*(60+250*(i+1))+60);
        }
    }
    // setze Label der Matizen korrekt
    const eoutputs = getCanvasElements("EOutput"); // liste mit den tatsächlichen objekten drin
    const matrices = Object.values(matrix_list);
    // gehe matrizen durch
    for (let i=0; i< matrices.length; i++) {
        //matrices[i].display();
        // gehe outputs durch
        for (let j=0; j< eoutputs.length; j++) {
            matrices[i].setLabel(eoutputs[j].id, mathMatrices[i][1][j]);
        }
    }
    headers = labels.slice(labels.length-k);
    for (let i=0; i< eoutputs.length; i++) {
        output = eoutputs[i];
        output.DOM.querySelector('.labelform').value = headers[i];
    }

    // aktualisere Ansicht
    let layers = sortNetwork(false)[0];
    updateNetwork(layers);
    // zeige erste Matrix anf
    Object.values(matrix_list)[0].display();

    // Referenz:
    //const output = new EOutput(3*(2*225)+(200), 0.5*(60+150)+60);
    //matrix1.setLabel(output.id, 0);

}

// load script file
document.forms['ScriptForm'].elements['loadScriptFile'].onchange = function(evt) {
    if(!window.FileReader) return; // Browser is not compatible
    debugger;
    var reader = new FileReader();
    reader.onload = function(evt) {
        if(evt.target.readyState != 2) return;
        if(evt.target.error) {
            alert('Fehler beim Lesen der skript Datei');
            return;
        }
        filecontent = evt.target.result;
        document.getElementById('box').value = evt.target.result;
        //document.forms['ScriptForm'].elements['text'].value = evt.target.result;
    };
    reader.readAsText(evt.target.files[0]);
};