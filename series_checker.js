'use strict';

function selectLineCharts() {
    let charts = document.querySelectorAll('.visual-lineChart');
    return charts;
}

function seriesMarkersDifferent(chart) {
    let markers = chart.querySelectorAll('marker');
    if (markers.length > 0) {
        let shapes = [];
        markers.forEach(marker => {
            shapes.push(marker.querySelector("path").getAttribute('d'));
        }); 
        document.querySelector('#testArea').innerHTML = new Set(shapes).size;
        return (new Set(shapes)).size == shapes.length;
    } else {
        return true;
    }
}

let results = []
selectLineCharts().forEach(chart => {
    document.querySelector('#testArea').innerHTML = chart;
    results.push(seriesMarkersDifferent(chart));
})
document.querySelector('#testArea').innerHTML = results;