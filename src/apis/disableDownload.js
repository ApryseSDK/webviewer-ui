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

import Feature from 'constants/feature';
import warnDeprecatedAPI from 'helpers/warnDeprecatedAPI';
import disableFeatures from './disableFeatures';

export default store => () => {
  warnDeprecatedAPI(
    'disableDownload()',
    'disableFeatures([instance.Feature.Download])',
    '6.0',
  );
  disableFeatures(store)([Feature.Download]);
};
