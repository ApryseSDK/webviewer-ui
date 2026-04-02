import React from 'react';
import { render, fireEvent, waitFor, configure, act } from '@testing-library/react';
import MultiViewer from './MultiViewer';
import * as multiViewerHelper from 'helpers/multiViewerHelper';
import useCore from 'hooks/useCore';
import actions from 'actions';
import initialState from 'src/redux/initialState';

jest.mock('core');
jest.mock('hooks/useCore');
jest.mock('helpers/fireActiveDocumentViewerChanged');
jest.mock('helpers/multiViewerHelper', () => ({
  __esModule: true,
  default: {
    matchedPages: null,
    isScrolledByClickingChangeItem: false,
  },
  useMultiViewerSync: jest.fn(),
}));

configure({ testIdAttribute: 'data-element' });

describe('MultiViewer', () => {
  let mockCoreLeftViewer;
  let mockCoreRightViewer;

  const createMockCore = (viewerKey = 1) => ({
    scrollViewUpdated: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    getDocumentViewer: jest.fn(() => ({
      setScrollViewElement: jest.fn(),
      setViewerElement: jest.fn(),
    })),
    deleteAnnotations: jest.fn(),
    getSemanticDiffAnnotations: jest.fn(() => []),
    getDocument: jest.fn(() => ({
      getFilename: () => `Document${viewerKey}.pdf`,
    })),
  });

  beforeEach(() => {
    jest.clearAllMocks();

    mockCoreLeftViewer = createMockCore(1);
    mockCoreRightViewer = createMockCore(2);

    useCore.mockImplementation((documentViewerKey) => {
      if (documentViewerKey === 1) {
        return { core: mockCoreLeftViewer };
      } else if (documentViewerKey === 2) {
        return { core: mockCoreRightViewer };
      }
      return { core: mockCoreLeftViewer };
    });

    multiViewerHelper.useMultiViewerSync.mockReturnValue({
      stopSyncing: jest.fn(),
      isSyncing: false,
    });

    global.ResizeObserver = jest.fn().mockImplementation(() => ({
      observe: jest.fn(),
      disconnect: jest.fn(),
      unobserve: jest.fn(),
    }));
  });

  const createMultiViewer = async (customState = {}) => {
    const mockState = {
      ...initialState,
      viewer: {
        ...initialState.viewer,
        isMultiViewerMode: true,
        isMultiViewerReady: true,
        isComparisonOverlayEnabled: true,
        activeDocumentViewerKey: 1,
        ...customState,
        openElements: {
          ...initialState.viewer.openElements,
          ...customState.openElements,
        },
        panelWidths: {
          ...initialState.viewer.panelWidths,
          ...customState.panelWidths,
        },
        disabledElements: {
          ...initialState.viewer.disabledElements,
          ...customState.disabledElements,
        },
      },
      document: {
        ...initialState.document,
        documentLoadedMap: {
          1: customState.doc1Loaded || false,
          2: customState.doc2Loaded || false,
        },
      },
    };

    const TestMultiViewerWithState = await withProviders(MultiViewer, mockState);
    return <TestMultiViewerWithState/>;
  };

  const renderMultiViewer = async (customState = {}) => {
    const TestMultiViewerWithState = await createMultiViewer(customState);
    return render(TestMultiViewerWithState);
  };

  describe('Rendering', () => {
    it('should not render when not in multi-viewer mode', async () => {
      const { container } = await renderMultiViewer({ isMultiViewerMode: false });
      const multiViewerElement = container.querySelector('.MultiViewer');
      expect(multiViewerElement).toHaveClass('hidden');
    });

    it('should render when in multi-viewer mode', async () => {
      const { container } = await renderMultiViewer({ isMultiViewerMode: true });

      await waitFor(() => {
        const multiViewerElement = container.querySelector('.MultiViewer');
        expect(multiViewerElement).not.toHaveClass('hidden');
      });
    });

    it('should render both containers when in multi-viewer mode', async () => {
      const { container } = await renderMultiViewer({ isMultiViewerMode: true });

      await waitFor(() => {
        const container1 = container.querySelector('#container1');
        const container2 = container.querySelector('#container2');
        expect(container1).toBeInTheDocument();
        expect(container2).toBeInTheDocument();
      });
    });

    it('should render drop areas when documents are not loaded', async () => {
      const { container } = await renderMultiViewer({
        isMultiViewerMode: true,
        doc1Loaded: false,
        doc2Loaded: false,
      });

      await waitFor(() => {
        const dropAreas = container.querySelectorAll('.DropArea');
        expect(dropAreas).toHaveLength(2);
      });
    });

    it('should not render drop areas when documents are loaded', async () => {
      const { container } = await renderMultiViewer({
        isMultiViewerMode: true,
        doc1Loaded: true,
        doc2Loaded: true,
      });

      await waitFor(() => {
        const dropAreas = container.querySelectorAll('.DropArea');
        expect(dropAreas).toHaveLength(0);
      });
    });

    it('should render resize bar', async () => {
      const { container } = await renderMultiViewer({ isMultiViewerMode: true });

      await waitFor(() => {
        const resizeBar = container.querySelector('.resize-bar');
        expect(resizeBar).toBeInTheDocument();
      });
    });

    it('should render document headers', async () => {
      const { container } = await renderMultiViewer({
        isMultiViewerMode: true,
        doc1Loaded: true,
        doc2Loaded: true,
      });

      await waitFor(() => {
        const header1 = container.querySelector('#header1');
        const header2 = container.querySelector('#header2');
        expect(header1).toBeInTheDocument();
        expect(header2).toBeInTheDocument();
      });
    });

    it('should render sync buttons when both documents are loaded', async () => {
      const { findAllByRole } = await renderMultiViewer({
        isMultiViewerMode: true,
        doc1Loaded: true,
        doc2Loaded: true,
      });

      const syncButtons = await findAllByRole('button', { name: /sync/i });
      expect(syncButtons).toHaveLength(2);
    });

    it('should not render sync buttons when one document is not loaded', async () => {
      const { findAllByRole, queryByRole } = await renderMultiViewer({
        isMultiViewerMode: true,
        doc1Loaded: true,
        doc2Loaded: false,
      });

      await findAllByRole('button', { name: /close document/i });
      expect(queryByRole('button', { name: /sync/i })).not.toBeInTheDocument();
    });
  });

  describe('Active Document Viewer', () => {
    it('should mark first container as active when activeDocumentViewerKey is 1', async () => {
      const { container } = await renderMultiViewer({
        isMultiViewerMode: true,
        activeDocumentViewerKey: 1,
        doc1Loaded: true,
      });

      await waitFor(() => {
        const container1 = container.querySelector('#container1');
        expect(container1).toHaveClass('active');
      });
    });

    it('should mark second container as active when activeDocumentViewerKey is 2', async () => {
      const { container } = await renderMultiViewer({
        isMultiViewerMode: true,
        activeDocumentViewerKey: 2,
        doc2Loaded: true,
      });

      await waitFor(() => {
        const container2 = container.querySelector('#container2');
        expect(container2).toHaveClass('active');
      });
    });

    it('should fire active document viewer changed event on interaction with first container', async () => {
      const { container } = await renderMultiViewer({
        isMultiViewerMode: true,
        activeDocumentViewerKey: 2,
        doc1Loaded: true,
        doc2Loaded: true,
      });

      await waitFor(() => {
        const container1 = container.querySelector('#container1');
        expect(container1).toBeInTheDocument();
      });

      const container1 = container.querySelector('#container1');
      fireEvent.click(container1);
    });
  });

  describe('Event Listeners', () => {
    const getLastDocumentUnloadedCallback = (mockCore) => {
      const allCallbacks = mockCore.addEventListener.mock.calls
        .filter((call) => call[0] === 'documentUnloaded')
        .map((call) => call[1]);
      return allCallbacks[allCallbacks.length - 1];
    };

    it('should add documentUnloaded event listeners on mount in multi-viewer mode', async () => {
      await renderMultiViewer({ isMultiViewerMode: true });

      await waitFor(() => {
        expect(mockCoreLeftViewer.addEventListener).toHaveBeenCalledWith(
          'documentUnloaded',
          expect.any(Function),
          undefined
        );
        expect(mockCoreRightViewer.addEventListener).toHaveBeenCalledWith(
          'documentUnloaded',
          expect.any(Function),
          undefined
        );
      });
    });

    it('should remove event listeners on unmount', async () => {
      const { unmount } = await renderMultiViewer({ isMultiViewerMode: true });

      await waitFor(() => {
        expect(mockCoreLeftViewer.addEventListener).toHaveBeenCalled();
      });

      unmount();

      expect(mockCoreLeftViewer.removeEventListener).toHaveBeenCalledWith(
        'documentUnloaded',
        expect.any(Function)
      );
      expect(mockCoreRightViewer.removeEventListener).toHaveBeenCalledWith(
        'documentUnloaded',
        expect.any(Function)
      );
    });

    it('should call stopSyncing when document is unloaded', async () => {
      const mockStopSyncing = jest.fn();
      const setSyncViewerSpy = jest.spyOn(actions, 'setSyncViewer');
      multiViewerHelper.useMultiViewerSync.mockReturnValue({
        stopSyncing: mockStopSyncing,
        isSyncing: true,
      });

      await renderMultiViewer({ isMultiViewerMode: true });

      await waitFor(() => {
        expect(mockCoreLeftViewer.addEventListener).toHaveBeenCalledWith(
          'documentUnloaded',
          expect.any(Function),
          undefined
        );
      });

      const unloadedCallback = getLastDocumentUnloadedCallback(mockCoreLeftViewer);
      unloadedCallback();

      expect(mockStopSyncing).toHaveBeenCalled();
      expect(setSyncViewerSpy).toHaveBeenCalledWith(null);
    });

    it('should delete semantic diff annotations when document is unloaded', async () => {
      const mockAnnotations = [{ id: '1' }, { id: '2' }];
      mockCoreRightViewer.getSemanticDiffAnnotations.mockReturnValue(mockAnnotations);

      await renderMultiViewer({ isMultiViewerMode: true });

      await waitFor(() => {
        expect(mockCoreLeftViewer.addEventListener).toHaveBeenCalled();
      });

      const unloadedCallback = getLastDocumentUnloadedCallback(mockCoreLeftViewer);
      unloadedCallback();

      expect(mockCoreRightViewer.deleteAnnotations).toHaveBeenCalledWith(
        mockAnnotations,
        { force: true }
      );
    });

    it('should reset matchedPages when document is unloaded', async () => {
      multiViewerHelper.default.matchedPages = { 1: 1, 2: 2 };

      await renderMultiViewer({ isMultiViewerMode: true });

      await waitFor(() => {
        expect(mockCoreLeftViewer.addEventListener).toHaveBeenCalled();
      });

      const unloadedCallback = getLastDocumentUnloadedCallback(mockCoreLeftViewer);
      unloadedCallback();

      expect(multiViewerHelper.default.matchedPages).toBeNull();
    });
  });

  describe('Resize Functionality', () => {
    it('should initialize with equal widths for both containers', async () => {
      const { container } = await renderMultiViewer({
        isMultiViewerMode: true,
        documentContainerWidth: 1000,
      });

      await waitFor(() => {
        const container1 = container.querySelector('#container1');
        const container2 = container.querySelector('#container2');
        expect(container1).toBeInTheDocument();
        expect(container2).toBeInTheDocument();
      });
    });

    it('should observe resize with ResizeObserver', async () => {
      const mockObserve = jest.fn();
      global.ResizeObserver = jest.fn().mockImplementation(() => ({
        observe: mockObserve,
        disconnect: jest.fn(),
        unobserve: jest.fn(),
      }));

      await renderMultiViewer({ isMultiViewerMode: true });

      await waitFor(() => {
        expect(mockObserve).toHaveBeenCalled();
      });
    });

    it('should update scroll views when resize observer callback runs', async () => {
      const originalResizeObserver = global.ResizeObserver;
      let resizeCallback;
      try {
        global.ResizeObserver = jest.fn().mockImplementation((callback) => {
          resizeCallback = callback;
          return {
            observe: jest.fn(),
            disconnect: jest.fn(),
            unobserve: jest.fn(),
          };
        });

        await renderMultiViewer({ isMultiViewerMode: true });

        await waitFor(() => {
          expect(resizeCallback).toBeDefined();
        });

        mockCoreLeftViewer.scrollViewUpdated.mockClear();
        mockCoreRightViewer.scrollViewUpdated.mockClear();

        act(() => {
          resizeCallback([{ contentRect: { width: 1200 } }]);
        });

        await waitFor(() => {
          expect(mockCoreLeftViewer.scrollViewUpdated).toHaveBeenCalledTimes(1);
          expect(mockCoreRightViewer.scrollViewUpdated).toHaveBeenCalledTimes(1);
        });
      } finally {
        global.ResizeObserver = originalResizeObserver;
      }
    });
  });

  describe('Container Styling', () => {
    it('should apply correct width style from Redux state', async () => {
      const { container } = await renderMultiViewer({
        isMultiViewerMode: true,
        openElements: { notesPanel: true },
        panelWidths: { notesPanel: 300 },
      });

      await waitFor(() => {
        const multiViewerElement = container.querySelector('.MultiViewer');
        expect(multiViewerElement).toHaveStyle({ width: 'calc(100% - 314px)' });
      });
    });

    it('should apply correct start margin from Redux state', async () => {
      const { container } = await renderMultiViewer({
        isMultiViewerMode: true,
      });

      await waitFor(() => {
        const multiViewerElement = container.querySelector('.MultiViewer');
        expect(multiViewerElement).toHaveStyle({ marginInlineStart: '0px' });
      });
    });

    it('should apply correct start margin when start panel is open', async () => {
      const { container } = await renderMultiViewer({
        isMultiViewerMode: true,
        openElements: { thumbnailsPanel: true },
        panelWidths: { thumbnailsPanel: 300 },
      });

      await waitFor(() => {
        const multiViewerElement = container.querySelector('.MultiViewer');
        expect(multiViewerElement).toHaveStyle({ marginInlineStart: '300px' });
      });
    });

    it('should apply correct end margin when end panel is open', async () => {
      const { container } = await renderMultiViewer({
        isMultiViewerMode: true,
        openElements: { notesPanel: true },
        panelWidths: { notesPanel: 300 },
      });

      await waitFor(() => {
        const multiViewerElement = container.querySelector('.MultiViewer');
        expect(multiViewerElement).toHaveStyle({ marginInlineEnd: '300px' });
      });
    });

    it('should apply correct margins when both panels are open', async () => {
      const { container } = await renderMultiViewer({
        isMultiViewerMode: true,
        openElements: { thumbnailsPanel: true, notesPanel: true },
        panelWidths: { thumbnailsPanel: 100, notesPanel: 100 },
      });

      await waitFor(() => {
        const multiViewerElement = container.querySelector('.MultiViewer');
        expect(multiViewerElement).toHaveStyle({ marginInlineStart: '100px' });
        expect(multiViewerElement).toHaveStyle({ marginInlineEnd: '100px' });
      });
    });

    it('should apply correct start margin when start panel is open in RTL mode', async () => {
      const RTLMultiViewer = await createMultiViewer({
        isMultiViewerMode: true,
        openElements: { thumbnailsPanel: true },
        panelWidths: { thumbnailsPanel: 300 },
      });

      const { container } = render(<div dir='rtl'>{RTLMultiViewer}</div>);

      await waitFor(() => {
        const multiViewerElement = container.querySelector('.MultiViewer');
        expect(multiViewerElement).toHaveStyle({ marginInlineStart: '300px' });
      });
    });

    it('should apply correct end margin when end panel is open in RTL mode', async () => {
      const RTLMultiViewer = await createMultiViewer({
        isMultiViewerMode: true,
        openElements: { notesPanel: true },
        panelWidths: { notesPanel: 300 },
      });

      const { container } = render(<div dir='rtl'>{RTLMultiViewer}</div>);

      await waitFor(() => {
        const multiViewerElement = container.querySelector('.MultiViewer');
        expect(multiViewerElement).toHaveStyle({ marginInlineEnd: '300px' });
      });
    });

    it('should apply correct margins when both panels are open in RTL mode', async () => {
      const RTLMultiViewer = await createMultiViewer({
        isMultiViewerMode: true,
        openElements: { thumbnailsPanel: true, notesPanel: true },
        panelWidths: { thumbnailsPanel: 100, notesPanel: 100 },
      });

      const { container } = render(<div dir='rtl'>{RTLMultiViewer}</div>);

      await waitFor(() => {
        const multiViewerElement = container.querySelector('.MultiViewer');
        expect(multiViewerElement).toHaveStyle({ marginInlineStart: '100px' });
        expect(multiViewerElement).toHaveStyle({ marginInlineEnd: '100px' });
      });
    });

    it('should apply active border to first container when it is active', async () => {
      const { container } = await renderMultiViewer({
        isMultiViewerMode: true,
        activeDocumentViewerKey: 1,
      });

      await waitFor(() => {
        const borderLine = container.querySelector('#container1 .borderLineBottom');
        expect(borderLine).toHaveClass('active');
      });
    });

    it('should apply active border to second container when it is active', async () => {
      const { container } = await renderMultiViewer({
        isMultiViewerMode: true,
        activeDocumentViewerKey: 2,
      });

      await waitFor(() => {
        const borderLine = container.querySelector('#container2 .borderLineBottom');
        expect(borderLine).toHaveClass('active');
      });
    });

    it('should apply padding to containers when documents are not loaded', async () => {
      const { container } = await renderMultiViewer({
        isMultiViewerMode: true,
        doc1Loaded: false,
        doc2Loaded: false,
      });

      await waitFor(() => {
        const container1 = container.querySelector('#container1');
        const container2 = container.querySelector('#container2');
        expect(container1).toHaveStyle({ padding: '16px' });
        expect(container2).toHaveStyle({ padding: '16px' });
      });
    });

    it('should not apply padding to containers when documents are loaded', async () => {
      const { container } = await renderMultiViewer({
        isMultiViewerMode: true,
        doc1Loaded: true,
        doc2Loaded: true,
      });

      await waitFor(() => {
        const container1 = container.querySelector('#container1');
        const container2 = container.querySelector('#container2');
        expect(container1).toHaveStyle({ padding: '0' });
        expect(container2).toHaveStyle({ padding: '0' });
      });
    });
  });

  describe('User Interactions', () => {
    it('should not change active viewer on wheel event when syncing', async () => {
      multiViewerHelper.useMultiViewerSync.mockReturnValue({
        stopSyncing: jest.fn(),
        isSyncing: true,
      });

      const { container } = await renderMultiViewer({
        isMultiViewerMode: true,
        activeDocumentViewerKey: 1,
        doc1Loaded: true,
        doc2Loaded: true,
      });

      await waitFor(() => {
        const container2 = container.querySelector('#container2');
        expect(container2).toBeInTheDocument();
      });

      const container2 = container.querySelector('#container2');
      fireEvent.wheel(container2);

      const container1 = container.querySelector('#container1');
      expect(container1).toHaveClass('active');
    });

    it('should change active viewer on scroll event when not syncing', async () => {
      multiViewerHelper.useMultiViewerSync.mockReturnValue({
        stopSyncing: jest.fn(),
        isSyncing: false,
      });

      const { container } = await renderMultiViewer({
        isMultiViewerMode: true,
        activeDocumentViewerKey: 1,
        doc1Loaded: true,
        doc2Loaded: true,
      });

      await waitFor(() => {
        const container2 = container.querySelector('#container2');
        expect(container2).toBeInTheDocument();
      });

      const container2 = container.querySelector('#container2');
      fireEvent.scroll(container2);
    });

    it('should handle pointer down on first container', async () => {
      const { container } = await renderMultiViewer({
        isMultiViewerMode: true,
        doc1Loaded: true,
        doc2Loaded: true,
      });

      await waitFor(() => {
        const container1 = container.querySelector('#container1');
        expect(container1).toBeInTheDocument();
      });

      const container1 = container.querySelector('#container1');
      fireEvent.pointerDown(container1);
    });

    it('should handle mouse down on second container', async () => {
      const { container } = await renderMultiViewer({
        isMultiViewerMode: true,
        doc1Loaded: true,
        doc2Loaded: true,
      });

      await waitFor(() => {
        const container2 = container.querySelector('#container2');
        expect(container2).toBeInTheDocument();
      });

      const container2 = container.querySelector('#container2');
      fireEvent.mouseDown(container2);
    });

    it('should handle touch start on first container', async () => {
      const { container } = await renderMultiViewer({
        isMultiViewerMode: true,
        doc1Loaded: true,
        doc2Loaded: true,
      });

      await waitFor(() => {
        const container1 = container.querySelector('#container1');
        expect(container1).toBeInTheDocument();
      });

      const container1 = container.querySelector('#container1');
      fireEvent.touchStart(container1);
    });
  });

  describe('Custom Containers', () => {
    it('should render custom container elements', async () => {
      const { container } = await renderMultiViewer({ isMultiViewerMode: true });

      await waitFor(() => {
        const customContainer1 = container.querySelector('.custom-container-1');
        const customContainer2 = container.querySelector('.custom-container-2');
        expect(customContainer1).toBeInTheDocument();
        expect(customContainer2).toBeInTheDocument();
      });
    });

    it('should set custom containers to full width', async () => {
      const { container } = await renderMultiViewer({ isMultiViewerMode: true });

      await waitFor(() => {
        const customContainer1 = container.querySelector('.custom-container-1');
        const customContainer2 = container.querySelector('.custom-container-2');
        expect(customContainer1).toHaveStyle({ width: '100%' });
        expect(customContainer2).toHaveStyle({ width: '100%' });
      });
    });
  });

  describe('Integration', () => {
    it('should properly integrate with multiViewerHelper hook', async () => {
      const mockStopSyncing = jest.fn();
      const mockIsSyncing = true;

      multiViewerHelper.useMultiViewerSync.mockReturnValue({
        stopSyncing: mockStopSyncing,
        isSyncing: mockIsSyncing,
      });

      await renderMultiViewer({ isMultiViewerMode: true });

      await waitFor(() => {
        expect(multiViewerHelper.useMultiViewerSync).toHaveBeenCalledWith(
          expect.any(Object),
          expect.any(Object)
        );
      });
    });

    it('should pass container refs to useMultiViewerSync hook', async () => {
      await renderMultiViewer({ isMultiViewerMode: true });

      await waitFor(() => {
        expect(multiViewerHelper.useMultiViewerSync).toHaveBeenCalled();
      });

      const [container1Ref, container2Ref] = multiViewerHelper.useMultiViewerSync.mock.calls[0];
      expect(container1Ref).toBeDefined();
      expect(container2Ref).toBeDefined();
    });
  });
});
