import { ITEM_TYPE, RESPONSIVE_ITEMS, DIRECTION } from 'constants/customizationVariables';
import { useEffect, useLayoutEffect } from 'react';
import { useStore } from 'react-redux';
import selectors from 'selectors';
import getRootNode from 'helpers/getRootNode';

const sizeManager = {};
export default sizeManager;

export const ResizingPromises = {};

export const storeWidth = ({ dataElement, element, headerDirection, size }) => {
  if (element && element.sizeManagerSize === size) {
    const freeSpace = getCurrentFreeSpace({ headerDirection, element });
    if (!sizeManager[dataElement]) {
      sizeManager[dataElement] = {};
    }
    const boundingRect = element.getBoundingClientRect();
    sizeManager[dataElement].sizeToWidth = {
      ...(sizeManager[dataElement].sizeToWidth ? sizeManager[dataElement].sizeToWidth : {}),
      [size]: boundingRect.width - (headerDirection === DIRECTION.ROW ? freeSpace : 0),
    };
    sizeManager[dataElement].sizeToHeight = {
      ...(sizeManager[dataElement].sizeToHeight ? sizeManager[dataElement].sizeToHeight : {}),
      [size]: boundingRect.height - (headerDirection === DIRECTION.COLUMN ? freeSpace : 0),
    };
    resolvePromise(dataElement);
  }
};

