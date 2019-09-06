/**
 * Disables localStorage feature, preventing tool styles from being saved to localStorage after changed.
 * @method WebViewer#disableLocalStorage
 * @example // 5.1 and after
WebViewer(...)
  .then(function(instance) {
    instance.disableLocalStorage();
  });
 * @example // 4.0 ~ 5.0
var viewerElement = document.getElementById('viewer');
var viewer = new PDFTron.WebViewer(...);

viewerElement.addEventListener('ready', function() {
  var instance = viewer.getInstance();
  instance.disableLocalStorage();
});
 */

import Feature from 'constants/feature';
import warnDeprecatedAPI from 'helpers/warnDeprecatedAPI';
import disableFeatures from './disableFeatures';

export default store => () => {
  warnDeprecatedAPI(
    'disableLocalStorage()',
    'disableFeatures([instance.Feature.LocalStorage])',
    '6.0',
  );
  disableFeatures(store)([Feature.LocalStorage]);
};