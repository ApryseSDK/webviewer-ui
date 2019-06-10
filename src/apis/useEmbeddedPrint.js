/**
 * Use/not use embedded printing. You may not want to use embedded printing if there are custom annotations in your document.
 * @method WebViewer#useEmbeddedPrint
 * @param {boolean} [use=true] Whether or not to use embedded printing
 * @example // 5.1 and after
WebViewer(...)
  .then(function(instance) {
    instance.useEmbeddedPrint(false); // disable embedded printing
  });
 * @example // 4.0 ~ 5.0
var viewerElement = document.getElementById('viewer');
var viewer = new PDFTron.WebViewer(...);

viewerElement.addEventListener('ready', function() {
  var instance = viewer.getInstance();
  instance.useEmbeddedPrint(false); // disable embedded printing
});
 */

import actions from 'actions';

export default store => useEmbeddedPrint => {
  store.dispatch(actions.useEmbeddedPrint(useEmbeddedPrint));
};