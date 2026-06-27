
import * as getRootNodeModule from './getRootNode';
import { getFlyoutPositionOnElement, isToggleScrolledOutOfAncestor } from './flyoutHelper';


describe('FlyoutPosition', () => {
  const flyoutRef = {
    current: {
      clientWidth: 200,
      clientHeight: 200
    }
  };

  const mockGetRootNodeModule = (boundingRect, closestId) => {
    jest.spyOn(getRootNodeModule, 'default').mockImplementation(() => ({
      getElementById: jest.fn(() => ({
        getBoundingClientRect: jest.fn(() => ({
          left: 350,
          right: 750,
          top: 50,
          bottom: 450,
          width: 400,
          height: 400
        }))
      })),
      querySelector: jest.fn(() => ({
        getBoundingClientRect: () => boundingRect,
        closest: () => document.getElementById(closestId),
      })),
    }));
  };

  const addHeader = (headerReference, rect) => {
    const modularHeader = document.createElement('div');
    modularHeader.id = headerReference;
    modularHeader.classList.add(headerReference);
    modularHeader.classList.add('ModularHeader');
    modularHeader.style.width = `${rect.width}px`;
    modularHeader.style.height = `${rect.height}px`;
    modularHeader.style.top = `${rect.top}px`;
    modularHeader.style.bottom = `${rect.bottom}px`;
    modularHeader.style.left = `${rect.left}px`;
    modularHeader.style.right = `${rect.right}px`;
    modularHeader.style.position = 'absolute';

    const container = document.getElementById('app');
    container.appendChild(modularHeader);
  };

  beforeEach(() => {
    addHeader('TopHeader', { width: 400, height: 40, top: 50, bottom: 90 });
    addHeader('BottomHeader', { width: 400, height: 40, top: 410, bottom: 450 });
    addHeader('LeftHeader', { width: 40, height: 400, top: 50, bottom: 450, left: 350, right: 390 });
    addHeader('RightHeader', { width: 40, height: 400, top: 50, bottom: 450, left: 710, right: 750 });
  });

  const scenarios = [
    {
      describeLabel: 'should return the correct position of the flyout when the toggle button is on the TOP header',
      tests: [
        {
          itLabel: 'Scenario 1',
          boundingRect: { left: 370, right: 410, top: 60, bottom: 100, width: 40, height: 40 },
          closestId: 'TopHeader',
          // In this case, the X should be the same as the left of the reference element - container left
          expectedX: 20,
          // the Y should be the same as the top of the reference element - container top + the height of the reference element + the default offset of 6
          expectedY: 56,
        },
        {
          itLabel: 'Scenario 2',
          boundingRect: { left: 600, right: 640, top: 60, bottom: 100, width: 40, height: 40 },
          closestId: 'TopHeader',
          // In this case, the reference element is on the right side of the container,
          // so the X should be the same as the right of the reference element - the width of the flyout - the left offset
          expectedX: 90,
          // the Y should be the same as the top of the reference element - container top + the height of the reference element + the default offset
          expectedY: 56,
        }
      ],
    },
    {
      describeLabel: 'should return the correct position of the flyout when the toggle button is on the BOTTOM header',
      tests: [
        {
          itLabel: 'Scenario 1',
          boundingRect: { left: 370, right: 410, top: 410, bottom: 450, width: 40, height: 40 },
          closestId: 'BottomHeader',
          // In this case, the X should be the same as the left of the reference element - container left
          expectedX: 20,
          // the Y should be the same as the top of the reference element - container top - the height of the flyout - the default offset
          expectedY: 154,
        },
        {
          itLabel: 'Scenario 2',
          boundingRect: { left: 600, right: 640, top: 410, bottom: 450, width: 40, height: 40 },
          closestId: 'BottomHeader',
          // In this case, the reference element is on the right side of the container,
          // so the X should be the same as the right of the reference element - the width of the flyout - the left offset
          expectedX: 90,
          // the Y should be the same as the top of the reference element - container top - the height of the flyout - the default offset
          expectedY: 154,
        }
      ],
    },
    {
      describeLabel: 'should return the correct position of the flyout when the toggle button is on the LEFT header',
      tests: [
        {
          itLabel: 'Scenario 1',
          boundingRect: { left: 360, right: 400, top: 60, bottom: 100, width: 40, height: 40 },
          closestId: 'LeftHeader',
          // In this case, the X should be the same as the left of the reference element - container left + the width of the reference element + the default offset
          expectedX: 56,
          // the Y should be the same as the top of the reference element - container top
          expectedY: 10,
        },
        {
          itLabel: 'Scenario 2',
          boundingRect: { left: 360, right: 400, top: 360, bottom: 400, width: 40, height: 40 },
          closestId: 'LeftHeader',
          // In this case, the X should be the same as the left of the reference element - container left + the width of the reference element + the default offset
          expectedX: 56,
          // the Y should be the bottom of the reference element - the height of the flyout - container top (app-relative)
          expectedY: 150,
        }
      ],
    },
    {
      describeLabel: 'should return the correct position of the flyout when the toggle button is on the RIGHT header',
      tests: [
        {
          itLabel: 'Scenario 1',
          boundingRect: { left: 710, right: 750, top: 60, bottom: 100, width: 40, height: 40 },
          closestId: 'RightHeader',
          // In this case, the X should be the same as the left of the reference element - container left - the width of the flyout - the default offset
          expectedX: 154,
          // the Y should be the same as the top of the reference element - container top
          expectedY: 10,
        },
        {
          itLabel: 'Scenario 2',
          boundingRect: { left: 710, right: 750, top: 360, bottom: 400, width: 40, height: 40 },
          closestId: 'RightHeader',
          // In this case, the X should be the same as the left of the reference element - container left - the width of the flyout - the default offset
          expectedX: 154,
          // the Y should be the bottom of the reference element - the height of the flyout - container top (app-relative)
          expectedY: 150,
        }
      ],
    },
    {
      describeLabel: 'should return the correct position of the flyout when the toggle button is not on a header',
      tests: [
        {
          itLabel: 'Scenario 1',
          boundingRect: { left: 710, right: 750, top: 60, bottom: 100, width: 40, height: 40 },
          closestId: null,
          // In this case, the X should be the same as the left of the reference element - container left - left offset
          expectedX: 200,
          // the Y should be the same as the top of the reference element - container top + the height of the reference element + the default offset
          expectedY: 56
        },
        {
          itLabel: 'Scenario 2',
          boundingRect: { left: 710, right: 750, top: 360, bottom: 400, width: 40, height: 40 },
          closestId: null,
          // In this case, the X should be the same as the left of the reference element - container left - left offset
          expectedX: 200,
          // the Y should be top of the reference element - the height of the flyout - default offset - container top (app-relative)
          expectedY: 104,
        }
      ]
    }
  ];


  scenarios.forEach((scenario) => {
    describe(scenario.describeLabel, () => {
      scenario.tests.forEach((test) => {
        it(test.itLabel, () => {
          mockGetRootNodeModule(test.boundingRect, test.closestId);
          const position = getFlyoutPositionOnElement('testSelector', flyoutRef);
          expect(position.x).toEqual(test.expectedX);
          expect(position.y).toEqual(test.expectedY);
        });
      });
    });
  });
});

