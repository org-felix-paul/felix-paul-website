window.addEventListener('load', () => {

    resizeCanvas(); // initialisiere die Canvas-Größe

    // main js start
    const m = 2;
    const n = 2;
    const matrix2 = new Matrix(m ,n, [[1, 1], [1, 1]]);

    // Label können gesetzt werden mit matrix_3.setLabel(<index>,<value>);
    // und abgefragt werden mit matrix_3.getLabel(<index>);

    initCanvasMatrix(matrix2);

    const matrix3 = new Matrix(m ,n, [[2, 2], [2, 2]]);
    const matrix4 = new Matrix(m ,n, [[3, 3], [3, 3]]);
    
    // Neuronen erstellen
    let layers = [
        [
            new Neuron(1*(2*225)+(200),0*(60+150)+60),
            new Neuron(1*(2*225)+(200),1*(60+150)+60),
        ],
        [
            new Neuron(2*(2*225)+(200),0*(60+150)+60)
        ]      
    ];

    for (let i = 1; i < layers.length; i++) {
        const layer = layers[i];
        const prev_layer = layers[i-1];
        layer.forEach(outputNeuron => {
            prev_layer.forEach(inputNeuron => {
                outputNeuron.addInput(inputNeuron);
            });
        });
    }

    for (let i = 0; i < getCurrentMatrix().n; i++) {
        for (let j = 0; j < getCurrentMatrix().m; j++) {
            layers[0].forEach(neuron => {
                neuron.addInput(globalThis.canvasMatrix, initializeWeights(), i, j);
            });
        }
    }

    const output = new EOutput(3*(2*225)+(200), 0.5*(60+150)+60);
    output.setInput(layers[layers.length-1][layers[layers.length-1].length-1]);

    matrix2.setLabel(output.id, 1);
    matrix3.setLabel(output.id, 2);
    matrix4.setLabel(output.id, 3);

    output.setExpectedValue(1);
    // standardmäßig ist Expertenmodus erstmal aus
    toggleExpertMode();
    // standardmäßig ist topbar aus
    toggleTopBar();
});