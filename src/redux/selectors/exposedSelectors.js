import core from 'core';
import { workerTypes } from 'constants/types';
import getHeaderItemByToolName from 'helpers/getHeaderItemByToolName';

// viewer
export const isElementDisabled = (state, dataElement) => state.viewer.disabledElements[dataElement] && state.viewer.disabledElements[dataElement].disabled;
export const isToolGroupButtonDisabled = (state, dataElement, toolNames) => {
  const isEveryButtonInGroupDisabled = toolNames.every(toolName => isToolButtonDisabled(state, toolName));

  return isElementDisabled(state, dataElement) || isEveryButtonInGroupDisabled;
};
export const isToolButtonDisabled = (state, toolName) => {
  const dataElement = getToolButtonDataElement(state, toolName);
  return !!isElementDisabled(state, dataElement);
};
export const isElementOpen = (state, dataElement) => {
  if (state.viewer.disabledElements[dataElement]) {
    return state.viewer.openElements[dataElement] && !state.viewer.disabledElements[dataElement].disabled;
  }

  return state.viewer.openElements[dataElement];
};

export const isElementActive = (state, tool) => {
  const { viewer: { activeToolName, header: { tools = [] }  }} = state;
  const { element, dataElement } = tool;

  return isElementOpen(state, element) || tools.some(tool => tool.dataElement === dataElement && tool.toolName === activeToolName);
};

export const getActiveHeaderItems = state => state.viewer.header;
export const getDisabledElementPriority = (state, dataElement) => state.viewer.disabledElements[dataElement] && state.viewer.disabledElements[dataElement].priority;
export const getToolButtonObjects = state => state.viewer && state.viewer.toolButtonObjects;
export const getAnnotationToolNames = state => Object.keys(state.viewer.toolButtonObjects).filter(toolButtonName => state.viewer.toolButtonObjects[toolButtonName].annotationCheck);
export const getGroupName = (state, toolName) => {
  const defaultHeader = state.viewer.header.filter(toolObject => toolObject.children);
  for (let i = 0; i < defaultHeader.length; i++) {
    let childrenToolNames = defaultHeader[i].children.map(object => object.toolName);
    if (childrenToolNames.includes(toolName)) {
      return defaultHeader[i].toolGroup;
    }
    for (let j = 0; j < defaultHeader[i].children.length; j++) {
      if (defaultHeader[i].children[j].children) {
        let grandchildrenToolNames = defaultHeader[i].children[j].children.map(object => object.toolName);
        if (grandchildrenToolNames.includes(toolName)) {
          return defaultHeader[i].children[j].toolGroup;
        }
      }
    }
  }
};
export const getToolButtonDataElements = (state, toolNames) => toolNames.filter(toolName => getHeaderItemByToolName(state, toolName)).map(toolName => getHeaderItemByToolName(state, toolName).dataElement);
export const getToolButtonObject = (state, toolName) => state.viewer && state.viewer.toolButtonObjects[toolName];
export const getToolButtonDataElement = (state, toolName) => getHeaderItemByToolName(state, toolName) ? getHeaderItemByToolName(state, toolName).dataElement : '';
export const getToolButtonIcon = (state, toolName) => getHeaderItemByToolName(state, toolName) ? getHeaderItemByToolName(state, toolName).img : '';
export const getToolNamesByGroup = (state, toolGroup) => state.viewer.header.filter(toolButtonObject => toolButtonObject.toolGroup).find(toolButtonObject => toolButtonObject.toolGroup === toolGroup).children.map(buttonObject => buttonObject.toolName);
export const getToolNameByDataElement = (state, dataElement) => Object.keys(state.viewer.toolButtonObjects).find(toolName => getHeaderItemByToolName(state, toolName) && getHeaderItemByToolName(state, toolName).dataElement === dataElement);
export const getActiveToolName = state => state.viewer.activeToolName;
export const getActiveToolStyles = state => state.viewer.activeToolStyles;
export const getActiveDataElement = state => getHeaderItemByToolName(state, state.viewer.activeToolName) ? getHeaderItemByToolName(state, state.viewer.activeToolName).dataElement : '';
export const getListIndex = (state, panel) => {
  if (state.viewer.listIndex[panel] === undefined) {
    return null;
  } else {
    return state.viewer.listIndex[panel];
  }
};
export const getActiveLeftPanel = state => state.viewer.activeLeftPanel;
export const getActiveToolGroup = state => state.viewer.activeToolGroup;
export const getNotePopupId = state => state.viewer.notePopupId;
export const isNoteExpanded = (state, id) => !!state.viewer.expandedNotes[id];
export const isNoteEditing = (state, id) => state.viewer.isNoteEditing && isNoteExpanded(state, id);
export const isAnnotationFocused = (state, id) => Object.keys(state.viewer.expandedNotes).length === 1 && isNoteExpanded(state, id); // Considered focused when it is the only annotation selected
export const getFitMode = state => state.viewer.fitMode;
export const getZoom = state => state.viewer.zoom;
export const getDisplayMode = state => state.viewer.displayMode;
export const getCurrentPage = state => state.viewer.currentPage;
export const getSortStrategy = state => state.viewer.sortStrategy;
export const getRotation = state => state.viewer.rotation;
export const getNoteDateFormat = state => state.viewer.noteDateFormat;
export const isFullScreen = state => state.viewer.isFullScreen;
export const doesDocumentAutoLoad = state => state.viewer.doesAutoLoad;
export const isDocumentLoaded = state => state.viewer.isDocumentLoaded;
export const isDocumentReadOnly = state => state.viewer.isReadOnly;
export const getCustomPanels = state => state.viewer.customPanels;
export const getPageLabels = state => state.viewer.pageLabels;
export const getDisabledCustomPanelTabs = state => {
  return state.viewer.customPanels.reduce((disabledTabs, { tab }) => {
    if (state.viewer.disabledElements[tab.dataElement]) {
      disabledTabs.push(tab.dataElement);
    }
    return disabledTabs;
  }, []);
};
export const isEmbedPrintSupported = state => {
  const isChrome = window.navigator.userAgent.indexOf('Chrome') > -1 && window.navigator.userAgent.indexOf('Edge') === -1;
  const isPDF = getDocumentType(state) === workerTypes.PDF;
  return  isPDF && isChrome && state.viewer.useEmbeddedPrint;
};
export const getCursorOverlayData = state => state.viewer.cursorOverlay;
export const getOpenElements = state => state.viewer.openElements;
export const getAvailablePalettes = (state, activeToolName) => state.viewer.toolButtonObjects[activeToolName] && state.viewer.toolButtonObjects[activeToolName].availablePalettes;
export const getCurrentPalette = (state, activeToolName) => state.viewer.toolButtonObjects[activeToolName] && state.viewer.toolButtonObjects[activeToolName].currentPalette;
export const getIconColor = (state, activeToolName) => state.viewer.toolButtonObjects[activeToolName] && state.viewer.toolButtonObjects[activeToolName].iconColor;
export const getSwipeOrientation = state => state.viewer.swipeOrientation;
export const getCustomNoteFilter = state => state.viewer.customNoteFilter;
export const getZoomList = state => state.viewer.zoomList;

