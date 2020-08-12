import { isChrome, isAndroid } from 'helpers/device';

// viewer
export const getLastPickedToolForGroup = (state, group) => state.viewer.lastPickedToolForGroup[group];
export const getStandardStamps = state => state.viewer.standardStamps;
export const getCustomStamps = state => state.viewer.customStamps;
export const getSelectedStampIndex = state => state.viewer.selectedStampIndex;
export const getSelectedStamp = state => {
  const standardStamps = getStandardStamps(state);
  const customStamps = getCustomStamps(state);
  const index = getSelectedStampIndex(state);
  let selectedStamp = standardStamps[index];
  // selected stamp is not found in standard stamps, search dyamic stamps
  if (!selectedStamp && standardStamps.length) {
    selectedStamp = customStamps[index - standardStamps.length];
  }
  return selectedStamp;
};
export const getSavedSignatures = state => state.viewer.savedSignatures;
export const getSelectedSignatureIndex = state => state.viewer.selectedSignatureIndex;
export const getSelectedSignature = state => getSavedSignatures(state)[getSelectedSignatureIndex(state)];

export const getNotesInLeftPanel = state =>
  state.viewer.notesInLeftPanel;
export const getLeftPanelWidth = state =>
  state.viewer.panelWidths.leftPanel;
export const getSearchPanelWidth = state =>
  state.viewer.panelWidths.searchPanel;
export const getNotesPanelWidth = state =>
  state.viewer.panelWidths.notesPanel;

export const isElementDisabled = (state, dataElement) =>
  state.viewer.disabledElements[dataElement]?.disabled;

export const isElementOpen = (state, dataElement) =>
  state.viewer.openElements[dataElement] &&
  !state.viewer.disabledElements[dataElement]?.disabled;

export const allButtonsInGroupDisabled = (state, toolGroup) => {
  const toolButtonObjects = getToolButtonObjects(state);
  const dataElements = Object.values(toolButtonObjects)
    .filter(({ group }) => group === toolGroup)
    .map(({ dataElement }) => dataElement);

  return dataElements.every(dataElement =>
    isElementDisabled(state, dataElement),
  );
};

const getToolbarGroupDataElements = state => {
  return Object.keys(state.viewer.headers)
    .filter(key => key.includes('toolbarGroup-'));
};

export const getEnabledToolbarGroups = state => {
  const toolbarGroupDataElements = getToolbarGroupDataElements(state);
  return toolbarGroupDataElements.filter(dataElement => {
    const headerItems = state.viewer.headers[dataElement];
    const toolGroupButtons = headerItems.filter(({ dataElement }) => {
      return dataElement && dataElement.includes('ToolGroupButton');
    });
    const isEveryToolGroupButtonDisabled  = !dataElement.includes('toolbarGroup-View') && toolGroupButtons.every(({ dataElement: toolGroupDataElement }) => {
      return isElementDisabled(state, toolGroupDataElement);
    });
    return !isElementDisabled(state, `${dataElement}`) && !isEveryToolGroupButtonDisabled;
  });
};

export const getCurrentToolbarGroup = state =>
  state.viewer.toolbarGroup;

export const getActiveTheme = state =>
  state.viewer.activeTheme;

export const getDefaultHeaderItems = state => {
  return state.viewer.headers.default;
};

export const getActiveHeaderItems = state => {
  return state.viewer.headers[state.viewer.activeHeaderGroup];
};

export const getDisabledElementPriority = (state, dataElement) =>
  state.viewer.disabledElements[dataElement]?.priority;

export const getToolsHeaderItems = state => {
  const toolbarGroup = getCurrentToolbarGroup(state);
  return state.viewer.headers[toolbarGroup] || [];
};

export const getToolButtonObjects = state => {
  return state.viewer.toolButtonObjects;
};

export const getActiveToolNamesForActiveToolGroup = state => {
  const { activeToolGroup } = state.viewer;
  const toolButtonObjects = getToolButtonObjects(state);
  return Object.keys(toolButtonObjects).filter(
    toolName => {
      const toolButtonObject = toolButtonObjects[toolName];
      const { group, dataElement } = toolButtonObject;
      return group === activeToolGroup && !isElementDisabled(state, dataElement);
    },
  );
};

export const getToolButtonDataElements = (state, toolNames) => {
  const toolButtonObjects = getToolButtonObjects(state);
  return toolNames
    .map(toolName => toolButtonObjects[toolName]?.dataElement)
    .filter(Boolean);
};

export const getToolButtonObject = (state, toolName) =>
  getToolButtonObjects(state)[toolName];

export const getToolButtonDataElement = (state, toolName) =>
  getToolButtonObject(state, toolName)?.dataElement;

export const getToolNamesByGroup = (state, toolGroup) => {
  const toolButtonObjects = getToolButtonObjects(state);
  return Object.keys(toolButtonObjects).filter(
    name => toolButtonObjects[name].group === toolGroup,
  );
};

