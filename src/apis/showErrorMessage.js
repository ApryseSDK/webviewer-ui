/**
 * Displays the custom error message
 * @method WebViewer#showErrorMessage
 * @param {string} message An error message
 * @example // 5.1 and after
WebViewer(...)
  .then(function(instance) {
    instance.showErrorMessage('My error message');
  });
 * @example // 4.0 ~ 5.0
var viewerElement = document.getElementById('viewer');
var viewer = new PDFTron.WebViewer(...);

viewerElement.addEventListener('ready', function() {
  var instance = viewer.getInstance();
  instance.showErrorMessage('My error message');
});
 */

import actions from 'actions';

export default store => message => {
  store.dispatch(actions.showErrorMessage(message));
};
