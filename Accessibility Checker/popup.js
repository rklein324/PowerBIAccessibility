window.onload = function () {
    btn = document.getElementById("runbtn");
    btn.addEventListener('click', function() {
      window.top.close();
      chrome.windows.create({url: "check.html", type: "popup", height: 320, width: 420, left: 500, top: 450});
    });
}