export const getToolNameByDataElement = (state, dataElement) => {
  const toolButtonObjects = getToolButtonObjects(state);
  return Object.keys(toolButtonObjects).find(
    name => toolButtonObjects[name].dataElement === dataElement,
  );
};


export const getActiveToolName = state => state.viewer.activeToolName;

export const getActiveToolStyles = state => state.viewer.activeToolStyles;

export const getActiveLeftPanel = state => state.viewer.activeLeftPanel;

export const getActiveToolGroup = state => state.viewer.activeToolGroup;

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

export const isDocumentReadOnly = state => state.viewer.isReadOnly;

export const getCustomPanels = state => state.viewer.customPanels;

export const getCustomModals = state => state.viewer.customModals;

export const getPageLabels = state => state.viewer.pageLabels;

export const getSelectedThumbnailPageIndexes = state => state.viewer.selectedThumbnailPageIndexes;

export const getDisabledCustomPanelTabs = state =>
  state.viewer.customPanels.reduce((disabledTabs, { tab }) => {
    if (state.viewer.disabledElements[tab.dataElement]?.disabled) {
      disabledTabs.push(tab.dataElement);
    }
    return disabledTabs;
  }, []);

export const isEmbedPrintSupported = state => isChrome && !isAndroid && state.viewer.useEmbeddedPrint;

export const getColorMap = state => state.viewer.colorMap;

export const getCursorOverlayData = state => state.viewer.cursorOverlay;

export const getOpenElements = state => state.viewer.openElements;

export const getDisabledElements = state => state.viewer.disabledElements;

export const getCurrentPalette = (state, colorMapKey) =>
  state.viewer.colorMap[colorMapKey]?.currentPalette;

export const getIconColor = (state, colorMapKey) =>
  state.viewer.colorMap[colorMapKey]?.iconColor;

export const getCustomNoteFilter = state => state.viewer.customNoteFilter;

export const getIsReplyDisabled = state => state.viewer.isReplyDisabledFunc;

export const getZoomList = state => state.viewer.zoomList;

export const getMeasurementUnits = state => state.viewer.measurementUnits;

export const getIsNoteEditing = state => state.viewer.isNoteEditing;

export const getMaxSignaturesCount = state => state.viewer.maxSignaturesCount;

export const getUserData = state => state.viewer.userData;

export const getIsMentionEnabled = state => !!state.viewer.userData;

export const getSignatureFonts = state => state.viewer.signatureFonts;

export const getSelectedTab = (state, id) => state.viewer.tab[id];

export const getCustomElementOverrides = (state, dataElement) => state.viewer.customElementOverrides[dataElement];

export const getPopupItems = (state, popupDataElement) =>
  state.viewer[popupDataElement] || [];

export const getIsThumbnailMergingEnabled = state => state.viewer.isThumbnailMerging;

export const getIsThumbnailReorderingEnabled = state => state.viewer.isThumbnailReordering;

export const getIsThumbnailMultiselectEnabled = state => state.viewer.isThumbnailMultiselect;

export const getIsMultipleViewerMerging = state => state.viewer.isMultipleViewerMerging;

export const getAllowPageNavigation = state => state.viewer.allowPageNavigation;

export const getCustomMeasurementOverlay = state => state.viewer.customMeasurementOverlay;

export const getAnnotationContentOverlayHandler = state => state.viewer.annotationContentOverlayHandler;

export const getEnableMouseWheelZoom = state => state.viewer.enableMouseWheelZoom;

// warning message
export const getWarningMessage = state => state.viewer.warning?.message || '';

export const getWarningTitle = state => state.viewer.warning?.title || '';

export const getWarningConfirmEvent = state => state.viewer.warning?.onConfirm;

export const getWarningConfirmBtnText = state =>
  state.viewer.warning?.confirmBtnText;

export const getWarningCancelEvent = state => state.viewer.warning?.onCancel;

export const isAccessibleMode = state => state.viewer.isAccessibleMode;

// error message
export const getErrorMessage = state => state.viewer.errorMessage || '';

// document
export const getPasswordAttempts = state => state.document.passwordAttempts;

export const getPrintQuality = state => state.document.printQuality;

export const getTotalPages = state => state.document.totalPages;

export const getOutlines = state => state.document.outlines;

export const getBookmarks = state => state.document.bookmarks;

export const getLayers = state => state.document.layers;

export const getLoadingProgress = state => state.document.loadingProgress;

// user
export const getUserName = state => state.user.name;

// advanced
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

export const getSearchErrorMessage = state => state.search.errorMessage;

export const isProgrammaticSearch = state => state.search.isProgrammaticSearch;

export const isProgrammaticSearchFull = state =>
  state.search.isProgrammaticSearchFull;

export const getNoteTransformFunction = state => state.viewer.noteTransformFunction;

export const isSnapModeEnabled = state => state.viewer.isSnapModeEnabled;
