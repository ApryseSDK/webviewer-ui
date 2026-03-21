import { shouldDisableLayersPanel, updatePortfolio, syncDisplayModeMultiviewer, addPageLabelsToRedux } from './onDocumentLoaded';
import { workerTypes } from '../constants/types';
import * as useCore from '../hooks/useCore/useCore';
import * as portfolioHelpers from '../helpers/portfolio';
import actions from 'actions';
import selectors from 'selectors';
import core from 'core';

describe('shouldDisableLayersPanel', function() {
  it('should return true if document is not client side initialized (forceClientSideInit is false) and WebViewer Server is running', async () => {
    const mockDoc = {
      isWebViewerServerDocument: () => true,
      getType: () => workerTypes.WEBVIEWER_SERVER,
    };

    const result = shouldDisableLayersPanel(mockDoc);
    expect(result).toEqual(true);
  });

  it('should return false if WebViewer Server is not running even if somehow the document type is WVS', async () => {
    const mockDoc = {
      isWebViewerServerDocument: () => true,
      getType: () => workerTypes.PDF,
    };

    const result = shouldDisableLayersPanel(mockDoc);
    expect(result).toEqual(false);
  });

  it('should return false if document is client side initialized (forceClientSideInit is true)', async () => {
    const mockDoc = {
      isWebViewerServerDocument: () => false,
      getType: () => workerTypes.WEBVIEWER_SERVER,
    };

    const result = shouldDisableLayersPanel(mockDoc);
    expect(result).toEqual(false);
  });

  it('should return false if document is client side initialized (forceClientSideInit is true) and WebViewer Server is not running', async () => {
    const mockDoc = {
      isWebViewerServerDocument: () => false,
      getType: () => workerTypes.PDF,
    };

    const result = shouldDisableLayersPanel(mockDoc);
    expect(result).toEqual(false);
  });
});

describe('syncDisplayModeMultiviewer', () => {
  const noop = () => {};
  jest.mock('selectors');

  jest.mock('core', () => {
    const actual = jest.requireActual('core');
    return {
      ...actual,
      getDocumentViewers: jest.fn(),
      getDocumentViewer: jest.fn(),
      getDisplayMode: jest.fn(),
    };
  });

  const makeMockViewer = (documentViewer, initialMode = 'Continuous') => {
    let displayMode = new Core.VirtualDisplayMode(documentViewer, initialMode);
    const displayModeManager = {
      isVirtualDisplayEnabled: () => true,
      setDisplayMode: jest.fn((mode) => displayMode = mode),
      getDisplayMode: jest.fn(() => displayMode),
    };
    return {
      addEventListener: noop,
      removeEventListener: noop,
      getCurrentPage: jest.fn(),
      getDocument: noop,
      isRightToLeftPageRenderingEnabled: noop,
      getDisplayMode: jest.fn(() => displayMode.mode),
      getDisplayModeManager: () => displayModeManager,
    };
  };

  let mockDocumentViewer1;
  let mockDocumentViewer2;

  beforeEach(() => {
    jest.resetAllMocks();
    mockDocumentViewer1 = makeMockViewer(1,'Single');
    mockDocumentViewer2 = makeMockViewer(2);
    core.getDocumentViewers = jest.fn(() => [mockDocumentViewer1, mockDocumentViewer2]);
    core.getDocumentViewer = jest.fn((key) => core.getDocumentViewers()[key - 1]);
    core.getDisplayMode = jest.fn((key) => core.getDocumentViewer(key).getDisplayMode());
  });

  it('Newly loaded doc in second viewer should be the same display mode as what is stored', () => {
    const run = syncDisplayModeMultiviewer(2);
    run();
    const displayModeManager = mockDocumentViewer2.getDisplayModeManager();
    expect(displayModeManager.setDisplayMode).toHaveBeenCalledTimes(1);
    const singleDisplayMode = new Core.VirtualDisplayMode(mockDocumentViewer2, 'Single');
    expect(displayModeManager.setDisplayMode).toHaveBeenCalledWith(singleDisplayMode);

    expect(mockDocumentViewer2.getDisplayMode()).toEqual(mockDocumentViewer1.getDisplayMode());
  });
});

