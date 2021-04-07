// Listen for messages
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    // If the received message has the expected format...
    if (msg.text === 'report_back') {
        // Call the specified callback, passing
        // the web-page's DOM content as argument
        var test = document.all[0].outerHTML;
        console.log(test);
        sendResponse(document.all[0].outerHTML);
    }
});
