import React from 'react';
import { DIRECTION } from 'src/constants/customizationVariables';
import sizeManager, {
  findItemToResize,
  getCurrentFreeSpace,
  resetLastSizedElementMap,
  useSizeStore,
  storeWidth
} from './responsivenessHelper';
import { renderHook } from '@testing-library/react-hooks';

const noop = () => {
};

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useEffect: jest.fn(),
}));

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useStore: () => ({
    getState: () => ({}),
  }),
}));

jest.spyOn(React, 'useLayoutEffect');

const createHTMLElement = (type, width, height, options) => {
  const element = document.createElement(type);
  element.getBoundingClientRect = jest.fn().mockReturnValue({
    width,
    height,
    clientWidth: width,
    clientHeight: height,
  });

  if (options?.dataElement) {
    element.setAttribute('data-element', options.dataElement);
  }

  return element;
};

window.getComputedStyle = jest.fn().mockImplementation((element) => {
  let flexGrow = '0';
  if (element.children.length > 1) {
    flexGrow = '2';
  }

  return {
    paddingTop: '0px',
    paddingBottom: '0px',
    paddingLeft: '0px',
    paddingRight: '0px',
    marginTop: '0px',
    marginBottom: '0px',
    marginLeft: '0px',
    marginRight: '0px',
    borderTopWidth: '0px',
    borderBottomWidth: '0px',
    borderLeftWidth: '0px',
    borderRightWidth: '0px',
    rowGap: '12px',
    columnGap: '12px',
    flexGrow: flexGrow,
  };
});

