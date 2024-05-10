import { ITEM_TYPE, RESPONSIVE_ITEMS, BUTTON_TYPES, DIRECTION } from 'constants/customizationVariables';
import { useLayoutEffect } from 'react';

const sizeManager = {};
export default sizeManager;

export const useSizeStore = (dataElement, size, elementRef, headerDirection) => {
  useLayoutEffect(() => {
    if (elementRef.current) {
      const isVertical = headerDirection === DIRECTION.COLUMN;
      const freeSpace = getCurrentFreeSpace(headerDirection, elementRef.current, true);
      if (!sizeManager[dataElement]) {
        sizeManager[dataElement] = {};
      }
      sizeManager[dataElement].sizeToWidth = {
        ...(sizeManager[dataElement].sizeToWidth ? sizeManager[dataElement].sizeToWidth : {}),
        [size]: elementRef.current.clientWidth - (isVertical ? 0 : freeSpace),
      };
      sizeManager[dataElement].sizeToHeight = {
        ...(sizeManager[dataElement].sizeToHeight ? sizeManager[dataElement].sizeToHeight : {}),
        [size]: elementRef.current.clientHeight - (isVertical ? freeSpace : 0)
      };
    }
  }, [size, elementRef.current]);
};

const cssNonNumberValues = ['auto', 'inherit', 'initial', 'unset', 'normal', 'revert', 'revert-layer', 'none'];
const pixelToNumber = (pixel) => Math.ceil(parseFloat(pixel.replace('px', '')));
const getCSSValue = (style, property) => {
  const value = style[property];
  if (cssNonNumberValues.includes(value)) {
    return 0;
  }
  return pixelToNumber(value);
};
export const getCurrentFreeSpace = (headerDirection, element, isChild = false) => {
  const isVertical = headerDirection === DIRECTION.COLUMN;
  const widthOrHeight = isVertical ? 'height' : 'width';
  const style = window.getComputedStyle(element);
  const rect = element.getBoundingClientRect();
  if (isChild && style.flexGrow === '0') {
    return 0;
  }
  let calculatedFreeSpace = rect[widthOrHeight];
  for (const child of element.children) {
    calculatedFreeSpace -= child.getBoundingClientRect()[widthOrHeight] - getCurrentFreeSpace(headerDirection, child, true);
  }
  const leftOrTop = isVertical ? 'Left' : 'Top';
  const rightOrBottom = isVertical ? 'Right' : 'Bottom';
  calculatedFreeSpace -= getCSSValue(style, `padding${leftOrTop}`) + getCSSValue(style, `padding${rightOrBottom}`);
  calculatedFreeSpace -= getCSSValue(style, `margin${leftOrTop}`) + getCSSValue(style, `margin${rightOrBottom}`);
  calculatedFreeSpace -= getCSSValue(style, `border${leftOrTop}Width`) + getCSSValue(style, `border${rightOrBottom}Width`);
  if (element.children.length > 1) {
    const columnOrRow = isVertical ? DIRECTION.COLUMN : DIRECTION.ROW;
    calculatedFreeSpace -= getCSSValue(style, `${columnOrRow}Gap`) * (element.children.length - 1);
  }
  return calculatedFreeSpace;
};

const SIZE_CHANGE_TYPES = { GROW: 'grow', SHRINK: 'shrink' };
const lastSizedElementMap = {};
const elementToPreventLoop = {};

// To be used in the unit tests
export const resetLastSizedElementMap = () => {
  Object.keys(lastSizedElementMap).forEach((key) => {
    delete lastSizedElementMap[key];
  });
};

export const findItemToResize = (items, freeSpace, headerDirection, parentDataElement, parentDomElement) => {
  if (freeSpace === 0 || !items || items.length === 0) {
    return null;
  }
  const isVertical = headerDirection === DIRECTION.COLUMN;
  if (lastSizedElementMap[parentDataElement]) {
    const lastSizedElement = lastSizedElementMap[parentDataElement];
    const element = lastSizedElement.getElement();
    const hasToShrink = (lastSizedElement.type === SIZE_CHANGE_TYPES.GROW && freeSpace < 0);
    const hasToGrow = element.canGrow && (lastSizedElement.type === SIZE_CHANGE_TYPES.SHRINK && freeSpace > 0);
    if (hasToGrow && element.canGrow) {
      const growSizeIncrease = getGrowSizeIncrease(element, parentDataElement, isVertical, items, parentDomElement);
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
            lastSizedElement.getElement()[hasToShrink ? SIZE_CHANGE_TYPES.GROW : SIZE_CHANGE_TYPES.SHRINK]();
          }
        };
        lastSizedElementMap[parentDataElement] = newSizeChangeEntry;
        elementToPreventLoop[parentDataElement] = newSizeChangeEntry;
        lastSizedElement.reverse();
      };
    }
  }
  const [itemList, groupedItemList] = sortResponsiveItems(items, parentDataElement);
  const isGrowing = freeSpace > 0;
  if (isGrowing) {
    const itemToGrow = findItemToGrow(itemList, groupedItemList);
    if (!itemToGrow) {
      return null;
    }
    const sizeDifference = getGrowSizeIncrease(sizeManager[itemToGrow.dataElement], parentDataElement, isVertical, items, parentDomElement);
    if (sizeDifference > freeSpace) {
      return null;
    }
    if (elementToPreventLoop[parentDataElement]?.type === SIZE_CHANGE_TYPES.SHRINK && lastSizedElementMap[parentDataElement].getElement() === elementToPreventLoop[parentDataElement]?.getElement()) {
      elementToPreventLoop[parentDataElement] = null;
      return null;
    }
    return () => {
      lastSizedElementMap[parentDataElement] = {
        type: SIZE_CHANGE_TYPES.GROW,
        getElement: () => sizeManager[itemToGrow.dataElement],
        reverse: () => sizeManager[itemToGrow.dataElement].shrink(),
      };
      sizeManager[itemToGrow.dataElement].grow();
    };
  }
  const itemToShrink = findItemToShrink(itemList, groupedItemList);
  if (!itemToShrink) {
    return null;
  }
  return () => {
    lastSizedElementMap[parentDataElement] = {
      type: SIZE_CHANGE_TYPES.SHRINK,
      getElement: () => sizeManager[itemToShrink.dataElement],
      reverse: () => sizeManager[itemToShrink.dataElement].grow(),
    };
    sizeManager[itemToShrink.dataElement].shrink();
  };
};

