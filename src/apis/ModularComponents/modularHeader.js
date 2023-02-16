import actions from 'actions';
import { ITEM_TYPE, ALIGNMENT } from 'constants/customizationVariables';

export default (store) => (options) => {
  const itemValidTypes = Object.values(ITEM_TYPE);

  const setGap = (gap) => {
    store.dispatch(actions.setGapBetweenHeaderItems(options.dataElement, gap));
  };

  const addItemsHelper = (item, itemsList) => {
    if (isItemTypeValid(item)) {
      itemsList.push(item);
    }
  };

  // Validates the items type of a grouped item
  const validateGroupedItems = (groupedItems) => {
    groupedItems.props.items.forEach((item) => {
      isItemTypeValid(item);
    });
  };

  // Shows a warn if the item type is not valid.
  const isItemTypeValid = (item) => {
    const itemType = item.type || item.props.type;
    if (itemValidTypes.includes(itemType)) {
      // case it is a grouped items, validates its items as well
      if (itemType === ITEM_TYPE.GROUPED_ITEMS) {
        validateGroupedItems(item);
      }
      return true;
    }
    console.warn(`${itemType} is not a valid item type.`);
    return false;
  };

  const addItems = (items) => {
    const state = store.getState();
    state.viewer.modularHeaders.forEach((header, index, headers) => {
      if (header.options.dataElement === options.dataElement) {
        const itemsList = headers[index].options.items || [];
        if (Array.isArray(items)) {
          items.forEach((item) => {
            addItemsHelper(item, itemsList);
          });
        } else {
          addItemsHelper(items, itemsList);
        }
        headers[index].options.items = itemsList;
      }
    });
    store.dispatch(actions.updateModularHeaders(state.viewer.modularHeaders));
  };

  const setAlignment = (alignment) => {
    const validAlignments = Object.values(ALIGNMENT);
    if (!validAlignments.includes(alignment)) {
      console.warn(`${alignment} is not a valid value for alignment. Please use one of the following: ${validAlignments}`);
      return;
    }
    store.dispatch(actions.setHeaderAlignment(options.dataElement, alignment));
  };

  return {
    options,
    setGap,
    addItems,
    setAlignment,
  };
};
