import { renderHook, act } from '@testing-library/react-hooks';
import { useSelector, useStore } from 'react-redux';
import core from 'core';
import actions from 'actions';
import multiViewerHelper, { useMultiViewerSync, setIsScrolledByClickingChangeItem } from './multiViewerHelper';
import { zoomTo } from 'helpers/zoom';

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useStore: jest.fn(),
}));

jest.mock('core');

jest.mock('actions', () => ({
  __esModule: true,
  default: {
    setSyncViewer: jest.fn((syncViewer) => ({
      type: 'SET_SYNC_VIEWER',
      payload: { syncViewer },
    })),
  },
}));

jest.mock('selectors', () => ({
  __esModule: true,
  default: {
    getCustomMultiViewerSyncHandler: (state) => state.customMultiViewerSyncHandler,
    getSyncViewer: (state) => state.syncViewer,
    getMultiViewerSyncScrollMode: (state) => state.multiViewerSyncScrollMode,
    isMultiViewerMode: (state) => state.isMultiViewerMode,
    isDocumentLoaded: (state, documentViewerKey) => !!state.documentLoadedMap[documentViewerKey],
  },
}));

jest.mock('helpers/documentViewerHelper', () => ({
  addDocumentViewer: jest.fn(),
  setupOpenURLHandler: jest.fn(),
  syncDocumentViewers: jest.fn(),
  removeDocumentViewer: jest.fn(),
}));
jest.mock('helpers/eventHandler', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    addEventHandlers: jest.fn(),
    removeEventHandlers: jest.fn(),
  })),
}));
jest.mock('helpers/zoom', () => ({ zoomTo: jest.fn() }));
jest.mock('helpers/fireEvent', () => jest.fn());
jest.mock('hooks/useCore/useCore', () => ({ createWrappedCore: jest.fn() }));
jest.mock('components/MultiViewer/ComparisonButton', () => ({ __esModule: true, default: jest.fn(() => null) }));
jest.mock('constants/dataElement', () => ({}));
jest.mock('constants/defaultTool', () => ({ __esModule: true, default: 'AnnotationEdit' }));
jest.mock('constants/events', () => ({ __esModule: true, default: { MULTI_VIEWER_READY: 'MULTI_VIEWER_READY' } }));
jest.mock('constants/multiViewerContants', () => ({
  SYNC_MODES: { SYNC: 'SYNC', SKIP_UNMATCHED: 'SKIP_UNMATCHED' },
  DISABLED_TOOL_GROUPS: [],
  DISABLED_TOOLS_KEYWORDS: [],
}));

const createContainerRef = (overrides = {}) => ({
  current: {
    scrollTop: 0,
    scrollLeft: 0,
    scrollWidth: 1000,
    scrollHeight: 2000,
    clientWidth: 500,
    clientHeight: 600,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    ...overrides,
  },
});

function createMockDocumentViewer({ isContinuous = true, visiblePages = [1], viewerElement = null } = {}) {
  const defaultViewerElement = { querySelector: jest.fn(() => null) };
  return {
    getDisplayModeManager: jest.fn(() => ({
      getDisplayMode: jest.fn(() => ({
        isContinuous: jest.fn(() => isContinuous),
        getVisiblePages: jest.fn(() => visiblePages),
      })),
    })),
    getViewerElement: jest.fn(() => viewerElement || defaultViewerElement),
  };
}

