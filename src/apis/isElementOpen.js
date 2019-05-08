/**
 * Returns whether the element is open.
 * @method WebViewer#isElementOpen
 * @param {string} dataElement data-element attribute value for a DOM element. To find data-element of a DOM element, refer to <a href='https://www.pdftron.com/documentation/web/guides/hiding-elements/#finding-dataelement-attribute-values' target='_blank'>Finding data-element attribute values</a>.
 * @returns {boolean} Whether the element is open.
 * @example // 5.1 and after
WebViewer(...)
.then(instance => {
  console.log(instance.isElementOpen('leftPanel'));
});
 * @example // 4.0 ~ 5.0
var viewerElement = document.getElementById('viewer');
var viewer = new PDFTron.WebViewer(...);

viewerElement.addEventListener('ready', function() {
  var instance = viewer.getInstance();
  console.log(instance.isElementOpen('leftPanel'));
});
 */

import selectors from 'selectors';

export default store => dataElement => !!selectors.isElementOpen(store.getState(), dataElement);
