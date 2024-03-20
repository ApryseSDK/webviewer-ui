
import * as getRootNodeModule from './getRootNode';
import { getFlyoutPositionOnElement } from './flyoutHelper';


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
          // so the X should be the same as the right of the reference element - the width of the flyout
          expectedX: 440,
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
          // so the X should be the same as the right of the reference element - the width of the flyout
          expectedX: 440,
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
          // the Y should be the same as the top of the reference element
          expectedY: 200,
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
          // the Y should be bottom of the reference element - the height of the flyout
          expectedY: 200,
        }
      ],
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