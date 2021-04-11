// A function to use as callback
function doStuffWithDom(domContent) {
    console.log('I received the following DOM content:\n' + domContent);
}

chrome.browserAction.onClicked.addListener(function(activeTab)
{
  chrome.tabs.sendMessage(activeTab.id, {text: "report_back"}, doStuffWithDom);

  var w = 200;
  var h = 250;
  var left = (screen.width/2) + (screen.width/4);
  var top = (screen.height/10);

  chrome.windows.create({url: 'popup.html', 'type': 'popup', 'width': w, 'height': h, 'left': left, 'top': top} , function(window) {
  });
});
