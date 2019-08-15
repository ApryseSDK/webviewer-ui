/**
 * Set the number of signatures that can be stored in the WebViewer (default is 2)
 * @method WebViewer#setMaxSignaturesCount
 * @param {number} [maxSignaturesCount=2] Number of signature webViewer can store
 * @example // 5.1 and after
WebViewer(...)
  .then(function(instance) {
    instance.setMaxSignaturesCount(5); // allow up to 5 stored signatures
  });
 * @example // 4.0 ~ 5.0
var viewerElement = document.getElementById('viewer');
var viewer = new PDFTron.WebViewer(...);

viewerElement.addEventListener('ready', function() {
  var instance = viewer.getInstance();
  instance.setMaxSignaturesCount(5); // allow up to 5 stored signatures
});
 */

import actions from 'actions';

export default store => maxSignaturesCount => {
  store.dispatch(actions.setMaxSignaturesCount(maxSignaturesCount));
};