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
    _.each(window.components, function (c) {
        c.getDOMNode().style.border = '';
    });

    var components = getComponentsByName(exact, displayName);

    window.components = _.transform(components, function (comps, c) {
        comps[c.props.id] = c;
    }, {});

    _.each(window.components, function (c) {
        c.getDOMNode().style.border = '#F00 dashed 1px';
    });
}

document.addEventListener('RW759_connectExtension', function(e) {
    switch (e.detail.type) {
        case 'searchByName':
            searchByName(e.detail.displayName, e.detail.exact);
            break;
        default:
            console.error('no handler for event type ' + e.detail.type);
    }
});