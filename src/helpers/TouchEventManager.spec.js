import core from 'core';
import defaultTouchEventManager, { createTouchEventManager } from './TouchEventManager';

jest.mock('core');
jest.mock('./localStorageManager', () => ({
  getItemSynchronous: jest.fn(() => null),
}));

function makeContainer(overrides = {}) {
  return {
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    scrollLeft: 0,
    scrollTop: 0,
    offsetLeft: 0,
    offsetTop: 0,
    clientWidth: 800,
    clientHeight: 600,
    getBoundingClientRect: jest.fn(() => ({ left: 0, top: 0 })),
    ...overrides,
  };
}

function makeDocument(overrides = {}) {
  return {
    offsetLeft: 0,
    offsetTop: 0,
    clientWidth: 400,
    clientHeight: 500,
    style: {},
    ...overrides,
  };
}

describe('createTouchEventManager', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns an object with initialize and terminate methods', () => {
    const manager = createTouchEventManager();
    expect(typeof manager.initialize).toBe('function');
    expect(typeof manager.terminate).toBe('function');
  });

  it('creates a new independent object each call', () => {
    const m1 = createTouchEventManager();
    const m2 = createTouchEventManager();
    expect(m1).not.toBe(m2);
  });

  it('two instances do not share mutable state after initialize', () => {
    const m1 = createTouchEventManager();
    const m2 = createTouchEventManager();

    m1.initialize(makeDocument(), makeContainer(), 1);
    m2.initialize(makeDocument(), makeContainer(), 2);

    expect(m1.documentViewerKey).toBe(1);
    expect(m2.documentViewerKey).toBe(2);

    m1.documentViewerKey = 99;
    expect(m2.documentViewerKey).toBe(2);
  });

  it('default export and createTouchEventManager instances are independent', () => {
    const created = createTouchEventManager();
    created.initialize(makeDocument(), makeContainer(), 3);
    expect(defaultTouchEventManager).not.toBe(created);
  });

  it('keeps the pinch zoom focus independent of the viewer position on the page', () => {
    const container = makeContainer({
      scrollLeft: 20,
      scrollTop: 30,
      offsetLeft: 100,
      offsetTop: 50,
      getBoundingClientRect: jest.fn(() => ({ left: 340, top: 210 })),
    });
    const document = makeDocument({
      offsetLeft: 150,
      offsetTop: 80,
    });
    const documentViewer = {
      isStylusModeEnabled: jest.fn(() => false),
      getScrollViewElement: jest.fn(() => container),
      getDisplayModeManager: jest.fn(() => ({
        getDisplayMode: jest.fn(() => ({
          getScale: jest.fn(() => ({ scaleX: 1, scaleY: 1 })),
        })),
      })),
    };
    core.getToolMode.mockReturnValue({ name: 'Pan' });
    core.getDocumentViewer.mockReturnValue(documentViewer);
    core.getZoom.mockReturnValue(1);
    jest.spyOn(window, 'getComputedStyle').mockReturnValue({ marginTop: '0' });

    const manager = createTouchEventManager();
    manager.initialize(document, container);
    manager.handleTouchStart({
      cancelable: true,
      preventDefault: jest.fn(),
      touches: [
        { clientX: 590, clientY: 460 },
        { clientX: 690, clientY: 560 },
      ],
    });
    manager.touch.type = 'pinch';
    manager.touch.scale = 1.5;

    manager.handleTouchEnd({});

    expect(core.zoomTo).toHaveBeenCalledWith(1.5, 105, 150, 1);
  });
});
