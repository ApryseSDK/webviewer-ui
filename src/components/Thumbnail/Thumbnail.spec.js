import Thumbnail from './Thumbnail';
import React from 'react';
import { render, fireEvent, screen, waitFor, act } from '@testing-library/react';

const TestThumbnail = withProviders(Thumbnail);

function noop() { }

let loadCanvasCallback = null;
let loadCanvasIdCounter = 1;
// Controls whether drawComplete is called automatically (true) or manually (false)
let autoResolveDrawComplete = true;

const mockDocument = {
  getPageInfo: () => ({
    width: 100,
    height: 100
  }),
  getInternalId: () => 'test-doc-1',
  loadCanvas: jest.fn(({ drawComplete }) => {
    const id = loadCanvasIdCounter++;
    const canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 100;
    loadCanvasCallback = { drawComplete, id, canvas };
    if (autoResolveDrawComplete) {
      // Call drawComplete asynchronously so loadRequestIdRef is set before the guard runs
      Promise.resolve().then(() => drawComplete(canvas));
    }
    return id;
  }),
  cancelLoadCanvas: jest.fn(),
};

jest.mock('core', () => ({
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  getRotation: () => 1,
  getDocument: () => mockDocument,
  getTotalPages: () => 10,
  setCurrentPage: () => {},
  getDocumentViewer: jest.fn(() => ({
    getDocument: () => mockDocument,
  })),
}));

jest.mock('src/helpers/getRootNode', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    querySelector: jest.fn(() => ({
      getAttribute: (k) => (k === 'dir' ? 'ltr' : null),
      appendChild: jest.fn(),
      querySelector: jest.fn(() => null),
    }))
  }))
}));

