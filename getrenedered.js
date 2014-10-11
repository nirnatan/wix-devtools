//setTimeout(function() {
//    /* Example: Send data to your Chrome extension*/
//
//    var data = {
//        rendered: window.rendered
//    };
//
//    document.dispatchEvent(new CustomEvent('RW759_connectExtension', {detail: data}));
//}, 0);

document.addEventListener('RW759_connectExtension', function(e) {
    debugger;
    // e.detail contains the transferred data (can be anything, ranging
    // from JavaScript objects to strings).
    // Do something, for example:
    if (window.component) {
        window.component.getDOMNode().style.border = '';
    }
    if (window.components) {
        _.each(window.components, function(c) { c.getDOMNode().style.border = ''; })
    }

    var displayNameOrId = e.detail; //prompt('Enter displayName or id of component: ');

    var React = require('react');
    var components = React.addons.TestUtils.findAllInRenderedTree(rendered, function(component) {
        return component.constructor.displayName === displayNameOrId || component.props.id === displayNameOrId;
    });

    window.components = _.transform(components, function(comps, c) { comps[c.props.id] = c; }, {});

    _.each(window.components, function(c) {
        c.getDOMNode().style.border = '#F00 dashed 1px';
    });
});