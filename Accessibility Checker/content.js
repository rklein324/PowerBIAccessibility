
const allChartsSelector = '.visual-barChart, .visual-columnChart, .visual-clusteredBarChart, .visual-clusteredColumnChart, .visual-hundredPercentStackedBarChart, .visual-hundredPercentStackedColumnChart, .visual-lineChart, .visual-areaChart, .visual-stackedAreaChart, .visual-lineStackedColumnComboChart, .visual-lineClusteredColumnComboChart, .visual-ribbonChart, .visual-waterfallChart, .visual-funnel .visual-scatterChart, .visual-pieChart, .visual-donutChart, .visual-treemap';

// Listen for messages
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    // If the received message has the expected format...
    if (msg.text === 'report_back') {

      let charts = document.querySelectorAll(allChartsSelector);
      let num = 0;
      charts.forEach(chart => {
        chart.setAttribute("id", num.toString());
        num += 1;
      });

      sendResponse(document.all[0].innerHTML);

    } else if (msg.text === 'insert') {
      let el = document.getElementById(msg.id_num);
      el.style.border = "medium solid #f8d568";

    }
});
