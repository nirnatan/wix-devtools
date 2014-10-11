var tabId;

function handleData(data) {
    debugger;
}

chrome.extension.onRequest.addListener(handleData);

var searchBtn = document.getElementById('search');
searchBtn.onclick = function() {
    var name = document.getElementById('name');
    chrome.tabs.sendMessage(tabId, {displayName: name.value});
};


chrome.windows.getCurrent(function (currentWindow) {
    chrome.tabs.query({ active: true, windowId: currentWindow.id }, function (activeTabs) {
        tabId = activeTabs[0].id;
        chrome.tabs.executeScript(tabId, { file: 'contentscript.js', allFrames: true });
    });
});