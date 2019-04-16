/**
 * Toggles a visibility state of the element to be visible/hidden. Note that toggleElement works only for panel/overlay/popup/modal elements.
 * @method WebViewer#toggleElement
 * @param {string} dataElement data-element attribute value for a DOM element. To find data-element of a DOM element, refer to <a href='https://www.pdftron.com/documentation/web/guides/hiding-elements/#finding-dataelement-attribute-values' target='_blank'>Finding data-element attribute values</a>.
 * @example // open LeftPanel if it is closed, or vice versa
viewerElement.addEventListener('ready', () => {
  const instance = viewer.getInstance();
  instance.toggleElement('leftPanel');
});
 */

import actions from 'actions';

export default store => dataElement => {
  store.dispatch(actions.toggleElement(dataElement));
};