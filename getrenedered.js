var React = require('react');

function getComponentsByName(exact, displayName) {
    return React.addons.TestUtils.findAllInRenderedTree(rendered, function (component) {
        if (exact) {
            return component.constructor.displayName === displayName;
        }

        return new RegExp(displayName, 'ig').test(component.constructor.displayName);
    });
}

function searchByName(displayName, exact, callback) {
    clearAll();
    var components = getComponentsByName(exact, displayName);

    window.components = _.transform(components, function (comps, c) {
        comps[c.props.id] = c;
    }, {});

    _.each(window.components, function (c) {
        c.getDOMNode().style.border = '#F00 dashed 1px';
    });
}

function clearAll() {
    _.each(window.components, function (c) {
        c.getDOMNode().style.border = '';
    });

    delete window.components;
}

document.addEventListener('RW759_connectExtension', function(e) {
    switch (e.detail.type) {
        case 'searchByName':
            searchByName(e.detail.displayName, e.detail.exact);
            debugger;
            var data = {
                type: e.detail.type,
                ids: _.map(window.components, function (c) { return c.props.id; })
            };
            document.dispatchEvent(new CustomEvent('RW759_connectExtensionResponse', {detail: data}));
            break;
        case 'clearAll':
            clearAll();
            break;
        default:
            console.error('no handler for event type ' + e.detail.type);
    }
});