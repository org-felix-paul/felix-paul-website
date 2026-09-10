/*
Hier werden die Funktionen zur Einstellung der Linearität implementiert
Unterstützt werden die Funktionen linear, ReLu, Sigmoid
todo: implementiere linear
todo: implementiere ReLu
todo: implementiere Sigmoid
todo: bespreche auf welche Werte die Funktionen skalieren sollen (dies soll parametrisiert möglich sein
todo: implementiere tests der funktionen, insbesondere für das casten der werte in einen gleichen Wertebereich, negative Werte,
    Null, identische Werte, extrem große, kleine Werte, falsche Eingabetypen
todo: evtl. hier eine Funktion durch den User laden lassen (analog zu der anderen skript-ladefunktion
 */

// Normalisierung erstmal rauslassen bzw optional gestalten
function identity(x) {
    return x;
}

function derivationIdentity(x) {
    return 1;
}

function reLu(x) {
    return Math.max(0,x);
}

function derivationreLu(x) {
    if (x > 0) return 1;
    else return 0;
}

/*
Sigmoid ist wie folgt definiert
sig(t): R --> [0,1]
sig(t)= 1/(1+e^(-t)) = e^t / (1+e^t) = 1/2 * (1+ tanh(t/2))
entspricht also eine skalierter und verschobener Tangens- Hyperbolicus Funktion
für weitere Informationen siehe https://de.wikipedia.org/wiki/Sigmoidfunktion#Effiziente_Berechnung
 */
function sigmoid(t) {
    const e = Math.E;
    return (1 / (1 + e ** (-t))).toFixed(3);
}

function derivationSigmoid(t) {
    z = sigmoid(t)
    return z * (1-z);
}
/*
function eigene(x) {
    return x**2;
}

function derivationEigene(x) {
    return 2*x;
}
*/
 function eigene(x) {
     console.log("in eigener Aktivierungsfunktion")
     //z.B. x**3
     ausgabe = eval(document.getElementById('box').value);
     return ausgabe;
 }
 function derivationEigene(x) {
     // z.B. 3*x**2
     return eval(document.getElementById('box2').value);
 }

linearityFunctions = [identity, reLu, sigmoid, eigene]
derivationLinearityFunctions = [derivationIdentity, derivationreLu, derivationSigmoid, derivationEigene]