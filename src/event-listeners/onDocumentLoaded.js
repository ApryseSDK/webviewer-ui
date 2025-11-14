import core from 'core';
import getHashParameters from 'helpers/getHashParameters';
import { getLeftPanelDataElements } from 'helpers/isDataElementPanel';
import actions from 'actions';
import selectors from 'selectors';
import { workerTypes } from 'constants/types';
import { PRIORITY_ONE, PRIORITY_TWO, PRIORITY_THREE } from 'constants/actionPriority';
import { print } from 'helpers/print';
import outlineUtils from 'helpers/OutlineUtils';
import i18next from 'i18next';
import hotkeys from 'hotkeys-js';
import hotkeysManager, { ShortcutKeys, Shortcuts, defaultHotkeysScope } from 'helpers/hotkeysManager';
import { getInstanceNode } from 'helpers/getRootNode';
import { isOfficeEditorMode, isSpreadsheetEditorMode } from 'helpers/officeEditor';
import DataElements from 'constants/dataElement';
import { panelNames } from 'constants/panel';
import { getPortfolioFiles } from 'helpers/portfolio';
import {
  OFFICE_EDITOR_SCOPE,
  OfficeEditorEditMode,
  EditingStreamType,
  ELEMENTS_TO_DISABLE_IN_OFFICE_EDITOR,
  ELEMENTS_TO_ENABLE_IN_OFFICE_EDITOR,
  EDIT_OPERATION_SOURCE,
} from 'constants/officeEditor';
import { SPREADSHEET_EDITOR_SCOPE, ELEMENTS_TO_DISABLE_IN_SPREADSHEET_EDITOR, SpreadsheetEditorEditMode } from 'src/constants/spreadsheetEditor';
import { VIEWER_CONFIGURATIONS } from 'constants/customizationVariables';
import FeatureFlags from 'constants/featureFlags';
import getDefaultPageLabels from 'helpers/getDefaultPageLabels';

let notesInLeftPanel;

const getIsCustomUIEnabled = (store) => selectors.getIsCustomUIEnabled(store.getState());

export default (store, documentViewerKey) => async () => {
  const { dispatch } = store;
  dispatch(actions.openElement('pageNavOverlay'));
  // init zoom level value in redux
  dispatch(actions.setZoom(core.getZoom(documentViewerKey), documentViewerKey));
  dispatch(actions.setThumbnailSelectingPages(false));
};

export const enableRedactionElements = (dispatch) => () => {
  // redaction button starts hidden. when the user first loads a document, check HashParams the first time
  core.enableRedaction(getHashParameters('enableRedaction', false) || core.isCreateRedactionEnabled());
  // if redaction is already enabled for some reason (i.e. calling instance.enableRedaction() before loading a doc), keep it enabled

  if (core.isCreateRedactionEnabled()) {
    dispatch(actions.enableElement('redactionToolGroupButton', PRIORITY_ONE));
    dispatch(actions.enableElement('pageRedactionToolGroupButton', PRIORITY_ONE));
  } else {
    dispatch(actions.disableElement('redactionToolGroupButton', PRIORITY_TWO));
    dispatch(actions.disableElement('pageRedactionToolGroupButton', PRIORITY_TWO));
  }
};

