// opens the main checker window (check.html) when the 'Run' button is clicked
window.onload = function () {
    btn = document.getElementById("runbtn");
    btn.addEventListener('click', function() {
      window.top.close();

      var w = 420;
      var h = 320;
      var left = (screen.width/2 - w/2);
      var top = (screen.height);

      chrome.windows.create({url: 'check.html', 'type': 'popup', 'width': w, 'height': h, 'left': left, 'top': top} , function(window) {
      });
    });
}
