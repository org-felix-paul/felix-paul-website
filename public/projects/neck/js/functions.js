function pause(time) {
    return new Promise( resolve => {
            setTimeout(function(){
                resolve('');
                return;
            },time);
        }
    )
}


// canvas scale start
let canvasScale = 1;

function resizeCanvas() {
    const canvas = document.getElementById('canvas');

    const translate = (canvasScale-1)/2*100;
    canvas.style.transform = 'translateX('+translate+'%) translateY('+translate+'%) scale('+canvasScale+')';
    canvas.style.MozTransform = 'translateX('+translate+'%) translateY('+translate+'%) scale('+canvasScale+')';
    canvas.style.webkitTransform = 'translateX('+translate+'%) translateY('+translate+'%) scale('+canvasScale+')';

    canvas.style.width = (1/canvasScale)*100 + '%';
    canvas.style.height = (1/canvasScale)*100 + '%';

    let width = 0, height = 0; // TODO: Linien werden noch nicht richtig beachtet...
    canvas.querySelectorAll('*:not(#canvas-background)').forEach(child => {
        const style = getComputedStyle(child);
        width = Math.max(width, (parseFloat(style.left) || 0) + child.offsetWidth);
        height = Math.max(height, (parseFloat(style.top) || 0) + child.offsetHeight);
    });
    const bg = document.getElementById('canvas-background');
    bg.style.width = width+'px';
    bg.style.height = height+'px';
}

function zoomIn(){
    canvasScale = Math.min(2, canvasScale + .1);
    resizeCanvas();
}

function zoomOut(){
    canvasScale = Math.max(.2, canvasScale -= .1);
    resizeCanvas();
}

function zoomReset(){
    canvasScale = 1;
    resizeCanvas();
}
// canvas scale end



function toggleActivationFunctionFields() { // TODO: kann diese Funktion gelöscht werden?
    document.getElementById('eigeneFunktionContainer').classList.toggle('hideActivationInputs');
}

function showSidebar() {
    document.getElementById('wrapper').classList.remove('sideBarHidden');
}
function hideSidebar() {
    document.getElementById('wrapper').classList.add('sideBarHidden');
}
function toggleSidebar() {
    document.getElementById('wrapper').classList.toggle('sideBarHidden');
}

function showTopBar() { 
    document.getElementById('navbarsExample07XL').classList.remove('topBarHidden');
}
function hideTopBar() {
    document.getElementById('navbarsExample07XL').classList.add('topBarHidden');
}
function toggleTopBar() {
    document.getElementById('navbarsExample07XL').classList.toggle('topBarHidden');
}

function showExpertMode() {
    document.getElementById('experModeContainer').classList.remove('expertModeHidden');
}
function hideExpertMode() {
    document.getElementById('experModeContainer').classList.add('expertModeHidden');
}
let i = 0;
function toggleExpertMode() {
    document.getElementById('experModeContainer').classList.toggle('expertModeHidden');
    eigenesTrainingOption = document.getElementById('trainingMethod')[2];
    eigeneAktivierungsfunktion = document.getElementById('linearityFunction')[3];
    if (i % 2 == 0){
        eigenesTrainingOption.style.display = 'none';
        eigeneAktivierungsfunktion.style.display = 'none';
    }
    else {
        eigenesTrainingOption.style.display = 'block';
        eigeneAktivierungsfunktion.style.display = 'block';
    }
    i +=1;
}



// rufe callback() auf, sobald sich etwas im HTML-Baum von elem ändert
function observeSubtree(elem, callback, init = false) {
    const observer = new MutationObserver(mutations => {
        callback();
    });
    observer.observe(elem, {
        childList: true,
        subtree: true
    });
    if (init) {
        callback();
    }
}

function resize() {
    const top_bar_height = document.getElementById('top-bar').offsetHeight;
    const bottom_bar_height = document.getElementById('bottom-bar').offsetHeight;
    document.getElementById('wrapper').style.height = window.innerHeight-top_bar_height-bottom_bar_height+'px';
}

let ID_canvasScale = 0;
function generateUniqueId() {
    let id = 'unique_id_'+ID_canvasScale;
    ID_canvasScale++;
    if (document.getElementById(id) != null) {
        id = generateUniqueId();
    }
    return id;
}

// Gibt ein zufalliges Element aus dem Array items zurück
function randomElement(items) {
    return items[Math.floor(Math.random()*items.length)];
}

// Initialisiere die Variable bias-active mit dem Status des Bias, und 
// ändere ihn wenn Bias an/aus gestellt wird. 
// Mache das so, um sie im css auch sehen zu können.
function getIsBiasActive() {
    return document.getElementById('inputBiasActive').checked;
}
document.querySelector('#canvas').setAttribute('data-bias-active', getIsBiasActive());  
function onChangeBias() {
    document.querySelector('#canvas').setAttribute('data-bias-active', getIsBiasActive());
}

function predictNetwork(){
    let layers = sortNetwork(false)[0]; 
    updateNetwork(layers);
}