describe('useMultiViewerSync', () => {
  let mockState;
  let mockStore;
  let coreEventListeners;
  let scrollListeners;

  function setupCoreMocks(docViewer1, docViewer2) {
    core.getDocumentViewers.mockReturnValue([docViewer1, docViewer2]);
    core.getDocumentViewer.mockImplementation((key) => {
      if (key === 1) {
        return docViewer1;
      }
      if (key === 2) {
        return docViewer2;
      }
      return docViewer1;
    });
    core.getDocument.mockImplementation((key) =>
      mockState.documentLoadedMap[key] ? {} : null
    );
    core.getZoom.mockReturnValue(1);
    core.getCurrentPage.mockReturnValue(1);

    coreEventListeners = {};
    core.addEventListener = jest.fn((eventName, handler, _opts, docViewerKey) => {
      const key = `${eventName}_${docViewerKey || 'default'}`;
      if (!coreEventListeners[key]) {
        coreEventListeners[key] = [];
      }
      coreEventListeners[key].push(handler);
    });
    core.removeEventListener = jest.fn();
  }

  function trackScrollListeners(containerRef, container2Ref) {
    scrollListeners = { 1: [], 2: [] };
    containerRef.current.addEventListener.mockImplementation((eventName, handler) => {
      if (eventName === 'scroll') {
        scrollListeners[1].push(handler);
      }
    });
    container2Ref.current.addEventListener.mockImplementation((eventName, handler) => {
      if (eventName === 'scroll') {
        scrollListeners[2].push(handler);
      }
    });
  }

  function fireScrollEvent(containerKey, containerRef, { scrollTop = 0, scrollLeft = 0 } = {}) {
    const container = containerRef.current;
    container.scrollTop = scrollTop;
    container.scrollLeft = scrollLeft;
    scrollListeners[containerKey].forEach((h) => h({ target: container }));
  }

  function fireCoreEvent(eventName, documentViewerKey, ...args) {
    coreEventListeners[`${eventName}_${documentViewerKey}`].forEach((h) => h(...args));
  }

  beforeEach(() => {
    jest.clearAllMocks();
    multiViewerHelper.matchedPages = null;
    multiViewerHelper.isScrolledByClickingChangeItem = false;

    mockState = {
      customMultiViewerSyncHandler: null,
      syncViewer: 1,
      multiViewerSyncScrollMode: 'SYNC',
      isMultiViewerMode: true,
      documentLoadedMap: { 1: true, 2: true },
    };

    mockStore = {
      getState: jest.fn(() => mockState),
      dispatch: jest.fn(),
    };

    useStore.mockReturnValue(mockStore);
    useSelector.mockImplementation((selector) => selector(mockState));

    setupCoreMocks(createMockDocumentViewer(), createMockDocumentViewer());
  });

  describe('starting and stopping sync', () => {
    it('reports isSyncing=true when syncViewer is set and both docs are loaded', () => {
      const { result } = renderHook(() =>
        useMultiViewerSync(createContainerRef(), createContainerRef())
      );
      expect(result.current.isSyncing).toBe(true);
    });

    it('does not sync when isMultiViewerMode is false', () => {
      mockState.isMultiViewerMode = false;
      const { result } = renderHook(() =>
        useMultiViewerSync(createContainerRef(), createContainerRef())
      );
      expect(result.current.isSyncing).toBe(false);
    });

    it('clears syncViewer when a document is not loaded', () => {
      mockState.documentLoadedMap[2] = false;
      const { result } = renderHook(() =>
        useMultiViewerSync(createContainerRef(), createContainerRef())
      );
      expect(result.current.isSyncing).toBe(false);
      expect(actions.setSyncViewer).toHaveBeenCalledWith(null);
    });

    it('zooms the non-primary viewer to match the primary on start', () => {
      core.getZoom.mockReturnValue(1.5);
      renderHook(() => useMultiViewerSync(createContainerRef(), createContainerRef()));
      expect(zoomTo).toHaveBeenCalledWith(1.5, true, 2);
    });

    it('zooms viewer 1 when primary is viewer 2', () => {
      mockState.syncViewer = 2;
      core.getZoom.mockReturnValue(2.0);
      renderHook(() => useMultiViewerSync(createContainerRef(), createContainerRef()));
      expect(zoomTo).toHaveBeenCalledWith(2.0, true, 1);
    });

    it('stops syncing and removes all listeners when syncViewer is cleared', () => {
      const c1 = createContainerRef();
      const c2 = createContainerRef();
      const { result, rerender } = renderHook(() => useMultiViewerSync(c1, c2));
      expect(result.current.isSyncing).toBe(true);

      mockState.syncViewer = null;
      rerender();

      expect(result.current.isSyncing).toBe(false);
      expect(core.removeEventListener).toHaveBeenCalledWith('zoomUpdated', expect.any(Function), 1);
      expect(core.removeEventListener).toHaveBeenCalledWith('zoomUpdated', expect.any(Function), 2);
      expect(c1.current.removeEventListener).toHaveBeenCalledWith('scroll', expect.any(Function));
      expect(c2.current.removeEventListener).toHaveBeenCalledWith('scroll', expect.any(Function));
    });

    it('stops syncing and clears syncViewer when a doc is unloaded mid-sync', () => {
      const { result, rerender } = renderHook(() =>
        useMultiViewerSync(createContainerRef(), createContainerRef())
      );
      expect(result.current.isSyncing).toBe(true);

      actions.setSyncViewer.mockClear();
      mockState.documentLoadedMap[2] = false;
      rerender();

      expect(result.current.isSyncing).toBe(false);
      expect(actions.setSyncViewer).toHaveBeenCalledWith(null);
    });

    it('exposes a stopSyncing function that stops sync', () => {
      const { result, rerender } = renderHook(() =>
        useMultiViewerSync(createContainerRef(), createContainerRef())
      );
      mockState.syncViewer = null;
      act(() => {
        result.current.stopSyncing();
        rerender();
      });
      expect(result.current.isSyncing).toBe(false);
    });

    it('invokes customMultiViewerSyncHandler with primary key and handler list', () => {
      const customHandler = jest.fn();
      mockState.customMultiViewerSyncHandler = customHandler;
      renderHook(() => useMultiViewerSync(createContainerRef(), createContainerRef()));
      expect(customHandler).toHaveBeenCalledWith(1, expect.any(Array));
    });

    it('resets both scroll positions in SKIP_UNMATCHED mode when matchedPages exist', () => {
      mockState.multiViewerSyncScrollMode = 'SKIP_UNMATCHED';
      multiViewerHelper.matchedPages = { 1: {}, 2: {} };
      const c1 = createContainerRef({ scrollTop: 500 });
      const c2 = createContainerRef({ scrollTop: 300 });

      renderHook(() => useMultiViewerSync(c1, c2));

      expect(c1.current.scrollTop).toBe(0);
      expect(c2.current.scrollTop).toBe(0);
    });

    it('preserves scroll positions in SYNC mode', () => {
      multiViewerHelper.matchedPages = { 1: {}, 2: {} };
      const c1 = createContainerRef({ scrollTop: 500 });
      const c2 = createContainerRef({ scrollTop: 300 });

      renderHook(() => useMultiViewerSync(c1, c2));

      expect(c1.current.scrollTop).toBe(500);
      expect(c2.current.scrollTop).toBe(300);
    });

    it('attaches pageNumberUpdated listeners only in non-continuous mode', () => {
      setupCoreMocks(
        createMockDocumentViewer({ isContinuous: false }),
        createMockDocumentViewer({ isContinuous: false }),
      );
      renderHook(() => useMultiViewerSync(createContainerRef(), createContainerRef()));

      const pageCalls = core.addEventListener.mock.calls.filter(([e]) => e === 'pageNumberUpdated');
      expect(pageCalls).toHaveLength(2);
    });

  });

  describe('scroll sync – guard conditions', () => {
    it('does not sync scroll when fewer than 2 document viewers exist', () => {
      const c1 = createContainerRef();
      const c2 = createContainerRef();
      trackScrollListeners(c1, c2);
      renderHook(() => useMultiViewerSync(c1, c2));

      core.getDocumentViewers.mockReturnValue([{}]);
      fireScrollEvent(1, c1, { scrollTop: 100 });
      expect(c2.current.scrollTop).toBe(0);
    });

    it('does not sync scroll when a document is null at event time', () => {
      const c1 = createContainerRef();
      const c2 = createContainerRef();
      trackScrollListeners(c1, c2);
      renderHook(() => useMultiViewerSync(c1, c2));

      core.getDocument.mockImplementation((key) => (key === 1 ? null : {}));
      fireScrollEvent(1, c1, { scrollTop: 100 });
      expect(c2.current.scrollTop).toBe(0);
    });

    it('skips sync and resets flag when isScrolledByClickingChangeItem', () => {
      const c1 = createContainerRef();
      const c2 = createContainerRef();
      trackScrollListeners(c1, c2);
      renderHook(() => useMultiViewerSync(c1, c2));

      setIsScrolledByClickingChangeItem(true);
      fireScrollEvent(1, c1, { scrollTop: 200 });
      expect(c2.current.scrollTop).toBe(0);

      fireScrollEvent(2, c2, { scrollTop: 200 });
      expect(multiViewerHelper.isScrolledByClickingChangeItem).toBe(false);
    });
  });

  describe('SYNC mode – vertical scroll', () => {
    let c1, c2;

    beforeEach(() => {
      c1 = createContainerRef();
      c2 = createContainerRef();
      trackScrollListeners(c1, c2);
      renderHook(() => useMultiViewerSync(c1, c2));
    });

    it('scrolls other container by the same delta', () => {
      fireScrollEvent(1, c1, { scrollTop: 50 });
      expect(c2.current.scrollTop).toBe(50);
    });

    it('accumulates deltas across multiple scroll events', () => {
      fireScrollEvent(1, c1, { scrollTop: 50 });
      fireScrollEvent(1, c1, { scrollTop: 120 });
      expect(c2.current.scrollTop).toBe(120);
    });

    it('when c1 scrolls and syncs c2, the resulting c2 scroll event does not sync back to c1', () => {
      fireScrollEvent(1, c1, { scrollTop: 100 });
      expect(c2.current.scrollTop).toBe(100);

      // c2 fires a scroll event at the position c1 synced it to. c2 didn't
      // initiate this scroll — it was moved by the sync. The hook ignores
      // this to avoid an infinite loop.
      c1.current.scrollTop = 0;
      fireScrollEvent(2, c2, { scrollTop: 100 });
      expect(c1.current.scrollTop).toBe(0);

      // Once the echo is consumed, c2 can initiate a real scroll.
      // Delta is 130-100=30, applied to c1 which is at 0 → 30
      fireScrollEvent(2, c2, { scrollTop: 130 });
      expect(c1.current.scrollTop).toBe(30);
    });

    it('tracks topOverflow when other side has no room, then applies it when scrolling back', () => {
      // c2 is shorter: maxScroll = 1000 - 600 = 400
      c2.current.scrollHeight = 1000;

      // Scroll c1 down by 500 — exceeds c2 capacity, overflow is tracked
      fireScrollEvent(1, c1, { scrollTop: 500 });
      expect(c2.current.scrollTop).toBe(500);

      // c2 fires a scroll event at the position it was synced to (not user-initiated).
      // This resets internal tracking so c1 can initiate the next scroll.
      fireScrollEvent(2, c2, { scrollTop: 500 });

      // Scroll c1 backward by 200 — overflow absorbs part of the delta,
      // then the remainder is applied once the sign flips
      fireScrollEvent(1, c1, { scrollTop: 300 });
      expect(c2.current.scrollTop).toBe(400);
    });
  });

  describe('SYNC mode – horizontal scroll', () => {
    let c1, c2;

    beforeEach(() => {
      c1 = createContainerRef();
      c2 = createContainerRef();
      trackScrollListeners(c1, c2);
      renderHook(() => useMultiViewerSync(c1, c2));
    });

    it('syncs horizontal scroll by percentage of scrollable width', () => {
      fireScrollEvent(1, c1, { scrollTop: 0, scrollLeft: 250 });
      expect(c2.current.scrollLeft).toBe(250);
    });

    it('maps percentage correctly across different container widths', () => {
      c2.current.scrollWidth = 2000;
      c2.current.clientWidth = 500;
      // c1: 250/500 = 50%, c2: 50% of (1500) = 750
      fireScrollEvent(1, c1, { scrollTop: 0, scrollLeft: 250 });
      expect(c2.current.scrollLeft).toBe(750);
    });

    it('does not throw when maxScrollLeft is 0', () => {
      c1.current.scrollWidth = 500;
      c1.current.clientWidth = 500;
      expect(() => {
        fireScrollEvent(1, c1, { scrollTop: 10, scrollLeft: 0 });
      }).not.toThrow();
    });
  });

  describe('SKIP_UNMATCHED mode – vertical scroll', () => {
    let c1, c2;

    beforeEach(() => {
      mockState.multiViewerSyncScrollMode = 'SKIP_UNMATCHED';
      multiViewerHelper.matchedPages = {
        1: {
          1: { thisSidePages: [1], otherSidePages: [1] },
          2: { thisSidePages: [2], otherSidePages: [2, 3] },
        },
        2: {
          1: { thisSidePages: [1], otherSidePages: [1] },
          2: { thisSidePages: [2, 3], otherSidePages: [2] },
        },
      };
      c1 = createContainerRef();
      c2 = createContainerRef();
      trackScrollListeners(c1, c2);
    });

    it('scrolls by amount × page ratio when both sides have matched pages', () => {
      const docViewer1 = createMockDocumentViewer({
        visiblePages: [2],
        viewerElement: {
          querySelector: jest.fn((sel) =>
            sel === '#pageContainer2' ? { getBoundingClientRect: () => ({ top: 0, height: 800 }) } : null
          ),
        },
      });
      const docViewer2 = createMockDocumentViewer({
        visiblePages: [2],
        viewerElement: {
          querySelector: jest.fn((sel) =>
            sel === '#pageContainer2' ? { getBoundingClientRect: () => ({ top: 0, height: 400 }) } : null
          ),
        },
      });
      setupCoreMocks(docViewer1, docViewer2);
      renderHook(() => useMultiViewerSync(c1, c2));

      // scrollRatio=2/1=2, heightRatio=400/800=0.5 → 50*2*0.5=50
      fireScrollEvent(1, c1, { scrollTop: 50 });
      expect(c2.current.scrollTop).toBe(50);
    });

    it('uses scrollRatio only (heightRatio=1) when page DOM elements are not found', () => {
      const docViewer1 = createMockDocumentViewer({ visiblePages: [2] });
      const docViewer2 = createMockDocumentViewer({ visiblePages: [2] });
      setupCoreMocks(docViewer1, docViewer2);
      renderHook(() => useMultiViewerSync(c1, c2));

      // scrollRatio=2, heightRatio=1 → 50*2*1=100
      fireScrollEvent(1, c1, { scrollTop: 50 });
      expect(c2.current.scrollTop).toBe(100);
    });

    it('scrolls other side when active page is matched, even if other side visible page is unmatched', () => {
      const docViewer1 = createMockDocumentViewer({ visiblePages: [1] });
      const docViewer2 = createMockDocumentViewer({ visiblePages: [4] });
      setupCoreMocks(docViewer1, docViewer2);
      renderHook(() => useMultiViewerSync(c1, c2));

      fireScrollEvent(1, c1, { scrollTop: 80 });
      expect(c2.current.scrollTop).toBe(80);
    });

    it('passes diffTop through when both sides are on unmatched pages', () => {
      const docViewer1 = createMockDocumentViewer({ visiblePages: [3] });
      const docViewer2 = createMockDocumentViewer({ visiblePages: [4] });
      setupCoreMocks(docViewer1, docViewer2);
      renderHook(() => useMultiViewerSync(c1, c2));

      fireScrollEvent(1, c1, { scrollTop: 80 });
      expect(c2.current.scrollTop).toBe(80);
    });

    it('does not scroll other side when active page is unmatched but other side is matched', () => {
      const docViewer1 = createMockDocumentViewer({ visiblePages: [3] });
      const docViewer2 = createMockDocumentViewer({ visiblePages: [1] });
      setupCoreMocks(docViewer1, docViewer2);
      renderHook(() => useMultiViewerSync(c1, c2));

      fireScrollEvent(1, c1, { scrollTop: 80 });
      expect(c2.current.scrollTop).toBe(0);
    });

    it('falls back to standard SYNC behaviour when matchedPages is null', () => {
      multiViewerHelper.matchedPages = null;
      setupCoreMocks(createMockDocumentViewer(), createMockDocumentViewer());
      renderHook(() => useMultiViewerSync(c1, c2));

      fireScrollEvent(1, c1, { scrollTop: 50 });
      expect(c2.current.scrollTop).toBe(50);
    });
  });

  describe('zoom sync', () => {
    let c1, c2;

    beforeEach(() => {
      c1 = createContainerRef();
      c2 = createContainerRef();
      trackScrollListeners(c1, c2);
      renderHook(() => useMultiViewerSync(c1, c2));
      zoomTo.mockClear();
    });

    it('zooms the other viewer to match when one viewer zooms', () => {
      core.getZoom.mockImplementation((key) => (key === 1 ? 2.0 : 1.0));
      fireCoreEvent('zoomUpdated', 1, 2.0);
      expect(zoomTo).toHaveBeenCalledWith(2.0, true, 2);
    });

    it('does not call zoomTo when both viewers are already at the target level', () => {
      core.getZoom.mockReturnValue(1.5);
      fireCoreEvent('zoomUpdated', 1, 1.5);
      expect(zoomTo).not.toHaveBeenCalled();
    });

    it('skips zoom sync when shouldSkipSyncEvent conditions are met', () => {
      core.getDocumentViewers.mockReturnValue([{}]);
      core.getZoom.mockImplementation((key) => (key === 1 ? 2.0 : 1.0));
      fireCoreEvent('zoomUpdated', 1, 2.0);
      expect(zoomTo).not.toHaveBeenCalled();
    });
  });

  describe('scroll correction after zoom', () => {
    let c1, c2;

    beforeEach(() => {
      c1 = createContainerRef();
      c2 = createContainerRef();
      trackScrollListeners(c1, c2);
      renderHook(() => useMultiViewerSync(c1, c2));
      zoomTo.mockClear();
    });

    it('corrects the non-zooming container scrollTop to match the zooming container delta', () => {
      core.getZoom.mockImplementation((key) => (key === 1 ? 2.0 : 1.0));
      fireCoreEvent('zoomUpdated', 1, 2.0);

      // Zooming container (c1) scrolls by 20
      fireScrollEvent(1, c1, { scrollTop: 20 });
      // Non-zooming container (c2) only moved 15; correction adds the missing 5
      fireScrollEvent(2, c2, { scrollTop: 15 });
      expect(c2.current.scrollTop).toBe(20);
    });

    it('syncs horizontal scroll by percentage during post-zoom correction', () => {
      core.getZoom.mockImplementation((key) => (key === 1 ? 2.0 : 1.0));
      fireCoreEvent('zoomUpdated', 1, 2.0);

      fireScrollEvent(1, c1, { scrollTop: 10, scrollLeft: 250 });
      expect(c2.current.scrollLeft).toBe(250);
    });

    it('maps horizontal scroll percentage correctly when containers differ in size', () => {
      c2.current.scrollWidth = 600;
      core.getZoom.mockImplementation((key) => (key === 1 ? 2.0 : 1.0));
      fireCoreEvent('zoomUpdated', 1, 2.0);

      // c1: 200/500 = 40%, c2: 40% of (600-500)=100 → 40
      fireScrollEvent(1, c1, { scrollTop: 50, scrollLeft: 200 });
      expect(c2.current.scrollLeft).toBe(40);
    });
  });

  describe('page sync (non-continuous mode)', () => {
    let c1, c2;

    beforeEach(() => {
      setupCoreMocks(
        createMockDocumentViewer({ isContinuous: false }),
        createMockDocumentViewer({ isContinuous: false }),
      );
      c1 = createContainerRef();
      c2 = createContainerRef();
      trackScrollListeners(c1, c2);
      core.getCurrentPage.mockReturnValue(1);
      renderHook(() => useMultiViewerSync(c1, c2));
    });

    it('advances the other viewer page by the same delta', () => {
      core.getCurrentPage.mockImplementation((key) => (key === 2 ? 1 : 3));
      fireCoreEvent('pageNumberUpdated', 1, 3);
      expect(core.setCurrentPage).toHaveBeenCalledWith(3, 2);
    });

    it('decrements the other viewer page when going backward', () => {
      // Move both to page 3 first
      core.getCurrentPage.mockReturnValue(3);
      fireCoreEvent('pageNumberUpdated', 1, 3);
      core.setCurrentPage.mockClear();
      fireCoreEvent('pageNumberUpdated', 2, 3); // viewer 2's page event from being synced

      core.getCurrentPage.mockImplementation((key) => (key === 2 ? 3 : 2));
      fireCoreEvent('pageNumberUpdated', 1, 2);
      expect(core.setCurrentPage).toHaveBeenCalledWith(2, 2);
    });

    it('when viewer 1 syncs viewer 2 page, the resulting viewer 2 page event does not sync back', () => {
      fireCoreEvent('pageNumberUpdated', 1, 3);
      core.setCurrentPage.mockClear();
      fireCoreEvent('pageNumberUpdated', 2, 3);
      expect(core.setCurrentPage).not.toHaveBeenCalled();
    });

    it('skips page sync when shouldSkipSyncEvent conditions are met', () => {
      core.getDocumentViewers.mockReturnValue([{}]);
      fireCoreEvent('pageNumberUpdated', 1, 3);
      expect(core.setCurrentPage).not.toHaveBeenCalled();
    });
  });
});