describe('isToggleScrolledOutOfAncestor', () => {
  const testCases = [
    {
      description: 'returns false when scrolledTarget is null',
      toggle: {
        getBoundingClientRect: () => ({ top: 100, bottom: 150, left: 100, right: 150 }),
      },
      scrolledTarget: null,
      expected: false,
    },
    {
      description: 'returns false when scrolledTarget is not an element',
      toggle: {
        getBoundingClientRect: () => ({ top: 100, bottom: 150, left: 100, right: 150 }),
      },
      scrolledTarget: {},
      expected: false,
    },
    {
      description: 'returns false when scrolledTarget.nodeType is less than 1',
      toggle: {
        getBoundingClientRect: () => ({ top: 100, bottom: 150, left: 100, right: 150 }),
      },
      scrolledTarget: {
        nodeType: 0,
      },
      expected: false,
    },
    {
      description: 'returns false when scrolledTarget.nodeType is greater than 1',
      toggle: {
        getBoundingClientRect: () => ({ top: 100, bottom: 150, left: 100, right: 150 }),
      },
      scrolledTarget: {
        nodeType: 2,
      },
      expected: false,
    },
    {
      description: 'returns false when scrolledTarget does not contain toggle',
      toggle: {
        getBoundingClientRect: () => ({ top: 100, bottom: 150, left: 100, right: 150 }),
      },
      scrolledTarget: {
        nodeType: 1,
        contains: () => false,
        getBoundingClientRect: () => ({ top: 50, bottom: 200, left: 50, right: 200 }),
      },
      expected: false,
    },
    {
      description: 'returns false when toggle is not clipped by scrolledTarget',
      toggle: {
        getBoundingClientRect: () => ({ top: 80, bottom: 150, left: 100, right: 150 }),
      },
      scrolledTarget: {
        nodeType: 1,
        contains: () => true,
        getBoundingClientRect: () => ({ top: 50, bottom: 90, left: 50, right: 200 }),
      },
      expected: false,
    },
    {
      description: 'returns true when only toggle bottom is clipped by scrolledTarget',
      toggle: {
        getBoundingClientRect: () => ({ top: 100, bottom: 150, left: 100, right: 150 }),
      },
      scrolledTarget: {
        nodeType: 1,
        contains: () => true,
        getBoundingClientRect: () => ({ top: 160, bottom: 200, left: 50, right: 200 }),
      },
      expected: true,
    },
    {
      description: 'returns true when only toggle top is clipped by scrolledTarget',
      toggle: {
        getBoundingClientRect: () => ({ top: 100, bottom: 150, left: 100, right: 150 }),
      },
      scrolledTarget: {
        nodeType: 1,
        contains: () => true,
        getBoundingClientRect: () => ({ top: 50, bottom: 90, left: 50, right: 200 }),
      },
      expected: true,
    },
    {
      description: 'returns true when only toggle right is clipped by scrolledTarget',
      toggle: {
        getBoundingClientRect: () => ({ top: 100, bottom: 150, left: 100, right: 100 }),
      },
      scrolledTarget: {
        nodeType: 1,
        contains: () => true,
        getBoundingClientRect: () => ({ top: 50, bottom: 200, left: 120, right: 200 }),
      },
      expected: true,
    },
    {
      description: 'returns true when only toggle left is clipped by scrolledTarget',
      toggle: {
        getBoundingClientRect: () => ({ top: 100, bottom: 150, left: 100, right: 150 }),
      },
      scrolledTarget: {
        nodeType: 1,
        contains: () => true,
        getBoundingClientRect: () => ({ top: 50, bottom: 200, left: 0, right: 90 }),
      },
      expected: true,
    },
    {
      description: 'returns true when toggle bottom exactly meets scrolledTarget top',
      toggle: { getBoundingClientRect: () => ({ top: 50, bottom: 100, left: 100, right: 150 }) },
      scrolledTarget: {
        nodeType: 1,
        contains: () => true,
        getBoundingClientRect: () => ({ top: 100, bottom: 200, left: 50, right: 200 }),
      },
      expected: true,
    },
    {
      description: 'returns true when toggle top exactly meets scrolledTarget bottom',
      toggle: { getBoundingClientRect: () => ({ top: 100, bottom: 150, left: 100, right: 150 }) },
      scrolledTarget: {
        nodeType: 1,
        contains: () => true,
        getBoundingClientRect: () => ({ top: 50, bottom: 100, left: 50, right: 200 }),
      },
      expected: true,
    },
    {
      description: 'returns true when toggle right exactly meets scrolledTarget left',
      toggle: { getBoundingClientRect: () => ({ top: 100, bottom: 150, left: 50, right: 100 }) },
      scrolledTarget: {
        nodeType: 1,
        contains: () => true,
        getBoundingClientRect: () => ({ top: 50, bottom: 200, left: 100, right: 200 }),
      },
      expected: true,
    },
    {
      description: 'returns true when toggle left exactly meets scrolledTarget right',
      toggle: { getBoundingClientRect: () => ({ top: 100, bottom: 150, left: 100, right: 150 }) },
      scrolledTarget: {
        nodeType: 1,
        contains: () => true,
        getBoundingClientRect: () => ({ top: 50, bottom: 200, left: 0, right: 100 }),
      },
      expected: true,
    },
  ];

  testCases.forEach(({ description, toggle, scrolledTarget, expected }) => {
    it(description, () => {
      expect(isToggleScrolledOutOfAncestor(toggle, scrolledTarget)).toBe(expected);
    });
  });
});