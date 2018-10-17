import { documentTypes } from 'constants/types';

// viewer
export const isElementDisabled = (state, dataElement) => state.viewer.disabledElements[dataElement] && state.viewer.disabledElements[dataElement].disabled;
export const isToolDisabled = (state, toolName) => state.viewer.disabledTools[toolName];
export const isElementOpen = (state, dataElement) => {
  if (state.viewer.disabledElements[dataElement]) {
    return state.viewer.openElements[dataElement] && !state.viewer.disabledElements[dataElement].disabled;
  }
  
  return state.viewer.openElements[dataElement];
};
export const getActiveHeaderItems = state => state.viewer.headers[state.viewer.activeHeaderGroup];
export const getDisabledElementPriority = (state, dataElement) => state.viewer.disabledElements[dataElement] && state.viewer.disabledElements[dataElement].priority;
export const getToolButtonObjects = state => state.viewer.toolButtonObjects;
export const getToolButtonObject = (state, toolName) => state.viewer.toolButtonObjects[toolName];
export const getToolNamesByGroup = (state, toolGroup) => Object.keys(state.viewer.toolButtonObjects).filter(name => state.viewer.toolButtonObjects[name].group === toolGroup);
export const getActiveToolName = state => state.viewer.activeToolName;
export const getActiveToolStyles = state => state.viewer.activeToolStyles;
export const getActiveLeftPanel = state => state.viewer.activeLeftPanel;
export const getActiveToolGroup = state => state.viewer.activeToolGroup;
export const getNotePopupId = state => state.viewer.notePopupId;
export const isNoteExpanded = (state, id) => !!state.viewer.expandedNotes[id];
export const isNoteEditing = (state, id) => state.viewer.isNoteEditing && isNoteExpanded(state, id);
export const getFitMode = state => state.viewer.fitMode;
export const getZoom = state => state.viewer.zoom;
export const getDisplayMode = state => state.viewer.displayMode;
export const getCurrentPage = state => state.viewer.currentPage;
export const getSortNotesBy = state => state.viewer.sortNotesBy;
export const isFullScreen = state => state.viewer.isFullScreen;
export const doesDocumentAutoLoad = state => state.viewer.doesAutoLoad;
export const isDocumentLoaded = state => state.viewer.isDocumentLoaded;
export const isDocumentReadOnly = state => state.viewer.isReadOnly;
export const getLoadingMessage = state => state.viewer.loadingMessage;

// document
export const getDocument = state => state.document;
export const getDocumentId = state => state.document.id;
export const getDocumentPath = state => state.document.path;
export const getDocumentFile = state => state.document.file;
export const hasPath = state => !!(state.document.path || state.advanced.externalPath);
export const getDocumentType = state => state.document.type;
export const isEmbedPrintSupported = state => {
  const isChrome = window.navigator.userAgent.indexOf('Chrome') > -1 && window.navigator.userAgent.indexOf('Edge') === -1;
  const isPDF = getDocumentType(state) === documentTypes.PDF;

  return  isPDF && isChrome;
};
export const getCheckPasswordFunction = state => state.document.checkPassword;
export const getPrintQuality = state => state.document.printQuality;
export const getTotalPages = state => state.document.totalPages;
export const getOutlines = state => state.document.outlines;

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