/**
 * Disables print feature, affecting the Print button in menu overlay and shortcut to print (ctrl/cmd + p).
 * @method WebViewer#disablePrint
 * @example // 5.1 and after
WebViewer(...)
  .then(function(instance) {
    instance.disablePrint();
  });
 * @example // 4.0 ~ 5.0
var viewerElement = document.getElementById('viewer');
var viewer = new PDFTron.WebViewer(...);

viewerElement.addEventListener('ready', function() {
  var instance = viewer.getInstance();
  instance.disablePrint();
});
 */

import Feature from 'constants/feature';
import warnDeprecatedAPI from 'helpers/warnDeprecatedAPI';
import disableFeatures from './disableFeatures';

export default store => () => {
  warnDeprecatedAPI(
    'disablePrint()',
    'disableFeatures([instance.Feature.Print])',
    '6.0',
  );
  disableFeatures(store)([Feature.Print]);
};
