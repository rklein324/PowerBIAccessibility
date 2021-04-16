// will hold the results of the tests
var results = {};

window.onload = function () {
  // gets the most recent active tab that is not the popup,
  // passes that to content.js, gets the DOM as a string and converts it to a DOM element
  // runs tests and stores in 'results'
  chrome.tabs.query({active: true, currentWindow: false}, function(tabs) {
    currentTab = tabs[tabs.length - 1].id;
    chrome.tabs.sendMessage(tabs[tabs.length - 1].id, {text: "report_back"}, function(html) {
      html = html.trim();
      template = document.createElement('template');
      template.innerHTML = html;
      results = runTests(template.content);
      let issueArea = document.getElementById("issues");

      results.seriesMarkers.forEach(issue => {
        issueArea.appendChild(createIssue(issue.result, issue.description, issue.aria, issue.type, issue.link, issue.id_num));
        chrome.tabs.sendMessage(tabs[tabs.length - 1].id, {text: "insert", id_num: issue.id_num, type: issue.type});
      });

      results.stacked.forEach(issue => {
        issueArea.appendChild(createIssue(issue.result, issue.description, issue.aria, issue.type, issue.link, issue.id_num));
        chrome.tabs.sendMessage(tabs[tabs.length - 1].id, {text: "insert", id_num: issue.id_num, type: issue.type});
      });

      results.title.forEach(issue => {
        issueArea.appendChild(createIssue(issue.result, issue.description, issue.aria, issue.type, issue.link, issue.id_num));
        chrome.tabs.sendMessage(tabs[tabs.length - 1].id, {text: "insert", id_num: issue.id_num, type: issue.type});
      });
    });
  });

  btn = document.getElementById("runAgainBtn");
  btn.addEventListener('click', function() {
    window.top.close();
    chrome.windows.create({url: "popup.html", type: "popup", height: 250, width: 200, left: 940, top: 65});
  });
}

function toggleActive(element) {
    element.classList.toggle("active");
}

function drpdwnButton(btn, icon, text, link, arrow) {
  btn.removeChild(btn.lastChild);

  let t = document.createElement("text");
  let p = document.createElement("p");
  let a = document.createElement("a");
  let i = document.createElement("i");
  let b = document.createElement("button");

  t.textContent = text;
  t.setAttribute("class", "issueInfo");
  i.setAttribute("class", "fas fa-angle-up" + " " + arrow);
  i.setAttribute("aria-hidden", "true");
  b.setAttribute("type", "button");
  b.setAttribute("id", "linkBtn");
  b.textContent = "More Information";
  p.setAttribute("class", "issueInfo");

  b.addEventListener('click', function() {
    window.open(link, '_blank');
  });

  p.appendChild(t);
  b.appendChild(a);
  p.appendChild(b);
  btn.appendChild(p);
  btn.appendChild(i);
}

function resetButton(btn, arrow) {
  let icon = document.createElement("i");

  for (i = 0; i < 2; i++) {
    btn.removeChild(btn.lastChild);
  }
  icon.setAttribute("class", "fas fa-angle-down" + " " + arrow);
  btn.appendChild(icon);
}

function createIssue(title, description, aria, type, link, chart_id) {
  console.log(chart_id);
  let d = document.createElement("div");
  let b = document.createElement("button");
  let i1 = document.createElement("i");
  let p = document.createElement("pre");
  let i2 = document.createElement("i");

  d.setAttribute("class", "dropdown");
  b.setAttribute("class", "dropbtn " + type);
  b.setAttribute("aria-label", aria);
  if (type == "error") {
    i1.setAttribute("class", "fas fa-minus-circle");
  }
  if (type == "warning") {
    i1.setAttribute("class", "fas fa-exclamation-triangle");
  }
  p.textContent = "  " + title;
  i2.setAttribute("class", "fas fa-angle-down");
  i2.setAttribute("aria-hidden", "true");
  i2.setAttribute("class", "fas fa-angle-down downArrow1");

  d.appendChild(b);
  b.appendChild(i1);
  b.appendChild(p);
  b.appendChild(i2);

  b.addEventListener('click', function() {
    toggleActive(d);

    if (d.classList.contains("active")) {
      drpdwnButton(b, i1, description, link, "upArrow1");
      chrome.tabs.sendMessage(currentTab, {text: "highlight", active: "active", id_num: chart_id, type: type});
    } else {
      resetButton(b, "downArrow1")
      chrome.tabs.sendMessage(currentTab, {text: "highlight", active: "inactive", id_num: chart_id, type: type});
    }
  });

  return d;
}
