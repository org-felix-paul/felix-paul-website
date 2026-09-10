/*
plot funktioniert wie folgt:
bei großer rundenzahl
 */

/*
// plot that extends itself
function getData() {
return Math.random();
}
Plotly.plot('myPlot', [{
y:[getData()],
type:'line'
}])

    setInterval(function(){
    Plotly.extendTraces('myPlot', {y:[[getData()]]}, [0]);
},5);
*/
// static plot
function plot() {
    var trace1 = {
        x: window.opener.x1,//[0, 1, 2, 3, 4, 5, 6, 7, 8],
        y: window.opener.y1, //[0, 1, 2, 3, 4, 5, 6, 7, 8],
        name: 'ECHTER Fehler',
        type: 'scatter'
    };

    var trace2 = {
        x: window.opener.x2,
        y: window.opener.y2, //[0, 7, 12, 18, 4, 6, 9, 1, 8],
        name: 'verworfener Fehler',
        mode: 'markers',
        marker : {
            color: 'red',
            symbol: 'x' }
    };

    var data = [trace1, trace2];

    var layout = {
        title: {
            text:'Fehler in Abhängigkeit der Runde',
            font: {
                family: 'Courier New, monospace',
                size: 24
            },
            xref: 'paper',
            x: 0.05,
        },

        xaxis: {
            title: {
                text: 'Rundenzahl',
                font: {
                    family: 'Courier New, monospace',
                    size: 18,
                    color: '#7f7f7f'
                }
            },
        },

        yaxis: {
            title: {
                text: 'Fehler',
                font: {
                    family: 'Courier New, monospace',
                    size: 18,
                    color: '#7f7f7f'
                }
            }
        }
    };
    Plotly.newPlot('myPlot', data, layout,  {responsive: true});
}
// todo: anstatt newPlot nur extendTraces
// initial muss aber newPlot bleiben!


function  stop() {
    clearInterval(intervall);
}

const intervall = setInterval(function(){
    if(window.opener.trainingFinished == true){
        stop();
    }
    console.log(window.opener.trainingFinished);
    plot();
    //location.reload();
}, window.opener.getRoundDuration());