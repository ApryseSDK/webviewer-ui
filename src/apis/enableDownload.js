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

import Feature from 'constants/feature';
import warnDeprecatedAPI from 'helpers/warnDeprecatedAPI';
import enableFeatures from './enableFeatures';
import disableFeatures from './disableFeatures';

export default store => (enable = true) => {
  if (enable) {
    warnDeprecatedAPI(
      'enableDownload()',
      'enableFeatures([instance.Feature.Download])',
      '6.0',
    );
    enableFeatures(store)([Feature.Measurement]);
  } else {
    warnDeprecatedAPI(
      'enableDownload(false)',
      'disableFeatures([instance.Feature.Download])',
      '6.0',
    );
    disableFeatures(store)([Feature.Download]);
  }
};
