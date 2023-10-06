import { getFlyoutPositionOnElement } from './flyoutHelper';

jest.mock('./getRootNode', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    getElementById: jest.fn(() => ({
      getBoundingClientRect: jest.fn(() => ({
        left: 0,
        right: 400,
        top: 0,
        bottom: 400,
        width: 400,
        height: 400
      }))
    }))
  }))

}));

describe('FlyoutPosition', () => {
  let flyoutRef;

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
    addHeader('TopHeader', { width: 400, height: 40, top: 0, bottom: 40 });
    addHeader('BottomHeader', { width: 400, height: 40, top: 360, bottom: 400 });
    addHeader('LeftHeader', { width: 40, height: 400, top: 0, bottom: 400, left: 0, right: 40 });
    addHeader('RightHeader', { width: 40, height: 400, top: 0, bottom: 400, left: 360, right: 400 });

    flyoutRef = {
      current: {
        clientWidth: 200,
        clientHeight: 200
      }
    };
  });

  it('should return the correct position of the flyout when the toggle button is on the TOP header', () => {
    // Ref element placed on the left of the top header
    const refElement = {
      getBoundingClientRect: () => {
        return {
          left: 20,
          right: 60,
          top: 10,
          bottom: 50,
          width: 40,
          height: 40
        };
      },
      closest: () => {
        return document.getElementById('TopHeader');
      }
    };

    const position = getFlyoutPositionOnElement(refElement, flyoutRef);

    // In this case, the X should be the same as the left of the reference element
    // expect(position.x).to.equal(20);
    expect(position.x).toEqual(20);
    // the Y should be the same as the top of the reference element + the height of the reference element + the default offset
    expect(position.y).toEqual(56);

    // Ref element placed on the left of the top header
    const refElement2 = {
      getBoundingClientRect: () => {
        return {
          left: 250,
          right: 290,
          top: 10,
          bottom: 50,
          width: 40,
          height: 40
        };
      },
      closest: () => {
        return document.getElementById('TopHeader');
      }
    };

    // In this case, the reference element is on the right side of the container,
    // so the X should be the same as the right of the reference element - the width of the flyout
    const position2 = getFlyoutPositionOnElement(refElement2, flyoutRef);
    expect(position2.x).toEqual(90);
    // the Y should be the same as the top of the reference element + the height of the reference element + the default offset
    expect(position2.y).toEqual(56);
  });

  it('should return the correct position of the flyout when the toggle button is on the BOTTOM header', () => {
    // Ref element is placed on the left of the bottom header
    const refElement = {
      getBoundingClientRect: () => {
        return {
          left: 20,
          right: 60,
          top: 360,
          bottom: 400,
          width: 40,
          height: 40
        };
      },
      closest: () => {
        return document.getElementById('BottomHeader');
      }
    };

    const position = getFlyoutPositionOnElement(refElement, flyoutRef);

    // In this case, the X should be the same as the left of the reference element
    expect(position.x).toEqual(20);
    // the Y should be the same as the top of the reference element - the height of the flyout - the default offset
    expect(position.y).toEqual(154);

    // Ref element is placed on the right of the bottom header
    const refElement2 = {
      getBoundingClientRect: () => {
        return {
          left: 250,
          right: 290,
          top: 360,
          bottom: 400,
          width: 40,
          height: 40
        };
      },
      closest: () => {
        return document.getElementById('BottomHeader');
      }
    };

    // In this case, the reference element is on the right side of the container,
    // so the X should be the same as the right of the reference element - the width of the flyout
    const position2 = getFlyoutPositionOnElement(refElement2, flyoutRef);
    expect(position2.x).toEqual(90);
    // the Y should be the same as the top of the reference element - the height of the flyout - the default offset
    expect(position2.y).toEqual(154);
  });

  it('should return the correct position of the flyout when the toggle button is on the LEFT header', () => {
    // Ref element is placed on the top of the left header
    const refElement = {
      getBoundingClientRect: () => {
        return {
          left: 10,
          right: 50,
          top: 60,
          bottom: 100,
          width: 40,
          height: 40
        };
      },
      closest: () => {
        return document.getElementById('LeftHeader');
      }
    };

    const position = getFlyoutPositionOnElement(refElement, flyoutRef);

    // In this case, the X should be the same as the left of the reference element + the width of the reference element + the default offset
    expect(position.x).toEqual(56);
    // the Y should be the same as the top of the reference element
    expect(position.y).toEqual(60);

    // Ref element is placed on the bottom of the left header
    const refElement2 = {
      getBoundingClientRect: () => {
        return {
          left: 10,
          right: 50,
          top: 360,
          bottom: 400,
          width: 40,
          height: 40
        };
      },
      closest: () => {
        return document.getElementById('LeftHeader');
      }
    };

    const position2 = getFlyoutPositionOnElement(refElement2, flyoutRef);
    // In this case, the X should be the same as the left of the reference element + the width of the reference element + the default offset
    expect(position2.x).toEqual(56);
    // the Y should be the same as the top of the reference element
    expect(position2.y).toEqual(200);
  });

  it('should return the correct position of the flyout when the toggle button is on the RIGHT header', () => {
    // Ref element is placed on the top of the right header
    const refElement = {
      getBoundingClientRect: () => {
        return {
          left: 360,
          right: 400,
          top: 60,
          bottom: 100,
          width: 40,
          height: 40
        };
      },
      closest: () => {
        return document.getElementById('RightHeader');
      }
    };

    const position = getFlyoutPositionOnElement(refElement, flyoutRef);

    // In this case, the X should be the same as the left of the reference element - the width of the flyout - the default offset
    expect(position.x).toEqual(154);
    // the Y should be the same as the top of the reference element
    expect(position.y).toEqual(60);

    // Ref element is placed on the bottom of the right header
    const refElement2 = {
      getBoundingClientRect: () => {
        return {
          left: 360,
          right: 400,
          top: 360,
          bottom: 400,
          width: 40,
          height: 40
        };
      },
      closest: () => {
        return document.getElementById('RightHeader');
      }
    };

    const position2 = getFlyoutPositionOnElement(refElement2, flyoutRef);
    // In this case, the X should be the same as the left of the reference element - the width of the flyout - the default offset
    expect(position2.x).toEqual(154);
    // the Y should be bottom of the reference element - the height of the flyout
    expect(position2.y).toEqual(200);
  });
});