const sortResponsiveItems = (items, parentDataElement) => {
  const arrayToSearch = [...items];
  const newItems = [];
  const groupedItems = [];
  while (arrayToSearch.length > 0) {
    const item = arrayToSearch.pop();
    if (item.type === ITEM_TYPE.GROUPED_ITEMS) {
      const [innerItemList, innerGroupedItemList] = sortResponsiveItems(item.items, item.dataElement);
      newItems.push(...innerItemList);
      groupedItems.push(...innerGroupedItemList);
      groupedItems.push(item);
    } else if (RESPONSIVE_ITEMS.includes(item.type)) {
      newItems.push(item);
    }
  }
  groupedItems.push({ dataElement: parentDataElement, type: 'header' });
  return [newItems, groupedItems];
};

const findItemToShrink = (items, groupedItems) => {
  let searchIndex = 0;
  while (searchIndex < items.length) {
    const rawItem = items[searchIndex];
    const item = sizeManager[rawItem.dataElement];
    if (item && item.canShrink) {
      return rawItem;
    }
    searchIndex++;
  }
  searchIndex = 0;
  while (searchIndex < groupedItems.length) {
    const rawItem = groupedItems[searchIndex];
    const item = sizeManager[rawItem.dataElement];
    if (item && item.canShrink) {
      return rawItem;
    }
    searchIndex++;
  }
};

const findItemToGrow = (items, groupedItems) => {
  let searchIndex = groupedItems.length - 1;
  while (searchIndex >= 0) {
    const rawItem = groupedItems[searchIndex];
    const item = sizeManager[rawItem.dataElement];
    if (item && item.canGrow) {
      return rawItem;
    }
    searchIndex--;
  }
  searchIndex = items.length - 1;
  while (searchIndex >= 0) {
    const rawItem = items[searchIndex];
    const item = sizeManager[rawItem.dataElement];
    if (item && item.canGrow) {
      return rawItem;
    }
    searchIndex--;
  }
};

const getGrowSizeIncrease = (element, parentDataElement, isVertical, items, parentElement) => {
  if (sizeManager[parentDataElement] === element) {
    const currentSize = element.size;
    if (currentSize === 0) {
      return 0;
    }
    const sizeToGet = isVertical ? 'sizeToHeight' : 'sizeToWidth';
    const itemToBeAddedIndex = items.length - currentSize;
    let itemToBeAdded = items[itemToBeAddedIndex];
    let itemsCount = 1;
    if (itemToBeAdded.type === ITEM_TYPE.DIVIDER) {
      itemsCount++;
      itemToBeAdded = items[itemToBeAddedIndex + 1];
    }
    const columnOrRow = isVertical ? DIRECTION.COLUMN : DIRECTION.ROW;
    const paddingSizeIncrease = currentSize === 1 ? 0 : pixelToNumber(getComputedStyle(parentElement)[`${columnOrRow}Gap`]) * itemsCount;
    if (BUTTON_TYPES.includes(itemToBeAdded.type)) {
      if (currentSize === 1) {
        return 0;
      }
      return 32 + paddingSizeIncrease;
    }
    const itemToBeAddedSize = sizeManager[itemToBeAdded.dataElement].size;
    const elementToBeAdded = sizeManager[itemToBeAdded.dataElement];
    const elementSize = elementToBeAdded[sizeToGet][itemToBeAddedSize];
    return elementSize + paddingSizeIncrease;
  }
  const currentSize = element.size;
  const sizeToGet = isVertical ? 'sizeToHeight' : 'sizeToWidth';
  return element[sizeToGet][currentSize - 1] - element[sizeToGet][currentSize];
};
