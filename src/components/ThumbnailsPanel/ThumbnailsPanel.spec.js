import React from 'react';
import { render, act } from '@testing-library/react';
import ThumbnailsPanel from './ThumbnailsPanel';
import useCore from 'hooks/useCore';

// --- Event system mock ---
// Simulates key-scoped addEventListener/removeEventListener like the real useCore wrapper.
// Tests can fire events via fireViewerEvent(key, event, ...args).
const listenersByKey = {};

function addListener(key, event, handler) {
  if (!listenersByKey[key]) {
    listenersByKey[key] = {};
  }
  if (!listenersByKey[key][event]) {
    listenersByKey[key][event] = [];
  }
  listenersByKey[key][event].push(handler);
}

function removeListener(key, event, handler) {
  if (!listenersByKey[key]?.[event]) {
    return;
  }
  listenersByKey[key][event] = listenersByKey[key][event].filter((h) => h !== handler);
}

function fireViewerEvent(key, event, ...args) {
  (listenersByKey[key]?.[event] || []).forEach((h) => h(...args));
}

function clearAllListeners() {
  Object.keys(listenersByKey).forEach((k) => delete listenersByKey[k]);
}

// --- Core mock ---
const mockDrawAnnotations = jest.fn();
const mockSetAnnotationCanvasTransform = jest.fn();

function createMockCoreForKey(key) {
  return {
    addEventListener: jest.fn((event, handler) => addListener(key, event, handler)),
    removeEventListener: jest.fn((event, handler) => removeListener(key, event, handler)),
    getDocument: jest.fn(() => ({
      getType: () => 'pdf',
      getPageInfo: () => ({ width: 100, height: 100 }),
    })),
    getPageWidth: jest.fn(() => 100),
    getPageHeight: jest.fn(() => 100),
    getRotation: jest.fn(() => 0),
    getCompleteRotation: jest.fn(() => 0),
    getTotalPages: jest.fn(() => 3),
    getCurrentPage: jest.fn(() => 1),
    setCurrentPage: jest.fn(),
    cancelLoadThumbnail: jest.fn(),
    drawAnnotations: mockDrawAnnotations,
    setAnnotationCanvasTransform: mockSetAnnotationCanvasTransform,
    movePages: jest.fn(),
  };
}

let activeMockKey = 1;
let mockCoresByKey = {};

function getMockCore(key) {
  if (!mockCoresByKey[key]) {
    mockCoresByKey[key] = createMockCoreForKey(key);
  }
  return mockCoresByKey[key];
}

jest.mock('hooks/useCore', () => ({
  __esModule: true,
  default: jest.fn(),
}));

// --- Component mocks ---
jest.mock('components/Thumbnail', () => {
  const React = require('react');
  return React.forwardRef(function MockThumbnail(props, ref) {
    React.useEffect(() => {
      const containerId = `pageThumb${  props.index}`;
      const container = global.document.getElementById(containerId);
      if (container && props.onLoad) {
        props.onLoad(props.index, container, props.index + 100);
      }
      return () => {
        if (props.onRemove) {
          props.onRemove(props.index);
        }
      };
    }, []);

    const thumbId = `pageThumb${  props.index}`;
    return (
      <div data-testid={`thumbnail-${  props.index}`}>
        <div id={thumbId} className="thumbnail">
          <canvas className="page-image" width="100" height="100" />
        </div>
      </div>
    );
  });
});

jest.mock('react-virtualized', () => {
  const R = require('react');
  return {
    List: R.forwardRef(function MockList({ rowCount, rowRenderer }, ref) {
      R.useImperativeHandle(ref, () => ({ scrollToRow: jest.fn() }));
      const children = Array.from({ length: rowCount }, (_, i) =>
        R.createElement('div', { key: i }, rowRenderer({ index: i, key: i, style: {} }))
      );
      return R.createElement('div', { 'data-testid': 'virtual-list' }, ...children);
    }),
  };
});

jest.mock('react-measure', () => {
  return {
    __esModule: true,
    default: ({ children, onResize }) => {
      if (onResize) {
        setTimeout(() => onResize({ bounds: { width: 200, height: 600 } }), 0);
      }
      return children({ measureRef: jest.fn() });
    },
  };
});

