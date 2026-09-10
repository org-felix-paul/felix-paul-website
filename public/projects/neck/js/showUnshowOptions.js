// wenn nicht Backpropagation als Verfahren genutzt wird, wird das div mit der Lernrate gelöscht und das div mit dem Heatfaktor hinzugefügt

// wenn Backpropagation als Verfahren genutzt wird, wird das div mit dem Heatfaktor gelöscht und das div mit der Lernrate hinzugefügt
// wenn backpropagation als verfahren gewählt wurde zeige Lernrate statt Heatfaktor an
// wenn ein anderes lernverfahren genutzt wird - zeige Heatfaktor statt Lernrate an
for (let i=0; i< 3; i++) {
    optionButton = this.document.getElementById('trainingMethod')[i];
    optionButton.addEventListener('click', e => { // führe diesen Code aus, wenn das Element angeklickt wird
        // backpropagation gewählt - zeige lernrate
        if (i==1) {
            // lösche heatfaktor raus
            deleteElement = this.document.getElementById('heatFactor-inner')
            // todo: lösche deleteelement nur wenn es existiert
            deleteElement.remove();
            // zeige die Verschlechterungswahrscheinlichkeit nicht an
            document.getElementById('acceptErrorPossibility').style.display = 'none';
            // zeige lernrate an
            // todo: ergänze das anzeigen der lernrate
            this.document.getElementById('heatFactor-container').innerHTML += ' '+
                '<div id="lernrate-inner">'+
                '<!-- Heat-Faktor-Div -->'+
                '<div class="mx-md-2 TopText" data-toggle="tooltip" data-placement="bottom" title="Gebe die Lernrate ein. Hier bietet es sich an 10er Potenzen durchzuprobieren von 10^3 bis 10^-3">'+
                '<div>'+
                '   <label for="heatFactor">Lernrate: </label>'+
                ' <input  type="number" id="heatFactor" value="0.1"/>'+
                '</div>'+
                '<div class="d-flex justify-content-between">'+
                '   Aktuelle Lernrate:'+
                '   <div id="currentHeatFactor" > </div>'+
                '</div>'+
                '</div>'+
                '</div> <!-- end heat faktor inner -->'

        }

        // backpropagation nicht gewählt - zeige heatfaktor
        else {
            // lösche lernrate
            deleteElement = this.document.getElementById('lernrate-inner')
            // todo: lösche deleteelement nur wenn es existiert
            deleteElement.remove();
            // zeige verschlechterungswahrscheinlichkeit wieder an
            document.getElementById('acceptErrorPossibility').style.display = 'block';
            // zeige heatfaktor an
            this.document.getElementById('heatFactor-container').innerHTML += ' '+
            '<div id="heatFactor-inner">'+
            '<!-- Heat-Faktor-Div -->'+
            '<div class="mx-md-2 TopText" data-toggle="tooltip" data-placement="bottom" title="Gebe die Anpassungsgeschwindigkeit der Gewichte an.">'+
            '<div>'+
            '   <label for="heatFactor">Heat-Faktor</label>'+
            '   <div class="d-flex justify-content-between">'+
            '       <input class="form-control-range TopSlide mx-1" type="range" id="heatFactor" min="1" max="100" step="0.5" value="50" oninput="this.nextElementSibling.value=this.value">'+
            '           <output></output>'+
            '   </div>'+
            '</div>'+
            '<div class="d-flex justify-content-between">'+
            '   Aktueller Heatfaktor:'+
            '   <div id="currentHeatFactor" > </div>'+
            '</div>'+
            '</div>'+
            '<!-- Heat Faktor Abnehmrate range-->'+
            '<div class="mx-md-2 TopText" data-toggle="tooltip" data-placement="bottom" title="Gebe die Abnahme der Anpassungsgeschwindigkeit der Gewichte an.">'+
            '    <label for="heatFactorRate">Heat-Faktor Abnehmrate</label>'+
            '    <div class="d-flex justify-content-between">'+
            '        <input class="form-control-range TopSlide" type="range"" id="heatFactorRate" min="1" max="99" step="0.5" value="50" oninput="this.nextElementSibling.value=this.value">'+
            '            <output></output>'+
            '    </div>'+
            '</div>'+
            '</div> <!-- end heat faktor inner -->'
        }
    })
}





