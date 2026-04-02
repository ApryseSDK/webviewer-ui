import { renderHook } from '@testing-library/react-hooks';
import { useSelector, useStore } from 'react-redux';
import core from 'core';
import actions from 'actions';
import { useMultiViewerSync } from './multiViewerHelper';

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useStore: jest.fn(),
}));

jest.mock('core');

jest.mock('actions', () => ({
  __esModule: true,
  default: {
    setSyncViewer: jest.fn((syncViewer) => ({
      type: 'SET_SYNC_VIEWERS',
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

jest.mock('helpers/zoom', () => ({
  zoomTo: jest.fn(),
}));

jest.mock('helpers/fireEvent', () => jest.fn());
jest.mock('hooks/useCore/useCore', () => ({ createWrappedCore: jest.fn() }));
jest.mock('components/MultiViewer/ComparisonButton', () => ({
  __esModule: true,
  default: jest.fn(() => null),
}));
jest.mock('constants/dataElement', () => ({}));
jest.mock('constants/defaultTool', () => ({ __esModule: true, default: 'AnnotationEdit' }));

const createContainerRef = () => ({
  current: {
    scrollTop: 0,
    scrollLeft: 0,
    scrollWidth: 1000,
    clientWidth: 500,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  },
});

describe('useMultiViewerSync', () => {
  let mockState;
  let mockStore;

  beforeEach(() => {
    jest.clearAllMocks();

    mockState = {
      customMultiViewerSyncHandler: null,
      syncViewer: 1,
      multiViewerSyncScrollMode: 'standard',
      isMultiViewerMode: true,
      documentLoadedMap: {
        1: true,
        2: true,
      },
    };

    mockStore = {
      getState: jest.fn(() => mockState),
      dispatch: jest.fn(),
    };

    useStore.mockReturnValue(mockStore);
    useSelector.mockImplementation((selector) => selector(mockState));

    core.getDocumentViewers.mockReturnValue([{}, {}]);
    core.getDocument.mockImplementation((documentViewerKey) => (
      mockState.documentLoadedMap[documentViewerKey] ? {} : null
    ));
    core.getZoom.mockReturnValue(1);
    core.getCurrentPage.mockReturnValue(1);
    core.addEventListener = jest.fn();
    core.removeEventListener = jest.fn();
    core.getDocumentViewer.mockReturnValue({
      getDisplayModeManager: () => ({
        getDisplayMode: () => ({
          isContinuous: () => true,
        }),
      }),
    });
  });

  it('does not start syncing and clears sync viewer when a document is missing', () => {
    mockState.documentLoadedMap[2] = false;

    const containerRef = createContainerRef();
    const container2Ref = createContainerRef();

    renderHook(() => useMultiViewerSync(containerRef, container2Ref));

    expect(core.addEventListener).not.toHaveBeenCalled();
    expect(containerRef.current.addEventListener).not.toHaveBeenCalled();
    expect(actions.setSyncViewer).toHaveBeenCalledWith(null);
    expect(mockStore.dispatch).toHaveBeenCalledWith({
      type: 'SET_SYNC_VIEWERS',
      payload: { syncViewer: null },
    });
  });

  it('starts syncing when both documents are loaded', () => {
    const containerRef = createContainerRef();
    const container2Ref = createContainerRef();

    renderHook(() => useMultiViewerSync(containerRef, container2Ref));

    expect(core.addEventListener).toHaveBeenCalledWith('zoomUpdated', expect.any(Function), undefined, 1);
    expect(core.addEventListener).toHaveBeenCalledWith('zoomUpdated', expect.any(Function), undefined, 2);
    expect(containerRef.current.addEventListener).toHaveBeenCalledWith('scroll', expect.any(Function));
    expect(container2Ref.current.addEventListener).toHaveBeenCalledWith('scroll', expect.any(Function));
    expect(actions.setSyncViewer).not.toHaveBeenCalled();
  });
});
