/**
 * Toggles a visibility state of the element to be visible/hidden. Note that toggleElement works only for panel/overlay/popup/modal elements.
 * @method WebViewer#toggleElement
 * @param {string} dataElement data-element attribute value for a DOM element. To find data-element of a DOM element, refer to <a href='https://www.pdftron.com/documentation/web/guides/hiding-elements/#finding-dataelement-attribute-values' target='_blank'>Finding data-element attribute values</a>.
 * @example // 5.1 and after
WebViewer(...)
  .then(function(instance) {
    instance.toggleElement('leftPanel'); // open LeftPanel if it is closed, or vice versa
  });
 * @example // 4.0 ~ 5.0
var viewerElement = document.getElementById('viewer');
var viewer = new PDFTron.WebViewer(...);

viewerElement.addEventListener('ready', function() {
  var instance = viewer.getInstance();
  instance.toggleElement('leftPanel'); // open LeftPanel if it is closed, or vice versa
});
 */

import actions from 'actions';

export default store => dataElement => {
  store.dispatch(actions.toggleElement(dataElement));
};