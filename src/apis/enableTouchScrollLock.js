/**
 * Enables locking when scrolling on touch screen
 * @method WebViewer#enableTouchScrollLock
 * @example // 5.1 and after
WebViewer(...)
  .then(function(instance) {
    instance.enableTouchScrollLock();
  });
 * @example // 4.0 ~ 5.0
var viewerElement = document.getElementById('viewer');
var viewer = new PDFTron.WebViewer(...);

viewerElement.addEventListener('ready', function() {
  var instance = viewer.getInstance();
  instance.enableTouchScrollLock();
});
*/

import Feature from 'constants/feature';
import warnDeprecatedAPI from 'helpers/warnDeprecatedAPI';
import enableFeatures from './enableFeatures';

export default store => () => {
  warnDeprecatedAPI(
    'enableTouchScrollLock()',
    'enableFeatures([instance.Feature.TouchScrollLock])',
    '6.0',
  );
  enableFeatures(store)([Feature.TouchScrollLock]);
};