export const addPageLabelsToRedux = (store, documentViewerKey) => async () => {
  const { dispatch, getState } = store;
  const docViewer = core.getDocumentViewer(documentViewerKey);
  if (core.isFullPDFEnabled()) {
    const PDFNet = window.Core.PDFNet;
    let isDocumentClosed = false;
    const documentUnloadedHandler = () => {
      isDocumentClosed = true;
    };
    const createPageRenderPromise = (resolved = false) => {
      const promiseCapability = {};
      promiseCapability.promise = new Promise((resolve, reject) => {
        promiseCapability.resolve = resolve;
        promiseCapability.reject = reject;
        resolved && resolve();
      });
      return promiseCapability;
    };
    let pageRenderPromiseCapability = createPageRenderPromise(true);
    docViewer.addEventListener('beginRendering', () => pageRenderPromiseCapability = createPageRenderPromise());
    docViewer.addEventListener('finishedRendering', () => pageRenderPromiseCapability.resolve());

    const checkIfDocumentClosed = () => {
      if (isDocumentClosed) {
        docViewer.removeEventListener('documentUnloaded', documentUnloadedHandler);
        throw new Error('setPageLabels is cancelled because the document got closed.');
      }
    };

    docViewer.addEventListener('documentUnloaded', documentUnloadedHandler, { 'once': true });
    checkIfDocumentClosed();
    const pdfDoc = await docViewer.getDocument().getPDFDoc();
    if (!pdfDoc) {
      return;
    }

    PDFNet.initialize().then(async () => {
      let totalPageCount;
      const pageLabels = [];
      const getPageCount = async () => {
        try {
          checkIfDocumentClosed();
          totalPageCount = await pdfDoc.getPageCount();
          const displayedPageCount = core.getTotalPages();
          if (totalPageCount !== displayedPageCount) {
            const errorLoadingDocument = i18next.t('message.errorLoadingDocument', {
              totalPageCount,
              displayedPageCount
            });
            dispatch(actions.showErrorMessage(errorLoadingDocument));
            throw new Error(`pdfDoc.getPageCount() returns ${totalPageCount} and this does not match with documentViewer.getPageCount() which returns ${displayedPageCount}.`);
          }
        } catch (e) {
          console.warn(e);
        }
      };
      await pageRenderPromiseCapability.promise;
      await PDFNet.runWithCleanup(getPageCount);

      for (let i = 1; i <= totalPageCount; i++) {
        const main = async () => {
          try {
            checkIfDocumentClosed();
            const pageLabel = await pdfDoc.getPageLabel(i);
            checkIfDocumentClosed();
            const label = await pageLabel.getLabelTitle(i);
            pageLabels.push(label.length > 0 ? label : i.toString());
          } catch (e) {
            console.warn(e);
          }
        };
        await pageRenderPromiseCapability.promise;
        await PDFNet.runWithCleanup(main);
      }

      checkIfDocumentClosed();
      const defaultPageLabels = getDefaultPageLabels(totalPageCount);
      const newPageLabels = selectors.getPageLabels(getState());
      if (newPageLabels.every((newLabel, index) => newLabel === defaultPageLabels[index])) {
        dispatch(actions.setPageLabels(pageLabels));
      }
    });
  }
};

export const handlePasswordModal = (dispatch, documentViewerKey) => () => {
  const docViewer = core.getDocumentViewer(documentViewerKey);
  const documentCompletePromise = docViewer.getDocument()?.getDocumentCompletePromise();
  documentCompletePromise?.then(() => {
    dispatch(actions.closeElement(DataElements.PASSWORD_MODAL));
  });
};

export const showProgressModal = (dispatch) => () => {
  dispatch(actions.setLoadingProgress(1));
  // set timeout so that progress modal can show progress bar properly
  setTimeout(() => {
    dispatch(actions.closeElement(DataElements.PROGRESS_MODAL));
    dispatch(actions.resetLoadingProgress());
  }, 300);
};

export const setPrintHandler = (store, documentViewerKey) => () => {
  const { dispatch, getState } = store;
  const docViewer = core.getDocumentViewer(documentViewerKey);
  docViewer
    .getAnnotationManager()
    .getFieldManager()
    .setPrintHandler(() => {
      print(
        dispatch,
        selectors.useClientSidePrint(getState()),
        selectors.isEmbedPrintSupported(getState()),
        selectors.getSortStrategy(getState()),
        selectors.getColorMap(getState()),
      );
    });
};

export const toggleAnnotations = () => () => {
  if (getHashParameters('a', false)) {
    core.getDocumentViewers().forEach((documentViewer) => {
      if (!documentViewer.getDocument() || !isOfficeEditorMode()) {
        documentViewer.enableAnnotations();
      }
    });
  } else {
    core.getDocumentViewers().forEach((documentViewer) => documentViewer.disableAnnotations());
  }
};

export const setServerProperties = () => () => {
  getInstanceNode().instance.UI.loadedFromServer = false;
  getInstanceNode().instance.UI.serverFailed = false;
};

