// constant that is the string selector for all of the charts that should be included in the tests
// one of two places where this would need to be updated
const allChartsSelector = '.visual-barChart, .visual-columnChart, .visual-clusteredBarChart, .visual-clusteredColumnChart, .visual-hundredPercentStackedBarChart, .visual-hundredPercentStackedColumnChart, .visual-lineChart, .visual-areaChart, .visual-stackedAreaChart, .visual-lineStackedColumnComboChart, .visual-lineClusteredColumnComboChart, .visual-ribbonChart, .visual-waterfallChart, .visual-funnel, .visual-scatterChart, .visual-pieChart, .visual-donutChart, .visual-treemap';

// Listen for messages
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    // sends back the DOM
    if (msg.text === 'report_back') {

      // adds IDs to each chart
      let charts = document.querySelectorAll(allChartsSelector);
      let num = 0;
      charts.forEach(chart => {
        chart.setAttribute("id", num.toString());
        num += 1;
      });
      sendResponse(document.all[0].innerHTML);

    // highlights all charts with issues around the border
    } else if (msg.text === 'insert') {
      msg.charts.forEach(id => {
        let el = document.getElementById(id.id_num);
        if (msg.type == "warning") {
          el.style.border = "medium solid #f8d568";
        } else if (msg.type == "error") {
          el.style.border = "medium solid #fa8072";
        }
      });

    // highlights charts wit issues connected to a dropdown that is open
    } else if (msg.text === 'highlight') {
      msg.charts.forEach(id => {
        let el = document.getElementById(id.id_num);
        if (msg.active == 'active') {
          if (msg.type == "warning") {
            el.style.backgroundColor = "#fdf1c9";
          } else if (msg.type == "error") {
            el.style.backgroundColor = "#fdc9c9";
          }
        } else {
          el.style.backgroundColor = "transparent";
        }
      });
    }

});
