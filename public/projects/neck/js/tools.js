// aktiviere ein Werkzeug (name wird in der Globalen Variable activeTool abgespeichert)
function setTool(name = 'none') {
    document.querySelectorAll('.tool').forEach(toolElement => {
        toolElement.classList.remove('active');
    });

    document.querySelectorAll('.tool[data-tool="'+name+'"]').forEach(toolElement => {
        toolElement.classList.add('active');
    });

    document.querySelector('#canvas').setAttribute('data-active-tool',name);

    globalThis.activeTool = name;

    setLinkingToolStatus('select-output');
}

function getTool() {
    return globalThis.activeTool;
}

function setLinkingToolStatus(status = 'select-output') {
    document.getElementById('canvas').setAttribute('data-linking-tool-status',status);
    globalThis.linkingToolStatus = status;
}

function getLinkingToolStatus() {
    return globalThis.linkingToolStatus || 'select-output';
}

// aktualisiere die Werkzeugleiste, sobald sich etwas im HTML-Code von #toolbar ändert
observeSubtree(document.getElementById('toolbar'), () => {
    document.getElementById('toolbar').querySelectorAll('.tool').forEach(toolElement => {
        toolElement.onclick = () => {
            setTool(toolElement.getAttribute('data-tool'));
        }
    });
}, true);