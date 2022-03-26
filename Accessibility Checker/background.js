// creates initial popup window when extension is run
chrome.browserAction.onClicked.addListener(function()
{
  var w = 200;
  var h = 250;
  var left = parseInt(screen.width/2) + parseInt(screen.width/4);
  var top = parseInt(screen.height/10);

  chrome.windows.create({url: 'popup.html', 'type': 'popup', 'width': w, 'height': h, 'left': left, 'top': top} , function(window) {
  });
});
