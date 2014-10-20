var React = require('react');

function getComponentsByName(exact, displayName) {
    return React.addons.TestUtils.findAllInRenderedTree(rendered, function (component) {
        if (exact) {
            return component.constructor.displayName === displayName;
        }

        return new RegExp(displayName, 'ig').test(component.constructor.displayName);
    });
}

function searchByName(displayName, exact) {
    clearAll();
    var components = getComponentsByName(exact, displayName);

    window.components = _.transform(components, function (comps, c) {
        comps[c.getDOMNode().id] = c;
    }, {});

    _.each(window.components, function (c) {
        c.getDOMNode().style.border = '#F00 dashed 1px';
    });
}

function clearAll(styleOnly) {
    _.each(window.components, function (c) {
        c.getDOMNode().style.border = '';
    });

    if (!styleOnly) {
        delete window.components;
    }
}

document.addEventListener('RW759_connectExtension', function(e) {
    var data;
    switch (e.detail.type) {
        case 'searchByName':
            searchByName(e.detail.displayName, e.detail.exact);
            data = {
                type: e.detail.type,
                ids: _.keys(window.components)
            };
            document.dispatchEvent(new CustomEvent('RW759_connectExtensionResponse', {detail: data}));
            break;
        case 'clearAll':
            clearAll();
            break;
        case 'reLayout':
            window.rendered.reLayout();
            break;
        case 'forceUpdate':
            window.rendered.forceUpdate();
            break;
        case 'select':
            clearAll(true);
            var domNode = window.components[e.detail.id].getDOMNode();
            domNode.style.border = '#F00 dashed 1px';
            domNode.scrollIntoView();
            window.scrollBy(0, -50);
            break;
        case 'unselect':
            clearAll(true);
            break;
        case 'getComponents':
            data = {
                type: e.detail.type
            };

            if (!React.addons.TestUtils) {
                data.error = 'No React TestUtils'
            } else {
                data.ids = _.keys(window.components);
                data.selectedId = window.selectedComp && window.selectedComp.getDOMNode().id;
            }

            document.dispatchEvent(new CustomEvent('RW759_connectExtensionResponse', {detail: data}));
            break;
        case 'selectItem':
            window.selectedComp = window.components[e.detail.id];
            break;
        default:
            console.error('no handler for event type ' + e.detail.type);
    }
});