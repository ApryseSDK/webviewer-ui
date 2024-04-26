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

  const arrayOfGroupedItems = Array.isArray(groupedItems) ? groupedItems : [groupedItems];
  arrayOfGroupedItems.forEach((group) => {
    filterNestedItems(getModularItem(state, group)?.items || []);
  });

  return nestedItems;
};

export const getParentGroupedItems = (state, groupedItems) => {
  const parentGroupedItems = [];
  const filterParentItems = (items) => {
    for (const item of items) {
      const itemDetails = getModularItem(state, item);
      if (itemDetails && itemDetails.type === ITEM_TYPE.GROUPED_ITEMS) {
        if (itemDetails.items.includes(groupedItems)) {
          parentGroupedItems.push(item);
          filterParentItems(item);
        }
      }
    }
  };
  filterParentItems(Object.keys(state.viewer.modularComponents));
  return parentGroupedItems;
};

export const getBasicItemsFromGroupedItems = (state, groupedItems) => {
  const basicItemTypes = [ITEM_TYPE.BUTTON,
    ITEM_TYPE.STATEFUL_BUTTON,
    ITEM_TYPE.RIBBON_ITEM,
    ITEM_TYPE.DIVIDER,
    ITEM_TYPE.TOGGLE_BUTTON,
    ITEM_TYPE.TOOL_BUTTON,
    ITEM_TYPE.ZOOM,
    ITEM_TYPE.FLYOUT,
    ITEM_TYPE.PAGE_CONTROLS,
    ITEM_TYPE.PRESET_BUTTON,
    ITEM_TYPE.VIEW_CONTROLS,
    ITEM_TYPE.TABS_PANEL,
  ];

  const basicItems = [];
  const nestedGroupedItems = getNestedGroupedItems(state, groupedItems);
  const allGroups = [groupedItems, ...nestedGroupedItems];

  for (const group of allGroups) {
    const itemsOfGroup = getModularItem(state, group)?.items || [];

    for (const item of itemsOfGroup) {
      const itemDetails = getModularItem(state, item);
      if (itemDetails && basicItemTypes.includes(itemDetails.type)) {
        basicItems.push(item);
      }
    }
  }

  return basicItems;
};
