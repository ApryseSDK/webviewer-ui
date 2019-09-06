/**
 * Disables redaction feature, affecting any elements related to redaction.
 * @method WebViewer#disableRedaction
 * @example // 5.1 and after
WebViewer(...)
  .then(function(instance) {
    instance.disableRedaction();
  });
 * @example // 4.0 ~ 5.0
var viewerElement = document.getElementById('viewer');
var viewer = new PDFTron.WebViewer(...);

viewerElement.addEventListener('ready', function() {
  var instance = viewer.getInstance();
  instance.disableRedaction();
});
 */

import Feature from 'constants/feature';
import warnDeprecatedAPI from 'helpers/warnDeprecatedAPI';
import disableFeatures from './disableFeatures';

export default store => () => {
  warnDeprecatedAPI(
    'disableRedaction()',
    'disableFeatures([instance.Feature.Redaction])',
    '6.0',
  );
  disableFeatures(store)([Feature.Redaction]);
};