export const checkDocumentForTools = (dispatch) => () => {
  const doc = core.getDocument();
  const docType = doc.getType();
  if (docType === workerTypes.PDF || (docType === workerTypes.WEBVIEWER_SERVER && !doc.isWebViewerServerDocument())) {
    dispatch(actions.enableElement('cropToolGroupButton', PRIORITY_ONE));
    dispatch(actions.enableElement('contentEditButton', PRIORITY_ONE));
    dispatch(actions.enableElement('addParagraphToolGroupButton', PRIORITY_ONE));
  } else if (docType === workerTypes.IMAGE) {
    dispatch(actions.disableElement('contentEditButton', PRIORITY_ONE));
    dispatch(actions.disableElement('addParagraphToolGroupButton', PRIORITY_ONE));
  } else {
    dispatch(actions.disableElement('cropToolGroupButton', PRIORITY_ONE));
    dispatch(actions.disableElement('contentEditButton', PRIORITY_ONE));
    dispatch(actions.disableElement('addParagraphToolGroupButton', PRIORITY_ONE));
  }
};

export const updateOutlines = (dispatch, documentViewerKey) => () => {
  const doc = core.getDocument(documentViewerKey);
  doc.addEventListener('bookmarksUpdated', () => core.getOutlines((outlines) => dispatch(actions.setOutlines(outlines)), documentViewerKey));
  outlineUtils.setDoc(core.getDocument(documentViewerKey));
};

export const setNextActivePanelDueToEmptyCurrentPanel = (currentActivePanel, store) => {
  const { dispatch } = store;
  const state = store.getState();
  const { customizableUI } = state.featureFlags;
  let activeLeftPanel;

  if (customizableUI) {
    activeLeftPanel = selectors.getActiveTabInPanel(state, panelNames.TABS);
  } else {
    activeLeftPanel = selectors.getActiveLeftPanel(state);
  }

  if (activeLeftPanel === currentActivePanel) {
    // set the active left panel to another one that's not disabled so that users don't see a blank left panel
    const nextActivePanel = getLeftPanelDataElements(state).find(
      (dataElement) => !selectors.isElementDisabled(state, dataElement),
    );
    if (customizableUI) {
      dispatch(actions.setActiveTabInPanel(nextActivePanel, panelNames.TABS));
    } else {
      dispatch(actions.setActiveLeftPanel(nextActivePanel));
    }
  }
};

export const updatePortfolio = (store) => async () => {
  const { dispatch } = store;
  const portfolio = await getPortfolioFiles();
  dispatch(actions.setPortfolio(portfolio));
  if (portfolio.length === 0) {
    setNextActivePanelDueToEmptyCurrentPanel(DataElements.PORTFOLIO_PANEL, store);
  }
};

