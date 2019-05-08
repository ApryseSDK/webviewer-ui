/**
 * Sets visibility states of the elements to be visible. Note that openElements works only for panel/overlay/popup/modal elements.
 * @method WebViewer#openElements
 * @param {Array.<string>} dataElements Array of data-element attribute values for DOM elements. To find data-element of a DOM element, refer to <a href='https://www.pdftron.com/documentation/web/guides/hiding-elements/#finding-dataelement-attribute-values' target='_blank'>Finding data-element attribute values</a>.
 * @example // 5.1 and after
WebViewer(...)
.then(instance => {
  // opens (shows) text popup and annotation popup in the UI
  instance.openElements([ 'menuOverlay', 'leftPanel' ]);
});
 * @example // 4.0 ~ 5.0
var viewerElement = document.getElementById('viewer');
var viewer = new PDFTron.WebViewer(...);

viewerElement.addEventListener('ready', function() {
  var instance = viewer.getInstance();

  // opens (shows) text popup and annotation popup in the UI
  instance.openElements([ 'menuOverlay', 'leftPanel' ]);
});
 */

import actions from 'actions';

export default store => dataElements => {
  store.dispatch(actions.openElements(dataElements));
}