/**
 * Unmount multiple elements in the DOM. Note that this ONLY removes the DOM elements without disabling related features.
 * @method WebViewer#disableElements
 * @param {string[]} dataElements Array of data-element attribute values for DOM elements. To find data-element of a DOM element, refer to <a href='https://www.pdftron.com/documentation/web/guides/hiding-elements/#finding-dataelement-attribute-values' target='_blank'>Finding data-element attribute values</a>.
 * @example // 5.1 and after
WebViewer(...)
.then(instance => {
  // remove left panel and left panel button from the DOM
  instance.disableElements([ 'leftPanel', 'leftPanelButton' ]);
});
 * @example // 4.0 ~ 5.0
var viewerElement = document.getElementById('viewer');
var viewer = new PDFTron.WebViewer(...);

viewerElement.addEventListener('ready', function() {
  var instance = viewer.getInstance();

  // remove left panel and left panel button from the DOM
  instance.disableElements([ 'leftPanel', 'leftPanelButton' ]);
});
 */

import actions from 'actions';
import { PRIORITY_THREE } from 'constants/actionPriority';

export default store => dataElements => {
  if (typeof dataElements === 'string') {
    store.dispatch(actions.disableElement(dataElements, PRIORITY_THREE));
  }

  store.dispatch(actions.disableElements(dataElements, PRIORITY_THREE));
};