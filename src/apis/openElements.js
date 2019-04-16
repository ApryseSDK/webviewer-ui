/**
 * Sets visibility states of the elements to be visible. Note that openElements works only for panel/overlay/popup/modal elements.
 * @method WebViewer#openElements
 * @param {Array.<string>} dataElements Array of data-element attribute values for DOM elements. To find data-element of a DOM element, refer to <a href='https://www.pdftron.com/documentation/web/guides/hiding-elements/#finding-dataelement-attribute-values' target='_blank'>Finding data-element attribute values</a>.
 * @example // opens (shows) text popup and annotation popup in the UI
viewerElement.addEventListener('ready', () => {
  const instance = viewer.getInstance();
  instance.openElements([ 'menuOverlay', 'leftPanel' ]);
});
 */

import actions from 'actions';

export default store => dataElements => {
  store.dispatch(actions.openElements(dataElements));
}