describe('updatePortfolio', function() {
  let mockStore;

  beforeEach(() => {
    mockStore = {
      dispatch: jest.fn(),
      getState: jest.fn(),
    };
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should dispatch portfolio files with correct documentViewerKey', async () => {
    const mockCore = {};
    const mockPortfolioFiles = [
      { id: 1, name: 'file1.pdf', order: 0 },
      { id: 2, name: 'file2.pdf', order: 1 },
    ];

    jest.spyOn(useCore, 'createWrappedCore').mockReturnValue(mockCore);
    jest.spyOn(portfolioHelpers, 'getPortfolioFiles').mockResolvedValue(mockPortfolioFiles);
    jest.spyOn(actions, 'setPortfolio').mockReturnValue({ type: 'SET_PORTFOLIO' });

    await updatePortfolio(mockStore, 1)();

    expect(useCore.createWrappedCore).toHaveBeenCalledWith(1);
    expect(portfolioHelpers.getPortfolioFiles).toHaveBeenCalledWith(mockCore);
    expect(actions.setPortfolio).toHaveBeenCalledWith(mockPortfolioFiles, 1);
    expect(mockStore.dispatch).toHaveBeenCalled();
  });

  it('should use different wrapped core instances for different documentViewerKeys', async () => {
    const mockCore1 = { id: 'core1' };
    const mockCore2 = { id: 'core2' };
    const mockFiles1 = [{ id: 1, name: 'viewer1.pdf' }];
    const mockFiles2 = [{ id: 2, name: 'viewer2.pdf' }];

    const createWrappedCoreSpy = jest.spyOn(useCore, 'createWrappedCore');
    const getPortfolioFilesSpy = jest.spyOn(portfolioHelpers, 'getPortfolioFiles');
    const setPortfolioSpy = jest.spyOn(actions, 'setPortfolio').mockReturnValue({ type: 'SET_PORTFOLIO' });

    createWrappedCoreSpy.mockReturnValue(mockCore1);
    getPortfolioFilesSpy.mockResolvedValue(mockFiles1);
    await updatePortfolio(mockStore, 1)();

    expect(setPortfolioSpy).toHaveBeenCalledWith(mockFiles1, 1);

    createWrappedCoreSpy.mockReturnValue(mockCore2);
    getPortfolioFilesSpy.mockResolvedValue(mockFiles2);
    await updatePortfolio(mockStore, 2)();

    expect(setPortfolioSpy).toHaveBeenCalledWith(mockFiles2, 2);
  });
});

describe('addPageLabelsToRedux', function() {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0));

  it('should fetch and dispatch page labels with the correct documentViewerKey for the second viewer', async () => {
    const documentViewerKey = 2;
    const totalPages = 2;
    const mockPageLabels = ['A', 'B'];
    const defaultLabels = ['1', '2'];

    const mockPDFDoc = {
      getPageCount: jest.fn().mockResolvedValue(totalPages),
      getPageLabel: jest.fn().mockImplementation((i) => Promise.resolve({
        getLabelTitle: jest.fn().mockResolvedValue(mockPageLabels[i - 1]),
      })),
    };

    const mockDocViewer = {
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      getDocument: jest.fn().mockReturnValue({ getPDFDoc: jest.fn().mockResolvedValue(mockPDFDoc) }),
    };

    const mockCore = {
      getDocumentViewer: jest.fn().mockReturnValue(mockDocViewer),
      isFullPDFEnabled: jest.fn().mockReturnValue(true),
      getTotalPages: jest.fn().mockReturnValue(totalPages),
    };

    jest.spyOn(useCore, 'createWrappedCore').mockReturnValue(mockCore);
    jest.spyOn(selectors, 'getPageLabels').mockReturnValue(defaultLabels);

    const setPageLabelsSpy = jest.spyOn(actions, 'setPageLabels').mockReturnValue({ type: 'SET_PAGE_LABELS' });

    window.Core = window.Core || {};
    window.Core.PDFNet = {
      initialize: jest.fn().mockResolvedValue(),
      runWithCleanup: jest.fn().mockImplementation((fn) => fn()),
    };

    const mockStore = {
      dispatch: jest.fn(),
      getState: jest.fn().mockReturnValue({ viewer: { pageLabels: { [documentViewerKey]: defaultLabels } } }),
    };

    await addPageLabelsToRedux(mockStore, documentViewerKey)();
    await flushPromises();

    expect(mockCore.getDocumentViewer).toHaveBeenCalledWith(documentViewerKey);
    expect(mockCore.getTotalPages).toHaveBeenCalledWith(documentViewerKey);
    expect(selectors.getPageLabels).toHaveBeenCalledWith(expect.anything(), documentViewerKey);
    expect(setPageLabelsSpy).toHaveBeenCalledWith(mockPageLabels, documentViewerKey);
  });
});


