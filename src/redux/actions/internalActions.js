import getFilteredDataElements from 'helpers/getFilteredDataElements';
import { isIOS, isAndroid } from 'helpers/device';
import selectors from 'selectors';
import core from 'core';

// viewer
export const disableElement = (dataElement, priority) => (dispatch, getState) => {
  if (dataElement === 'stylePopup') {
    dispatch(disableElements(['toolStylePopup', 'annotationStylePopup'], priority));
  } else {
    const currentPriority = selectors.getDisabledElementPriority(getState(), dataElement);
    if (!currentPriority || priority >= currentPriority) {
      dispatch({ type: 'DISABLE_ELEMENT', payload: { dataElement, priority }});
    }
  }
};
export const disableElements = (dataElements, priority) => (dispatch, getState) => {
  const filteredDataElements = getFilteredDataElements(getState(), dataElements, priority);
  dispatch({ type: 'DISABLE_ELEMENTS', payload: { dataElements: filteredDataElements, priority } });
};
export const enableElement = (dataElement, priority) => (dispatch, getState) => {
  if (dataElement === 'stylePopup') {
    dispatch(enableElements(['toolStylePopup', 'annotationStylePopup'], priority));
  } else {
    const currentPriority = selectors.getDisabledElementPriority(getState(), dataElement);
    if (!currentPriority || priority >= currentPriority) {
      dispatch({ type: 'ENABLE_ELEMENT', payload: { dataElement, priority }});
    }
  }
};
export const enableElements = (dataElements, priority) => (dispatch, getState) => {
  let filteredDataElements = getFilteredDataElements(getState(), dataElements, priority);

  if (!core.isCreateRedactionEnabled()) {
    filteredDataElements = filteredDataElements.filter(ele => ele !== 'redactionButton');
  }

  dispatch({ type: 'ENABLE_ELEMENTS', payload: { dataElements: filteredDataElements, priority } });
};
export const setActiveToolNameAndStyle = toolObject => (dispatch, getState) => {
  const state = getState();
  let name;
  
  if (isIOS || isAndroid) {
    name = toolObject.name;
  } else {
    // on desktop, auto switch between AnnotationEdit and TextSelect is true when you hover on text
    // we do this to prevent this action from spamming the console
    name = (toolObject.name === 'TextSelect') ? 'AnnotationEdit' : toolObject.name;
  }

  if (state.viewer.activeToolName === name) {
    return;
  }
  dispatch({ type: 'SET_ACTIVE_TOOL_NAME_AND_STYLES', payload: { toolName: name, toolStyles: toolObject.defaults || {} } });
};
export const setActiveToolStyles = (toolStyles = {}) => ({ type: 'SET_ACTIVE_TOOL_STYLES', payload: { toolStyles } });
export const setActiveToolGroup = toolGroup => ({ type: 'SET_ACTIVE_TOOL_GROUP', payload: { toolGroup } });
export const setNotePopupId = id => ({ type: 'SET_NOTE_POPUP_ID', payload: { id } });
export const setFitMode = fitMode => ({ type: 'SET_FIT_MODE', payload: { fitMode } });
export const setZoom = zoom => ({ type: 'SET_ZOOM', payload: { zoom } });
export const setDisplayMode = displayMode => ({ type: 'SET_DISPLAY_MODE', payload: { displayMode } });
export const setCurrentPage = currentPage => ({ type: 'SET_CURRENT_PAGE', payload: { currentPage } });
export const setFullScreen = isFullScreen => ({ type: 'SET_FULL_SCREEN', payload: { isFullScreen } });
export const setDocumentLoaded = isDocumentLoaded => ({ type: 'SET_DOCUMENT_LOADED', payload: { isDocumentLoaded } });
export const setReadOnly = isReadOnly => ({ type: 'SET_READ_ONLY', payload: { isReadOnly } });
export const registerTool = tool => ({ type: 'REGISTER_TOOL', payload: { ...tool } });
export const unregisterTool = toolName => ({ type: 'UNREGISTER_TOOL', payload: { toolName } });
export const setToolButtonObjects= toolButtonObjects => ({ type: 'SET_TOOL_BUTTON_OBJECTS', payload: { toolButtonObjects } });
export const setIsNoteEditing = isNoteEditing => (dispatch, getState) => {
  const state = getState();

  if (state.viewer.isNoteEditing !== isNoteEditing) {
    dispatch({ type: 'SET_IS_NOTE_EDITING', payload: { isNoteEditing } });
  }
};
export const expandNote = id => ({ type: 'EXPAND_NOTE', payload: { id } });
export const expandNotes = ids => ({ type: 'EXPAND_NOTES', payload: { ids } });
export const collapseNote = id => ({ type: 'COLLAPSE_NOTE', payload: { id } });
export const collapseAllNotes = () => (dispatch, getState) => {
  const state = getState();
  const isAnyNoteExpanded = Object.keys(state.viewer.expandedNotes).length > 0;

  if (isAnyNoteExpanded) {
    dispatch({ type: 'COLLAPSE_ALL_NOTES' });
  }
};
export const setHeaderItems = (header, headerItems) => ({ type: 'SET_HEADER_ITEMS', payload: { header, headerItems } });
export const setColorPalette = (colorMapKey, colorPalette) => ({ type: 'SET_COLOR_PALETTE', payload: { colorMapKey, colorPalette } });
export const setIconColor = (colorMapKey, color) => ({ type: 'SET_ICON_COLOR', payload: { colorMapKey, color } });
export const setColorMap = colorMap => ({ type: 'SET_COLOR_MAP', payload: { colorMap } });

