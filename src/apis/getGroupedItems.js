/**
 * Returns a grouped items component with the given dataElement.
 * @method UI.getGroupedItems
 * @param {string} dataElement The dataElement of the grouped items to be returned
 * @return {UI.Components.GroupedItems} Grouped Items
 * @example
WebViewer(...)
  .then(function(instance) {
    const groupedItems = instance.UI.getGroupedItems('custom-group')
  });
 */

import selectors from 'selectors';
import { ITEM_TYPE } from 'constants/customizationVariables';
import { getModularComponentInstance } from 'src/helpers/getModularComponentInstance';

export default (store) => (dataElement) => {
  const state = store.getState();
  const groupedItems = selectors.getModularComponent(state, dataElement);

  if (!groupedItems || groupedItems?.type !== ITEM_TYPE.GROUPED_ITEMS) {
    console.warn(`There are no grouped items with dataElement ${dataElement}`);
    return null;
  }

  const groupedItemsInstance = getModularComponentInstance(store)(groupedItems);
  return groupedItemsInstance;
};