export const useSizeStore = ({
  dataElement,
  elementRef,
  headerDirection,
}) => {
  const store = useStore();
  const getSize = () => selectors.getCustomElementSize(store.getState(), dataElement);
  const storeWidthWrapper = () =>
    storeWidth({ dataElement, element: elementRef.current, headerDirection, size: getSize() });

  if (!ResizingPromises[dataElement]) {
    queueResizingPromise(dataElement);
  }

  useLayoutEffect(() => {
    if (elementRef.current) {
      elementRef.current.sizeManagerSize = getSize();
    }
  }, [getSize()]);

  useEffect(() => {
    sizeManager[dataElement] = {
      ...(sizeManager[dataElement] ? sizeManager[dataElement] : {}),
      dataElement,
      storeWidth: storeWidthWrapper,
    };
  }, []);

  useEffect(() => {
    if (!window.ResizeObserver || !window.MutationObserver) {
      return console.error('Browser not support for header responsiveness');
    }
    if (!elementRef.current) {
      // Element might be disabled so no error or warning
      return;
    }
    const resizeObserver = new ResizeObserver(storeWidthWrapper);
    resizeObserver.observe(elementRef.current);
    const mutationObserver = new MutationObserver(storeWidthWrapper);
    mutationObserver.observe(elementRef.current, {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true,
    });
    storeWidthWrapper();
    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [elementRef.current]);
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
export const getCurrentFreeSpace = ({
  headerDirection = DIRECTION.ROW,
  element,
  isChild = false,
}) => {
  const isVertical = headerDirection === DIRECTION.COLUMN;
  const widthOrHeight = isVertical ? 'height' : 'width';
  const style = window.getComputedStyle(element);
  const rect = element.getBoundingClientRect();
  if (isChild && style.flexGrow === '0') {
    return 0;
  }
  let calculatedFreeSpace = rect[widthOrHeight];
  for (const child of element.children) {
    calculatedFreeSpace -= child.getBoundingClientRect()[widthOrHeight] - getCurrentFreeSpace({
      headerDirection,
      element: child,
      isChild: true,
    });
  }
  const leftOrTop = isVertical ? 'Top': 'Left';
  const rightOrBottom = isVertical ? 'Bottom' : 'Right';
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

// To be used in the unit tests
export const resetLastSizedElementMap = () => {
  Object.keys(lastSizedElementMap).forEach((key) => {
    delete lastSizedElementMap[key];
  });
};

export const findItemToResize = ({ items, freeSpace, headerDirection, parentDataElement }) => {
  if (freeSpace === 0 || !items || items.length === 0) {
    return null;
  }
  const isVertical = headerDirection === DIRECTION.COLUMN;
  if (lastSizedElementMap[parentDataElement]) {
    const lastSizedElement = lastSizedElementMap[parentDataElement];
    const isLastElementStillAvailable = items.some((item) => item.dataElement === lastSizedElement.dataElement);
    if (isLastElementStillAvailable) {
      const element = lastSizedElement.getElement();
      const hasToShrink = (lastSizedElement.changeType === SIZE_CHANGE_TYPES.GROW && freeSpace < 0);
      const hasToGrow = element.canGrow && (lastSizedElement.changeType === SIZE_CHANGE_TYPES.SHRINK && freeSpace > 0);
      if (hasToGrow) {
        const growSizeIncrease = getGrowSizeIncrease({ element, isVertical });
        if (growSizeIncrease > freeSpace) {
          return null;
        }
      }
      if (hasToShrink || hasToGrow) {
        return () => {
          createSizeChange({
            parentDataElement,
            item: lastSizedElement,
            changeType: hasToShrink ? SIZE_CHANGE_TYPES.SHRINK : SIZE_CHANGE_TYPES.GROW,
          });
        };
      }
    } else {
      lastSizedElementMap[parentDataElement] = null;
    }
  }
  const [itemList, groupedItemList] = sortResponsiveItems(items, parentDataElement);
  const isGrowing = freeSpace > 0;
  if (isGrowing) {
    const itemToGrow = findItemToGrow(itemList, groupedItemList);
    if (!itemToGrow) {
      return null;
    }
    const sizeDifference = getGrowSizeIncrease({ element: sizeManager[itemToGrow.dataElement], isVertical });
    if (sizeDifference > freeSpace) {
      return null;
    }
    return () => {
      createSizeChange({
        parentDataElement,
        item: itemToGrow,
        changeType: SIZE_CHANGE_TYPES.GROW,
      });
    };
  }
  const itemToShrink = findItemToShrink(itemList, groupedItemList);
  if (!itemToShrink) {
    return null;
  }
  return () => {
    createSizeChange({
      parentDataElement,
      item: itemToShrink,
      changeType: SIZE_CHANGE_TYPES.SHRINK,
    });
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
    if (item?.canShrink) {
      return rawItem;
    }
    searchIndex++;
  }
  searchIndex = 0;
  while (searchIndex < groupedItems.length) {
    const rawItem = groupedItems[searchIndex];
    const item = sizeManager[rawItem.dataElement];
    if (item?.canShrink) {
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
    if (item?.canGrow) {
      return rawItem;
    }
    searchIndex--;
  }
  searchIndex = items.length - 1;
  while (searchIndex >= 0) {
    const rawItem = items[searchIndex];
    const item = sizeManager[rawItem.dataElement];
    if (item?.canGrow) {
      return rawItem;
    }
    searchIndex--;
  }
};

const getGrowSizeIncrease = ({ element, isVertical }) => {
  const currentSize = element.size;
  const sizeToGet = isVertical ? 'sizeToHeight' : 'sizeToWidth';
  return element[sizeToGet][currentSize - 1] - element[sizeToGet][currentSize];
};

const createSizeChange = ({ parentDataElement, item, changeType }) => {
  const { dataElement } = item;
  const elementStack = getParentElements(dataElement);
  queueResizingPromise(dataElement);
  for (const element of elementStack) {
    queueResizingPromise(element);
  }
  lastSizedElementMap[parentDataElement] = {
    changeType,
    getElement: () => sizeManager[dataElement],
    dataElement,
  };
  sizeManager[item.dataElement][changeType]();
};

const getParentElements = (dataElement) => {
  const stack = [];
  let element = getRootNode().querySelector(`[data-element="${dataElement}"]`);
  while (element?.parentElement) {
    element = element.parentElement;
    const dataElement = element.dataset.element;
    if (dataElement) {
      stack.push(dataElement);
    }
    if (element.classList.contains('ModularHeaderItems')) {
      break;
    }
  }
  return stack;
};

const queueResizingPromise = (dataElement) => {
  const promiseCapability = {};
  promiseCapability.promise = new Promise((resolve, reject) => {
    // Timeout to auto resolve to prevent getting stuck
    let timeout = setTimeout(() => sizeManager[dataElement].storeWidth(), 200);
    promiseCapability.resolve = () => {
      clearTimeout(timeout);
      resolve();
    };
    promiseCapability.reject = reject;
  });
  ResizingPromises[dataElement] = promiseCapability;
};

const resolvePromise = (dataElement) => {
  ResizingPromises[dataElement].resolve();
};
