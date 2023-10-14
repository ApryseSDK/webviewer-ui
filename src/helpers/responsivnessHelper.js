import { ITEM_TYPE, RESPONSIVE_ITEMS } from 'constants/customizationVariables';
import actions from 'actions';
import selectors from 'selectors';

const sizeManager = {};
export default sizeManager;

let store;

export const setResponsiveHelperStore = (newStore) => {
  store = newStore;
};

export const itemToFlyout = (item, {
  onClick = undefined,
  children = undefined,
} = {}) => {
  const itemProps = item.props || item;

  if (!itemProps || !itemProps.type || !Object.values(ITEM_TYPE).includes(itemProps.type)) {
    return null;
  }

  if (itemProps.type === ITEM_TYPE.DIVIDER) {
    return 'divider';
  }

  const flyoutItem = {
    label: itemProps.label || itemProps.title,
    onClick: () => {
      itemProps.onClick && itemProps.onClick();
      onClick && onClick();
    },
    dataElement: itemProps.dataElement,
    icon: itemProps.icon || itemProps.img,
    children,
  };

  if (itemProps.type === ITEM_TYPE.BUTTON) {
    flyoutItem.className = 'FlyoutCustomButton';
  } else if (itemProps.type === ITEM_TYPE.RIBBON_ITEM) {
    flyoutItem.className = 'FlyoutRibbonItem';
    flyoutItem.onClick = () => {
      const currentToolbarGroup = selectors.getCurrentToolbarGroup(store.getState());
      if (currentToolbarGroup !== itemProps.toolbarGroup) {
        store.dispatch(actions.setToolbarGroup(itemProps.toolbarGroup));
        const activeGroups = itemProps.groupedItems.map((item) => item?.dataElement);
        store.dispatch(actions.setCurrentGroupedItem(activeGroups));
      }
      onClick && onClick();
    };
  } else if (itemProps.type === ITEM_TYPE.TOGGLE_BUTTON) {
    flyoutItem.className = 'FlyoutToggleButton';
    flyoutItem.onClick = () => {
      store.dispatch(actions.toggleElement(itemProps.toggleElement));
      onClick && onClick();
    };
  }

  return flyoutItem;
};

export const getCurrentFreeSpace = (parentSize, items, headerDirection, element) => {
  const isVertical = headerDirection === 'column';
  let calculatedFreeSpace = parentSize;
  for (const child of element.children) {
    const boundingRect = child.getBoundingClientRect();
    const widthOrHeight = isVertical ? 'height' : 'width';
    calculatedFreeSpace -= boundingRect[widthOrHeight];
  }
  const style = window.getComputedStyle(element);
  const leftOrTop = isVertical ? 'Left' : 'Top';
  const rightOrBottom = isVertical ? 'Right' : 'Bottom';
  calculatedFreeSpace -= pixelToNumber(style[`padding${leftOrTop}`]) + pixelToNumber(style[`padding${rightOrBottom}`]);
  calculatedFreeSpace -= pixelToNumber(style[`margin${leftOrTop}`]) + pixelToNumber(style[`margin${rightOrBottom}`]);
  calculatedFreeSpace -= pixelToNumber(style[`border${leftOrTop}Width`]) + pixelToNumber(style[`border${rightOrBottom}Width`]);
  if (items.length > 1) {
    const columnOrRow = isVertical ? 'column' : 'row';
    calculatedFreeSpace -= pixelToNumber(style[`${columnOrRow}Gap`]) * (items.length - 1);
  }
  return calculatedFreeSpace;
};

const pixelToNumber = (pixel) => Math.ceil(parseFloat(pixel.replace('px', '')));

const SIZE_CHANGE_TYPES = { GROW: 'grow', SHRINK: 'shrink' };
const lastSizedElementMap = {};
const elementToPreventLoop = {};
const shrinkHistoryMap = {};

