import { ITEM_TYPE, RESPONSIVE_ITEMS, DIRECTION } from 'constants/customizationVariables';
import { useEffect, useLayoutEffect } from 'react';
import { useStore } from 'react-redux';
import selectors from 'selectors';
import getRootNode from 'helpers/getRootNode';

// Per-instance storage:
// `sizeManager`, `ResizingPromises`, and `lastSizedElementMap` were previously module-level singletons keyed only by `dataElement`. In multi-WebComponent setups every instance shares the same `dataElement` strings (e.g. 'default-top-header'), so the two instances' header components stomp on each other's records and their `ResponsiveContainer`s end up dispatching shrink/grow into the wrong instance's Redux store -- producing an infinite SET_CUSTOM_ELEMENT_SIZE / UPDATE_FLYOUT loop.
// We now partition every record by the owning root node (Document or ShadowRoot). Single-instance code paths and existing tests keep the original default-exported `sizeManager` / `ResizingPromises`, which alias the document-scoped bucket.
const DEFAULT_ROOT = typeof document !== 'undefined' ? document : null;
const rootBuckets = new WeakMap();
const FALLBACK_BUCKET = createBucket();

function createBucket() {
  return { sizeManager: {}, ResizingPromises: {}, lastSizedElementMap: {} };
}

const resolveRoot = (root) => root || DEFAULT_ROOT;

const getBucket = (root) => {
  const key = resolveRoot(root);
  if (!key) {
    return FALLBACK_BUCKET;
  }
  let bucket = rootBuckets.get(key);
  if (!bucket) {
    bucket = createBucket();
    rootBuckets.set(key, bucket);
  }
  return bucket;
};

const rootFromElement = (element) => {
  if (!element || typeof element.getRootNode !== 'function') {
    return DEFAULT_ROOT;
  }
  return element.getRootNode();
};

export const getSizeManager = (root) => getBucket(root).sizeManager;
export const getResizingPromises = (root) => getBucket(root).ResizingPromises;
const getLastSizedElementMap = (root) => getBucket(root).lastSizedElementMap;

const sizeManager = getSizeManager(DEFAULT_ROOT);
export default sizeManager;

export const ResizingPromises = getResizingPromises(DEFAULT_ROOT);

export const storeWidth = ({ dataElement, element, headerDirection, size }) => {
  if (element && element.sizeManagerSize === size) {
    const freeSpace = getCurrentFreeSpace({ headerDirection, element });
    const localSizeManager = getSizeManager(rootFromElement(element));
    if (!localSizeManager[dataElement]) {
      localSizeManager[dataElement] = {};
    }
    const boundingRect = element.getBoundingClientRect();
    localSizeManager[dataElement].sizeToWidth = {
      ...(localSizeManager[dataElement].sizeToWidth ? localSizeManager[dataElement].sizeToWidth : {}),
      [size]: boundingRect.width - (headerDirection === DIRECTION.ROW ? freeSpace : 0),
    };
    localSizeManager[dataElement].sizeToHeight = {
      ...(localSizeManager[dataElement].sizeToHeight ? localSizeManager[dataElement].sizeToHeight : {}),
      [size]: boundingRect.height - (headerDirection === DIRECTION.COLUMN ? freeSpace : 0),
    };
    resolvePromise(dataElement, rootFromElement(element));
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

  // We can't resolve the per-instance root until the element is mounted, so queue the initial promise in the fallback bucket; the post-mount effect below moves the record into the correct per-root bucket.
  if (!ResizingPromises[dataElement]) {
    queueResizingPromise(dataElement);
  }

  useLayoutEffect(() => {
    if (elementRef.current) {
      elementRef.current.sizeManagerSize = getSize();
    }
  }, [getSize()]);

  useEffect(() => {
    const root = rootFromElement(elementRef.current);
    const localSizeManager = getSizeManager(root);
    localSizeManager[dataElement] = {
      ...(localSizeManager[dataElement] ? localSizeManager[dataElement] : {}),
      dataElement,
      storeWidth: storeWidthWrapper,
    };
    if (!getResizingPromises(root)[dataElement]) {
      queueResizingPromise(dataElement, root);
    }
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
const lastSizedElementMap = getLastSizedElementMap(DEFAULT_ROOT);

// To be used in the unit tests
export const resetLastSizedElementMap = () => {
  Object.keys(lastSizedElementMap).forEach((key) => {
    delete lastSizedElementMap[key];
  });
};

const isItemEnabled = (dataElement, state) => {
  if (!state) {
    return true;
  }
  return !selectors.isElementDisabled(state, dataElement) && !selectors.isDisabledViewOnly(state, dataElement);
};

// Helper that checks if the last sized element is still available and enabled, and if so, returns a resize handler for it
const getResizeHandlerForLastSizedElement = ({ lastSizedElement, parentDataElement,freeSpace, isVertical, root }) => {
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
        instanceRoot: root,
      });
    };
  }
  return undefined;
};