// warning message
export const getWarningMessage = state => state.viewer.warning && state.viewer.warning.message || '';
export const getWarningTitle = state => state.viewer.warning && state.viewer.warning.title || '';
export const getWarningConfirmEvent = state => state.viewer.warning && state.viewer.warning.onConfirm;
export const getWarningConfirmBtnText = state =>  state.viewer.warning && state.viewer.warning.confirmBtnText;
export const getWarningCancelEvent = state =>  state.viewer.warning && state.viewer.warning.onCancel;


// error message
export const getErrorMessage = state => state.viewer.errorMessage || '';

// document
export const getDocument = state => state.document;
export const getDocumentId = state => state.document.id;
export const getDocumentPath = state => state.document.path || state.document.initialDoc;
export const getDocumentFile = state => state.document.file;
export const hasPath = state => !!(state.document.initialDoc || state.advanced.externalPath);
export const getDocumentType = state => state.document.type;
export const getCheckPasswordFunction = state => state.document.checkPassword;
export const getPasswordAttempts = state => state.document.passwordAttempts;
export const getPrintQuality = state => state.document.printQuality;
export const getTotalPages = state => state.document.totalPages;
export const getOutlines = state => state.document.outlines;
export const getLayers = state => state.document.layers;
export const getLoadingProgress = state => Math.min(state.document.documentLoadingProgress, state.document.workerLoadingProgress);
export const getUploadProgress = state => state.document.uploadProgress;
export const isUploading = state => state.document.isUploading;
export const getAccessibleMode = state => !!state.document.accessibleMode;

// user
export const getUserName = state => state.user.name;

// advanced
export const getAdvanced = state => state.advanced;
export const getServerUrl = state => state.advanced.serverUrl;

// search
export const getSearchListeners = state => state.search.listeners;
export const getSearchValue = state => state.search.value;
export const getActiveResult = state => state.search.activeResult;
export const getActiveResultIndex = state => state.search.activeResultIndex;
export const getResults = state => state.search.results;
export const isCaseSensitive = state => state.search.isCaseSensitive;
export const isWholeWord = state => state.search.isWholeWord;
export const isWildcard = state => state.search.isWildcard;
export const isSearchUp = state => state.search.isSearchUp;
export const isAmbientString = state => state.search.isAmbientString;
export const isRegex = state => state.search.isRegex;
export const isSearching = state => state.search.isSearching;
export const isNoResult = state => state.search.noResult;
export const isProgrammaticSearch = state => state.search.isProgrammaticSearch;
export const isProgrammaticSearchFull = state => state.search.isProgrammaticSearchFull;
