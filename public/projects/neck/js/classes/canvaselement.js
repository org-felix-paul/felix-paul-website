let canvas_elements = {};

// gebe alle Canvas Elemente mit einem bestimmten Classennamen (oder von zwei Klassen) in einer Liste zurück
function getCanvasElements(classname1 = null, classname2 = null) {
    result = [];
    Object.entries(canvas_elements).forEach(element => {
        if (element[1].constructor.name === classname1 || element[1].constructor.name === classname2 || classname1 == null) {
            result.push(element[1]);
        }
    });
    return result;
}

class CanvasElement {
    constructor(innerHTML = '<div class="bg-danger rounded text-white p-3">Canvas Element <div class="btn btn-white ms-2"><i class="bi bi-arrows-move"></i></div> </div>', left = 0, top= 0, type, id=-1) {
        //id sollte nur manuell gesetzt werden beim Laden von gespeicherten Dateien
        if(id === -1 || document.getElementById(id) !== null ) {
            this.id = generateUniqueId();
        }
        else {
            this.id = id
        }
        this.type = type;
        canvas_elements[this.id] = this;

        this.snapToGrid = true; // sorge dafür, dass sich das Element am Raster ausrichtet
        this.ondrag = () => {};     // diese Variable enthält eine Funktion, die aufgerufen wird, wenn das Element bewegt wird
        this.onremove = () => {};   // diese Variable enthält eine Funktion, die aufgerufen wird, wenn das Element gelöscht wird

        this.DOM = document.createElement('div');   // erstelle einen neuen div-container
        this.DOM.classList.add('canvas-element');            // füge dem div-container die Klasse "canvas-element" hinzu

        this.setDeleteable(false);  // verbiete sandardgemäß das Bewegen mit dem Verschiebe-Werkzeug
        this.setDraggable(false);   // verbiete sandardgemäß das Löschen mit dem Entfernen-Werkzeug
        this.setUpdateable(false);  // verbiete sandardgemäß das Updaten mit dem Netz-Updaten-Werkzeug

        this.DOM.addEventListener('click', e => { // führe diesen Code aus, wenn das Element angeklickt wird
            switch (activeTool) { // welches Tool ist gerade aktiv?
                case 'move':
                    globalThis.selectedCanvasElementId = this.id;
                    updateSidebar();
                    break;
                case 'delete': // Fall, wenn das Entfernen-Werkzeug aktiv ist
                    if (this.deleteable) { // prüfe, ob das Löschen für dieses Element erlaubt ist
                        this.remove() // entferne dieses Element
                    }
                    break;
            }
        });

        ['mousedown','touchstart'].forEach(type => { // erstelle für mousedown und touchstart den gleichen EventListener
            this.DOM.addEventListener(type, e => {
                switch (activeTool) { // welches Werkzeug ist aktiv?
                    case 'move':
                        if (this.draggable && ((e.type !== 'mousedown') || e.button === 0)) { // prüfe, ob das Element bewegt werden darf und, ob die linke Maustaste gedrückt wurde
                            this.dragging = true;
                            this.DOM.classList.add('dragging');
                            this.DOM.parentElement.appendChild(this.DOM); // sorge dafür, dass das Element über allen anderen mit dem gleichen z-index geschoben wird
                            const style = getComputedStyle(this.DOM);
                            this.draggstartInfo = { // speichere die Start-Koordinaten
                                mousePos: getCanvasMousePos(e),
                                left: parseInt(style.left),
                                top: parseInt(style.top)
                            };
                        }
                        break;
                }
            });
        });

        ['mousemove','touchmove'].forEach(type => { // erstelle für mousemove und touchmove den gleichen EventListener
            window.addEventListener(type,e => {
                if (this.dragging) {
                    const relMousePos = getCanvasMousePos(e);
                    this.DOM.style.left = Math.max(0, this.draggstartInfo.left + (relMousePos.left - this.draggstartInfo.mousePos.left)) + 'px';
                    this.DOM.style.top = Math.max(0, this.draggstartInfo.top + (relMousePos.top - this.draggstartInfo.mousePos.top)) + 'px';
                    this.ondrag();
                    resizeCanvas();
                }
            });
        });

        ['mouseup','touchend'].forEach(type => { // erstelle für mouseup und touchend den gleichen EventListener
            window.addEventListener(type,() => {
                if (this.dragging) {
                    this.dragging = false;
                    this.DOM.classList.remove('dragging');
                    if (this.snapToGrid) {
                        const style = getComputedStyle(this.DOM);
                        this.DOM.style.left = (calculateStickedCoordinates(style.left))+'px';
                        this.DOM.style.top = (calculateStickedCoordinates(style.top))+'px';
                        const intervalId = setInterval(() => {
                            this.ondrag();
                        },10);
                        setTimeout(() => {
                            clearInterval(intervalId);
                        },210);
                    }
                }
            })
        });

        document.getElementById('canvas').appendChild(this.DOM);

        this.DOM.innerHTML = innerHTML;

        this.DOM.style.left = left+'px';
        this.DOM.style.top = top+'px';

        resizeCanvas();
    }

    // Lege fest, ob das Objekt per Löschen-Werkzeug entfernt werden kann
    setDeleteable(value = true) {
        this.deleteable = value;
        if (this.deleteable) {
            this.DOM.classList.add('deleteable');
        } else {
            this.DOM.classList.remove('deleteable');
        }
    }

    // Lege fest, ob das Objekt per Verschiebe-Werkzeug bewegt werden kann
    setDraggable(value = true) {
        this.draggable = value;
        if (this.draggable) {
            this.DOM.classList.add('draggable');
        } else {
            this.DOM.classList.remove('draggable');
        }
    }

    //Lege fest, ob das Objekt updated werden kann
    setUpdateable(value = true) {
        this.updateable = value;
        if (this.updateable) {
            this.DOM.classList.add('updateable');
        } else {
            this.DOM.classList.remove('updateable');
        }
    }


    hide() {
        this.DOM.style.visibility = 'hidden';
    }

    show() {
        this.DOM.style.visibility = 'visible';
    }

    remove() {
        this.onremove();
        this.DOM.remove();
        delete canvas_elements[this.id];
        delete this;
        resizeCanvas();
    }
}
