import React from 'react';
import { shouldDisableLayersPanel, updatePortfolio, syncDisplayModeMultiviewer, addPageLabelsToRedux, configureEditorMode, checkDocumentForTools } from './onDocumentLoaded';
import { workerTypes } from '../constants/types';
import * as useCore from '../hooks/useCore/useCore';
import * as portfolioHelpers from '../helpers/portfolio';
import * as officeEditorHelpers from '../helpers/officeEditor';
import isSpreadsheetEditorMode from '../helpers/spreadsheetEditor/isSpreadsheetEditorMode';
import actions from 'actions';
import selectors from 'selectors';
import core from 'core';
import { VIEWER_CONFIGURATIONS, PLACEMENT } from 'constants/customizationVariables';
import DataElements from 'constants/dataElement';
import { PRIORITY_ONE, PRIORITY_TWO, PRIORITY_THREE } from 'constants/actionPriority';
import { Provider } from 'react-redux';
import ModularHeader from 'components/ModularComponents/ModularHeader/ModularHeader';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from 'src/redux/reducers/rootReducer';
import { act, cleanup, render } from '@testing-library/react';
import SnippingToolPopupContainer from 'src/components/SnippingToolPopup';
import * as hotkeysManagerModule from 'helpers/hotkeysManager';

jest.mock('../helpers/spreadsheetEditor/isSpreadsheetEditorMode');

const mockSnippingTool = {
  setSnippingMode: () => {},
  getIsSnipping: () => false,
  reset: () => {},
};

