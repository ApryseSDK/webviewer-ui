/**
 * Enables text to be selected in the document.
 * @method WebViewer#enableTextSelection
 * @example // 5.1 and after
WebViewer(...)
  .then(function(instance) {
    instance.enableTextSelection();
  });
 * @example // 4.0 ~ 5.0
var viewerElement = document.getElementById('viewer');
var viewer = new PDFTron.WebViewer(...);

viewerElement.addEventListener('ready', function() {
  var instance = viewer.getInstance();
  instance.enableTextSelection();
});
 */

import Feature from 'constants/feature';
import warnDeprecatedAPI from 'helpers/warnDeprecatedAPI';
import enableFeatures from './enableFeatures';
import disableFeatures from './disableFeatures';

export default store => (enable = true) => {
  if (enable) {
    warnDeprecatedAPI(
      'enableTextSelection()',
      'enableFeatures([instance.Feature.TextSelection])',
      '6.0',
    );
    enableFeatures(store)([Feature.Measurement]);
  } else {
    warnDeprecatedAPI(
      'enableTextSelection(false)',
      'disableFeatures([instance.Feature.TextSelection])',
      '6.0',
    );
    disableFeatures(store)([Feature.TextSelection]);
  }
};
