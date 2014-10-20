var s = document.createElement('script');
s.src = chrome.extension.getURL('getrenedered.js');
(document.head || document.documentElement).appendChild(s);
s.onload = function () {
    s.parentNode.removeChild(s);
};

chrome.extension.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg && msg.type === 'debug') {
        var url = "http://" + location.host + location.pathname + (location.search ? location.search + "&" : "?") + "debug=all" + location.hash;
        window.location.replace(url);
        return;
    }

    var listener = function (evt) {
        document.removeEventListener('RW759_connectExtensionResponse', listener);
        sendResponse(evt.detail);
    };
    document.addEventListener('RW759_connectExtensionResponse', listener);

    document.dispatchEvent(new CustomEvent('RW759_connectExtension', {detail: msg}));
});

