/**
 * Enables measurement feature, affecting any elements related to measurement tools.
 * @method WebViewer#enableMeasurement
 * @example // 5.1 and after
WebViewer(...)
  .then(function(instance) {
    instance.enableMeasurement();
  });
 * @example // 4.0 ~ 5.0
var viewerElement = document.getElementById('viewer');
var viewer = new PDFTron.WebViewer(...);

viewerElement.addEventListener('ready', function() {
  var instance = viewer.getInstance();
  instance.enableMeasurement();
});
 */

import Feature from 'constants/feature';
import warnDeprecatedAPI from 'helpers/warnDeprecatedAPI';
import enableFeatures from './enableFeatures';

export default store => () => {
  warnDeprecatedAPI(
    'enableMeasurement()',
    'enableFeatures([instance.Feature.Measurement])',
    '6.0',
  );
  enableFeatures(store)([Feature.Measurement]);
};
