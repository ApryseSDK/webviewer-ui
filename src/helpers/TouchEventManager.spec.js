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

  it('only suppresses touch interaction while the pen session is active', () => {
    const manager = createTouchEventManager();
    manager.documentViewerKey = 1;
    const isPenPointerDown = jest.fn(() => true);
    core.getDocumentViewer.mockReturnValue({ isPenPointerDown });

    expect(manager.isPenInputActive()).toBe(true);

    isPenPointerDown.mockReturnValue(false);
    expect(manager.isPenInputActive()).toBe(false);
  });

  describe('while a pen owns the input', () => {
    let manager;

    beforeEach(() => {
      manager = createTouchEventManager();
      manager.initialize(makeDocument(), makeContainer({ scrollTo: jest.fn() }), 1);
      core.getToolMode.mockReturnValue({ name: 'AnnotationCreateFreeHand' });
      core.getDocumentViewer.mockReturnValue({ isPenPointerDown: () => true, isStylusModeEnabled: () => false });
      manager.touch.type = 'Tap';
      manager.touch.touchMoveCount = 5;
      manager.touch.stopMomentumScroll = false;
      manager.horziontalLock = true;
      manager.verticalLock = true;
      manager.verticalMomentum = 3;
      manager.horziontalMomentum = 4;
    });

    const expectTouchStateReset = () => {
      expect(manager.touch.type).toBe('');
      expect(manager.touch.touchMoveCount).toBe(0);
      expect(manager.touch.stopMomentumScroll).toBe(true);
      expect(manager.horziontalLock).toBe(false);
      expect(manager.verticalLock).toBe(false);
      expect(manager.verticalMomentum).toBe(0);
      expect(manager.horziontalMomentum).toBe(0);
    };

    it('ignores touch start from a resting palm and clears gesture state', () => {
      manager.handleTouchStart({ touches: [{ clientX: 1, clientY: 1 }] });
      expectTouchStateReset();
      expect(manager.container.scrollTo).not.toHaveBeenCalled();
    });

    it('cancels touch move so the page does not scroll, and clears gesture state', () => {
      const e = { cancelable: true, preventDefault: jest.fn(), touches: [{ clientX: 1, clientY: 1 }] };
      manager.handleTouchMove(e);
      expect(e.preventDefault).toHaveBeenCalled();
      expectTouchStateReset();
    });

    it('does not call preventDefault on a non-cancelable touch move', () => {
      const e = { cancelable: false, preventDefault: jest.fn(), touches: [{ clientX: 1, clientY: 1 }] };
      manager.handleTouchMove(e);
      expect(e.preventDefault).not.toHaveBeenCalled();
      expectTouchStateReset();
    });

    it('clears gesture state on touch end without starting a tap or momentum scroll', () => {
      jest.useFakeTimers();
      manager.handleTouchEnd({ touches: [], changedTouches: [{ clientX: 1, clientY: 1 }] });
      expectTouchStateReset();
      expect(jest.getTimerCount()).toBe(0);
      jest.useRealTimers();
    });

    it('clears gesture state on touch cancel', () => {
      manager.handleTouchCancel({ touches: [], changedTouches: [] });
      expectTouchStateReset();
    });
  });

  it('does not treat touches as pen input when no document viewer is available', () => {
    const manager = createTouchEventManager();
    manager.documentViewerKey = 1;
    core.getDocumentViewer.mockReturnValue(undefined);
    expect(manager.isPenInputActive()).toBe(false);
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

  describe('axis lock during touch scroll', () => {
    const setup = (toolMode) => {
      const container = makeContainer({ scrollTo: jest.fn(), scrollLeft: 300, scrollTop: 900 });
      core.getToolMode.mockReturnValue(toolMode);
      const manager = createTouchEventManager();
      manager.initialize(makeDocument(), container, 1);
      manager.startingScrollLeft = 100;
      manager.startingScrollTop = 200;
      manager.touch = { clientX: 0, clientY: 0, touchMoveCount: 10 };
      return { manager, container };
    };

    it('does not reset the locked axis while an annotation is being dragged', () => {
      const { manager, container } = setup({ isSelecting: () => true });
      manager.verticalLock = true;
      manager.horziontalLock = true;

      manager.handleScroll({ clientX: 5, clientY: 5 });

      expect(container.scrollTo).not.toHaveBeenCalled();
    });

    it('resets the locked axis to the touch start position when not dragging an annotation', () => {
      const { manager, container } = setup({ isSelecting: () => false });
      manager.verticalLock = true;

      manager.handleScroll({ clientX: 5, clientY: 5 });

      expect(container.scrollTo).toHaveBeenCalledWith(100, 900);
    });
  });

  describe('spreadsheet editor documents', () => {
    const twoFingers = [
      { clientX: 100, clientY: 100 },
      { clientX: 200, clientY: 200 },
    ];
    const makeEvent = (touches) => ({ cancelable: true, preventDefault: jest.fn(), touches });

    const setup = (documentType) => {
      core.getDocument.mockReturnValue({ getType: () => documentType });
      core.getToolMode.mockReturnValue({ name: 'Pan' });
      core.getZoom.mockReturnValue(1);
      core.getDocumentViewer.mockReturnValue({
        isStylusModeEnabled: jest.fn(() => false),
        getScrollViewElement: jest.fn(() => makeContainer()),
        getDisplayModeManager: jest.fn(() => ({
          getDisplayMode: jest.fn(() => ({ getScale: jest.fn(() => ({ scaleX: 1, scaleY: 1 })) })),
        })),
      });
      jest.spyOn(window, 'getComputedStyle').mockReturnValue({ marginTop: '0' });

      const manager = createTouchEventManager();
      manager.initialize(makeDocument(), makeContainer());
      return manager;
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('does not handle touches, which are left to the spreadsheet editor', () => {
      const manager = setup('spreadsheetEditor');
      const event = makeEvent(twoFingers);

      manager.handleTouchStart(event);
      manager.handleTouchMove(event);
      manager.handleTouchEnd(event);

      expect(event.preventDefault).not.toHaveBeenCalled();
      expect(manager.touch.type).toBe('');
      expect(core.zoomTo).not.toHaveBeenCalled();
    });

    it('still handles touches for other documents', () => {
      const manager = setup('pdf');
      const event = makeEvent(twoFingers);

      manager.handleTouchStart(event);

      expect(event.preventDefault).toHaveBeenCalled();
      expect(manager.touch.distance).toBeGreaterThan(0);
    });
  });
});