describe('Responsiveness Helper', () => {
  describe('Tests for useSizeStore hook', () => {
    // To be fixed as part of https://apryse.atlassian.net/browse/WVR-8684
    test.skip('Stores the size of an element in the sizeManager object', async () => {
      const dataElement = 'modularHeaderGroupedItems';
      const size = 0;
      const headerDirection = DIRECTION.ROW;
      const elementRef = {
        current: createHTMLElement('div', 150, 32, { dataElement })
      };
      const childElement = createHTMLElement('div', 150, 32);
      elementRef.current.appendChild(childElement);

      renderHook(() => useSizeStore({ dataElement, elementRef, headerDirection }));
      useSizeStore({ dataElement, elementRef, headerDirection });

      storeWidth({
        dataElement,
        element: elementRef.current,
        headerDirection,
        size,
      });

      expect(sizeManager[dataElement].sizeToWidth).toEqual({ '0': 150 });
      expect(sizeManager[dataElement].sizeToHeight).toEqual({ '0': 32 });
    });

    // To be fixed as part of https://apryse.atlassian.net/browse/WVR-8684
    test.skip('Stores the size of an element with children in the sizeManager object with a horizontal header', () => {
      const modularHeaderGroupedItemsDOM = createHTMLElement('div', 150, 32, { dataElement: 'modularHeaderGroupedItems' });
      const signatureButtonDOM = createHTMLElement('div', 40, 32, { dataElement: 'signatureCreateToolButton' });
      const rectangleButtonDOM = createHTMLElement('div', 40, 32, { dataElement: 'rectangleCreateToolButton' });
      const ellipseButtonDOM = createHTMLElement('div', 40, 32, { dataElement: 'ellipseCreateToolButton' });
      modularHeaderGroupedItemsDOM.appendChild(signatureButtonDOM);
      modularHeaderGroupedItemsDOM.appendChild(rectangleButtonDOM);
      modularHeaderGroupedItemsDOM.appendChild(ellipseButtonDOM);

      const dataElement = 'modularHeaderGroupedItems';
      const size = 0;
      const headerDirection = DIRECTION.ROW;
      const elementRef = {
        current: modularHeaderGroupedItemsDOM
      };

      renderHook(() => useSizeStore({ dataElement, size, elementRef, headerDirection }));
      useSizeStore({ dataElement, size, elementRef, headerDirection });

      storeWidth({
        dataElement,
        element: elementRef.current,
        headerDirection,
        size,
      });

      expect(sizeManager[dataElement].sizeToWidth).toEqual({ '0': 144 });
      expect(sizeManager[dataElement].sizeToHeight).toEqual({ '0': 32 });
    });
  });

  describe('Tests for getCurrentFreeSpace function', () => {
    test('Returns correct free space for a children element', () => {
      const elementChild = createHTMLElement('div', 40, 32);
      const headerDirection = DIRECTION.ROW;
      const freeSpace = getCurrentFreeSpace({ headerDirection, element: elementChild, isChild: true });
      expect(freeSpace).toBe(0);
    });

    test('Returns correct free space for a ROW header with children', () => {
      const parentElement = createHTMLElement('div', 480, 32);
      const elementChild1 = createHTMLElement('div', 40, 32);
      const elementChild2 = createHTMLElement('div', 100, 32);
      const elementChild3 = createHTMLElement('div', 60, 32);
      parentElement.appendChild(elementChild1);
      parentElement.appendChild(elementChild2);
      parentElement.appendChild(elementChild3);
      const headerDirection = DIRECTION.ROW;
      const element = parentElement;

      // Putting the isChild flag to true to be able to enter in the flow of the case where the element is a child
      const freeSpace = getCurrentFreeSpace({ headerDirection, element });
      // Expect free space to be -> parentElement.width - (elementChild1.width + elementChild2.width + elementChild3.width) - 2 * rowGap
      expect(freeSpace).toBe(256);
    });

    test('Returns correct free space for COLUMN header with children', () => {
      const parentElement = createHTMLElement('div', 40, 480);
      const elementChild1 = createHTMLElement('div', 40, 156);
      const elementChild2 = createHTMLElement('div', 32, 100);
      const elementChild3 = createHTMLElement('div', 32, 60);
      parentElement.appendChild(elementChild1);
      parentElement.appendChild(elementChild2);
      parentElement.appendChild(elementChild3);
      const headerDirection = DIRECTION.COLUMN;
      const element = parentElement;

      // Putting the isChild flag to true to be able to enter in the flow of the case where the element is a child
      const freeSpace = getCurrentFreeSpace({ headerDirection, element, isChild: true });
      // Expect free space to be -> parentElement.height - (elementChild1.height + elementChild2.height + elementChild3.height) - 2 * columnGap
      expect(freeSpace).toBe(140);
    });

    test('Returns a negative value when there is no space on a header with children', () => {
      const parentElement = createHTMLElement('div', 40, 280);
      const elementChild1 = createHTMLElement('div', 40, 180);
      const elementChild2 = createHTMLElement('div', 32, 110);
      parentElement.appendChild(elementChild1);
      parentElement.appendChild(elementChild2);
      const headerDirection = DIRECTION.COLUMN;
      const element = parentElement;

      // Putting the isChild flag to true to be able to enter in the flow of the case where the element is a child
      const freeSpace = getCurrentFreeSpace({ headerDirection, element, isChild: true });
      expect(freeSpace).toBe(-22);
    });
  });

  describe('Tests for findItemToResize function', () => {
    const headerDirection = DIRECTION.ROW;
    const items = [
      {
        'dataElement': 'modularHeaderGroupedItems',
        'items': [],
        'type': 'groupedItems',
        'grow': 1,
        'gap': 12,
        'alwaysVisible': true,
        'style': {}
      }
    ];

    beforeEach(() => {
      sizeManager['modularHeaderGroupedItems'] = {
        'sizeToWidth': {
          '1': 0,
          '2': 44,
          '3': 88,
        },
        'sizeToHeight': {
          '1': 32,
          '2': 32,
          '3': 32
        },
        'canGrow': true,
        'canShrink': true,
        'size': 3,
        shrink: jest.fn(),
        grow: jest.fn()
      };
      sizeManager['default-top-header'] = {
        'canGrow': true,
        'canShrink': true,
        'size': 1,
        shrink: jest.fn(),
        grow: jest.fn(),
        sizeToWidth: {
          '0': 160,
          '1': 150,
        }
      };
    });

    afterEach(() => {
      resetLastSizedElementMap();
    });

    test('should call the SHRINK method of a grouped item if the free space is negative and make the free space positive', () => {
      const freeSpace = -2;
      const parentDataElement = 'default-top-header';
      const parentDomElement = createHTMLElement('div', 160, 50, { dataElement: parentDataElement });
      const modularHeaderGroupedItemsDom = createHTMLElement('div', 150, 32, { dataElement: 'modularHeaderGroupedItems' });
      parentDomElement.appendChild(modularHeaderGroupedItemsDom);

      const returnFunction = findItemToResize({ items, freeSpace, headerDirection, parentDataElement });
      expect(typeof returnFunction).toBe('function');
      returnFunction();
      expect(sizeManager['modularHeaderGroupedItems'].shrink).toBeCalled();
      const newFreeSpace = getCurrentFreeSpace({ headerDirection, element: parentDomElement });
      expect(newFreeSpace).toBe(10);
    });

    test('should call the GROW method of a grouped item if the free space is positive', () => {
      const freeSpace = 100;
      const parentDataElement = 'default-top-header';
      const parentDomElement = createHTMLElement('div', 260, 50, { dataElement: parentDataElement });
      const modularHeaderGroupedItemsDom = createHTMLElement('div', 150, 32, { dataElement: 'modularHeaderGroupedItems' });
      parentDomElement.appendChild(modularHeaderGroupedItemsDom);

      const returnFunction = findItemToResize({ items, freeSpace, headerDirection, parentDataElement });
      expect(typeof returnFunction).toBe('function');
      returnFunction();
      expect(sizeManager[parentDataElement].grow).toBeCalled();
    });

    test('should not return disabled items as items to resize', () => {
      const freeSpace = -2;
      const parentDataElement = 'default-top-header';
      const parentDomElement = createHTMLElement('div', 160, 50, { dataElement: parentDataElement });
      const highlightToolGroupToggleButtonDom = createHTMLElement('div', 40, 32, { dataElement: 'highlightToolGroupToggleButton' });
      const calloutToolGroupToggleButtonDom = createHTMLElement('div', 40, 32, { dataElement: 'calloutToolGroupToggleButton' });
      const highlightGroupedItemsDom = createHTMLElement('div', 150, 32, { dataElement: 'highlightGroupedItems' });
      const calloutGroupedItemsDom = createHTMLElement('div', 150, 32, { dataElement: 'calloutGroupedItems' });
      parentDomElement.appendChild(highlightToolGroupToggleButtonDom);
      parentDomElement.appendChild(calloutToolGroupToggleButtonDom);
      parentDomElement.appendChild(highlightGroupedItemsDom);
      parentDomElement.appendChild(calloutGroupedItemsDom);

      sizeManager['highlightToolGroupToggleButton'] = {
        canGrow: true,
        canShrink: true,
        size: 1,
        shrink: jest.fn(),
        grow: jest.fn(),
      };

      sizeManager['calloutToolGroupToggleButton'] = {
        canGrow: true,
        canShrink: true,
        size: 1,
        shrink: jest.fn(),
        grow: jest.fn(),
      };

      sizeManager['highlightGroupedItems'] = {
        canGrow: true,
        canShrink: true,
        size: 4,
        shrink: jest.fn(),
        grow: jest.fn(),
      };

      sizeManager['calloutGroupedItems'] = {
        canGrow: true,
        canShrink: true,
        size: 4,
        shrink: jest.fn(),
        grow: jest.fn(),
      };

      const itemsToResize = [
        {
          dataElement: 'highlightToolGroupToggleButton',
          type: 'toolGroupToggleButton',
        },
        {
          dataElement: 'calloutToolGroupToggleButton',
          type: 'toolGroupToggleButton',
        },
        {
          dataElement: 'highlightGroupedItems',
          items: [],
          type: 'groupedItems',
        },
        {
          dataElement: 'calloutGroupedItems',
          items: [],
          type: 'groupedItems',
        },
      ];

      const state = {
        viewer: {
          isViewOnly: false,
          disabledElements: {
            calloutGroupedItems: { disabled: true },
          },
          modularComponents: {},
          viewOnlyWhitelist: {
            dataElement: [],
            dataElementBlacklist: [],
          },
          flyoutMap: {},
        },
      };

      items[0].items = itemsToResize;
      const returnFunction = findItemToResize({ items, freeSpace, headerDirection, parentDataElement, state });
      expect(typeof returnFunction).toBe('function');
      returnFunction();
      expect(sizeManager['highlightGroupedItems'].shrink).toBeCalled();
      expect(sizeManager['calloutGroupedItems'].shrink).not.toBeCalled();
    });

    test('should stop reusing the last sized item when it is disabled and continue with enabled fallback items', () => {
      const freeSpace = -2;
      const parentDataElement = 'default-top-header';
      const itemsToResize = [
        {
          dataElement: 'highlightGroupedItems',
          items: [],
          type: 'groupedItems',
        },
        {
          dataElement: 'calloutGroupedItems',
          items: [],
          type: 'groupedItems',
        },
      ];

      sizeManager['highlightGroupedItems'] = {
        canGrow: true,
        canShrink: true,
        size: 4,
        shrink: jest.fn(),
        grow: jest.fn(),
      };

      sizeManager['calloutGroupedItems'] = {
        canGrow: true,
        canShrink: true,
        size: 4,
        shrink: jest.fn(),
        grow: jest.fn(),
      };

      items[0].items = itemsToResize;

      const enabledState = {
        viewer: {
          isViewOnly: false,
          disabledElements: {
            calloutGroupedItems: { disabled: true },
          },
          modularComponents: {},
          viewOnlyWhitelist: {
            dataElement: [],
            dataElementBlacklist: [],
          },
          flyoutMap: {},
        },
      };

      const initialResize = findItemToResize({ items, freeSpace, headerDirection, parentDataElement, state: enabledState });
      expect(typeof initialResize).toBe('function');
      initialResize();
      expect(sizeManager['highlightGroupedItems'].shrink).toBeCalledTimes(1);

      const disabledState = {
        ...enabledState,
        viewer: {
          ...enabledState.viewer,
          disabledElements: {
            highlightGroupedItems: { disabled: true },
          },
        },
      };

      const disabledResize = findItemToResize({ items, freeSpace, headerDirection, parentDataElement, state: disabledState });
      expect(typeof disabledResize).toBe('function');
      disabledResize();
      expect(sizeManager['highlightGroupedItems'].shrink).toBeCalledTimes(1);
      expect(sizeManager['calloutGroupedItems'].shrink).toBeCalledTimes(1);
    });
  });
});
