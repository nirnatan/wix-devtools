var tabId;

function handleData(data) {
    debugger;
}

chrome.extension.onRequest.addListener(handleData);

var searchBtn = document.getElementById('search');
searchBtn.onclick = function() {
    var name = document.getElementById('name');
    var exact = document.getElementById('exact');
    debugger;
    var evt = {
        type: 'searchByName',
        displayName: name.value,
        exact: exact.checked
    };

    chrome.tabs.sendMessage(tabId, evt, function (data) {
        console.log(data);
    });
};

var clearBtn = document.getElementById('clear');
clearBtn.onclick = function() {
    var evt = {
        type: 'clearAll'
    };

    chrome.tabs.sendMessage(tabId, evt);
};

// Load the content script to the main tab in the current tab.
chrome.windows.getCurrent(function (currentWindow) {
    chrome.tabs.query({ active: true, windowId: currentWindow.id }, function (activeTabs) {
        tabId = activeTabs[0].id;
        chrome.tabs.executeScript(tabId, { file: 'contentscript.js', allFrames: true });
    });
});