/**
 * Remount the hidden elements in the DOM.
 * @method WebViewer#enableElements
 * @param {string[]} dataElements Array of data-element attribute values for DOM elements. To find data-element of a DOM element, refer to <a href='https://www.pdftron.com/documentation/web/guides/hiding-elements/#finding-dataelement-attribute-values' target='_blank'>Finding data-element attribute values</a>.
 * @example // 5.1 and after
WebViewer(...)
  .then(function(instance) {
    // remove left panel and left panel button from the DOM
    instance.enableElements([ 'leftPanel', 'leftPanelButton' ]);
  });
 * @example // 4.0 ~ 5.0
var viewerElement = document.getElementById('viewer');
var viewer = new PDFTron.WebViewer(...);

viewerElement.addEventListener('ready', function() {
  var instance = viewer.getInstance();

  // remove left panel and left panel button from the DOM
  instance.enableElements([ 'leftPanel', 'leftPanelButton' ]);
});
 */

import actions from 'actions';
import { PRIORITY_THREE } from 'constants/actionPriority';

export default store => dataElements => {
  if (typeof dataElements === 'string') {
    return store.dispatch(actions.enableElement(dataElements, PRIORITY_THREE));
  }
  return store.dispatch(actions.enableElements(dataElements, PRIORITY_THREE));
};