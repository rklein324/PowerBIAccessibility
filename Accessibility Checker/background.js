// A function to use as callback
function doStuffWithDom(domContent) {
    console.log('I received the following DOM content:\n' + domContent);
}

chrome.browserAction.onClicked.addListener(function(activeTab)
{
  chrome.tabs.sendMessage(activeTab.id, {text: "report_back"}, doStuffWithDom);
  chrome.windows.create({url: "popup.html", type: "popup", height: 250, width: 200, left: 940, top: 65});
});
