// Diese Funktion skaliert alle Einträge im Datensatz auf einen Wert zwischen 0 und 1

function normalizeDataSet() {
    for (let i = 0; i < getCurrentMatrix().n; i++) {
        for (let j = 0; j < getCurrentMatrix().m; j++) {
            let minValue = Infinity;
            let maxValue = -Infinity;
            for (const [id, matrix] of Object.entries(matrix_list)) {
                minValue = Math.min(minValue, matrix.getValue(i,j) || Infinity);
                maxValue = Math.max(maxValue, matrix.getValue(i,j) || -Infinity);
            }
            for (const [id, matrix] of Object.entries(matrix_list)) {
                let normalizedValue = .5;
                if (maxValue-minValue !== 0) {
                    normalizedValue = (matrix.getValue(i,j) - minValue) / (maxValue-minValue);
                }
                matrix.setValue(i,j,normalizedValue,false);
            }
        }
    }

    //TODO: evtl auch Label normalisieren?

    updateSidebar();
}