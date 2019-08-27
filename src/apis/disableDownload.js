/**
 * Disables download feature, affecting the Download button in menu overlay.
 * @method WebViewer#disableDownload
 * @example // 5.1 and after
WebViewer(...)
  .then(function(instance) {
    instance.disableDownload();
  });
 * @example // 4.0 ~ 5.0
var viewerElement = document.getElementById('viewer');
var viewer = new PDFTron.WebViewer(...);

viewerElement.addEventListener('ready', function() {
  var instance = viewer.getInstance();
  instance.disableDownload();
});
 */

import disableFeatures from './disableFeatures';

export default store => () => {
  // TODO: remove comment in 5.3
  // console.warn(`disableDownload is deprecated, please use disableFeatures(['download']) instead`);
  disableFeatures(store)(['download']);
};
