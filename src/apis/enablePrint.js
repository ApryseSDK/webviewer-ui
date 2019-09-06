/**
 * Enables print feature, affecting the Print button in menu overlay and shortcut to print (ctrl/cmd + p).
 * @method WebViewer#enablePrint
 * @example // 5.1 and after
WebViewer(...)
  .then(function(instance) {
    instance.enablePrint();
  });
 * @example // 4.0 ~ 5.0
var viewerElement = document.getElementById('viewer');
var viewer = new PDFTron.WebViewer(...);

viewerElement.addEventListener('ready', function() {
  var instance = viewer.getInstance();
  instance.enablePrint();
});
 */

import Feature from 'constants/feature';
import warnDeprecatedAPI from 'helpers/warnDeprecatedAPI';
import enableFeatures from './enableFeatures';
import disableFeatures from './disableFeatures';

export default store => (enable = true) => {
  if (enable) {
    warnDeprecatedAPI(
      'enablePrint()',
      'enableFeatures([instance.Feature.Print])',
      '6.0',
    );
    enableFeatures(store)([Feature.Measurement]);
  } else {
    warnDeprecatedAPI(
      'enablePrint(false)',
      'disableFeatures([instance.Feature.Print])',
      '6.0',
    );
    disableFeatures(store)([Feature.Print]);
  }
};
