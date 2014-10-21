(function () {
    var tabId;
    var $search = $('#search');

    function sendEvent(evt, callback) {
        chrome.tabs.sendMessage(tabId, evt, callback);
    }

    function setContent(data) {
        if (data.error) {
            var $debug = $('<input type="button" value="Debug" />');
            $debug.click(function () {
                sendEvent({type: 'debug'});
            });

            $('body').children().first().replaceWith($debug);
        }

        var $content = clearContent();

        var $ul = $('<ul class="list-group"></ul>');
        _.each(data.ids, function (id) {
            var item = $('<li class="list-group-item">' + id + '</li>');
            if (data.selectedId === id) {
                item.addClass('active');
            }
            item.mouseenter(hoverSelectedItem.bind(undefined, true));
            item.mouseleave(hoverSelectedItem.bind(undefined, false));
            item.click(function () {
                sendEvent({type: 'selectItem', id: id});
                $ul.children().removeClass('active');

                item.addClass('active');
            });
            $ul.append(item);
        });

        $content.append($ul);
    }

    function hoverSelectedItem(select, event) {
        var target = event.target;
        target.style.backgroundColor = select ? 'lightblue' : 'white';
        var compId = target.innerText;

        var evt = {
            type: select ? 'select' : 'unselect',
            id: compId
        };

        sendEvent(evt);
    }

    $search.find('[name="name"]').keypress(function (evt) {
        if (evt.keyCode === 13) {
            $search.find('[name="query"]').click();
        }
    });

    $search.find('[name="query"]').click(function () {
        var name = $search.find('[name="name"]').val();
        var exact = $search.find('[name="exact"]').is(':checked');
        var evt = {
            type: 'searchByName',
            displayName: name,
            exact: exact
        };

        sendEvent(evt, setContent);
    });

    $('[value="relayout"]').click(function () {
        var evt = {
            type: 'reLayout'
        };

        sendEvent(evt);
    });

    $('[value="forceUpdate"]').click(function () {
        var evt = {
            type: 'forceUpdate'
        };

        sendEvent(evt);
    });

    function clearContent() {
        var $content = $('#content');
        if ($content.children().length) {
            $content.children().first().remove();
        }

        return $content;
    }

    $search.find('[name="clear"]').click(function () {
        var evt = {
            type: 'clearAll'
        };

        sendEvent(evt);
        clearContent();
    });

// Load the content script to the main tab in the current tab.
    chrome.windows.getCurrent(function (currentWindow) {
        chrome.tabs.query({ active: true, windowId: currentWindow.id }, function (activeTabs) {
            tabId = activeTabs[0].id;
            chrome.tabs.executeScript(tabId, { file: 'contentscript.js', allFrames: true });

            setTimeout(sendEvent.bind(this, {type: 'getComponents'}, setContent), 500);
        });
    });
})();