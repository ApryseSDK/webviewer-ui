import { ITEM_TYPE } from 'constants/customizationVariables';

export const getModularItem = (state, item) => {
  return state.viewer.modularComponents[item];
};

export const getNestedGroupedItems = (state, groupedItems) => {
  const nestedItems = [];

  const filterNestedItems = (items) => {
    for (const item of items) {
      const itemDetails = getModularItem(state, item);
      if (itemDetails && itemDetails.type === ITEM_TYPE.GROUPED_ITEMS) {
        nestedItems.push(item);
        filterNestedItems(itemDetails.items);
      }
    }
  };

  filterNestedItems(getModularItem(state, groupedItems)?.items || []);

  return nestedItems;
};
