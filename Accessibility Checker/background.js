

chrome.browserAction.onClicked.addListener(function(activeTab)
{
  chrome.windows.create({url: "popup.html", type: "popup", height: 250, width: 200, left: 940, top: 65});
});