export const findItemToResize = (items, freeSpace, headerDirection, parentDataElement) => {
  if (freeSpace === 0) {
    return null;
  }
  const isVertical = headerDirection === 'column';
  const sizeToGet = isVertical ? 'sizeToHeight' : 'sizeToWidth';
  if (lastSizedElementMap[parentDataElement]) {
    const lastSizedElement = lastSizedElementMap[parentDataElement];
    const element = lastSizedElement.getElement();
    const currentSizeState = element.size;
    const hasToShrink = (lastSizedElement.type === SIZE_CHANGE_TYPES.GROW && freeSpace < 0);
    const hasToGrow = element.canGrow && (lastSizedElement.type === SIZE_CHANGE_TYPES.SHRINK && freeSpace > 0);
    if (hasToGrow && element.canGrow) {
      const growSizeIncrease = element[sizeToGet][currentSizeState - 1] - element[sizeToGet][currentSizeState];
      if (growSizeIncrease > freeSpace) {
        return null;
      }
    }
    if (hasToShrink || hasToGrow) {
      if (lastSizedElement.getElement() === elementToPreventLoop[parentDataElement]?.getElement()) {
        elementToPreventLoop[parentDataElement] = null;
        return null;
      }
      return () => {
        const newSizeChangeEntry = {
          type: hasToShrink ? SIZE_CHANGE_TYPES.SHRINK : SIZE_CHANGE_TYPES.GROW,
          getElement: lastSizedElement.getElement,
          reverse: () => {
            lastSizedElement.getElement()[hasToShrink ? 'grow' : 'shrink']();
          }
        };
        lastSizedElementMap[parentDataElement] = newSizeChangeEntry;
        if (hasToShrink) {
          shrinkHistoryMap[parentDataElement].push(newSizeChangeEntry);
        } else {
          shrinkHistoryMap[parentDataElement].pop();
        }
        elementToPreventLoop[parentDataElement] = newSizeChangeEntry;
        lastSizedElement.reverse();
      };
    }
  }
  const isGrowing = freeSpace > 0;
  if (isGrowing) {
    const shrinkHistory = shrinkHistoryMap[parentDataElement];
    if (!shrinkHistory) {
      return null;
    }
    const lastItem = shrinkHistory[shrinkHistory.length - 1];
    if (!lastItem) {
      return null;
    }
    const currentSize = lastItem.getElement().size;
    const sizeToGet = isVertical ? 'sizeToHeight' : 'sizeToWidth';
    const sizeDifference = lastItem.getElement()[sizeToGet][currentSize - 1] - lastItem.getElement()[sizeToGet][currentSize];
    if (sizeDifference > freeSpace) {
      return null;
    }
    if (elementToPreventLoop[parentDataElement]?.type === SIZE_CHANGE_TYPES.SHRINK && lastSizedElementMap[parentDataElement].getElement() === elementToPreventLoop[parentDataElement]?.getElement()) {
      elementToPreventLoop[parentDataElement] = null;
      return null;
    }
    return () => {
      const lastItem = shrinkHistory.pop();
      lastSizedElementMap[parentDataElement] = {
        type: SIZE_CHANGE_TYPES.GROW,
        getElement: lastItem.getElement,
        reverse: () => {
          lastItem.getElement().shrink();
        }
      };
      lastItem.reverse();
    };
  }
  const [itemList, groupedItemList] = sortResponsiveItems(items);
  const shrinkHistory = shrinkHistoryMap[parentDataElement];
  let itemToShrink;
  if (!shrinkHistory || shrinkHistory.length === 0) {
    itemToShrink = findItemToShrink(itemList, groupedItemList, -1, -1);
  } else {
    const lastShrunkItem = shrinkHistory[shrinkHistory.length - 1].getElement();
    const lastChangedIndex = itemList.findIndex((item) => sizeManager[item.dataElement] === lastShrunkItem);
    const lastChangedGroupIndex = groupedItemList.findIndex((item) => sizeManager[item.dataElement] === lastShrunkItem);
    itemToShrink = findItemToShrink(itemList, groupedItemList, lastChangedIndex, lastChangedGroupIndex);
  }
  if (!itemToShrink) {
    return null;
  }
  return () => {
    const newSizeChangeEntry = {
      type: SIZE_CHANGE_TYPES.SHRINK,
      getElement: () => sizeManager[itemToShrink.dataElement],
      reverse: () => {
        sizeManager[itemToShrink.dataElement].grow();
      }
    };
    lastSizedElementMap[parentDataElement] = newSizeChangeEntry;
    if (!shrinkHistoryMap[parentDataElement]) {
      shrinkHistoryMap[parentDataElement] = [];
    }
    shrinkHistoryMap[parentDataElement].push(newSizeChangeEntry);
    sizeManager[itemToShrink.dataElement].shrink();
  };
};

const sortResponsiveItems = (items) => {
  const arrayToSearch = [...items];
  const newItems = [];
  const groupedItems = [];
  while (arrayToSearch.length > 0) {
    const item = arrayToSearch.pop();
    if (item.type === ITEM_TYPE.GROUPED_ITEMS) {
      groupedItems.push(item);
      arrayToSearch.push(...item.items);
    } else if (RESPONSIVE_ITEMS.includes(item.type)) {
      newItems.push(item);
    }
  }
  return [newItems, groupedItems];
};

const findItemToShrink = (items, groupedItems, lastChangedIndex, lastChangedGroupIndex) => {
  let isValidIndex = lastChangedIndex >= 0;
  let searchIndex = isValidIndex ? lastChangedIndex : 0;
  while (searchIndex < items.length) {
    const rawItem = items[searchIndex];
    const item = sizeManager[rawItem.dataElement];
    if (item && item.canShrink) {
      return rawItem;
    }
    searchIndex++;
  }
  isValidIndex = lastChangedGroupIndex >= 0;
  searchIndex = isValidIndex ? lastChangedGroupIndex : 0;
  while (searchIndex < groupedItems.length) {
    const rawItem = groupedItems[searchIndex];
    const item = sizeManager[rawItem.dataElement];
    if (item && item.canShrink) {
      return rawItem;
    }
    searchIndex++;
  }
};
