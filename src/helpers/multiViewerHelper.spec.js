import { cleanUpMultiViewer, setupMultiViewer } from './multiViewerHelper';
import * as actions from 'actions';
import * as selectors from 'selectors';
import { createWrappedCore } from 'hooks/useCore/useCore';
import core from 'core';
import * as documentViewerHelper from './documentViewerHelper';
import defaultTool from 'constants/defaultTool';

jest.mock('actions', () => ({
  setIsMultiViewerReady: jest.fn(),
  setIsMultiViewerMode : jest.fn(),
  setPortfolio: jest.fn(),
  setDocumentLoaded: jest.fn(),
  setTotalPages: jest.fn(),
  setZoom: jest.fn(),
  setCompareAnnotationsMap: jest.fn(),
  setActiveCustomRibbon: jest.fn(),
}));
jest.mock('selectors', () => ({
  getCurrentToolbarGroup: jest.fn(),
  getActiveToolName: jest.fn(),
  isComparisonDisabled: jest.fn(),
  getIsShowComparisonButtonEnabled: jest.fn(),
  getFeatureFlags: jest.fn(),
  getDefaultHeaderItems: jest.fn(),
  isMultiViewerMode: jest.fn(),
  getSyncViewer: jest.fn(),
}));
jest.mock('hooks/useCore/useCore');
jest.mock('core');
jest.mock('./documentViewerHelper');
jest.mock('helpers/eventHandler', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    addEventHandlers: jest.fn(),
    removeEventHandlers: jest.fn(),
  })),
}));
jest.mock('helpers/fireEvent');
jest.mock('constants/events', () => ({
  __esModule: true,
  default: {
    MULTI_VIEWER_READY: 'MULTI_VIEWER_READY',
  },
}));
jest.mock('constants/multiViewerContants', () => ({
  SYNC_MODES: { SKIP_UNMATCHED: 'skip_unmatched' },
  DISABLED_TOOL_GROUPS: [],
  DISABLED_TOOLS_KEYWORDS: [],
}));
jest.mock('helpers/zoom');
jest.mock('components/MultiViewer/ComparisonButton', () => ({
  __esModule: true,
  default: jest.fn(() => null),
}));
jest.mock('constants/dataElement');
jest.mock('constants/defaultTool', () => ({
  __esModule: true,
  default: 'AnnotationEdit',
}));

