/**
 * Sets the specified grouped items as active in the Modular UI.
 * @method UI.setActiveGroupedItems
 * @param {string} dataElement The dataElement identifier of the grouped items to activate.
 * @example
WebViewer(...)
  .then(function(instance) {
    instance.UI.setActiveGroupedItems('annotateGroupedItems');
 */

import actions from 'actions';

const { checkTypes, TYPES } = window.Core;

export default (store) => (groupedItems) => {
  checkTypes([groupedItems], [TYPES.STRING], 'setActiveGroupedItems');
  store.dispatch(actions.setActiveGroupedItems(groupedItems));
};