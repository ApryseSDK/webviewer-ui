/**
 * Disables text to be selected in the document.
 * @method WebViewer#disableTextSelection
 * @example // 5.1 and after
WebViewer(...)
  .then(function(instance) {
    instance.disableTextSelection();
  });
 * @example // 4.0 ~ 5.0
var viewerElement = document.getElementById('viewer');
var viewer = new PDFTron.WebViewer(...);

viewerElement.addEventListener('ready', function() {
  var instance = viewer.getInstance();
  instance.disableTextSelection();
});
 */

import Feature from 'constants/feature';
import warnDeprecatedAPI from 'helpers/warnDeprecatedAPI';
import disableFeatures from './disableFeatures';

export default store => () => {
  warnDeprecatedAPI(
    'disableTextSelection()',
    'disableFeatures([instance.Feature.TextSelection])',
    '6.0',
  );
  disableFeatures(store)([Feature.TextSelection]);
};
