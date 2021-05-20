'use strict';

/*------------------
  CHART SELECTORS
------------------*/

// constant that is the string selector for all of the charts that should be included in the tests
// one of two places where this would need to be updated
const allChartsSelector = '.visual-barChart, .visual-columnChart, .visual-clusteredBarChart, .visual-clusteredColumnChart, .visual-hundredPercentStackedBarChart, .visual-hundredPercentStackedColumnChart, .visual-lineChart, .visual-areaChart, .visual-stackedAreaChart, .visual-lineStackedColumnComboChart, .visual-lineClusteredColumnComboChart, .visual-ribbonChart, .visual-waterfallChart, .visual-funnel, .visual-scatterChart, .visual-pieChart, .visual-donutChart, .visual-treemap';

// constant that is the string selector for all of the charts that should be included in the test 'seriesMarkersDifferent'
const seriesChartsSelector = '.visual-lineChart, .visual-areaChart, .visual-stackedAreaChart, .visual-lineStackedColumnComboChart, .visual-lineClusteredColumnComboChart';

// constant that is the string selector for all of the charts that should be included in the test 'checkStacked'
const stackedChartsSelector = '.visual-barChart, .visual-columnChart, .visual-hundredPercentStackedBarChart, .visual-hundredPercentStackedColumnChart, .visual-lineStackedColumnComboChart, .visual-stackedAreaChart';

// constant that is the string selector for all of the charts that should be included in the test 'checkCategoryLabels'
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