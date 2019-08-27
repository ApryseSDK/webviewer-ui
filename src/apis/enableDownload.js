/**
 * Enables download feature, affecting the Download button in menu overlay.
 * @method WebViewer#enableDownload
 * @example // 5.1 and after
WebViewer(...)
  .then(function(instance) {
    instance.enableDownload();
  });
 * @example // 4.0 ~ 5.0
var viewerElement = document.getElementById('viewer');
var viewer = new PDFTron.WebViewer(...);

viewerElement.addEventListener('ready', function() {
  var instance = viewer.getInstance();
  instance.enableDownload();
});
 */

import enableFeatures from './enableFeatures';
import disableFeatures from './disableFeatures';

export default store => (enable = true) => {
  if (enable) {
    // TODO: remove comment in 5.3
    // console.warn(`enableDownload is deprecated, please use enableFeatures(['download']) instead`);
    enableFeatures(store)(['download']);
  } else {
    // TODO: in 5.3, change the message to warn about using disableFeatures instead
    console.warn('enableDownload(false) is deprecated, please use disableDownload() instead');
    disableFeatures(store)(['download']);
  }
};
