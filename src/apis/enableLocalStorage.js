/**
 * Enables localStorage feature, tool styles will be saved to localStorage after changed.
 * @method WebViewer#enableLocalStorage
 * @example // 5.1 and after
WebViewer(...)
  .then(function(instance) {
    instance.enableLocalStorage();
  });
 * @example // 4.0 ~ 5.0
var viewerElement = document.getElementById('viewer');
var viewer = new PDFTron.WebViewer(...);

viewerElement.addEventListener('ready', function() {
  var instance = viewer.getInstance();
  instance.enableLocalStorage();
});
 */

import Feature from 'constants/feature';
import warnDeprecatedAPI from 'helpers/warnDeprecatedAPI';
import enableFeatures from './enableFeatures';

export default store => () => {
  warnDeprecatedAPI(
    'enableLocalStorage()',
    'enableFeatures([instance.Feature.LocalStorage])',
    '6.0',
  );
  enableFeatures(store)([Feature.LocalStorage]);
};