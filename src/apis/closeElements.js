/**
 * Sets visibility states of the elements to be hidden. Note that closeElements works only for panel/overlay/popup/modal elements.
 * @method WebViewer#closeElements
 * @param {Array.<string>} dataElements Array of data-element attribute values for DOM elements. To find data-element of a DOM element, refer to <a href='https://www.pdftron.com/documentation/web/guides/hiding-elements/#finding-dataelement-attribute-values' target='_blank'>Finding data-element attribute values</a>.
 * @example // 5.1 and after
WebViewer(...)
.then(instance => {
  // closes (hides) text popup and left panel in the UI
  instance.closeElements([ 'menuOverlay', 'leftPanel' ]);
});
 * @example // 4.0 ~ 5.0
var viewerElement = document.getElementById('viewer');
var viewer = new PDFTron.WebViewer(...);

viewerElement.addEventListener('ready', function() {
  var instance = viewer.getInstance();

  // closes (hides) text popup and left panel in the UI
  instance.closeElements([ 'menuOverlay', 'leftPanel' ]);
});
 */

import actions from 'actions';

export default store => dataElements => {
  store.dispatch(actions.closeElements(dataElements));
}