describe('cleanUpMultiViewer', () => {
  let mockStore;
  let mockState;
  let mockDispatch;
  let mockCoreLeftViewer;
  let mockAnnotationManager;
  let mockFormFieldCreationManager;
  let mockContentEditManager;

  beforeEach(() => {
    mockAnnotationManager = {
      getFormFieldCreationManager: jest.fn(),
    };

    mockFormFieldCreationManager = {
      endFormFieldCreationMode: jest.fn(),
    };

    mockAnnotationManager.getFormFieldCreationManager.mockReturnValue(mockFormFieldCreationManager);

    const mockDocumentViewer1 = {
      getAnnotationManager: jest.fn().mockReturnValue(mockAnnotationManager),
    };

    const mockDocumentViewer2 = {
      getAnnotationManager: jest.fn().mockReturnValue(mockAnnotationManager),
    };

    mockContentEditManager = {
      endContentEditMode: jest.fn(),
    };

    core.getDocumentViewers.mockReturnValue([mockDocumentViewer1, mockDocumentViewer2]);
    core.getDocumentViewer = jest.fn((key) => key === 1 ? mockDocumentViewer1 : mockDocumentViewer2);
    core.getFormFieldCreationManager = jest.fn(() => mockFormFieldCreationManager);
    core.getContentEditManager.mockReturnValue(mockContentEditManager);
    core.setToolMode = jest.fn();
    core.setActive = jest.fn();

    mockCoreLeftViewer = {
      deleteAnnotations: jest.fn(),
      getSemanticDiffAnnotations: jest.fn().mockReturnValue([]),
    };

    createWrappedCore.mockReturnValue(mockCoreLeftViewer);

    documentViewerHelper.removeDocumentViewer.mockReset();
    documentViewerHelper.addDocumentViewer.mockReset();
    documentViewerHelper.setupOpenURLHandler.mockReset();
    documentViewerHelper.syncDocumentViewers.mockReset();

    mockDispatch = jest.fn();
    mockState = {
      viewer: {},
    };
    mockStore = {
      dispatch: mockDispatch,
      getState: jest.fn().mockReturnValue(mockState),
    };

    actions.setIsMultiViewerReady.mockReset().mockReturnValue({ type: 'SET_IS_MULTI_VIEWER_READY' });
    actions.setIsMultiViewerMode.mockReset().mockReturnValue({ type: 'SET_IS_MULTI_VIEWER_MODE' });
    actions.setPortfolio.mockReset().mockReturnValue({ type: 'SET_PORTFOLIO' });
    actions.setDocumentLoaded.mockReset().mockReturnValue({ type: 'SET_DOCUMENT_LOADED' });
    actions.setTotalPages.mockReset().mockReturnValue({ type: 'SET_TOTAL_PAGES' });
    actions.setZoom.mockReset().mockReturnValue({ type: 'SET_ZOOM' });
    actions.setCompareAnnotationsMap.mockReset().mockReturnValue({ type: 'SET_COMPARE_ANNOTATIONS_MAP' });
    actions.setActiveCustomRibbon.mockReset().mockReturnValue({ type: 'SET_ACTIVE_CUSTOM_RIBBON' });

    selectors.isComparisonDisabled.mockReset().mockReturnValue(false);
    selectors.getCurrentToolbarGroup.mockReset().mockReturnValue('toolbarGroup-View');
    selectors.getActiveToolName.mockReset().mockReturnValue('');
    selectors.getDefaultHeaderItems.mockReset().mockReturnValue([]);
    selectors.isMultiViewerMode.mockReset().mockReturnValue(true);
    selectors.getSyncViewer.mockReset().mockReturnValue(1);

    setupMultiViewer(mockStore);

    mockDispatch.mockClear();
    actions.setIsMultiViewerReady.mockClear();
    actions.setIsMultiViewerMode.mockClear();
    actions.setPortfolio.mockClear();
    actions.setDocumentLoaded.mockClear();
    actions.setTotalPages.mockClear();
    actions.setZoom.mockClear();
    actions.setCompareAnnotationsMap.mockClear();
    actions.setActiveCustomRibbon.mockClear();
  });

  describe('dispatching portfolio, document loaded, total pages, and zoom actions', () => {
    it('should dispatch setPortfolio with empty array for viewer key 2', () => {
      cleanUpMultiViewer(mockStore);
      expect(actions.setPortfolio).toHaveBeenCalledWith([], 2);
    });

    it('should dispatch setDocumentLoaded with false for viewer key 2', () => {
      cleanUpMultiViewer(mockStore);
      expect(actions.setDocumentLoaded).toHaveBeenCalledWith(false, 2);
    });

    it('should dispatch setTotalPages with 0 for viewer key 2', () => {
      cleanUpMultiViewer(mockStore);
      expect(actions.setTotalPages).toHaveBeenCalledWith(0, 2);
    });

    it('should dispatch setZoom with 1 for viewer key 2', () => {
      cleanUpMultiViewer(mockStore);
      expect(actions.setZoom).toHaveBeenCalledWith(1, 2);
    });

    it('should dispatch all portfolio-related actions', () => {
      cleanUpMultiViewer(mockStore);

      // Check that dispatch was called with the action results
      const dispatchCalls = mockDispatch.mock.calls;
      const hasPortfolio = dispatchCalls.some((call) => call[0]?.type === 'SET_PORTFOLIO');
      const hasDocumentLoaded = dispatchCalls.some((call) => call[0]?.type === 'SET_DOCUMENT_LOADED');
      const hasTotalPages = dispatchCalls.some((call) => call[0]?.type === 'SET_TOTAL_PAGES');
      const hasZoom = dispatchCalls.some((call) => call[0]?.type === 'SET_ZOOM');

      expect(hasPortfolio).toBe(true);
      expect(hasDocumentLoaded).toBe(true);
      expect(hasTotalPages).toBe(true);
      expect(hasZoom).toBe(true);
    });

    it('should call removeDocumentViewer for non-primary viewers', () => {
      cleanUpMultiViewer(mockStore);
      expect(documentViewerHelper.removeDocumentViewer).toHaveBeenCalledWith(2);
    });

    it('should call endFormFieldCreationMode for all viewers', () => {
      cleanUpMultiViewer(mockStore);
      expect(mockFormFieldCreationManager.endFormFieldCreationMode).toHaveBeenCalledTimes(2);
    });
  });

  describe('other cleanup actions', () => {
    it('should dispatch setIsMultiViewerReady with false', () => {
      cleanUpMultiViewer(mockStore);
      expect(actions.setIsMultiViewerReady).toHaveBeenCalledWith(false);
    });

    it('should dispatch setIsMultiViewerMode with false', () => {
      cleanUpMultiViewer(mockStore);
      expect(actions.setIsMultiViewerMode).toHaveBeenCalledWith(false);
    });

    it('should dispatch setCompareAnnotationsMap with empty object', () => {
      cleanUpMultiViewer(mockStore);
      expect(actions.setCompareAnnotationsMap).toHaveBeenCalledWith({});
    });

    it('should dispatch setActiveCustomRibbon with View Ribbon item for non-primary viewers', () => {
      cleanUpMultiViewer(mockStore);
      expect(actions.setActiveCustomRibbon).toHaveBeenCalledWith('toolbarGroup-View');
    });

    it('should set tool mode to default tool for all viewers', () => {
      cleanUpMultiViewer(mockStore);
      expect(core.setToolMode).toHaveBeenCalledWith(defaultTool);
    });
  });
});
