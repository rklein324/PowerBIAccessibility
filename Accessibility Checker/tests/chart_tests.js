'use strict';

/*------------------
  CHART SELECTORS
------------------*/

const allChartsSelector = '.visual-barChart, .visual-columnChart, .visual-clusteredBarChart, .visual-clusteredColumnChart, .visual-hundredPercentStackedBarChart, .visual-hundredPercentStackedColumnChart, .visual-lineChart, .visual-areaChart, .visual-stackedAreaChart, .visual-lineStackedColumnComboChart, .visual-lineClusteredColumnComboChart, .visual-ribbonChart, .visual-waterfallChart, .visual-funnel .visual-scatterChart, .visual-pieChart, .visual-donutChart, .visual-treemap';

const seriesChartsSelector = '.visual-lineChart, .visual-areaChart, .visual-stackedAreaChart, .visual-lineStackedColumnComboChart, .visual-lineClusteredColumnComboChart, .visual-scatterChart';

const stackedChartsSelector = '.visual-barChart, .visual-columnChart, .visual-hundredPercentStackedBarChart, .visual-hundredPercentStackedColumnChart, .visual-lineStackedColumnComboChart, .visual-stackedAreaChart';

/*------------------
 CHART DICTIONARIES
------------------*/

/*
Key: class names of (almost) every chart
Value: corresponding official name in Power BI user interface
*/
const classToName = {
    'visual-barChart': 'Stacked Bar Chart',
    'visual-columnChart': 'Stacked Column Chart',
    'visual-clusteredBarChart': 'Clustered Bar Chart',
    'visual-clusteredColumnChart': 'Clustered Column Chart',
    'visual-hundredPercentStackedBarChart': '100% Stacked Bar Chart',
    'visual-hundredPercentStackedColumnChart': '100% Stacked Column Chart',
    'visual-lineChart': 'Line Chart',
    'visual-areaChart': 'Area Chart',
    'visual-stackedAreaChart': 'Stacked Area Chart',
    'visual-lineStackedColumnComboChart': 'Line and Stacked Column Chart',
    'visual-lineClusteredColumnComboChart': 'Line and Clustered Column Chart',
    'visual-ribbonChart': 'Ribbon Chart',
    'visual-waterfallChart': 'Waterfall Chart',
    'visual-funnel': 'Funnel',
    'visual-scatterChart': 'Scatter Chart',
    'visual-pieChart': 'Pie Chart',
    'visual-donutChart': 'Donut Chart',
    'visual-treemap': 'Treemap'
};

/*
Key: class names of every chart that includes a stacked element
Value: class name of corresponding chart that uses the non-stacked version
*/
const stackedToClustered = {
    'visual-barChart': 'visual-clusteredBarChart',
    'visual-columnChart': 'visual-clusteredColumnChart',
    'visual-hundredPercentStackedBarChart': 'visual-clusteredBarChart',
    'visual-hundredPercentStackedColumnChart': 'visual-clusteredColumnChart',
    'visual-lineStackedColumnComboChart': 'visual-lineClusteredColumnComboChart',
    'visual-stackedAreaChart': 'visual-areaChart'
};

/*-----------------------------------
 FUNCTIONS TO RETURN SPECIFIC CHARTS
-----------------------------------*/

/*
returns a list of all charts in the document
*/
function selectCharts(dom) {
    let charts = dom.querySelectorAll(allChartsSelector);
    console.log(charts);
    return charts;
}

/*
returns a list of all charts that may have multiple series needing markers
*/
function selectSeriesCharts(dom) {
    let charts = dom.querySelectorAll(seriesChartsSelector);
    return charts;
}

/*
returns a list of all charts that includes a stacked element
*/
function selectStackedCharts(dom) {
    let charts = dom.querySelectorAll(stackedChartsSelector);
    //console.log(charts);
    return charts;
}

/*--------------
  CHART TESTS
--------------*/

/*
checks if chart has markers
if it does not, returns 'no markers'
if it does, checks that each marker used is unique
if they are, returns true
if they are not, returns false
*/
function seriesMarkersDifferent(chart) {
    let markers = chart.querySelectorAll('marker');
    if (markers.length > 0) {
        let shapes = [];
        markers.forEach(marker => {
            shapes.push(marker.querySelector("path").getAttribute('d'));
        });
        if ((new Set(shapes)).size != shapes.length) {
            return "Markers are the same";
        }
        return false
    } else {
        return "Markers are not used";
    }
}

/*
checks if chart is a stacked bar/column chart
if it is, returns the class name of the recommended chart to replace it with
if it is not, returns false
*/
function checkStacked(chart) {
    let result = false
    chart.classList.forEach(className => {
        if (className in stackedToClustered) {
            result = stackedToClustered[className];
        }
    })
    return result;
}

/*-----------------
  DISPLAY RESULTS
-----------------*/

function testSeriesMarkers(dom) {
    let results = []
    selectSeriesCharts(dom).forEach(chart => {
        let title = chart.closest('visual-container-modern').querySelector('.visualTitle').title;
        let result = seriesMarkersDifferent(chart);
        if (result) {
            results.push({chart: title, result: result, id_num: chart.id});
        }
    })
    return results;
}

function testStacked(dom) {
    let results = []
    selectStackedCharts(dom).forEach(chart => {
        let title = chart.closest('visual-container-modern').querySelector('.visualTitle').title;
        let result = checkStacked(chart);
        if (result) {
            results.push({chart: title, result: "Use " + classToName[result], id_num: chart.id});
        }
    })
    return results;
}

function runTests(dom) {
    let results = {}
    results.seriesMarkers = testSeriesMarkers(dom);
    results.stacked = testStacked(dom);
    return results
}
