import core from 'core';
import getHashParameters from 'helpers/getHashParameters';
import { getLeftPanelDataElements } from 'helpers/isDataElementPanel';
import actions from 'actions';
import selectors from 'selectors';
import { workerTypes } from 'constants/types';
import { PRIORITY_ONE, PRIORITY_TWO } from 'constants/actionPriority';
import { print } from 'helpers/print';
import outlineUtils from 'helpers/OutlineUtils';
import onLayersUpdated from './onLayersUpdated';
import i18next from 'i18next';
import hotkeys from 'hotkeys-js';
import hotkeysManager, { ShortcutKeys, Shortcuts, defaultHotkeysScope } from 'helpers/hotkeysManager';
import { getInstanceNode } from 'helpers/getRootNode';
import { isOfficeEditorMode } from 'helpers/officeEditor';
import DataElements from 'constants/dataElement';
import { panelNames } from 'constants/panel';
import { getPortfolioFiles } from 'helpers/portfolio';
import getDefaultPageLabels from 'helpers/getDefaultPageLabels';
import { defaultPanels } from '../redux/modularComponents';
import {
  OFFICE_EDITOR_SCOPE,
  OfficeEditorEditMode,
  EditingStreamType,
  ELEMENTS_TO_DISABLE_IN_OFFICE_EDITOR,
  ELEMENTS_TO_ENABLE_IN_OFFICE_EDITOR
} from 'constants/officeEditor';
import { VIEWER_CONFIGURATIONS } from 'constants/customizationVariables';

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

    PDFNet.initialize().then(() => {
      const main = async () => {
        try {
          checkIfDocumentClosed();
          const totalPageCount = await pdfDoc.getPageCount();
          const displayedPageCount = core.getTotalPages();
          const pageLabels = [];
          if (totalPageCount !== displayedPageCount) {
            const errorLoadingDocument = i18next.t('message.errorLoadingDocument', {
              totalPageCount,
              displayedPageCount
            });
            dispatch(actions.showErrorMessage(errorLoadingDocument));
            throw new Error(`pdfDoc.getPageCount() returns ${totalPageCount} and this does not match with documentViewer.getPageCount() which returns ${displayedPageCount}.`);
          }

          for (let i = 1; i <= totalPageCount; i++) {
            checkIfDocumentClosed();
            const pageLabel = await pdfDoc.getPageLabel(i);
            checkIfDocumentClosed();
            const label = await pageLabel.getLabelTitle(i);
            pageLabels.push(label.length > 0 ? label : i.toString());
          }

          checkIfDocumentClosed();
          const defaultPageLabels = getDefaultPageLabels(totalPageCount);
          const newPageLabels = selectors.getPageLabels(getState());
          if (newPageLabels.every((newLabel, index) => newLabel === defaultPageLabels[index])) {
            dispatch(actions.setPageLabels(pageLabels));
          }
        } catch (e) {
          console.warn(e);
        }
      };

      PDFNet.runWithCleanup(main);
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
  core.getOutlines((outlines) => {
    dispatch(actions.setOutlines(outlines));
  }, documentViewerKey);
  const doc = core.getDocument(documentViewerKey);
  doc.addEventListener('bookmarksUpdated', () => core.getOutlines((outlines) => dispatch(actions.setOutlines(outlines)), documentViewerKey));
  outlineUtils.setDoc(core.getDocument(documentViewerKey));
};

export const updatePortfolioAndLayers = (store) => async () => {
  const { getState, dispatch } = store;
  const doc = core.getDocument();

  const setNextActivePanelDueToEmptyCurrentPanel = (currentActivePanel) => {
    const state = getState();
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

  const portfolio = await getPortfolioFiles();
  dispatch(actions.setPortfolio(portfolio));
  if (portfolio.length === 0) {
    setNextActivePanelDueToEmptyCurrentPanel(DataElements.PORTFOLIO_PANEL);
  }

  if (!doc.isWebViewerServerDocument()) {
    doc.addEventListener('layersUpdated', async () => {
      const newLayers = await doc.getLayersArray();
      const currentLayers = selectors.getLayers(getState());
      onLayersUpdated(newLayers, currentLayers, dispatch);
    });
    doc.getLayersArray().then((layers) => {
      if (layers.length === 0) {
        if (!getIsCustomUIEnabled(store)) {
          dispatch(actions.disableElement('layersPanel', PRIORITY_ONE));
          dispatch(actions.disableElement('layersPanelButton', PRIORITY_ONE));
        }
        setNextActivePanelDueToEmptyCurrentPanel('layersPanel');
      } else {
        dispatch(actions.enableElement('layersPanel', PRIORITY_ONE));
        dispatch(actions.enableElement('layersPanelButton', PRIORITY_ONE));
        onLayersUpdated(layers, undefined, dispatch);
      }
    });
  }
};

export const configureOfficeEditor = (store) => () => {
  const { getState, dispatch } = store;
  const doc = core.getDocument();
  const contentSelectTool = core.getTool('OfficeEditorContentSelect');
  const handleEditModeUpdate = (editMode) => {
    const isCustomUIEnabled = getIsCustomUIEnabled(store);
    dispatch(actions.setOfficeEditorEditMode(editMode));
    if (editMode === OfficeEditorEditMode.VIEW_ONLY || editMode === OfficeEditorEditMode.PREVIEW) {
      isCustomUIEnabled ?
        dispatch(actions.disableElement(DataElements.OFFICE_EDITOR_TOOLS_HEADER, PRIORITY_TWO)) :
        dispatch(actions.closeElement(DataElements.OFFICE_EDITOR_TOOLS_HEADER));
      dispatch(actions.disableElements([DataElements.CONTEXT_MENU_POPUP, DataElements.NOTE_MULTI_SELECT_MODE_BUTTON], PRIORITY_TWO));
    } else {
      isCustomUIEnabled ?
        dispatch(actions.enableElement(DataElements.OFFICE_EDITOR_TOOLS_HEADER, PRIORITY_TWO)) :
        dispatch(actions.openElement(DataElements.OFFICE_EDITOR_TOOLS_HEADER));
      dispatch(actions.enableElements([DataElements.CONTEXT_MENU_POPUP, DataElements.NOTE_MULTI_SELECT_MODE_BUTTON], PRIORITY_TWO));
    }
    if (editMode === OfficeEditorEditMode.REVIEWING || editMode === OfficeEditorEditMode.PREVIEW) {
      dispatch(actions.openElement(isCustomUIEnabled ? DataElements.OFFICE_EDITOR_REVIEW_PANEL : DataElements.LEFT_PANEL));
    } else {
      dispatch(actions.closeElement(isCustomUIEnabled ? DataElements.OFFICE_EDITOR_REVIEW_PANEL : DataElements.LEFT_PANEL));
    }
  };

  const handleActiveStreamChanged = (stream) => {
    dispatch(actions.setOfficeEditorActiveStream(stream));
  };

  const isOfficeEditorHeaderEnabled = (store) => selectors.getIsOfficeEditorHeaderEnabled(store.getState());
  const isSpreadsheetEditorEnabled = selectors.isSpreadsheetEditorModeEnabled(getState());
  if (isOfficeEditorMode()) {
    // isOfficeEditorMode checks to see if the file type is workerTypes.OFFICE_EDITOR
    if (!isOfficeEditorHeaderEnabled(store)) {
      // Since we are switching to Office Editor mode, we need to stash the current UI state in case we return to default viewing mode
      dispatch(actions.stashComponents(VIEWER_CONFIGURATIONS.DEFAULT));
      // if isOfficeEditorHeaderEnabled wasn't already set then we need to set the UI to the default OE UI
      // If the UI for the docx editor was previously customised, we restore that stash
      // if no stash is found the default is set
      dispatch(actions.restoreComponents(VIEWER_CONFIGURATIONS.DOCX_EDITOR));
      dispatch(actions.setIsOfficeEditorHeaderEnabled(true));
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
    handleEditModeUpdate(OfficeEditorEditMode.EDITING);
    doc.addEventListener('editModeUpdated', handleEditModeUpdate);
    handleActiveStreamChanged(EditingStreamType.BODY);
    contentSelectTool.addEventListener('activeStreamChanged', handleActiveStreamChanged);
    // Setting zoom to 100% later here to avoid mouse clicks from becoming offset.
    core.zoomTo(1, 0, 0);
    notesInLeftPanel = selectors.getNotesInLeftPanel(getState());
    dispatch(actions.setNotesInLeftPanel(true));
  } else if (isOfficeEditorHeaderEnabled(store) && !isSpreadsheetEditorEnabled) {
    // Since we are leaving office editor we can stash the current UI state
    dispatch(actions.stashComponents(VIEWER_CONFIGURATIONS.DOCX_EDITOR));
    // The Default UI only gets loaded if isOfficeEditorHeaderEnabled is true, to prevent overwriting the custom UI
    dispatch(actions.restoreComponents(VIEWER_CONFIGURATIONS.DEFAULT));
    const panels = getIsCustomUIEnabled(store) ? defaultPanels : [];
    dispatch(actions.setGenericPanels(panels));
    doc.removeEventListener('editModeUpdated', handleEditModeUpdate);
    contentSelectTool.removeEventListener('activeStreamChanged', handleActiveStreamChanged);
    hotkeys.setScope(defaultHotkeysScope);
    dispatch(actions.setNotesInLeftPanel(notesInLeftPanel));
    dispatch(actions.setIsOfficeEditorHeaderEnabled(false));
  }
};