// wenn nicht die eigene Aktivierungsfunktion gewählt wurde - lösche die eingabefelder
for (let i=0; i< 3; i++){
    optionButton = this.document.getElementById('linearityFunction')[i];
    optionButton.addEventListener('click', e => { // führe diesen Code aus, wenn das Element angeklickt wird
        deleteElement = this.document.getElementById('eigeneFunktionInneres')
        // todo: lösche deleteelement nur wenn es existiert
        deleteElement.remove();
    })
}

// zeige eingabefelder an wenn die eigene aktivierungsfunktion genutzt werden soll
eigeneFunktionOption = this.document.getElementById('linearityFunction')[3];
eigeneFunktionOption.addEventListener('click', e => { // führe diesen Code aus, wenn das Element angeklickt wird
    this.document.getElementById('eigeneFunktionContainer').innerHTML += ' '+
        '<div id="eigeneFunktionInneres">' +
        '<textarea id="box" rows="2" cols="30" placeholder="Gib deine Funktion hier ein: &#10;2*x + x**2+ Math.sin(x)"></textarea>'+
        '<textarea id="box2" rows="2" cols="30" placeholder="Gib die Ableitung deiner Funktion hier ein: &#10;2+2*x+ Math.cos(x)"></textarea> <br>'+
        //'<button style="width: 2cm;height: 1cm;" id="execute">laden</button>;' +
        '</div>'
})

// wenn backpropagation als verfahren gewählt wurde zeige die option der eigenen Fehlerfunktion nicht mehr an
// wenn ein anderes lernverfahren genutzt wird - zeige auch andere fehlermetriken an
for (let i=0; i< 3; i++) {
    optionButton = this.document.getElementById('trainingMethod')[i];
    optionButton.addEventListener('click', e => { // führe diesen Code aus, wenn das Element angeklickt wird
        errormetrikabsoluteError = document.getElementById('errorMetrik')[1];
        if (i == 1) errormetrikabsoluteError.style.display = 'none';
        else errormetrikabsoluteError.style.display = 'block';
    })
}

// blende textfeld zur eingabe eines skripts ein oder aus je nachdem ob man die online oder offline version der website nutzt
document.addEventListener('change',(e)=>{
    if(e.target.getAttribute('name')=="OnlineToggleButton") {
        if (e.target.value == "online") {
            // füge browse button und textfeld um skript einzugeben hinzu
            this.document.getElementById('OnlineContainer').innerHTML += ' ' +
                '<div id="OnlineContainerInneres">' +
                '<textarea id="box" rows="10" cols="15" placeholder="Im ONLINE MODUS: Gib deine eigene Trainingsmethode' + 
'hier als Javascript Code ein oder lade eine Datei die analog wie  <Datensätze/scripte/exampleScript.js> aufgebaut ist ' + 
'oder schreibe im OFFLINE MODUS  direkt in die Datei' + 
'js/training/eigenesTraining. Hier findest du ebenfalls ein Beispiel,' + 
'wie du ein eigenes Verfahren implementieren kannst"' + 

                '></textarea>' +
                '       <!-- Button um eigenes Skript aus Datei in Textfeld zu laden-->' +
                '       <form id="ScriptForm">' +
                '           <p>' +
                '               Lade dein Skript: <input id="loadScriptFile" name="files[]" multiple="" type="file" />' +
                '           </p>' +
                '       </form>' +
                '   </div>'
        } else {
            // lösche den button zum hochladen eines skripts und das textfeld aus der sidebar
            deleteElement = this.document.getElementById('OnlineContainerInneres')
            deleteElement.remove();
        }
    }
})

