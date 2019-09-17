import { workerTypes } from 'constants/types';

// viewer
export const isElementDisabled = (state, dataElement) =>
  state.viewer.disabledElements[dataElement]?.disabled;

export const isFeatureDisabled = (state, feature) =>
  state.viewer.disabledFeatures[feature];

export const isElementOpen = (state, dataElement) =>
  state.viewer.openElements[dataElement] &&
  !state.viewer.disabledElements[dataElement]?.disabled;

export const allButtonsInGroupDisabled = (state, toolGroup) => {
  const toolButtonObjects = getToolButtonObjects(state);
  const dataElements = Object.values(toolButtonObjects)
    .filter(({ group }) => group === toolGroup)
    .map(({ dataElement }) => dataElement);

  const result = dataElements.every(dataElement => isElementDisabled(state, dataElement));

  return result;
};

export const isElementActive = (state, tool) => {
  const {
    viewer: {
      activeToolName,
      headers: { tools = [] },
    },
  } = state;
  const { element, dataElement } = tool;

  return (
    isElementOpen(state, element) ||
    tools.some(
      tool =>
        tool.dataElement === dataElement && tool.toolName === activeToolName,
    )
  );
};

export const getActiveHeaderItems = state =>
  state.viewer.headers[state.viewer.activeHeaderGroup];

export const getDisabledElementPriority = (state, dataElement) =>
  state.viewer.disabledElements[dataElement]?.priority;

export const getToolButtonObjects = state => state.viewer.toolButtonObjects;

export const getToolButtonDataElements = (state, toolNames) =>
  toolNames.map(
    toolName => state.viewer.toolButtonObjects[toolName].dataElement,
  );

export const getToolButtonObject = (state, toolName) =>
  state.viewer.toolButtonObjects[toolName];

export const getToolButtonDataElement = (state, toolName) =>
  state.viewer.toolButtonObjects[toolName].dataElement;

export const getToolNamesByGroup = (state, toolGroup) =>
  Object.keys(state.viewer.toolButtonObjects).filter(
    name => state.viewer.toolButtonObjects[name].group === toolGroup,
  );

export const getToolNameByDataElement = (state, dataElement) =>
  Object.keys(state.viewer.toolButtonObjects).find(
    name => state.viewer.toolButtonObjects[name].dataElement === dataElement,
  );

export const getActiveToolName = state => state.viewer.activeToolName;

export const getActiveToolStyles = state => state.viewer.activeToolStyles;

export const getActiveLeftPanel = state => state.viewer.activeLeftPanel;

export const getActiveToolGroup = state => state.viewer.activeToolGroup;

export const getLeftPanelWidth = state => state.viewer.leftPanelWidth;

export const getNotePopupId = state => state.viewer.notePopupId;

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

export const getDisabledCustomPanelTabs = state =>
  state.viewer.customPanels.reduce((disabledTabs, { tab }) => {
    if (state.viewer.disabledElements[tab.dataElement]?.disabled) {
      disabledTabs.push(tab.dataElement);
    }
    return disabledTabs;
  }, []);

export const isEmbedPrintSupported = () => {
  return false;
};

export const getColorMap = state => state.viewer.colorMap;

export const getCursorOverlayData = state => state.viewer.cursorOverlay;

export const getOpenElements = state => state.viewer.openElements;

export const getCurrentPalette = (state, colorMapKey) =>
  state.viewer.colorMap[colorMapKey]?.currentPalette;

export const getIconColor = (state, colorMapKey) =>
  state.viewer.colorMap[colorMapKey]?.iconColor;

export const getCustomNoteFilter = state => state.viewer.customNoteFilter;

export const getZoomList = state => state.viewer.zoomList;

export const getMeasurementUnits = state => state.viewer.measurementUnits;

export const getIsNoteEditing = state => state.viewer.isNoteEditing;

export const getMaxSignaturesCount = state => state.viewer.maxSignaturesCount;

// warning message
export const getWarningMessage = state => state.viewer.warning?.message || '';

export const getWarningTitle = state => state.viewer.warning?.title || '';

export const getWarningConfirmEvent = state => state.viewer.warning?.onConfirm;

export const getWarningConfirmBtnText = state =>
  state.viewer.warning?.confirmBtnText;

export const getWarningCancelEvent = state => state.viewer.warning?.onCancel;

// error message
export const getErrorMessage = state => state.viewer.errorMessage || '';

// document
export const getDocument = state => state.document;

export const getDocumentId = state => state.document.id;

export const getDocumentPath = state =>
  state.document.path || state.document.initialDoc;

export const getDocumentFile = state => state.document.file;

export const hasPath = state =>
  !!(state.document.initialDoc || state.advanced.externalPath);

export const getDocumentType = state => state.document.type;

export const getCheckPasswordFunction = state => state.document.checkPassword;

export const getPasswordAttempts = state => state.document.passwordAttempts;

export const getPrintQuality = state => state.document.printQuality;

export const getTotalPages = state => state.document.totalPages;

export const getOutlines = state => state.document.outlines;

export const getLoadingProgress = state =>
  (state.document.documentLoadingProgress +
    state.document.workerLoadingProgress) /
  2;

export const getUploadProgress = state => state.document.uploadProgress;

export const isUploading = state => state.document.isUploading;

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

export const isProgrammaticSearchFull = state =>
  state.search.isProgrammaticSearchFull;