export const findItemToResize = ({ items, freeSpace, headerDirection, parentDataElement, instanceRoot, state }) => {
  if (freeSpace === 0 || !items || items.length === 0) {
    return null;
  }
  const root = resolveRoot(instanceRoot);
  const localSizeManager = getSizeManager(root);
  const localLastSizedElementMap = getLastSizedElementMap(root);
  const isVertical = headerDirection === DIRECTION.COLUMN;
  if (localLastSizedElementMap[parentDataElement]) {
    const lastSizedElement = localLastSizedElementMap[parentDataElement];
    const isLastElementStillAvailable = items.some((item) => item.dataElement === lastSizedElement.dataElement);
    const isLastElementEnabled = isItemEnabled(lastSizedElement.dataElement, state);
    if (isLastElementStillAvailable && isLastElementEnabled) {
      const resizeHandler = getResizeHandlerForLastSizedElement({ lastSizedElement, parentDataElement, freeSpace, isVertical, root });
      if (resizeHandler !== undefined) {
        return resizeHandler;
      }
    } else {
      localLastSizedElementMap[parentDataElement] = null;
    }
  }
  const [itemList, groupedItemList] = sortResponsiveItems(items, parentDataElement);
  const enabledItemList = itemList.filter((item) => isItemEnabled(item.dataElement, state));
  const enabledGroupedItemList = groupedItemList.filter((item) => isItemEnabled(item.dataElement, state));
  const isGrowing = freeSpace > 0;
  if (isGrowing) {
    const itemToGrow = findItemToGrow(enabledItemList, enabledGroupedItemList, localSizeManager);
    if (!itemToGrow) {
      return null;
    }
    const sizeDifference = getGrowSizeIncrease({ element: localSizeManager[itemToGrow.dataElement], isVertical });
    if (sizeDifference > freeSpace) {
      return null;
    }
    return () => {
      createSizeChange({
        parentDataElement,
        item: itemToGrow,
        changeType: SIZE_CHANGE_TYPES.GROW,
        instanceRoot: root,
      });
    };
  }
  const itemToShrink = findItemToShrink(enabledItemList, enabledGroupedItemList, localSizeManager);
  if (!itemToShrink) {
    return null;
  }
  return () => {
    createSizeChange({
      parentDataElement,
      item: itemToShrink,
      changeType: SIZE_CHANGE_TYPES.SHRINK,
      instanceRoot: root,
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

const findItemToShrink = (items, groupedItems, localSizeManager = sizeManager) => {
  let searchIndex = 0;
  while (searchIndex < items.length) {
    const rawItem = items[searchIndex];
    const item = localSizeManager[rawItem.dataElement];
    if (item?.canShrink) {
      return rawItem;
    }
    searchIndex++;
  }
  searchIndex = 0;
  while (searchIndex < groupedItems.length) {
    const rawItem = groupedItems[searchIndex];
    const item = localSizeManager[rawItem.dataElement];
    if (item?.canShrink) {
      return rawItem;
    }
    searchIndex++;
  }
};

const findItemToGrow = (items, groupedItems, localSizeManager = sizeManager) => {
  let searchIndex = groupedItems.length - 1;
  while (searchIndex >= 0) {
    const rawItem = groupedItems[searchIndex];
    const item = localSizeManager[rawItem.dataElement];
    if (item?.canGrow) {
      return rawItem;
    }
    searchIndex--;
  }
  searchIndex = items.length - 1;
  while (searchIndex >= 0) {
    const rawItem = items[searchIndex];
    const item = localSizeManager[rawItem.dataElement];
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

const createSizeChange = ({ parentDataElement, item, changeType, instanceRoot }) => {
  const root = resolveRoot(instanceRoot);
  const localSizeManager = getSizeManager(root);
  const localLastSizedElementMap = getLastSizedElementMap(root);
  const { dataElement } = item;
  const elementStack = getParentElements(dataElement, root);
  queueResizingPromise(dataElement, root);
  for (const element of elementStack) {
    queueResizingPromise(element, root);
  }
  localLastSizedElementMap[parentDataElement] = {
    changeType,
    getElement: () => localSizeManager[dataElement],
    dataElement,
  };
  localSizeManager[item.dataElement][changeType]();
};

const getParentElements = (dataElement, instanceRoot) => {
  const stack = [];
  const root = resolveRoot(instanceRoot) || getRootNode();
  let element = root.querySelector?.(`[data-element="${dataElement}"]`);
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

const queueResizingPromise = (dataElement, instanceRoot) => {
  const root = resolveRoot(instanceRoot);
  const localSizeManager = getSizeManager(root);
  const localPromises = getResizingPromises(root);
  const promiseCapability = {};
  promiseCapability.promise = new Promise((resolve, reject) => {
    // Timeout to auto resolve to prevent getting stuck
    let timeout = setTimeout(() => localSizeManager[dataElement]?.storeWidth?.(), 200);
    promiseCapability.resolve = () => {
      clearTimeout(timeout);
      resolve();
    };
    promiseCapability.reject = reject;
  });
  localPromises[dataElement] = promiseCapability;
};

const resolvePromise = (dataElement, instanceRoot) => {
  const localPromises = getResizingPromises(resolveRoot(instanceRoot));
  localPromises[dataElement]?.resolve?.();
};
