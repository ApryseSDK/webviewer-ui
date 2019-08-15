/**
 * Enables locking when scrolling on touch screen
 * @method WebViewer#enableTouchScrollLock
 * @example // 5.1 and after
WebViewer(...)
  .then(function(instance) {
    instance.enableTouchScrollLock();
  });
 * @example // 4.0 ~ 5.0
var viewerElement = document.getElementById('viewer');
var viewer = new PDFTron.WebViewer(...);

viewerElement.addEventListener('ready', function() {
  var instance = viewer.getInstance();
  instance.enableTouchScrollLock();
});
*/

import TouchEventManager from 'helpers/TouchEventManager';

export default () => {
  TouchEventManager.enableTouchScrollLock = true;
};
