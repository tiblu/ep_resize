'use strict';

exports.aceEditEvent = function (event, args, callback) {
    var editbar = $('#editbar');
    var inner = $('iframe[name=ace_outer]').contents().find('iframe[name=ace_inner]');
    window.parent.postMessage({
        name: 'ep_resize',
        data: {
            width:  inner.outerWidth(),
            height: inner.outerHeight() + (editbar.length ? editbar.outerHeight() : 0)
        }
    }, '*');
};