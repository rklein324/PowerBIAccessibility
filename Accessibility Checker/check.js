// will hold the results of the tests
var results = {}

window.onload = function () {
  // gets the most recent active tab that is not the popup,
  // passes that to content.js, gets the DOM as a string and converts it to a DOM element
  // runs tests and stores in 'results'
  chrome.tabs.query({active: true, currentWindow: false}, function(tabs) {
    chrome.tabs.sendMessage(tabs[tabs.length - 1].id, {text: "report_back"}, function(html) {
      html = html.trim();
      template = document.createElement('template');
      template.innerHTML = html;
      results = runTests(template.content);
      console.log(results);
    });
  });

    btn = document.getElementById("runAgainBtn");
    btn.addEventListener('click', function() {
      window.top.close();
      chrome.windows.create({url: "popup.html", type: "popup", height: 250, width: 200, left: 940, top: 65});
    });

    btn1 = document.getElementById("bdrpdwn1");
    div1 = document.getElementById("drpdwn1");

    btn1.addEventListener('click', function() {
      toggleActive(div1);

      if (div1.classList.contains("active")) {
        pre1 = document.getElementById("pre1");
        i1 = document.getElementById("icon1");
        drpdwnButton(btn1, pre1, i1, "Ratio of colors not adequate to meet guidelines, must be 3:1. Change colors for more contrast.", "https://www.w3.org/WAI/standards-guidelines/wcag/", "upArrow1");
      } else {
        pre1 = document.getElementById("pre1");
        resetButton(pre1, btn1, "icon1")
      }
    });

    btn2 = document.getElementById("bdrpdwn2");
    div2 = document.getElementById("drpdwn2");
    btn2.addEventListener('click', function() {
      toggleActive(div2);

      if (div2.classList.contains("active")) {
        pre2 = document.getElementById("pre2");
        i2 = document.getElementById("icon2");
        drpdwnButton(btn2, pre2, i2, "Contrast in fonts not strong enough for readability, must have higher ratio of 4.5:1 for normal text. Increase or decrease text size.", "https://datasavvy.me/2018/06/06/power-bi-report-accessibility-checklist/", "upArrow2");
      } else {
        pre2 = document.getElementById("pre2");
        resetButton(pre2, btn2, "icon2")
      }
    });

    btn3 = document.getElementById("bdrpdwn3");
    div3 = document.getElementById("drpdwn3");
    btn3.addEventListener('click', function() {
      toggleActive(div3);

      if (div3.classList.contains("active")) {
        pre3 = document.getElementById("pre3");
        i3 = document.getElementById("icon3");
        drpdwnButton(btn3, pre3, i3, "Ratio of colors not adequate to meet guidelines, must be 3:1. Change colors for more contrast.", "https://datasavvy.me/2018/06/06/power-bi-report-accessibility-checklist/", "upArrow3");
      } else {
        pre3 = document.getElementById("pre3");
        resetButton(pre3, btn3, "icon3")
      }
    });
}

function toggleActive(element) {
    element.classList.toggle("active");
}

function drpdwnButton(btn, pre, icon, text, link, arrow) {
  pre.removeChild(icon);

  let t = document.createElement("text");
  let p = document.createElement("p");
  let a = document.createElement("a");
  let i = document.createElement("i");
  let pre2 = document.createElement("pre2");

  t.textContent = text;
  t.setAttribute("class", "issueInfo");
  a.innerHTML = "View more information";
  a.setAttribute("href", link);
  a.setAttribute("target", "_blank");
  i.setAttribute("class", "fas fa-angle-up");
  i.setAttribute("aria-hidden", "true");
  i.setAttribute("id", arrow);

  p.appendChild(a);
  btn.appendChild(t);
  btn.appendChild(p);
  btn.appendChild(i);
}

function resetButton(pre, btn, icon_name) {
  while (btn.firstChild) {
    btn.removeChild(btn.firstChild);
  }
  let i = document.createElement("i");
  i.setAttribute("class", "fas fa-angle-down");
  i.setAttribute("id", icon_name);
  i.setAttribute("aria-hidden", "true");
  pre.innerHTML = pre.innerHTML + i.outerHTML;
  btn.appendChild(pre);
}
