'use strict';

let lastHeight;
let lastWidth;
const returnchildHeights = (children, offsetTop) => {
  offsetTop = offsetTop + 10 || 10; // Some extra padding for possible shadows etc.

  let maxHeight = 0;

  if (children.length) {
    maxHeight = 0;
    children.each((key, child) => {
      const cid = $(child).attr('id');
      const isIframe = $(child).is('iframe');
      const isVisible = $(child).is(':visible');
      const validElem = ['editorcontainerbox', 'editbar'].indexOf(cid) === -1;
      const hasHeight = $(child)[0].offsetHeight > 0;
      // Avoid infinit increasing
      if (isVisible && validElem && !isIframe && hasHeight) {
        const childtop = ($(child).offset().top + $(child)[0].offsetHeight) + offsetTop;
        if (childtop > maxHeight) {
          maxHeight = childtop;
        }
      }
    });
  }

  return maxHeight;
};

const sendResizeMessage = (width, height) => {
  lastHeight = height;
  lastWidth = width;

  window.parent.postMessage({
    name: 'ep_resize',
    data: {
      width,
      height,
    },
  }, '*');
};

exports.aceEditEvent = (event, context, cb) => {
  const padOuter = $('iframe[name=ace_outer]');
  const ace_outer_top = padOuter.offset().top;
  const ace_inner_top = padOuter.contents().find('iframe[name=ace_inner]').offset().top;
  const getFinalLine = context.rep.lines.atIndex(context.rep.lines.length() - 1);
  const finalLine = $(getFinalLine.lineNode);

  const elem = $('iframe[name=ace_outer]').contents().find('iframe[name=ace_inner]');
  let newHeight = finalLine.offset().top + finalLine.outerHeight() + ace_outer_top + ace_inner_top;
  const newWidth = elem.outerWidth();

  let maxChild = returnchildHeights(padOuter.contents().find('body').children(), ace_outer_top);
  const maxChildBody = returnchildHeights($('body').children());

  if (maxChildBody > maxChild) {
    maxChild = maxChildBody;
  }

  if (maxChild > newHeight) {
    newHeight = maxChild;
  }
  if (!lastHeight || !lastWidth || lastHeight !== newHeight || lastWidth !== newWidth) {
    if (newHeight - lastHeight !== 10) sendResizeMessage(newWidth, newHeight);
  }

  return cb();
};

exports.goToRevisionEvent = (hook, context, cb) => {
  const editbar = $('#editbar');
  const elem = $('#outerdocbody');
  const newHeight = elem.outerHeight() + (editbar.length ? editbar.outerHeight() : 0);
  const newWidth = elem.outerWidth();

  if (!lastHeight || !lastWidth || lastHeight !== newHeight || lastWidth !== newWidth) {
    sendResizeMessage(newWidth, newHeight);
  }

  return cb();
};
