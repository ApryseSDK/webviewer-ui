/**
 * Enables annotations feature, affecting the annotation visibility and elements related to annotations.
 * @method WebViewer#enableAnnotations
 * @example // 5.1 and after
WebViewer(...)
  .then(function(instance) {
    instance.enableAnnotations();
  });
 * @example // 4.0 ~ 5.0
var viewerElement = document.getElementById('viewer');
var viewer = new PDFTron.WebViewer(...);

viewerElement.addEventListener('ready', function() {
  var instance = viewer.getInstance();
  instance.enableAnnotations();
});
 */

import Feature from 'constants/feature';
import warnDeprecatedAPI from 'helpers/warnDeprecatedAPI';
import enableFeatures from './enableFeatures';

export default store => () => {
  warnDeprecatedAPI(
    'enableAnnotations()',
    'enableFeatures([instance.Feature.Annotations])',
    '6.0',
  );
  enableFeatures(store)([Feature.Annotations]);
};
