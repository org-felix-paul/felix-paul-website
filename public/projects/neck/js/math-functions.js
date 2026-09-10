//berechnet die Koordinaten, sodass das Element schön auf den Schnittpunkten
//des Koordinatensystems platziert ist
function calculateStickedCoordinates(pos) {
    return (Math.round(parseInt(pos)/15)*15)
}