//TODO löschen der Linien richtig anpassen: sodass angrezende Canvaselemente
//realisieren dass die Linie gelöscht wird
class Line extends CanvasElement {
    constructor(start = [0,0], end = [0,0], color='black', width = 3) {
        super('',0,0, 1);
        this.DOM.classList.add('line');

        this.start = start;
        this.end = end;
        this.color = color;
        this.width = width;
        this.draw();
    }

    setStart(start = [0,0],animate = true) {
        this.start = start;
        this.draw(animate)
    }

    setEnd(end = [0,0],animate = true) {
        this.end = end;
        this.draw(animate);
    }

    setColor(color = 'black',animate = true) {
        this.color = color;
        this.draw(animate);
    }

    setWidth(width = 3,animate = true) {
        this.width = width;
        this.draw(animate);
    }

    draw(animate = true) {
        if (!animate) {
            this.DOM.style.transition = 'none';
            setTimeout(() => {
                this.DOM.style.transition = '';
            },100);
        }
        const length = Math.sqrt(Math.pow(this.end[0]-this.start[0],2) + Math.pow(this.end[1]-this.start[1],2));
        const angle = Math.atan((this.end[1] - this.start[1]) / (this.end[0] - this.start[0])) * (180 / Math.PI);
        this.DOM.style.width = length+'px';
        this.DOM.style.height = this.width+'px';
        this.DOM.style.left = (this.start[0] + (this.end[0] - this.start[0])/2)+'px';
        this.DOM.style.top = (this.start[1] + (this.end[1] - this.start[1])/2)+'px';
        this.DOM.style.transform = 'translateX(-50%) translateY(-50%) rotate('+angle+'deg)';
        this.DOM.style.backgroundColor = this.color;
    }
}