jest.mock('helpers/device', () => ({ isIE11: false }));
jest.mock('helpers/fireEvent', () => jest.fn());
jest.mock('helpers/pageManipulation', () => ({
  extractPagesToMerge: jest.fn(),
  mergeDocument: jest.fn(),
  mergeExternalWebViewerDocument: jest.fn(),
}));

jest.mock('helpers/getRootNode', () => ({
  __esModule: true,
  default: jest.fn(() => global.document),
}));

const mockInitialState = {
  viewer: {
    openElements: { leftPanel: true },
    disabledElements: {},
    selectedThumbnailPageIndexes: [],
    thumbnailSelectingPages: false,
    shiftKeyThumbnailsPivotIndex: null,
    thumbnailSelectionMode: 'thumbnail',
  },
};

const TestThumbnailsPanel = withProviders(ThumbnailsPanel, mockInitialState);

describe('ThumbnailsPanel annotation rendering', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    clearAllListeners();
    mockDrawAnnotations.mockClear();
    mockSetAnnotationCanvasTransform.mockClear();
    activeMockKey = 1;
    mockCoresByKey = {};

    useCore.mockImplementation(() => ({
      core: getMockCore(activeMockKey),
    }));

    // Provide getCanvasMultiplier
    window.Core = { getCanvasMultiplier: () => 1 };
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should cancel debounced annotation renders on viewer switch (core change)', () => {
    const { rerender } = render(<TestThumbnailsPanel panelSelector="panel1" />);
    act(() => jest.advanceTimersByTime(0));

    // Simulate annotationChanged on viewer 1 to trigger annotation rendering
    const annot = { PageNumber: 1, Listable: true };
    act(() => fireViewerEvent(1, 'annotationChanged', [annot]));

    // drawAnnotations should NOT have been called yet (debounced by 112ms)
    expect(mockDrawAnnotations).not.toHaveBeenCalled();

    // Switch viewers before debounce fires
    activeMockKey = 2;
    useCore.mockImplementation(() => ({
      core: getMockCore(activeMockKey),
    }));
    rerender(<TestThumbnailsPanel panelSelector="panel1" />);

    // Advance past the debounce window
    act(() => jest.advanceTimersByTime(200));

    // The old debounced drawAnnotations should have been cancelled,
    // so drawAnnotations should NOT have been called with viewer 1's annotations
    expect(mockDrawAnnotations).not.toHaveBeenCalled();
  });

  it('should remove annotation canvases from DOM on thumbnail removal', () => {
    const { unmount } = render(<TestThumbnailsPanel panelSelector="panel1" />);
    act(() => jest.advanceTimersByTime(0));

    // Add an annotation canvas to the thumbnail container (simulating what updateAnnotations does)
    const thumbContainer = document.getElementById('pageThumb0');
    expect(thumbContainer).toBeTruthy();

    const annotCanvas = document.createElement('canvas');
    annotCanvas.className = 'annotation-image';
    thumbContainer.appendChild(annotCanvas);

    expect(thumbContainer.querySelector('.annotation-image')).toBeTruthy();

    // Unmount triggers Thumbnail cleanup → onRemove → removes annotation canvases from DOM
    unmount();
    expect(thumbContainer.querySelector('.annotation-image')).toBeFalsy();
  });

  it('should use pageNumber (1-based) not pageIndex (0-based) for debounce map keying', () => {
    render(<TestThumbnailsPanel panelSelector="panel1" />);
    act(() => jest.advanceTimersByTime(0));

    // Fire annotationChanged for page 1 (pageIndex 0)
    const annot = { PageNumber: 1, Listable: true };
    act(() => fireViewerEvent(1, 'annotationChanged', [annot]));

    // Let debounce fire
    act(() => jest.advanceTimersByTime(200));

    // drawAnnotations should have been called (verifies the debounce map works)
    // The key thing is that it doesn't crash — previously the onRemove
    // used pageIndex=0 to look up the debounce map which was keyed by pageNumber=1
    expect(mockDrawAnnotations).toHaveBeenCalled();
  });

  it('should cancel all annotation renders when annotation listener effect re-runs', () => {
    const { rerender } = render(<TestThumbnailsPanel panelSelector="panel1" />);
    act(() => jest.advanceTimersByTime(0));

    // Fire annotationChanged to create a debounced entry
    const annot = { PageNumber: 1, Listable: true };
    act(() => fireViewerEvent(1, 'annotationChanged', [annot]));

    // Switch viewers which causes the [core, thumbnailSize, numberOfColumns] effect to re-run
    activeMockKey = 2;
    useCore.mockImplementation(() => ({
      core: getMockCore(activeMockKey),
    }));
    rerender(<TestThumbnailsPanel panelSelector="panel1" />);

    // Advance past debounce — old debounce should have been cancelled
    act(() => jest.advanceTimersByTime(200));

    // Old viewer's drawAnnotations should not have been called
    expect(mockDrawAnnotations).not.toHaveBeenCalled();
  });

  it('should skip non-Listable annotations in annotationChanged handler', () => {
    render(<TestThumbnailsPanel panelSelector="panel1" />);
    act(() => jest.advanceTimersByTime(0));

    // Fire annotationChanged with a non-Listable annotation
    const nonListableAnnot = { PageNumber: 1, Listable: false };
    act(() => fireViewerEvent(1, 'annotationChanged', [nonListableAnnot]));

    // Let debounce fire
    act(() => jest.advanceTimersByTime(200));

    // drawAnnotations should NOT have been called for non-listable annotations
    expect(mockDrawAnnotations).not.toHaveBeenCalled();
  });

  it('should deduplicate annotations for the same page in annotationChanged', () => {
    render(<TestThumbnailsPanel panelSelector="panel1" />);
    act(() => jest.advanceTimersByTime(0));

    // Fire annotationChanged with multiple annotations on the same page
    const annots = [
      { PageNumber: 1, Listable: true },
      { PageNumber: 1, Listable: true },
      { PageNumber: 1, Listable: true },
    ];
    act(() => fireViewerEvent(1, 'annotationChanged', annots));

    // Let debounce fire
    act(() => jest.advanceTimersByTime(200));

    // drawAnnotations should be called once (deduped + debounced), not three times
    expect(mockDrawAnnotations).toHaveBeenCalledTimes(1);
  });

  it('should not fire old viewer annotation events after viewer switch', () => {
    const { rerender } = render(<TestThumbnailsPanel panelSelector="panel1" />);
    act(() => jest.advanceTimersByTime(0));

    // Switch to viewer 2
    activeMockKey = 2;
    useCore.mockImplementation(() => ({
      core: getMockCore(activeMockKey),
    }));
    rerender(<TestThumbnailsPanel panelSelector="panel1" />);
    act(() => jest.advanceTimersByTime(0));

    // Fire annotationChanged on the OLD viewer (key 1) — should not trigger updateAnnotations
    const annot = { PageNumber: 1, Listable: true };
    act(() => fireViewerEvent(1, 'annotationChanged', [annot]));
    act(() => jest.advanceTimersByTime(200));

    // No draw should have happened since the listener was removed from viewer 1
    expect(mockDrawAnnotations).not.toHaveBeenCalled();
  });

  it('should clear debounce map on document loaded', () => {
    render(<TestThumbnailsPanel panelSelector="panel1" />);
    act(() => jest.advanceTimersByTime(0));

    // Fire annotationChanged to populate the debounce map
    const annot = { PageNumber: 1, Listable: true };
    act(() => fireViewerEvent(1, 'annotationChanged', [annot]));

    // Now fire documentLoaded which should clear the map
    act(() => fireViewerEvent(1, 'documentLoaded'));

    // Advance past debounce — the old debounced call should have been cancelled
    act(() => jest.advanceTimersByTime(200));

    // drawAnnotations should not have been called (debounce was cancelled on documentLoaded)
    expect(mockDrawAnnotations).not.toHaveBeenCalled();
  });
});
