/*
This is where the User Interface of the issues popup (or 'check.html') is updated based on the test results
It also communicates with 'content.js' for any interaction with the DOM
*/

window.onload = function () {
  /*
  when the window is loaded:
  - gets the most recent active tab that is not the popup (should be the tab the extension is run on),
  - passes that to content.js, gets the DOM as a string and converts it to a DOM element
  - runs tests and stores in 'results'
  - adds each issue in results as an issue in issueArea
  - sends the charts with issues to content.js for highlighting
  - adds the "Run Again" button
  - creates separate messages if cannot connect to DOM or all tests pass
  */
  chrome.tabs.query({active: true, currentWindow: false}, function(tabs) {
    // find id of correct tab
    currentTab = tabs[tabs.length - 1].id;
    chrome.tabs.sendMessage(currentTab, {text: "report_back"}, function(html) {
      // create error message if cannot connect to DOM
      if (html === undefined) {
        let issueArea = document.getElementById("issues");
        let div = document.createElement("div");
        let t = document.createElement("text");
        let i = document.createElement("i");

        div.setAttribute("id", "refresh");
        i.setAttribute("class", "fas fa-times-circle");
        i.setAttribute("id", "problem");
        t.textContent = "An error has occurred. Try refreshing or opening in a new window.";

        div.appendChild(i);
        div.appendChild(t);
        issueArea.appendChild(div);
      } else {
        // variable to count the number of errors and warnings
        let count = [0, 0];

        // creating DOM
        html = html.trim();
        template = document.createElement('template');
        template.innerHTML = html;
        let results = runTests(template.content);

        // create issues
        let issueArea = document.getElementById("issues");
        let num = 1; // count number of issue categories
        results.forEach(issue => {
          issueArea.appendChild(createIssue(issue.title, issue.charts, issue.description, issue.aria, issue.type, issue.link, num));
          chrome.tabs.sendMessage(currentTab, {text: "insert", charts: issue.charts, type: issue.type}); // add highlighting
          num += 1;
          count = trackSummary(issue.charts, issue.type, count); // add to count for summary
        });

        // create success message if all tests pass
        if (results.length == 0) {
          // create the needed elements
          let div = document.createElement("div");
          let i = document.createElement("i");
          let t = document.createElement("text");
          let t1 = document.createElement("text");
          let t2 = document.createElement("text");
          let a1 = document.createElement("a");
          let a2 = document.createElement("a");
 
          // set attributes
          div.setAttribute("id", "success");
          i.setAttribute("class", "fas fa-check-circle");
          a1.setAttribute("href", "https://rklein324.github.io/PowerBIAccessibility/");
          a1.setAttribute("target", "_blank");
          a2.setAttribute("href", "https://docs.microsoft.com/en-us/power-bi/create-reports/desktop-accessibility-creating-reports")
          a2.setAttribute("target", "_blank");

          // add text content
          t1.textContent = "All tests passed! We recommend that you check further guidelines in our ";
          a1.textContent = "best practices document";
          t2.textContent = " for visualization accessibility and the latest ";
          a2.textContent = "Microsoft accessibility guidelines.";

          // attach all elements to issue area
          div.appendChild(i);
          div.appendChild(t);
          t.appendChild(t1);
          t.appendChild(a1);
          t.appendChild(t2);
          t.appendChild(a2);
          issueArea.appendChild(div);
        }

        // create summary
        if (count[0] != 0 || count[1] != 0) {
          createSummary(count);
        }
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
  each chart is a dictionary where the key 'chart' has a value of the title of the chart 
  or 'null' if it doesn't have a title
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
      title = "Untitled Chart #" + untitledNum++;
    }
    if (chart.clustered) {
      title = title + " -> " + chart.clustered;
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

  // add the event listener for when the dropdown nature of the button is opened or closed
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

/*
updates the count of errors and warnings for the summary
charts: the array of charts that have a specific issue
type: the type of issue ('error' or 'warning')
count: an array of the current count of issues [number of charts with errors, number of charts with warnings]
*/
function trackSummary(charts, type, count) {
  if (type == "error") {
    count[0] = count[0] + charts.length;
  } 
  if (type == "warning") {
    count[1] = count[1] + charts.length;
  }
  return count;
}

/*
creates the summary section which includes the number of charts with errors and warnings
and a hover that shows the definitions of the issue types
count: an array of the number of issues [number of charts with errors, number of charts with warnings]
*/
function createSummary(count) {
  let p = document.getElementById("overview");

  // create the needed elements
  let i1 = document.createElement("i");
  let i2 = document.createElement("i");
  let t1 = document.createElement("text");
  let t2 = document.createElement("text");
  let s1 = document.createElement("span");
  let s2 = document.createElement("span");

  // add attributes
  p.setAttribute("id", "overview");
  i1.setAttribute("class", "fas fa-times-circle");
  i1.setAttribute("id", "error");
  i2.setAttribute("class", "fas fa-exclamation-triangle");
  i2.setAttribute("id", "warning");
  s1.setAttribute("class", "hide1"); // hover visibility is added in CSS
  s2.setAttribute("class", "hide2"); // hover visibility is added in CSS

  // add text content
  if(count[0] == 1) {
    t1.textContent = " " + count[0] + " error ";
  } else {
    t1.textContent = " " + count[0] + " errors ";
  }
  if(count[1] == 1) {
    t2.textContent = " " + count[1] + " warning";
  } else {
    t2.textContent = " " + count[1] + " warnings";
  }
  s1.textContent = "WCAG violation";
  s2.textContent = "Best practices violation";

  // attach all elements
  p.appendChild(i1);
  p.appendChild(s1);
  p.appendChild(t1);
  p.appendChild(i2);
  p.appendChild(s2);
  p.appendChild(t2);
}
