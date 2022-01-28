import castStringToArray from 'helpers/castStringToArray';
/**
 * Sets visibility states of the elements to be hidden. Note that closeElements works only for panel/overlay/popup/modal elements.
 * @method UI.closeElements
 * @param {Array.<string>} dataElements Array of data-element attribute values for DOM elements. To find data-element of a DOM element, refer to <a href='https://www.pdftron.com/documentation/web/guides/hiding-elements/#finding-dataelement-attribute-values' target='_blank'>Finding data-element attribute values</a>.
 * @example
WebViewer(...)
  .then(function(instance) {
    // closes (hides) text popup and left panel in the UI
    instance.UI.closeElements([ 'menuOverlay', 'leftPanel' ]);
  });
 */

import actions from 'actions';

export default store => dataElements => {
  const dataElementArray = castStringToArray(dataElements);
  store.dispatch(actions.closeElements(dataElementArray));
};