export const configureOfficeEditor = (store) => () => {
  const { getState, dispatch } = store;
  const doc = core.getDocument();
  const contentSelectTool = core.getTool('OfficeEditorContentSelect');
  const isCustomUIEnabled = getIsCustomUIEnabled(store);

  const updateEditMode = (editMode) => {
    dispatch(actions.setOfficeEditorEditMode(editMode));
    if (editMode === OfficeEditorEditMode.VIEW_ONLY || editMode === OfficeEditorEditMode.PREVIEW) {
      isCustomUIEnabled ?
        dispatch(actions.disableElement(DataElements.OFFICE_EDITOR_TOOLS_HEADER, PRIORITY_TWO)) :
        dispatch(actions.closeElement(DataElements.OFFICE_EDITOR_TOOLS_HEADER));
      dispatch(actions.disableElements([DataElements.CONTEXT_MENU_POPUP, DataElements.NOTE_MULTI_SELECT_MODE_BUTTON, DataElements.SEARCH_PANEL_REPLACE_CONTAINER], PRIORITY_TWO));
    } else {
      isCustomUIEnabled ?
        dispatch(actions.enableElement(DataElements.OFFICE_EDITOR_TOOLS_HEADER, PRIORITY_TWO)) :
        dispatch(actions.openElement(DataElements.OFFICE_EDITOR_TOOLS_HEADER));
      dispatch(actions.enableElements([DataElements.CONTEXT_MENU_POPUP, DataElements.NOTE_MULTI_SELECT_MODE_BUTTON, DataElements.SEARCH_PANEL_REPLACE_CONTAINER], PRIORITY_TWO));
    }
    if (editMode === OfficeEditorEditMode.REVIEWING || editMode === OfficeEditorEditMode.PREVIEW) {
      dispatch(actions.openElement(isCustomUIEnabled ? DataElements.OFFICE_EDITOR_REVIEW_PANEL : DataElements.LEFT_PANEL));
    } else {
      dispatch(actions.closeElement(isCustomUIEnabled ? DataElements.OFFICE_EDITOR_REVIEW_PANEL : DataElements.LEFT_PANEL));
    }
  };

  const updateActiveStream = (stream) => {
    dispatch(actions.setOfficeEditorActiveStream(stream));
  };

  const swapUIConfiguration = (newUIConfiguration) => {
    if (currentUIConfiguration === newUIConfiguration) {
      return;
    }
    dispatch(actions.stashComponents(currentUIConfiguration));
    dispatch(actions.restoreComponents(newUIConfiguration));
  };

  const currentUIConfiguration = selectors.getUIConfiguration(getState());
  const isOfficeEditorHeaderEnabled = (store) => selectors.getIsOfficeEditorHeaderEnabled(store.getState());
  if (isOfficeEditorMode()) {
    if (!isOfficeEditorHeaderEnabled(store)) {
      swapUIConfiguration(VIEWER_CONFIGURATIONS.DOCX_EDITOR);
      dispatch(actions.setIsOfficeEditorHeaderEnabled(true));
      dispatch(actions.disableSpreadsheetEditorMode());
      dispatch(actions.setUIConfiguration(VIEWER_CONFIGURATIONS.DOCX_EDITOR));
    }
    dispatch(actions.setIsOfficeEditorMode(true));
    dispatch(actions.enableElements(
      ELEMENTS_TO_ENABLE_IN_OFFICE_EDITOR,
      PRIORITY_TWO,
    ));
    dispatch(actions.disableElements(
      ELEMENTS_TO_DISABLE_IN_OFFICE_EDITOR,
      PRIORITY_TWO, // To allow customers to still enable these elements with PRIORITY_THREE
    ));
    hotkeys.unbind('*', OFFICE_EDITOR_SCOPE);
    hotkeys.setScope(OFFICE_EDITOR_SCOPE);
    const searchShortcutKeys = ShortcutKeys[Shortcuts.SEARCH];
    hotkeys(
      searchShortcutKeys,
      OFFICE_EDITOR_SCOPE,
      hotkeysManager.keyHandlerMap[searchShortcutKeys],
    );
    const setHeaderFocusShortcutKeys = ShortcutKeys[Shortcuts.SET_HEADER_FOCUS];
    hotkeys(
      setHeaderFocusShortcutKeys,
      OFFICE_EDITOR_SCOPE,
      hotkeysManager.keyHandlerMap[setHeaderFocusShortcutKeys],
    );
    const officeEditorOptions = getHashParameters('officeEditorOptions', '{}');
    let onLoadEditMode = JSON.parse(officeEditorOptions).initialEditMode || OfficeEditorEditMode.EDITING;
    if (!Object.values(OfficeEditorEditMode).includes(onLoadEditMode)) {
      console.warn(`Invalid initialEditMode parameter: ${onLoadEditMode}. Default to Editing mode.`);
      onLoadEditMode = OfficeEditorEditMode.EDITING;
    }
    doc.getOfficeEditor().setEditMode(onLoadEditMode);
    updateEditMode(onLoadEditMode);
    doc.addEventListener('editModeUpdated', updateEditMode);
    updateActiveStream(EditingStreamType.BODY);
    contentSelectTool.addEventListener('activeStreamChanged', updateActiveStream);
    doc.addEventListener('editOperationStarted', ({ source }) => {
      switch (source) {
        case EDIT_OPERATION_SOURCE.HEADER_FOOTER:
          core.getOfficeEditor().setEditMode('viewOnly');
          break;
        case EDIT_OPERATION_SOURCE.REPLACE:
          dispatch(actions.setOfficeEditorIsReplaceInProgress(true));
          break;
        default:
          break;
      }
      dispatch(actions.openElement('loadingModal'));
    });
    doc.addEventListener('editOperationEnded', ({ source }) => {
      switch (source) {
        case EDIT_OPERATION_SOURCE.HEADER_FOOTER:
          core.getOfficeEditor().setEditMode('editing');
          break;
        case EDIT_OPERATION_SOURCE.REPLACE:
          dispatch(actions.setOfficeEditorIsReplaceInProgress(false));
          break;
        default:
          break;
      }
      dispatch(actions.closeElement('loadingModal'));
    });
    // Setting zoom to 100% later here to avoid mouse clicks from becoming offset.
    core.zoomTo(1, 0, 0);
    notesInLeftPanel = selectors.getNotesInLeftPanel(getState());
    dispatch(actions.setNotesInLeftPanel(true));
    dispatch(actions.setClearSearchOnPanelClose(true));
  } else if (isSpreadsheetEditorMode()) {
    if (!isCustomUIEnabled) {
      console.warn('Spreadsheet Editor requires Modular UI. Enabling it now.');
      dispatch(actions.enableFeatureFlag(FeatureFlags.CUSTOMIZABLE_UI));
    }
    const spreadsheetEditorOptions = getHashParameters('spreadsheetEditorOptions', '{}');
    const currentSpreadsheetEditorMode = selectors.getSpreadsheetEditorEditMode(getState());
    let onLoadEditMode = JSON.parse(spreadsheetEditorOptions).initialEditMode || currentSpreadsheetEditorMode || SpreadsheetEditorEditMode.VIEW_ONLY;
    if (!Object.values(SpreadsheetEditorEditMode).includes(onLoadEditMode)) {
      console.warn(`Invalid initialEditMode parameter: ${onLoadEditMode}. Default to view mode.`);
      onLoadEditMode = SpreadsheetEditorEditMode.VIEW_ONLY;
    }
    dispatch(actions.setSpreadsheetEditorEditMode(onLoadEditMode));
    const spreadsheetEditorManager = core.getDocumentViewer().getSpreadsheetEditorManager();
    spreadsheetEditorManager.setEditMode(onLoadEditMode);
    if (onLoadEditMode === SpreadsheetEditorEditMode.VIEW_ONLY) {
      dispatch(
        actions.disableElements(
          [DataElements.SEARCH_PANEL_REPLACE_CONTAINER],
          PRIORITY_THREE
        )
      );
    } else {
      dispatch(
        actions.enableElements(
          [DataElements.SEARCH_PANEL_REPLACE_CONTAINER],
          PRIORITY_THREE
        )
      );
    }
    swapUIConfiguration(VIEWER_CONFIGURATIONS.SPREADSHEET_EDITOR);
    dispatch(actions.disableElements(
      ELEMENTS_TO_DISABLE_IN_SPREADSHEET_EDITOR,
    ));
    hotkeys.unbind('*', SPREADSHEET_EDITOR_SCOPE);
    hotkeys.setScope(SPREADSHEET_EDITOR_SCOPE);
    dispatch(actions.enableSpreadsheetEditorMode());
    dispatch(actions.setUIConfiguration(VIEWER_CONFIGURATIONS.SPREADSHEET_EDITOR));
  } else {
    swapUIConfiguration(VIEWER_CONFIGURATIONS.DEFAULT);
    dispatch(actions.setUIConfiguration(VIEWER_CONFIGURATIONS.DEFAULT));
    dispatch(actions.disableSpreadsheetEditorMode());

    const currentGenericPanels = selectors.getGenericPanels(getState());
    const panels = getIsCustomUIEnabled(store) ? currentGenericPanels : [];
    dispatch(actions.setGenericPanels(panels));
    doc.removeEventListener('editModeUpdated', updateEditMode);
    contentSelectTool.removeEventListener('activeStreamChanged', updateActiveStream);
    hotkeys.setScope(defaultHotkeysScope);
    dispatch(actions.setNotesInLeftPanel(notesInLeftPanel));
    dispatch(actions.setIsOfficeEditorHeaderEnabled(false));
  }
};

export const shouldDisableLayersPanel = (doc) => {
  const documentIsWebViewerServerDocument = doc.isWebViewerServerDocument();
  const documentTypeIsWebViewerServer = doc.getType() === workerTypes.WEBVIEWER_SERVER;
  return documentIsWebViewerServerDocument && documentTypeIsWebViewerServer;
};

export const initializeLayersVisibility = (store, documentViewerKey) => () => {
  const { dispatch } = store;
  const docViewer = core.getDocumentViewer(documentViewerKey);
  const doc = docViewer.getDocument();

  if (shouldDisableLayersPanel(doc)) {
    dispatch(actions.disableElement(DataElements.LAYERS_PANEL_BUTTON, PRIORITY_THREE));
    dispatch(actions.disableElement(DataElements.LAYERS_PANEL, PRIORITY_THREE));
  }
};
