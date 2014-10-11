var s = document.createElement('script');
s.src = chrome.extension.getURL('getrenedered.js');
(document.head || document.documentElement).appendChild(s);
s.onload = function () {
    s.parentNode.removeChild(s);
};

chrome.extension.onMessage.addListener(function (msg, sender, sendResponse) {
    document.dispatchEvent(new CustomEvent('RW759_connectExtension', {detail: msg}));
});