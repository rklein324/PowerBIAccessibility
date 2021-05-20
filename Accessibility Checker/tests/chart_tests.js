'use strict';

/*-----------------------------------
 FUNCTIONS TO RETURN SPECIFIC CHARTS
-----------------------------------*/
// This section is for functions that take a chart selector from 'chart_constants.js' 
// and returns a NodeList of charts for a specific test or series of tests

/*
returns a list of all charts in the document
*/
function selectCharts(dom) {
    let charts = dom.querySelectorAll(allChartsSelector);
    return charts;
}

/*
returns a list of all charts that may have multiple series needing markers (for test 'seriesMarkersDifferent')
*/
function selectSeriesCharts(dom) {
    let charts = dom.querySelectorAll(seriesChartsSelector);
    return charts;
}

/*
returns a list of all charts that includes a stacked element (for test 'checkStacked')
*/
function selectStackedCharts(dom) {
    let charts = dom.querySelectorAll(stackedChartsSelector);
    return charts;
}

/*
returns a list of all charts that have the 'Category Label' option (for test 'checkCategoryLabels')
*/
function selectCategoryLabelCharts(dom) {
    let charts = dom.querySelectorAll(categoryLabelSelector);
    return charts;
}

/*--------------
  CHART TESTS
--------------*/
// This section is for functions that run a test on a singular chart

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
for pie and donut charts, it is impossible to tell if the label includes the category
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

/*------------------------
  FUNCTIONS TO RUN TESTS 
------------------------*/
/* This section is for compiling results for each test
   The results are held in an array
   Each type of result a test might give is held in a dictionary which includes:
    -title: the title of the issue that will be displayed in the UI
    -charts: an empty array that will have charts added as they fail the test
    -description: the text that will be shown when an issue is selected in the UI
    -aria: the aria text for the issue in the format '_description of issue_ Dropdown Information Button'
        example: 'Series Without Markers Dropdown Information Button'
    -type: the type of issue, either 'error' or 'warning'
    -link: a link to the section of the Best Practices document about this test
   A set of charts is selected using a function from the 'FUNCTIONS TO RETURN SPECIFIC CHARTS' section above
   Each chart in that list then is tested using the respective test from the 'CHART TESTS' section
   If a chart fails a test, it is added to the respective dictionary including the following:
    -chart: the title of the chart if it has one, otherwise it is left null
    -id_num: the id of the chart that was generated when the extension first ran on the report
   The dictionaries that have charts are then added to the list of results
*/

function testSeriesMarkers(dom) {
    // create variables to hold end results and specific issues
    let results = [];
    let noMarkers = {title: "Markers Are Not Used", charts: [], description: "Line or area plot has multiple series. Use unique markers to differentiate between series. Useful for helping colorblind users.", aria: "Series Without Markers Dropdown Information Button", type: "warning", link: "https://rklein324.github.io/PowerBIAccessibility/#markers"};
    let sameMarkers = {title: "Markers Are the Same", charts: [], description: "Line or area plot has multiple series. Use unique markers to differentiate between series. Useful for helping colorblind users.", aria: "Series With Same Markers Dropdown Information Button", type: "warning", link: "https://rklein324.github.io/PowerBIAccessibility/#markers"};
    // go through charts and add to relevant issues
    selectSeriesCharts(dom).forEach(chart => {
        let title = findTitle(chart);
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
    let stacked = {title: "Stacked Chart is Used", charts: [], description: "Use clustered over stacked charts. Increases readability and trend recognition.", aria: "Stacked Chart Dropdown Information Button", type: "warning", link: "https://rklein324.github.io/PowerBIAccessibility/#stacked"};
    // go through charts and add to relevant issues
    selectStackedCharts(dom).forEach(chart => {
        let title = findTitle(chart);
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
    let categoryLabels = {title: "Category Labels Not Used", charts: [], description: "Turn on category (and maybe data) labels. Increases readability. Useful for helping colorblind users.", aria: "No Category Labels Dropdown Information Button", type: "warning", link: "https://rklein324.github.io/PowerBIAccessibility/#category-labels"};
    // go through charts and add to relevant issues
    selectCategoryLabelCharts(dom).forEach(chart => {
        let title = findTitle(chart);
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
    let noTitle = {title: "Chart Does Not Have Title", charts: [], description: "Include descriptive titles on all charts. Helps people using screen readers navigate. WCAG requirement.", aria: "Untitled Chart Dropdown Information Button", type: "error", link: "https://rklein324.github.io/PowerBIAccessibility/#descriptive-titles"};
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

/*------------------
  COMPILE RESULTS 
------------------*/
// combines the results from all the tests into one list
// tests that show issues of type 'error' should be put before type 'warning'
function runTests(dom) {
    let results = [];

    // tests for 'error' types
    results = results.concat(testTitles(dom));

    // tests for 'warning' types
    results = results.concat(testSeriesMarkers(dom));
    results = results.concat(testStacked(dom));
    results = results.concat(testCategoryLabels(dom));

    return results;
}

/*-------------------------
  SUPPLEMENTARY FUNCTIONS 
-------------------------*/

function findTitle(chart) {
    let title = null;
    let titleNode = chart.closest('visual-container-modern').querySelector('.visualTitle');
    if (titleNode) {
        title = titleNode.title;
    }
    return title;
}
