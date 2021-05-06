'use strict';

/*------------------
  CHART SELECTORS
------------------*/

const allChartsSelector = '.visual-barChart, .visual-columnChart, .visual-clusteredBarChart, .visual-clusteredColumnChart, .visual-hundredPercentStackedBarChart, .visual-hundredPercentStackedColumnChart, .visual-lineChart, .visual-areaChart, .visual-stackedAreaChart, .visual-lineStackedColumnComboChart, .visual-lineClusteredColumnComboChart, .visual-ribbonChart, .visual-waterfallChart, .visual-funnel, .visual-scatterChart, .visual-pieChart, .visual-donutChart, .visual-treemap';

const seriesChartsSelector = '.visual-lineChart, .visual-areaChart, .visual-stackedAreaChart, .visual-lineStackedColumnComboChart, .visual-lineClusteredColumnComboChart';

const stackedChartsSelector = '.visual-barChart, .visual-columnChart, .visual-hundredPercentStackedBarChart, .visual-hundredPercentStackedColumnChart, .visual-lineStackedColumnComboChart, .visual-stackedAreaChart';

const categoryLabelSelector = '.visual-funnel, .visual-pieChart, .visual-donutChart, .visual-treemap';

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
    return charts;
}

/*
returns a list of all charts that have the 'Category Label' option
*/
function selectCategoryLabelCharts(dom) {
    let charts = dom.querySelectorAll(categoryLabelSelector);
    return charts;
}

/*--------------
  CHART TESTS
--------------*/

/*
checks if chart has markers
if it does not, returns "Markers are not used"
if it does, checks that each marker used is unique
if they are, returns "Markers are the same"
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
            result = classToName[stackedToClustered[className]];
        }
    })
    return result;
}

/*
checks if chart has labels
if it does, returns false
if it does not, returns "Category labels not turned on"
for pie and donut charts it is umpossible to tell if the label includes the category
returns instead "Labels not turned on"
*/
function checkCategoryLabels(chart) {
    if (chart.classList.contains('visual-funnel')) {
        if (chart.querySelector('.axis > g') == null) {
            return "Category labels not turned on"
        }
        return false;
    }
    if (chart.classList.contains('visual-treemap')) {
        if (chart.querySelector('.labels > .majorLabel') == null) {
            return "Category labels not turned on"
        }
        return false;
    }
    if (chart.classList.contains('visual-pieChart')) {
        if (chart.querySelector('.labelGraphicsContext > .label') == null) {
            return "Labels not turned on"
        }
        return false;
    }
    if (chart.classList.contains('visual-donutChart')) {
        if (chart.querySelector('.labelGraphicsContext > .label') == null) {
            return "Labels not turned on"
        }
        return false;
    }
}

/*
checks if chart has a title
if it does, returns false
if it does not, returns "Chart does not have title"
*/
function checkTitle(chart) {
    if (chart.closest('visual-container-modern').querySelector('.visualTitle') == null) {
        return "Chart does not have title"
    }
    return false;
}

/*-----------------
  DISPLAY RESULTS
-----------------*/

function testSeriesMarkers(dom) {
    // create variables to hold end results and specific issues
    let results = [];
    let noMarkers = {title: "Markers Are Not Used", charts: [], description: "Line or area plot has multiple series. Use unique markers to differentiate between series. Useful for helping colorblind users.", aria: "Series Without Markers Dropdown Information Button", type: "warning", link: "https://docs.microsoft.com/en-us/power-bi/create-reports/desktop-accessibility-creating-reports#markers"};
    let sameMarkers = {title: "Markes Are the Same", charts: [], description: "Line or area plot has multiple series. Use unique markers to differentiate between series. Useful for helping colorblind users.", aria: "Series With Same Markers Dropdown Information Button", type: "warning", link: "https://docs.microsoft.com/en-us/power-bi/create-reports/desktop-accessibility-creating-reports#markers"};
    // go through charts and add to relevant issues
    selectSeriesCharts(dom).forEach(chart => {
        let title = null;
        let titleNode = chart.closest('visual-container-modern').querySelector('.visualTitle');
        if (titleNode) {
            title = titleNode.title;
        }
        let result = seriesMarkersDifferent(chart);
        if (result == "Markers are not used") {
            noMarkers.charts.push({chart: title, id_num: chart.id});
        }
        if (result == "Markers are the same") {
            sameMarkers.charts.push({chart: title, id_num: chart.id});
        }
    })
    // add issues to results variable if applicable
    if (noMarkers.charts.length > 0) {
        results.push(noMarkers);
    }
    if (sameMarkers.charts.length > 0) {
        results.push(sameMarkers);
    }
    return results;
}

function testStacked(dom) {
    // create variables to hold end results and specific issues
    let results = [];
    let stacked = {title: "Stacked Chart is Used", charts: [], description: "Use clustered over stacked charts. Increases readability and trend recognition.", aria: "Stacked Chart Dropdown Information Button", type: "warning", link: "https://eagereyes.org/techniques/stacked-bars-are-the-worst"};
    // go through charts and add to relevant issues
    selectStackedCharts(dom).forEach(chart => {
        let title = null;
        let titleNode = chart.closest('visual-container-modern').querySelector('.visualTitle');
        if (titleNode) {
            title = titleNode.title;
        }
        let result = checkStacked(chart);
        if (result) {
            stacked.charts.push({chart: title, clustered: result, id_num: chart.id});
        }
    })
    // add issues to results variable if applicable
    if (stacked.charts.length > 0) {
        results.push(stacked);
    }
    return results;
}

function testCategoryLabels(dom) {
    // create variables to hold end results and specific issues
    let results = [];
    let categoryLabels = {title: "Category Labels Not Used", charts: [], description: "Turn on category(and maybe data) labels. Increases readability. Useful for helping colorblind users.", aria: "No Category Labels Dropdown Information Button", type: "warning", link: "https://www.storytellingwithdata.com/blog/2018/6/26/accessible-data-viz-is-better-data-viz"};
    // go through charts and add to relevant issues
    selectCategoryLabelCharts(dom).forEach(chart => {
        let title = null;
        let titleNode = chart.closest('visual-container-modern').querySelector('.visualTitle');
        if (titleNode) {
            title = titleNode.title;
        }
        let result = checkCategoryLabels(chart);
        if (result) {
            categoryLabels.charts.push({chart: title, id_num: chart.id});
        }
    })
    // add issues to results variable if applicable
    if (categoryLabels.charts.length > 0) {
        results.push(categoryLabels);
    }
    return results;
}

function testTitles(dom) {
    // create variables to hold end results and specific issues
    let results = [];
    let noTitle = {title: "Chart Does Not Have Title", charts: [], description: "Include descriptive titles on all charts. Helps people using screen readers navigate. WCAG requirement.", aria: "Untitled Chart Dropdown Information Button", type: "error", link: "https://www.w3.org/WAI/WCAG21/quickref/#headings-and-labels"};
    // go through charts and add to relevant issues
    selectCharts(dom).forEach(chart => {
        let result = checkTitle(chart);
        if (result) {
           noTitle.charts.push({chart: null, id_num: chart.id});
        }
    })
    // add issues to results variable if applicable
    if (noTitle.charts.length > 0) {
        results.push(noTitle);
    }
    return results;
}

// combines all tests
// make sure errors are put first
function runTests(dom) {
    let results = [];
    results = results.concat(testTitles(dom));
    results = results.concat(testSeriesMarkers(dom));
    results = results.concat(testStacked(dom));
    results = results.concat(testCategoryLabels(dom));
    return results;
}
