/*
This is where the User Interface of the issues popup (or 'check.html') is updated based on the test results
It also communicates with 'content.js' for any interaction with the DOM
*/
window.onload = function () {
  /*
  when the window is loaded:
  - gets the most recent active tab that is not the popup,
  - passes that to content.js, gets the DOM as a string and converts it to a DOM element
  - runs tests and stores in 'results'
  - adds each issue in results as an issue in issueArea
  - sends the charts with issues to content.js for highlighting
  - adds the "Run Again" button
  */
  chrome.tabs.query({active: true, currentWindow: false}, function(tabs) {
    currentTab = tabs[tabs.length - 1].id;
    chrome.tabs.sendMessage(tabs[tabs.length - 1].id, {text: "report_back"}, function(html) {
      html = html.trim();
      template = document.createElement('template');
      template.innerHTML = html;
      let results = runTests(template.content);
      let issueArea = document.getElementById("issues");
      let num = 1;
      results.forEach(issue => {
        issueArea.appendChild(createIssue(issue.title, issue.charts, issue.description, issue.aria, issue.type, issue.link, num));
        chrome.tabs.sendMessage(tabs[tabs.length - 1].id, {text: "insert", charts: issue.charts, type: issue.type});
        num += 1;
      });
      if (results.length == 0) {
        let t = document.createElement("text");
        t.textContent = "All tests passed! Please note that the tests are not comprehensive and you may still have issues.";
        issueArea.appendChild(t);
      }
    });
  });

  btn = document.getElementById("runAgainBtn");
  btn.addEventListener('click', function() {
    window.top.close();
    chrome.windows.create({url: "popup.html", type: "popup", height: 250, width: 200, left: 940, top: 65});
  });
}
/*
takes an element and toggles the 'active' class
*/
function toggleActive(element) {
    element.classList.toggle("active");
}

/*
takes the elements of an issue and updates the content to the dropdown setup
btn: the button element that holds the entire issue
charts: an array of all the charts with that issue
  each chart is a dictionary where the key 'chart' is the title of the chart or 'null' if it doesn't have a title
text: the text description about the issue
link: the link to be added to the "More Information" button
*/
function drpdwnButton(btn, charts, text, link) {
  // remove the arrow
  btn.removeChild(btn.lastChild);

  // create the needed elements
  let t = document.createElement("text");
  let u = document.createElement("ul");
  let p = document.createElement("p");
  let i = document.createElement("i");
  let b = document.createElement("button");
  let br = document.createElement("br");

  // create the list of affected charts
  let untitledNum = 1;
  charts.forEach(chart => {
    let l = document.createElement("li");
    let title = chart.chart;
    if (title == null) {
      title = "Untitle Chart #" + untitledNum++
    }
    l.textContent = title;
    u.appendChild(l);
  });

  // add text content and attributes
  t.textContent = text;
  t.setAttribute("class", "issueInfo");
  i.setAttribute("class", "fas fa-angle-up upArrow1");
  i.setAttribute("aria-hidden", "true");
  b.setAttribute("type", "button");
  b.setAttribute("id", "linkBtn");
  b.textContent = "More Information";
  p.setAttribute("class", "issueInfo");

  // add event listener to the "More Information" button that opens the link in a new tab when clicked
  b.addEventListener('click', function() {
    window.open(link, '_blank');
  });

  // attach all elements to issue button
  p.appendChild(t);
  p.appendChild(u);
  p.appendChild(br);
  p.appendChild(b);
  btn.appendChild(p);
  btn.appendChild(i);
}

/*
takes the elements of an issue and updates the content to the closed setup
btn: the button element that holds the entire issue
*/
function resetButton(btn) {
  // remove all unneeded elements
  for (i = 0; i < 2; i++) {
    btn.removeChild(btn.lastChild);
  }

  // create arrow element, add attributes, and attach to issue button
  let icon = document.createElement("i");
  icon.setAttribute("class", "fas fa-angle-down downArrow1");
  btn.appendChild(icon);
}

/*
creates an issue button
title: the title of the issue to be displayed
charts: an array of all the charts with that issue
  each chart is a dictionary where the key 'chart' is the title of the chart or 'null' if it doesn't have a title
description: the text description about the issue
aria: the aria label for the issue button
type: the type of issue ('error' or 'warning')
link: the link to be added to the "More Information" button
number: the number of the issue within the full list
*/
function createIssue(title, charts, description, aria, type, link, number) {
  // create the needed elements
  let d = document.createElement("div");
  let b = document.createElement("button");
  let i1 = document.createElement("i");
  let p = document.createElement("pre");
  let i2 = document.createElement("i");

  // add text content and attributes
  d.setAttribute("class", "dropdown");
  b.setAttribute("class", "dropbtn " + type);
  b.setAttribute("aria-label", aria);
  if (type == "error") {
    i1.setAttribute("class", "fas fa-times-circle");
  }
  if (type == "warning") {
    i1.setAttribute("class", "fas fa-exclamation-triangle");
  }
  p.textContent = "  " + number + ". " + title;
  i2.setAttribute("aria-hidden", "true");
  i2.setAttribute("class", "fas fa-angle-down downArrow1");

  // attach all elements to issue button
  d.appendChild(b);
  b.appendChild(i1);
  b.appendChild(p);
  b.appendChild(i2);

  // add the event listener for when the dropdown nature of the botton is opened or closed
  // sends the information to content.js to update highlighting
  b.addEventListener('click', function() {
    toggleActive(d);

    if (d.classList.contains("active")) {
      drpdwnButton(b, charts, description, link);
      chrome.tabs.sendMessage(currentTab, {text: "highlight", active: "active", charts: charts, type: type});
    } else {
      resetButton(b)
      chrome.tabs.sendMessage(currentTab, {text: "highlight", active: "inactive", charts: charts, type: type});
    }
  });

  return d;
}
