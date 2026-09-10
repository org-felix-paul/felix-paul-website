window.onload = function() {
    resetSelectElement(document.getElementById('trainingMethod'));
    resetSelectElement(document.getElementById('linearityFunction'));
    resetSelectElement(document.getElementById('errorMetrik'));
    resetSelectElement(document.getElementById('testDataChoosingFunction'));
    document.getElementById('expertMode').checked = false;
    document.getElementById('inputBiasActive').checked = true;
    document.getElementById('online').checked = true;

}

function resetSelectElement(selectElement) {
    selectElement.selectedIndex = 0;  // first option is selected, or
                                     // -1 for no option selected
}