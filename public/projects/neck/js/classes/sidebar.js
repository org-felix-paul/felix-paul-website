function updateSidebar(){
    
    const element = canvas_elements[globalThis.selectedCanvasElementId] || null;
    const sidebar = document.getElementById('sideBar');

    let ihtml = '';

    let type = 2;
    if (element != null) {
        type = element.type;
    }

    switch(type) {
        case 0: //Neuronen
            ihtml+="<h5>Neuron</h5>";
            for(i=0;i<element.inputs.length;i++){
                ihtml+="<div>Weight "+i+": " + element.inputs[i].weights[element.inputs[i].weights.length-1] + "</div>";
            }
            ihtml+="Value: " + element.value + "<br />";
            ihtml+="NetValue: " + element.netValue + "<br />";
            ihtml+="delta: " + element.delta + "<br />";
            break;
        case 1: //Output
            ihtml += '<h5 style="margin-bottom: 50px;">Output</h5>';
            ihtml += '<h5>Valuehistorie:</h5>';
            ihtml += '<h7>(Von neu zu alt)</h7>';
            //Vlalue-tabelle
            ihtml+=`<div style="overflow-x:auto;">`;
            ihtml+=`<table class="side-output-t">`;
            ihtml1=`<tr class="side-output-tr"><th class="side-output-td">Output</th>`;
            ihtml2=`<tr class="side-output-tr"><th class="side-output-td">Sollwert</th>`;
            ihtml3=`<tr class="side-output-tr"><th class="side-output-td">Differenz</th>`;
            ihtml4=`<tr class="side-output-tr"><th class="side-output-td">Differenz^2</th>`;
            let var1=0;
            let var2=0;
            let var3=0;
            let var4=0;
            for (let i = element.len; i > 0; i--) {
                var1=parseFloat(element.value[i-1]);
                var2=parseFloat(element.soll[i-1]);
                var3=parseFloat(Math.abs(element.soll[i-1]-element.value[i-1]));
                var4=parseFloat(Math.pow(element.soll[i-1]-element.value[i-1],2));
                ihtml1+=`<td class="side-output-td">`+(var1).toFixed(2)+"</td>";
                ihtml2+=`<td class="side-output-td">`+(var2).toFixed(2)+"</td>";
                ihtml3+=`<td class="side-output-td">`+(var3).toFixed(2)+"</td>";
                ihtml4+=`<td class="side-output-td">`+(var4).toFixed(2)+"</td>";
            }
            ihtml+=ihtml1+"</tr>"+ihtml2+"</tr>"+ihtml3+"</tr>"+ihtml4+"</tr></table></div>";
            break;
        case 2: //Matrix
            ihtml += '<h5 class="mb-3">Datensatz</h5>';

            ihtml += '<div class="d-flex align-items-center">';
            ihtml += '<select class="form-select form-select-sm" id="nVal" onchange="resizeMatrix()">';
            for (let i = 1; i <= 10; i++) {
                ihtml += '<option';
                if (getMatrixSize().n === i) {
                    ihtml += ' selected';
                }
                ihtml += '>'+i+'</option>';
            }
            ihtml += '</select>';
            ihtml += '<div class="mx-1">x</div>';
            ihtml += '<select class="form-select form-select-sm" id="mVal" onchange="resizeMatrix()">';
            for (let i = 1; i <= 10; i++) {
                ihtml += '<option';
                if (getMatrixSize().m === i) {
                    ihtml += ' selected';
                }
                ihtml += '>'+i+'</option>';
            }
            ihtml += '</select>';
            //ihtml += '<div class="d-flex justify-content-center"><button class="btn btn-sm btn-outline-secondary" onclick="resizeMatrix();">Resize</button></div>';
            ihtml += '</div>';

            ihtml += '<div class="d-flex justify-content-center mt-2"><button class="btn btn-sm btn-outline-secondary w-100" onclick="normalizeDataSet();">normalisieren</button></div>';

            ihtml += '<hr>';

            const minValue = getGlobalMinValue();
            const maxValue = getGlobalMaxValue();

            for (const [id, matrix] of Object.entries(matrix_list)){
                ihtml += '<div class="sidebarMatrix mb-2">';
                for (let row = 0; row < matrix.n; row++) {
                    ihtml += '<div class="sidebarMatrixRow">';
                    for (let col = 0; col < matrix.m; col++) {
                        const entry = matrix.values[row][col];

                        let opacity = .5;
                        if (maxValue-minValue !== 0) {
                            opacity = (entry - minValue) / (maxValue-minValue)
                        }
                        ihtml += '<div class="sidebarMatrixEntry" style="background-color: rgba(0,0,0,'+opacity+');"></div>';
                    }
                    ihtml += '</div>';
                }
                ihtml += '</div>'
                ihtml += '<div class="row"><div class="col-6"><button class="btn btn-sm btn-primary w-100" onclick="matrix_list.'+id+'.display();" title="Einsetzen"';
                if (matrix.isDisplayed()) {
                    ihtml += ' disabled';
                }
                ihtml += '><i class="bi bi-eye-fill"></i></button></div><div class="col-6"><button class="btn btn-sm btn-outline-danger w-100" onclick="matrix_list.'+id+'.remove()" title="Löschen"';
                ihtml += '><i class="bi bi-trash-fill"></i></button></div></div>';
                ihtml += '<hr>';
            }
            ihtml += '<div class="d-flex justify-content-center"><button class="btn btn-sm btn-outline-secondary" onclick="newMatrix();"><i class="bi bi-plus-circle-fill"></i> hinzufügen</button></div>';
            break;
    }
    sidebar.innerHTML = ihtml;
}