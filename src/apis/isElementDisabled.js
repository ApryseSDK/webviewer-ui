/**
 * Returns whether the element is disabled.
 * @method WebViewer#isElementDisabled
 * @param {string} dataElement data-element attribute value for a DOM element. To find data-element of a DOM element, refer to <a href='https://www.pdftron.com/documentation/web/guides/hiding-elements/#finding-dataelement-attribute-values' target='_blank'>Finding data-element attribute values</a>.
 * @returns {boolean} Whether the element is disabled.
 * @example // 5.1 and after
WebViewer(...)
  .then(function(instance) {
    console.log(instance.isElementDisabled('leftPanel'));
  });
 * @example // 4.0 ~ 5.0
var viewerElement = document.getElementById('viewer');
var viewer = new PDFTron.WebViewer(...);

viewerElement.addEventListener('ready', function() {
  var instance = viewer.getInstance();
  console.log(instance.isElementDisabled('leftPanel'));
});
 */

import selectors from 'selectors';

export default store => dataElement => !!selectors.isElementDisabled(store.getState(), dataElement);