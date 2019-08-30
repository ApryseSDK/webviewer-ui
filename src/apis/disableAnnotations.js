/**
 * Disables annotations feature, affecting the annotation visibility and elements related to annotations.
 * @method WebViewer#disableAnnotations
 * @example // 5.1 and after
WebViewer(...)
  .then(function(instance) {
    instance.disableAnnotations();
  });
 * @example // 4.0 ~ 5.0
var viewerElement = document.getElementById('viewer');
var viewer = new PDFTron.WebViewer(...);

viewerElement.addEventListener('ready', function() {
  var instance = viewer.getInstance();
  instance.disableAnnotations();
});
 */

import Feature from 'constants/feature';
import warnDeprecatedAPI from 'helpers/warnDeprecatedAPI';
import disableFeatures from './disableFeatures';

export default store => () => {
  warnDeprecatedAPI(
    'disableAnnotations()',
    'disableFeatures([instance.Feature.Annotations])',
    '6.0',
  );
  disableFeatures(store)([Feature.Annotations]);
};
