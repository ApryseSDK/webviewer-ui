import React from 'react';
import { DIRECTION } from 'src/constants/customizationVariables';
import sizeManager, {
  findItemToResize,
  getCurrentFreeSpace,
  resetLastSizedElementMap,
  useSizeStore
} from './responsivenessHelper';
import { renderHook } from '@testing-library/react-hooks';

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useLayoutEffect: jest.fn(),
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
    test('Stores the size of an element in the sizeManager object', () => {
      const dataElement = 'modularHeaderGroupedItems';
      const size = 0;
      const headerDirection = DIRECTION.ROW;
      const elementRef = {
        current: createHTMLElement('div', 150, 32)
      };

      renderHook(() => useSizeStore(dataElement, size, elementRef, headerDirection));
      useSizeStore(dataElement, size, elementRef, headerDirection);
      React.useLayoutEffect.mock.calls[0][0]();

      expect(sizeManager[dataElement].sizeToWidth).toEqual({ '0': 0 });
      expect(sizeManager[dataElement].sizeToHeight).toEqual({ '0': 0 });
    });

    test('Stores the size of an element with children in the sizeManager object with a horizontal header', () => {
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

      renderHook(() => useSizeStore(dataElement, size, elementRef, headerDirection));
      useSizeStore(dataElement, size, elementRef, headerDirection);
      React.useLayoutEffect.mock.calls[0][0]();

      expect(sizeManager[dataElement].sizeToWidth).toEqual({ '0': 0 });
      expect(sizeManager[dataElement].sizeToHeight).toEqual({ '0': 0 });
    });
  });

  describe('Tests for getCurrentFreeSpace function', () => {
    test('Returns correct free space for a children element', () => {
      const elementChild = createHTMLElement('div', 40, 32);
      const headerDirection = DIRECTION.ROW;
      const freeSpace = getCurrentFreeSpace(headerDirection, elementChild, true);
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
      const freeSpace = getCurrentFreeSpace(headerDirection, element);
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
      const freeSpace = getCurrentFreeSpace(headerDirection, element, true);
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
      const freeSpace = getCurrentFreeSpace(headerDirection, element, true);
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
        grow: jest.fn()
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

      const returnFunction = findItemToResize(items, freeSpace, headerDirection, parentDataElement, parentDomElement);
      expect(typeof returnFunction).toBe('function');
      returnFunction();
      expect(sizeManager['modularHeaderGroupedItems'].shrink).toBeCalled();
      const newFreeSpace = getCurrentFreeSpace(headerDirection, parentDomElement);
      expect(newFreeSpace).toBe(10);
    });

    test('should call the GROW method of a grouped item if the free space is positive', () => {
      const freeSpace = 100;
      const parentDataElement = 'default-top-header';
      const parentDomElement = createHTMLElement('div', 260, 50, { dataElement: parentDataElement });
      const modularHeaderGroupedItemsDom = createHTMLElement('div', 150, 32, { dataElement: 'modularHeaderGroupedItems' });
      parentDomElement.appendChild(modularHeaderGroupedItemsDom);

      const returnFunction = findItemToResize(items, freeSpace, headerDirection, parentDataElement, parentDomElement);
      expect(typeof returnFunction).toBe('function');
      returnFunction();
      expect(sizeManager[parentDataElement].grow).toBeCalled();
    });
  });
});
