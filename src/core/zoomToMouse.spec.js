import core from 'core';
import getZoomToMouseOffsets from 'helpers/getZoomToMouseOffsets';
import zoomToMouse from './zoomToMouse';

jest.mock('core', () => ({
  getDocumentViewer: jest.fn(),
}));

const createDocumentViewer = ({
  rect = { left: 0, top: 0 },
  scale = { scaleX: 1, scaleY: 1 },
} = {}) => ({
  getScrollViewElement: jest.fn(() => ({
    getBoundingClientRect: jest.fn(() => rect),
  })),
  getDisplayModeManager: jest.fn(() => ({
    getDisplayMode: jest.fn(() => ({
      getScale: jest.fn(() => scale),
    })),
  })),
  zoomToMouse: jest.fn(),
});

describe('getZoomToMouseOffsets', () => {
  it('uses the scroll view position instead of offsets inferred from surrounding UI elements', () => {
    const documentViewer = createDocumentViewer({
      rect: { left: 240, top: 360 },
    });
    const mouseEvent = {
      clientX: 640,
      clientY: 660,
      pageX: 640,
      pageY: 660,
    };

    expect(getZoomToMouseOffsets(documentViewer, mouseEvent)).toEqual({
      xOffset: 240,
      yOffset: 360,
    });
  });

  it('accounts for outer page scrolling', () => {
    const documentViewer = createDocumentViewer({
      rect: { left: 100, top: 150 },
    });
    const mouseEvent = {
      clientX: 500,
      clientY: 450,
      pageX: 525,
      pageY: 750,
    };

    expect(getZoomToMouseOffsets(documentViewer, mouseEvent)).toEqual({
      xOffset: 125,
      yOffset: 450,
    });
  });

  it('converts the mouse position to the display mode logical coordinate space', () => {
    const documentViewer = createDocumentViewer({
      rect: { left: 100, top: 200 },
      scale: { scaleX: 0.5, scaleY: 2 },
    });
    const mouseEvent = {
      clientX: 300,
      clientY: 600,
      pageX: 300,
      pageY: 600,
    };

    expect(getZoomToMouseOffsets(documentViewer, mouseEvent)).toEqual({
      xOffset: -100,
      yOffset: 400,
    });
  });
});

describe('zoomToMouse', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('zooms the requested document viewer with its calculated offsets', () => {
    const documentViewer = createDocumentViewer({
      rect: { left: 240, top: 360 },
    });
    const mouseEvent = {
      clientX: 640,
      clientY: 660,
      pageX: 640,
      pageY: 660,
    };
    core.getDocumentViewer.mockReturnValue(documentViewer);

    zoomToMouse(1.5, 2, mouseEvent);

    expect(core.getDocumentViewer).toHaveBeenCalledWith(2);
    expect(documentViewer.zoomToMouse).toHaveBeenCalledWith(1.5, 240, 360, mouseEvent);
  });
});