// document
export const setDocumentId = documentId => ({ type: 'SET_DOCUMENT_ID', payload: { documentId } });
export const setDocumentPath = documentPath => ({ type: 'SET_DOCUMENT_PATH', payload: { documentPath } });
export const setDocumentFile = documentFile => ({ type: 'SET_DOCUMENT_FILE', payload: { documentFile } });
export const setDocumentType = type => ({ type: 'SET_DOCUMENT_TYPE', payload: { type }});
export const setPDFDoc = pdfDoc => ({ type: 'SET_PDF_DOC', payload: { pdfDoc }});
export const setFilename = filename => ({ type: 'SET_FILENAME', payload: { filename } });
export const setTotalPages = totalPages => ({ type: 'SET_TOTAL_PAGES', payload: { totalPages } });
export const setOutlines = outlines => ({ type: 'SET_OUTLINES', payload: { outlines } });
export const setCheckPasswordFunction = func => ({ type: 'SET_CHECKPASSWORD', payload: { func } });
export const setPasswordAttempts = attempt => ({ type: 'SET_PASSWORD_ATTEMPTS', payload: { attempt } });
export const setPrintQuality = quality => ({ type: 'SET_PRINT_QUALITY', payload: { quality } });
export const setDocumentLoadingProgress = documentLoadingProgress => ({ type: 'SET_DOCUMENT_LOADING_PROGRESS', payload: { documentLoadingProgress }});
export const setWorkerLoadingProgress = workerLoadingProgress => ({ type: 'SET_WORKER_LOADING_PROGRESS', payload: { workerLoadingProgress }});
export const resetLoadingProgress = () => ({ type: 'RESET_LOADING_PROGRESS' });
export const setPassword = password => ({ type: 'SET_PASSWORD', payload: { password } });

// user
export const setUserName = userName => ({ type: 'SET_USER_NAME', payload: { userName } });
export const setAdminUser = isAdminUser => ({ type: 'SET_ADMIN_USER', payload: { isAdminUser } });

// advanced
export const setStreaming = streaming => ({ type: 'SET_STREAMING', payload: { streaming } });
export const setDecryptFunction = decryptFunction => ({ type: 'SET_DECRYPT_FUNCTION', payload: { decryptFunction } });
export const setDecryptOptions = decryptOptions => ({ type: 'SET_DECRYPT_OPTIONS', payload: { decryptOptions } });
export const setEngineType = type => ({ type: 'SET_ENGINE_TYPE', payload: { type } });
export const setCustomHeaders = customHeaders => ({ type: 'SET_CUSTOM_HEADERS', payload: { customHeaders } });
export const setWithCredentials = withCredentials => ({ type: 'SET_WITH_CREDENTIALS', payload: { withCredentials } });

// search
export const searchText = (searchValue, options) => ({ type: 'SEARCH_TEXT', payload: { searchValue, options } });
export const searchTextFull = (searchValue, options) => ({ type: 'SEARCH_TEXT_FULL', payload: { searchValue, options } });
export const addSearchListener = func => ({ type: 'ADD_SEARCH_LISTENER', payload: { func } });
export const removeSearchListener = func => ({ type: 'REMOVE_SEARCH_LISTENER', payload: { func } });
export const setSearchValue = value => ({ type: 'SET_SEARCH_VALUE', payload: { value } });
export const setActiveResult = activeResult => ({ type: 'SET_ACTIVE_RESULT', payload: { activeResult } });
export const setActiveResultIndex = index => ({ type: 'SET_ACTIVE_RESULT_INDEX', payload: { index } });
export const addResult = result => ({ type: 'ADD_RESULT', payload: { result } });
export const setCaseSensitive = isCaseSensitive => ({ type: 'SET_CASE_SENSITIVE', payload: { isCaseSensitive } });
export const setWholeWord = isWholeWord => ({ type: 'SET_WHOLE_WORD', payload: { isWholeWord } });
export const setIsSearching = isSearching => ({ type: 'SET_IS_SEARCHING', payload: { isSearching } });
export const setNoResult = noResult => ({ type: 'SET_NO_RESULT', payload: { noResult } });
export const resetSearch = () => ({ type: 'RESET_SEARCH', payload: { } });
export const setIsProgrammaticSearch = isProgrammaticSearch => ({ type: 'SET_IS_PROG_SEARCH', payload: { isProgrammaticSearch } });
export const setIsProgrammaticSearchFull = isProgrammaticSearchFull => ({ type: 'SET_IS_PROG_SEARCH_FULL', payload: { isProgrammaticSearchFull } });