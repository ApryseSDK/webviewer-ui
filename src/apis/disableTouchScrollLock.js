/**
 * Disable locking when scrolling on touch screen
 * @method WebViewer#disableTouchScrollLock
 * @example // 5.1 and after
WebViewer(...)
  .then(function(instance) {
    instance.disableTouchScrollLock();
  });
 * @example // 4.0 ~ 5.0
var viewerElement = document.getElementById('viewer');
var viewer = new PDFTron.WebViewer(...);

viewerElement.addEventListener('ready', function() {
  var instance = viewer.getInstance();
  instance.disableTouchScrollLock();
});
*/

import TouchEventManager from 'helpers/TouchEventManager';

export default () => {
  TouchEventManager.enableTouchScrollLock = false;
};