describe('Thumbnail', () => {
  describe('Component', () => {
    it('Component should not throw any errors', () => {
      expect(() => {
        render(<TestThumbnail />);
      }).not.toThrow();
    });

    it('Should render document controls if enabled and role', () => {
      const { container } = render(<TestThumbnail />);
      // Verify that container div is in the document to draw thumb canvas
      expect(container.querySelector('.container')).toBeInTheDocument();
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('Should render document controls if enabled', () => {
      const { container } = render(<TestThumbnail />);
      // Verify that page label div is in the document
      expect(container.querySelector('.page-label')).toBeInTheDocument();
    });

    it('Should render document controls if enabled', () => {
      const { container } = render(<TestThumbnail />);
      // Verify that thumbnail div is in the document to draw thumb canvas
      expect(container.querySelector('.thumbnail')).toBeInTheDocument();
    });
  });

  describe('Shift key Press', () => {
    it('Should set shiftKeyPivotIndex when just press a single key', () => {
      const actions = {
        setSelectedPageThumbnails: () => { },
        setShiftKeyThumbnailsPivotIndex: jest.fn(),
        setThumbnailSelectingPages: noop,
      };
      const pressedIndex = 2;
      const { container } = render(
        <TestThumbnail
          dispatch={() => { }}
          shiftKeyThumbnailPivotIndex={null}
          isThumbnailMultiselectEnabled
          isReaderModeOrReadOnly={false}
          selectedPageIndexes={[]}
          actions={actions}
          index={pressedIndex}
          currentPage={1}
        />);
      const tcontainer = container.querySelector('.container');
      fireEvent.click(tcontainer);
      expect(actions.setShiftKeyThumbnailsPivotIndex).toBeCalledWith(pressedIndex);
    });
    it('Should select page 3 when only click index 2', () => {
      const actions = {
        setSelectedPageThumbnails: jest.fn(),
        setShiftKeyThumbnailsPivotIndex: () => { },
        setThumbnailSelectingPages: noop,
      };
      const { container } = render(
        <TestThumbnail
          dispatch={() => { }}
          shiftKeyThumbnailPivotIndex={null}
          isThumbnailMultiselectEnabled
          isReaderModeOrReadOnly={false}
          selectedPageIndexes={[]}
          actions={actions}
          index={2}
          currentPage={1}
        />);
      const tcontainer = container.querySelector('.container');
      fireEvent.click(tcontainer);
      expect(actions.setSelectedPageThumbnails).toBeCalledWith([2]);
    });
    it('Should select page1, page2 and page3 when first select page 3', () => {
      const actions = {
        setSelectedPageThumbnails: jest.fn(),
        setShiftKeyThumbnailsPivotIndex: () => { },
        setThumbnailSelectingPages: noop,
      };
      const { container } = render(
        <TestThumbnail
          dispatch={() => { }}
          isThumbnailMultiselectEnabled
          shiftKeyThumbnailPivotIndex={null}
          isReaderModeOrReadOnly={false}
          selectedPageIndexes={[]}
          actions={actions}
          index={2}
          currentPage={1}
        />);
      const tcontainer = container.querySelector('.container');
      fireEvent.click(tcontainer, { shiftKey: true });
      expect(actions.setSelectedPageThumbnails).toBeCalledWith([0, 1, 2]);
    });
    it('Should select page2 and page3, page4 when select page 2 and page 4', () => {
      const actions = {
        setThumbnailSelectingPages: noop,
      };
      actions.setSelectedPageThumbnails = jest.fn();
      const { container } = render(
        <TestThumbnail
          dispatch={() => { }}
          shiftKeyThumbnailPivotIndex={1}
          isThumbnailMultiselectEnabled
          isReaderModeOrReadOnly={false}
          selectedPageIndexes={[1]}
          actions={actions}
          index={3}
          currentPage={1}
        />);
      const tcontainer = container.querySelector('.container');
      fireEvent.click(tcontainer, { shiftKey: true });
      expect(actions.setSelectedPageThumbnails).toBeCalledWith([1, 2, 3]);
    });
    it('Should select page1 and page2, page3 when 2 and 3 are already selected, and I click shift + select page 1', () => {
      const actions = {
        setThumbnailSelectingPages: noop,
      };
      actions.setSelectedPageThumbnails = jest.fn();
      const { container } = render(
        <TestThumbnail
          dispatch={() => { }}
          shiftKeyThumbnailPivotIndex={2}
          isThumbnailMultiselectEnabled
          isReaderModeOrReadOnly={false}
          selectedPageIndexes={[2, 3]}
          actions={actions}
          index={0}
          currentPage={1}
        />);
      const tcontainer = container.querySelector('.container');
      fireEvent.click(tcontainer, { shiftKey: true });
      expect(actions.setSelectedPageThumbnails).toBeCalledWith([0, 1, 2]);
    });
    it('Should select page 2 and page 1 when already selected page 2, and I shift + select page 1', () => {
      const actions = {
        setThumbnailSelectingPages: noop,
      };
      actions.setSelectedPageThumbnails = jest.fn();
      const { container } = render(
        <TestThumbnail
          dispatch={() => { }}
          shiftKeyThumbnailPivotIndex={2}
          isThumbnailMultiselectEnabled
          isReaderModeOrReadOnly={false}
          selectedPageIndexes={[2, 1, 0]}
          actions={actions}
          index={1}
          currentPage={1}
        />);
      const tcontainer = container.querySelector('.container');
      fireEvent.click(tcontainer, { shiftKey: true });
      expect(actions.setSelectedPageThumbnails).toBeCalledWith([1, 2]);
    });
  });
  describe('Thumbnail Flickering', () => {
    const mockUpdateAnnotations = jest.fn();
    const mockOnFinishLoading = jest.fn();
    const mockOnLoad = jest.fn();
    const rerenderThumbnail = (rerender, canLoad) => {
      rerender(
        <TestThumbnail
          dispatch={() => { }}
          shiftKeyThumbnailPivotIndex={null}
          isThumbnailMultiselectEnabled
          isReaderModeOrReadOnly={false}
          selectedPageIndexes={[]}
          actions={{}}
          index={0}
          currentPage={1}
          canLoad={canLoad}
          updateAnnotations={mockUpdateAnnotations}
          onFinishLoading={mockOnFinishLoading}
          onLoad={mockOnLoad}
        />
      );
    };

    const checkMockCount = async (count) => {
      await waitFor(() => {
        expect(mockOnFinishLoading).toHaveBeenCalledTimes(count);
      });
      expect(mockUpdateAnnotations).toHaveBeenCalledTimes(count);
    };

    beforeEach(() => {
      mockUpdateAnnotations.mockClear();
      mockOnFinishLoading.mockClear();
      mockOnLoad.mockClear();
    });

    // This is to mock onBeginRendering to onFinishedRendering
    it('should not trigger when canLoad is false', async () => {
      const { rerender } = render(
        <TestThumbnail
          dispatch={() => { }}
          shiftKeyThumbnailPivotIndex={null}
          isThumbnailMultiselectEnabled
          isReaderModeOrReadOnly={false}
          selectedPageIndexes={[]}
          actions={{}}
          index={0}
          currentPage={1}
          canLoad={false}
          updateAnnotations={mockUpdateAnnotations}
          onFinishLoading={mockOnFinishLoading}
          onLoad={mockOnLoad}
        />
      );

      // Initial render should not trigger mockUpdateAnnotations because canLoad is false
      await checkMockCount(0);

      // Subsequent rerenders should not trigger mockUpdateAnnotations
      rerenderThumbnail(rerender, true);
      await checkMockCount(0);

      rerenderThumbnail(rerender, false);
      await checkMockCount(0);
    });

    it('should trigger updateAnnotation once when canLoad is true on first render', async () => {
      const { rerender } = render(
        <TestThumbnail
          dispatch={() => { }}
          shiftKeyThumbnailPivotIndex={null}
          isThumbnailMultiselectEnabled
          isReaderModeOrReadOnly={false}
          selectedPageIndexes={[]}
          actions={{}}
          index={0}
          currentPage={1}
          canLoad={true}
          updateAnnotations={mockUpdateAnnotations}
          onFinishLoading={mockOnFinishLoading}
          onLoad={mockOnLoad}
        />
      );

      // Because canLoad is true, we expect one call for mockUpdateAnnotations
      await checkMockCount(1);

      // Subsequent rerenders should not trigger mockUpdateAnnotations
      rerenderThumbnail(rerender, false);
      await checkMockCount(1);

      rerenderThumbnail(rerender, true);
      await checkMockCount(1);
    });
  });

  describe('Cancellation', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      mockDocument.loadCanvas.mockClear();
      mockDocument.cancelLoadCanvas.mockClear();
      loadCanvasCallback = null;
      autoResolveDrawComplete = true;
      loadCanvasIdCounter = 1;
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should cancel pending load on unmount', () => {
      const { unmount } = render(
        <TestThumbnail
          dispatch={noop}
          shiftKeyThumbnailPivotIndex={null}
          isThumbnailMultiselectEnabled={false}
          isReaderModeOrReadOnly={false}
          selectedPageIndexes={[]}
          actions={{}}
          index={0}
          currentPage={1}
          canLoad={true}
          onFinishLoading={noop}
          onLoad={noop}
          onRemove={noop}
          panelSelector="panel1"
        />
      );

      // The load timeout should be pending
      unmount();

      // After unmount, the timeout should have been cleared (cancelPendingLoad called)
      // Advancing timers should not cause any errors
      expect(() => jest.advanceTimersByTime(100)).not.toThrow();
    });

    it('should not load when canLoad is false', () => {
      render(
        <TestThumbnail
          dispatch={noop}
          shiftKeyThumbnailPivotIndex={null}
          isThumbnailMultiselectEnabled={false}
          isReaderModeOrReadOnly={false}
          selectedPageIndexes={[]}
          actions={{}}
          index={0}
          currentPage={1}
          canLoad={false}
          onFinishLoading={noop}
          onLoad={noop}
          onRemove={noop}
          panelSelector="panel1"
        />
      );

      jest.advanceTimersByTime(100);
      expect(mockDocument.loadCanvas).not.toHaveBeenCalled();
    });

    it('should cancel in-flight loadCanvas request on unmount', () => {
      autoResolveDrawComplete = false;

      const { unmount } = render(
        <TestThumbnail
          dispatch={noop}
          shiftKeyThumbnailPivotIndex={null}
          isThumbnailMultiselectEnabled={false}
          isReaderModeOrReadOnly={false}
          selectedPageIndexes={[]}
          actions={{}}
          index={0}
          currentPage={1}
          canLoad={true}
          onFinishLoading={noop}
          onLoad={noop}
          onRemove={noop}
          panelSelector="panel1"
        />
      );

      // Trigger the timeout so loadCanvas is called
      act(() => jest.advanceTimersByTime(100));
      expect(mockDocument.loadCanvas).toHaveBeenCalledTimes(1);

      // Unmount while loadCanvas is in-flight (drawComplete hasn't been called)
      unmount();

      // cancelLoadCanvas should have been called to cancel the in-flight request
      expect(mockDocument.cancelLoadCanvas).toHaveBeenCalled();
    });

    it('should discard stale drawComplete callback when a newer load supersedes it', async () => {
      autoResolveDrawComplete = false;
      const mockOnFinishLoading = jest.fn();
      const coreModule = require('core');

      render(
        <TestThumbnail
          dispatch={noop}
          shiftKeyThumbnailPivotIndex={null}
          isThumbnailMultiselectEnabled={false}
          isReaderModeOrReadOnly={false}
          selectedPageIndexes={[]}
          actions={{}}
          index={0}
          currentPage={1}
          canLoad={true}
          onFinishLoading={mockOnFinishLoading}
          onLoad={noop}
          onRemove={noop}
          panelSelector="panel1"
        />
      );

      // Advance past THUMBNAIL_LOAD_DELAY to trigger load #1
      act(() => jest.advanceTimersByTime(100));
      expect(mockDocument.loadCanvas).toHaveBeenCalledTimes(1);
      const staleCallback = loadCanvasCallback;

      // Trigger load #2 via rotationUpdated event (calls loadThumbnailAsync again)
      const rotationHandler = coreModule.addEventListener.mock.calls
        .filter(([event]) => event === 'rotationUpdated')
        .pop()[1];
      act(() => rotationHandler());

      // cancelLoadCanvas should have been called for load #1
      expect(mockDocument.cancelLoadCanvas).toHaveBeenCalledWith(staleCallback.id);

      // Advance past THUMBNAIL_LOAD_DELAY to dispatch load #2
      act(() => jest.advanceTimersByTime(100));
      expect(mockDocument.loadCanvas).toHaveBeenCalledTimes(2);
      const freshCallback = loadCanvasCallback;

      // Call the stale drawComplete — should be discarded (id mismatch guard)
      await act(async () => {
        staleCallback.drawComplete(staleCallback.canvas);
        await Promise.resolve();
      });
      expect(mockOnFinishLoading).not.toHaveBeenCalled();

      // Call the fresh drawComplete — should work
      await act(async () => {
        freshCallback.drawComplete(freshCallback.canvas);
        await Promise.resolve();
      });
      expect(mockOnFinishLoading).toHaveBeenCalledTimes(1);
    });
  });

  describe('canLoad late transition', () => {
    // Tests the fix for: heavy files where canLoad starts false (beginRendering fires first),
    // then transitions to true after the [core] effect has already run.
    beforeEach(() => {
      mockDocument.loadCanvas.mockClear();
      mockDocument.cancelLoadCanvas.mockClear();
      autoResolveDrawComplete = true;
    });

    it('should trigger loading when canLoad transitions from false to true', async () => {
      const mockOnFinishLoading = jest.fn();

      const { rerender } = render(
        <TestThumbnail
          dispatch={noop}
          shiftKeyThumbnailPivotIndex={null}
          isThumbnailMultiselectEnabled={false}
          isReaderModeOrReadOnly={false}
          selectedPageIndexes={[]}
          actions={{}}
          index={0}
          currentPage={1}
          canLoad={false}
          onFinishLoading={mockOnFinishLoading}
          onLoad={noop}
          onRemove={noop}
          panelSelector="panel1"
        />
      );

      // Nothing loaded yet
      expect(mockDocument.loadCanvas).not.toHaveBeenCalled();

      // Simulate finishedRendering firing — canLoad transitions to true
      rerender(
        <TestThumbnail
          dispatch={noop}
          shiftKeyThumbnailPivotIndex={null}
          isThumbnailMultiselectEnabled={false}
          isReaderModeOrReadOnly={false}
          selectedPageIndexes={[]}
          actions={{}}
          index={0}
          currentPage={1}
          canLoad={true}
          onFinishLoading={mockOnFinishLoading}
          onLoad={noop}
          onRemove={noop}
          panelSelector="panel1"
        />
      );

      // The [canLoad] effect should have triggered loadThumbnailAsync
      await waitFor(() => {
        expect(mockOnFinishLoading).toHaveBeenCalled();
      });
    });
  });

  describe('canLoad cycling after load completes', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      mockDocument.loadCanvas.mockClear();
      mockDocument.cancelLoadCanvas.mockClear();
      autoResolveDrawComplete = true;
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should not re-load an already-loaded thumbnail when canLoad cycles false then true', async () => {
      const mockOnFinishLoading = jest.fn();

      const { rerender } = render(
        <TestThumbnail
          dispatch={noop}
          shiftKeyThumbnailPivotIndex={null}
          isThumbnailMultiselectEnabled={false}
          isReaderModeOrReadOnly={false}
          selectedPageIndexes={[]}
          actions={{}}
          index={0}
          currentPage={1}
          canLoad={true}
          onFinishLoading={mockOnFinishLoading}
          onLoad={noop}
          onRemove={noop}
          panelSelector="panel1"
        />
      );

      // Wait for initial load to complete (timeout + async drawComplete)
      await act(async () => {
        jest.advanceTimersByTime(100);
        await Promise.resolve();
      });
      expect(mockDocument.loadCanvas).toHaveBeenCalledTimes(1);
      expect(mockOnFinishLoading).toHaveBeenCalledTimes(1);
      mockDocument.loadCanvas.mockClear();

      // canLoad cycles false → true (e.g. beginRendering then viewer switch)
      rerender(
        <TestThumbnail
          dispatch={noop}
          shiftKeyThumbnailPivotIndex={null}
          isThumbnailMultiselectEnabled={false}
          isReaderModeOrReadOnly={false}
          selectedPageIndexes={[]}
          actions={{}}
          index={0}
          currentPage={1}
          canLoad={false}
          onFinishLoading={mockOnFinishLoading}
          onLoad={noop}
          onRemove={noop}
          panelSelector="panel1"
        />
      );
      rerender(
        <TestThumbnail
          dispatch={noop}
          shiftKeyThumbnailPivotIndex={null}
          isThumbnailMultiselectEnabled={false}
          isReaderModeOrReadOnly={false}
          selectedPageIndexes={[]}
          actions={{}}
          index={0}
          currentPage={1}
          canLoad={true}
          onFinishLoading={mockOnFinishLoading}
          onLoad={noop}
          onRemove={noop}
          panelSelector="panel1"
        />
      );

      await act(async () => {
        jest.advanceTimersByTime(100);
        await Promise.resolve();
      });

      // No duplicate load — the thumbnail is already loaded
      expect(mockDocument.loadCanvas).not.toHaveBeenCalled();
    });
  });
});
