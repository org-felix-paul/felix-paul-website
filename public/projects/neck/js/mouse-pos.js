function getCanvasMousePos(event) {
    const canvas = document.getElementById('canvas');
    const box = canvas.getBoundingClientRect();

    switch (event.type) {
        case 'touchmove':
        case 'touchstart':
        case 'touchend':
            return {
                left: (1/canvasScale) * (event.touches[0].clientX - box.left + canvas.scrollLeft),
                top: (1/canvasScale) * (event.touches[0].clientY - box.top + canvas.scrollTop)
            }
        default:
            return {
                left: (1/canvasScale) * (event.clientX - box.left + canvas.scrollLeft),
                top: (1/canvasScale) * (event.clientY - box.top + canvas.scrollTop)
            }
    }
}