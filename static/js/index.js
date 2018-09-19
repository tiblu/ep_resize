'use strict';

var lastHeight;
var lastWidth;

exports.aceEditEvent = function (event, args, callback) {
    var editbar = $('#editbar');

    var elem = $('iframe[name=ace_outer]').contents().find('iframe[name=ace_inner]');
    var newHeight = elem.outerHeight() + (editbar.length ? editbar.outerHeight() : 0);
    var newWidth = elem.outerWidth();
    
    // Get an array of all element heights
    var elementHeights = $('iframe[name=ace_outer]').contents().find('body').children().map(function() {
        if ($(this).is(":visible")) {
            return $(this).offset().top + $(this).outerHeight();
        }
    }).get();

    elementHeights.push(newHeight);
    // Math.max takes a variable number of arguments
    // `apply` is equivalent to passing each height as an argument
    var maxHeight = Math.max.apply(null, elementHeights);
    if (!lastHeight || !lastWidth || lastHeight !== maxHeight || lastWidth !== newWidth) {
        sendResizeMessage(newWidth, maxHeight);
    }
    
};

exports.goToRevisionEvent = function (hook_name, context, cb) {
    
    var editbar = $('#timeslider-top')
    var elem = $('#padeditor');

    var newHeight = elem.outerHeight() + (editbar.length ? editbar.outerHeight() : 0);
    var newWidth = elem.outerWidth();

    if (!lastHeight || !lastWidth || lastHeight !== newHeight || lastWidth !== newWidth) {
        sendResizeMessage(newWidth, newHeight);
    }
};

var sendResizeMessage = function (width, height) {
    lastHeight = height;
    lastWidth = width;
    

    window.parent.postMessage({
        name: 'ep_resize',
        data: {
            width:  width,
            height: height
        }
    }, '*');
} 