jest.mock('hooks/useCore', () => () => ({
  core: {
    setToolMode: jest.fn(),
    getContentEditManager: () => null,
    getTool: () => mockSnippingTool,
    addEventListener: () => {},
    removeEventListener: () => {},
    getDocument: () => ({}),
  },
}));

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
      getMultiViewerModeActive: jest.fn(),
      hasDocumentViewer: jest.fn(),
      setDisplayMode: jest.fn(),
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
    core.getDisplayMode = jest.fn((key) => core.getDocumentViewer(key).getDisplayModeManager().getDisplayMode());
    core.getMultiViewerModeActive = jest.fn(() => true);
    core.hasDocumentViewer = jest.fn((key) => !!core.getDocumentViewers()[key - 1]);
    core.setDisplayMode = jest.fn((mode, key) => {
      core.getDocumentViewer(key).getDisplayModeManager().setDisplayMode(mode);
    });
  });

  it('Newly loaded doc in second viewer should be the same display mode as what is stored', () => {
    const run = syncDisplayModeMultiviewer(2);
    run();
    const displayModeManager = mockDocumentViewer2.getDisplayModeManager();
    expect(displayModeManager.setDisplayMode).toHaveBeenCalledTimes(1);
    // Production calls core.setDisplayMode(core.getDisplayMode(sourceKey), targetKey), so the mode propagated to viewer2 is the exact VirtualDisplayMode instance held by viewer1.
    const sourceDisplayMode = mockDocumentViewer1.getDisplayModeManager().getDisplayMode();
    expect(displayModeManager.setDisplayMode).toHaveBeenCalledWith(sourceDisplayMode);

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

  it.each([
    ['uses valid labels in the second viewer', ['A', 'B'], [true, true]],
    ['preserves valid duplicate labels', ['1', '1'], [true, true]],
    ['uses numeric fallback for a valid empty label', ['', 'B'], [true, true]],
    ['keeps default numbering for corrupt labels missing the first page entry', ['', '1'], [false, true]],
    ['keeps default numbering for a document without page labels', ['', ''], [false, false]],
    ['discards all labels when page 1 is valid but page 2 is invalid', ['A', 'B'], [true, false]],
    ['discards all labels when page 100 is invalid', new Array(100).fill('A'), [...new Array(99).fill(true), false]],
    ['discards all labels when a later label cannot be read', ['A', 'B'], [true, true], true],
  ])('%s', async (_description, mockPageLabels, labelValidity, failsReadingLabel = false) => {
    const documentViewerKey = 2;
    const totalPages = mockPageLabels.length;
    const defaultLabels = mockPageLabels.map((_label, pageIndex) => String(pageIndex + 1));
    jest.spyOn(console, 'warn').mockImplementation(() => {});

    const mockPDFDoc = {
      getPageCount: jest.fn().mockResolvedValue(totalPages),
      getPageLabel: jest.fn().mockImplementation((i) => Promise.resolve({
        isValid: jest.fn().mockResolvedValue(labelValidity[i - 1]),
        getLabelTitle: failsReadingLabel && i === 2
          ? jest.fn().mockRejectedValue(new Error('Corrupt page label'))
          : jest.fn().mockResolvedValue(mockPageLabels[i - 1]),
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

    const initializePromise = Promise.resolve();
    const initializeThenSpy = jest.spyOn(initializePromise, 'then');

    window.Core = window.Core || {};
    window.Core.PDFNet = {
      initialize: jest.fn().mockReturnValue(initializePromise),
      runWithCleanup: jest.fn().mockImplementation((fn) => fn()),
    };

    const mockStore = {
      dispatch: jest.fn(),
      getState: jest.fn().mockReturnValue({ viewer: { pageLabels: { [documentViewerKey]: defaultLabels } } }),
    };

    await addPageLabelsToRedux(mockStore, documentViewerKey)();
    await initializeThenSpy.mock.results[0].value;

    expect(mockCore.getDocumentViewer).toHaveBeenCalledWith(documentViewerKey);
    expect(mockCore.getTotalPages).toHaveBeenCalledWith(documentViewerKey);
    if (labelValidity.every(Boolean) && !failsReadingLabel) {
      const expectedLabels = mockPageLabels.map((label, pageIndex) => label || defaultLabels[pageIndex]);
      expect(setPageLabelsSpy).toHaveBeenCalledWith(expectedLabels, documentViewerKey);
    } else {
      expect(setPageLabelsSpy).not.toHaveBeenCalled();
      expect(mockStore.dispatch).not.toHaveBeenCalled();
      expect(mockStore.getState().viewer.pageLabels[documentViewerKey]).toEqual(defaultLabels);
    }
  });
});

describe('configureEditorMode', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('configures spreadsheet-specific header elements', () => {
    const dispatched = [];
    const mockStore = {
      dispatch: (action) => dispatched.push(action),
      getState: () => ({}),
    };

    jest.spyOn(core, 'getDocument').mockReturnValue({});
    jest.spyOn(core, 'getTool').mockReturnValue({
      addEventListener: () => {},
      removeEventListener: () => {},
    });
    jest.spyOn(core, 'getDocumentViewer').mockReturnValue({
      getSpreadsheetEditorManager: () => ({
        getEditMode: () => 'viewOnly',
      }),
    });

    jest.spyOn(officeEditorHelpers, 'isOfficeEditorMode').mockReturnValue(false);
    isSpreadsheetEditorMode.mockReturnValue(true);
    jest.spyOn(selectors, 'getUIConfiguration').mockReturnValue(VIEWER_CONFIGURATIONS.DEFAULT);
    jest.spyOn(selectors, 'getSpreadsheetEditorEditMode').mockReturnValue('viewOnly');
    const disableElementsSpy = jest.spyOn(actions, 'disableElements');

    configureEditorMode(mockStore, 1)();

    expect(dispatched).toContainEqual({
      type: 'SET_IS_OFFICE_EDITOR_HEADER_ENABLED',
      payload: { isOfficeEditorHeaderEnabled: false },
    });
    expect(disableElementsSpy).toHaveBeenCalledWith(expect.arrayContaining([
      DataElements.NOTE_MULTI_SELECT_MODE_BUTTON,
      DataElements.NotesPanel.DefaultHeader.FILTER_ANNOTATION_BUTTON,
    ]));
  });

  it('should not enable the inline comment popup for spreadsheet documents', () => {
    const dispatched = [];
    const mockStore = {
      dispatch: (action) => dispatched.push(action),
      getState: () => ({}),
    };

    jest.spyOn(core, 'getDocument').mockReturnValue({});
    jest.spyOn(core, 'getTool').mockReturnValue({
      addEventListener: () => {},
      removeEventListener: () => {},
    });
    jest.spyOn(core, 'getDocumentViewer').mockReturnValue({
      getSpreadsheetEditorManager: () => ({
        getEditMode: () => 'viewOnly',
      }),
    });

    jest.spyOn(officeEditorHelpers, 'isOfficeEditorMode').mockReturnValue(false);
    isSpreadsheetEditorMode.mockReturnValue(true);
    jest.spyOn(selectors, 'getUIConfiguration').mockReturnValue(VIEWER_CONFIGURATIONS.DEFAULT);
    jest.spyOn(selectors, 'getSpreadsheetEditorEditMode').mockReturnValue('viewOnly');
    const enableElementSpy = jest.spyOn(actions, 'enableElement');
    const enableElementsSpy = jest.spyOn(actions, 'enableElements');

    configureEditorMode(mockStore, 1)();

    const enabledElements = [
      ...enableElementSpy.mock.calls.map(([element]) => element),
      ...enableElementsSpy.mock.calls.flatMap(([elements]) => elements),
    ];
    expect(enabledElements).not.toContain(DataElements.INLINE_COMMENT_POPUP);
  });

  it('falls back to editing mode when spreadsheet initialEditMode is invalid', () => {
    const dispatched = [];
    const mockStore = {
      dispatch: (action) => dispatched.push(action),
      getState: () => ({}),
    };

    jest.spyOn(core, 'getDocument').mockReturnValue({});
    jest.spyOn(core, 'getTool').mockReturnValue({
      addEventListener: () => {},
      removeEventListener: () => {},
    });
    jest.spyOn(core, 'getDocumentViewer').mockReturnValue({
      getSpreadsheetEditorManager: () => ({
        getEditMode: () => 'not-a-valid-mode',
      }),
    });

    jest.spyOn(officeEditorHelpers, 'isOfficeEditorMode').mockReturnValue(false);
    isSpreadsheetEditorMode.mockReturnValue(true);
    jest.spyOn(selectors, 'getUIConfiguration').mockReturnValue(VIEWER_CONFIGURATIONS.DEFAULT);
    jest.spyOn(selectors, 'getSpreadsheetEditorEditMode').mockReturnValue(undefined);
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    configureEditorMode(mockStore, 1)();

    expect(warnSpy).toHaveBeenCalledWith('Invalid initialEditMode parameter: not-a-valid-mode. Default to Editing mode.');
    expect(dispatched).toContainEqual(actions.setSpreadsheetEditorEditMode('editing'));
  });

  it('falls back to editing mode when spreadsheet initialEditMode is invalid', () => {
    const dispatched = [];
    const mockStore = {
      dispatch: (action) => dispatched.push(action),
      getState: () => ({}),
    };

    jest.spyOn(core, 'getDocument').mockReturnValue({});
    jest.spyOn(core, 'getTool').mockReturnValue({
      addEventListener: () => {},
      removeEventListener: () => {},
    });
    jest.spyOn(core, 'getDocumentViewer').mockReturnValue({
      getSpreadsheetEditorManager: () => ({
        getEditMode: () => 'not-a-valid-mode',
      }),
    });

    jest.spyOn(officeEditorHelpers, 'isOfficeEditorMode').mockReturnValue(false);
    isSpreadsheetEditorMode.mockReturnValue(true);
    jest.spyOn(selectors, 'getUIConfiguration').mockReturnValue(VIEWER_CONFIGURATIONS.DEFAULT);
    jest.spyOn(selectors, 'getSpreadsheetEditorEditMode').mockReturnValue(undefined);
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    configureEditorMode(mockStore, 1)();

    expect(warnSpy).toHaveBeenCalledWith('Invalid initialEditMode parameter: not-a-valid-mode. Default to Editing mode.');
    expect(dispatched).toContainEqual(actions.setSpreadsheetEditorEditMode('editing'));
  });

  it('should restore the notes-in-left-panel setting of the instance that is leaving the Office Editor', () => {
    const dispatchedByInstance = { 1: [], 2: [] };
    const createStore = (instanceId, notesInLeftPanel) => ({
      dispatch: (action) => dispatchedByInstance[instanceId].push(action),
      getState: () => ({ instanceId, notesInLeftPanel }),
    });
    const firstStore = createStore(1, true);
    const secondStore = createStore(2, false);

    const doc = {
      getOfficeEditor: () => ({ setEditMode: () => {} }),
      addEventListener: () => {},
      removeEventListener: () => {},
    };
    jest.spyOn(core, 'getDocument').mockReturnValue(doc);
    jest.spyOn(core, 'getTool').mockReturnValue({ addEventListener: () => {}, removeEventListener: () => {} });
    jest.spyOn(core, 'zoomTo').mockImplementation(() => {});
    isSpreadsheetEditorMode.mockReturnValue(false);
    jest.spyOn(hotkeysManagerModule, 'getHotkeysManager').mockReturnValue({ keyHandlerMap: {} });
    jest.spyOn(selectors, 'getInstanceId').mockImplementation((state) => state.instanceId);
    jest.spyOn(selectors, 'getNotesInLeftPanel').mockImplementation((state) => state.notesInLeftPanel);
    jest.spyOn(selectors, 'getIsOfficeEditorHeaderEnabled').mockReturnValue(true);
    jest.spyOn(selectors, 'getUIConfiguration').mockReturnValue(VIEWER_CONFIGURATIONS.DEFAULT);
    jest.spyOn(selectors, 'getGenericPanels').mockReturnValue([]);

    const isOfficeEditorMode = jest.spyOn(officeEditorHelpers, 'isOfficeEditorMode').mockReturnValue(true);
    configureEditorMode(firstStore, 1)();
    configureEditorMode(secondStore, 1)();

    isOfficeEditorMode.mockReturnValue(false);
    configureEditorMode(firstStore, 1)();

    const notesInLeftPanelActions = dispatchedByInstance[1].filter(
      (action) => action.type === actions.setNotesInLeftPanel(true).type
    );
    expect(notesInLeftPanelActions.at(-1)).toEqual(actions.setNotesInLeftPanel(true));
  });
});

describe('checkDocumentForTools', () => {
  let store;
  let container;
  const CROP_AND_REMOVE_RADIO_BUTTON = 'cropAndRemoveRadioButton';
  const CROP_TOOL_BUTTON = 'cropToolButton';
  const CONTENT_EDIT_BUTTON = 'contentEditButton';
  const ADD_PARAGRAPH_BUTTON = 'addParagraphToolGroupButton';
  const DOCUMENT_TOOL_BUTTONS = [CROP_TOOL_BUTTON, CONTENT_EDIT_BUTTON, ADD_PARAGRAPH_BUTTON];

  const createMockDocument = (type, isWebViewerServerDocument = false) => ({
    getType: () => type,
    isWebViewerServerDocument: () => isWebViewerServerDocument,
  });

  const headerItems = [
    { dataElement: CROP_TOOL_BUTTON, type: 'toolButton', toolName: 'CropPage' },
    { dataElement: CONTENT_EDIT_BUTTON, type: 'presetButton', buttonType: 'contentEditButton' },
    { dataElement: ADD_PARAGRAPH_BUTTON, type: 'toolButton', toolName: 'AddParagraphTool' },
  ];

  const isRendered = (dataElement) => !!container.querySelector(`[data-element="${dataElement}"]`);

  const loadDocument = async (doc) => {
    jest.spyOn(core, 'getDocument').mockReturnValue(doc);
    await act(async () => {
      checkDocumentForTools(store.dispatch, 1)();
    });
  };

  describe('ModularHeader items', () => {
    beforeEach(() => {
      store = configureStore({ reducer: rootReducer() });
      ({ container } = render(
        <Provider store={store}>
          <ModularHeader dataElement="testHeader" placement={PLACEMENT.TOP} items={headerItems} />
        </Provider>
      ));
    });

    afterEach(() => {
      jest.restoreAllMocks();
      store = null;
      container = null;
    });

    it('should render all document tool buttons before a document is checked', () => {
      DOCUMENT_TOOL_BUTTONS.forEach((dataElement) => {
        expect(isRendered(dataElement)).toBe(true);
      });
    });

    it.each([
      ['a PDF document', createMockDocument(workerTypes.PDF)],
      ['a client-side initialized WebViewer Server document', createMockDocument(workerTypes.WEBVIEWER_SERVER, false)],
    ])('should show crop and content edit buttons for %s', async (_, doc) => {
      await act(async () => {
        DOCUMENT_TOOL_BUTTONS.forEach((dataElement) => store.dispatch(actions.disableElement(dataElement, PRIORITY_ONE)));
      });
      DOCUMENT_TOOL_BUTTONS.forEach((dataElement) => {
        expect(isRendered(dataElement)).toBe(false);
      });

      await loadDocument(doc);

      DOCUMENT_TOOL_BUTTONS.forEach((dataElement) => {
        expect(isRendered(dataElement)).toBe(true);
      });
    });

    it.each([
      ['an Office document', createMockDocument(workerTypes.OFFICE)],
      ['a legacy Office document', createMockDocument(workerTypes.LEGACY_OFFICE)],
      ['a server-rendered WebViewer Server document', createMockDocument(workerTypes.WEBVIEWER_SERVER, true)],
    ])('should hide crop and content edit buttons for %s', async (_, doc) => {
      await loadDocument(doc);

      DOCUMENT_TOOL_BUTTONS.forEach((dataElement) => {
        expect(isRendered(dataElement)).toBe(false);
      });
    });

    it('should hide content edit buttons but keep the crop button for an image document', async () => {
      await loadDocument(createMockDocument(workerTypes.IMAGE));

      expect(isRendered(CROP_TOOL_BUTTON)).toBe(true);
      expect(isRendered(CONTENT_EDIT_BUTTON)).toBe(false);
      expect(isRendered(ADD_PARAGRAPH_BUTTON)).toBe(false);
    });

    it('should re-enable document tool buttons when a PDF is loaded after an Office document', async () => {
      await loadDocument(createMockDocument(workerTypes.OFFICE));
      DOCUMENT_TOOL_BUTTONS.forEach((dataElement) => {
        expect(isRendered(dataElement)).toBe(false);
      });

      await loadDocument(createMockDocument(workerTypes.PDF));

      DOCUMENT_TOOL_BUTTONS.forEach((dataElement) => {
        expect(isRendered(dataElement)).toBe(true);
      });
    });

    it('should not re-enable buttons that were disabled with a higher priority when a PDF is loaded', async () => {
      await act(async () => {
        await store.dispatch(actions.disableElement(CROP_TOOL_BUTTON, PRIORITY_THREE));
      });

      await loadDocument(createMockDocument(workerTypes.PDF));

      expect(isRendered(CROP_TOOL_BUTTON)).toBe(false);
      expect(isRendered(CONTENT_EDIT_BUTTON)).toBe(true);
      expect(isRendered(ADD_PARAGRAPH_BUTTON)).toBe(true);
    });

    it('should leave buttons unchanged when there is no document', async () => {
      await act(async () => {
        await store.dispatch(actions.disableElement(CONTENT_EDIT_BUTTON, PRIORITY_ONE));
      });

      await loadDocument(null);

      expect(isRendered(CROP_TOOL_BUTTON)).toBe(true);
      expect(isRendered(CONTENT_EDIT_BUTTON)).toBe(false);
      expect(isRendered(ADD_PARAGRAPH_BUTTON)).toBe(true);
    });

    it('should enable the crop tool button for an image document, and disable the content edit and add paragraph buttons', async () => {
      await loadDocument(createMockDocument(workerTypes.IMAGE));

      expect(isRendered(CROP_TOOL_BUTTON)).toBe(true);
      expect(isRendered(CONTENT_EDIT_BUTTON)).toBe(false);
      expect(isRendered(ADD_PARAGRAPH_BUTTON)).toBe(false);
    });

    it('should re-enable crop tool button when an image document is loaded after an Office document', async () => {
      await loadDocument(createMockDocument(workerTypes.OFFICE));
      DOCUMENT_TOOL_BUTTONS.forEach((dataElement) => {
        expect(isRendered(dataElement)).toBe(false);
      });

      await loadDocument(createMockDocument(workerTypes.IMAGE));

      expect(isRendered(CROP_TOOL_BUTTON)).toBe(true);
      expect(isRendered(CONTENT_EDIT_BUTTON)).toBe(false);
      expect(isRendered(ADD_PARAGRAPH_BUTTON)).toBe(false);
    });
  });

  describe('Snipping Popup crop radio button', () => {
    beforeEach(() => {
      jest.spyOn(core, 'getDocument').mockReturnValue(null);
      jest.spyOn(core, 'getScrollViewElement').mockReturnValue(null);
      jest.spyOn(core, 'getViewerElement').mockReturnValue(null);
      jest.spyOn(core, 'addEventListener').mockImplementation(() => {});
      jest.spyOn(core, 'removeEventListener').mockImplementation(() => {});

      store = configureStore({ reducer: rootReducer() });
      ({ container } = render(
        <Provider store={store}>
          <SnippingToolPopupContainer />
        </Provider>
      ));
      act(() => {
        store.dispatch(actions.setActiveToolNameAndStyle({ name: window.Core.Tools.ToolNames.SNIPPING }));
      });
    });

    afterEach(() => {
      cleanup();
      jest.restoreAllMocks();
      store = null;
      container = null;
    });

    it('should disable the Snipping Popup crop radio button when loading an Office document', async () => {
      await loadDocument(createMockDocument(workerTypes.OFFICE));
      await act(async () => {
        await store.dispatch(actions.openElement(DataElements.SNIPPING_TOOL_POPUP));
      });
      expect(isRendered(CROP_AND_REMOVE_RADIO_BUTTON)).toBe(false);
    });

    it('should enable the Snipping Popup crop radio button when loading a PDF document', async () => {
      await loadDocument(createMockDocument(workerTypes.PDF));
      await act(async () => {
        await store.dispatch(actions.openElement(DataElements.SNIPPING_TOOL_POPUP));
      });
      expect(isRendered(CROP_AND_REMOVE_RADIO_BUTTON)).toBe(true);
    });

    it('should enable the Snipping Popup crop radio button when loading an image document', async () => {
      await loadDocument(createMockDocument(workerTypes.IMAGE));
      await act(async () => {
        await store.dispatch(actions.openElement(DataElements.SNIPPING_TOOL_POPUP));
      });
      expect(isRendered(CROP_AND_REMOVE_RADIO_BUTTON)).toBe(true);
    });
  });
});