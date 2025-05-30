import getFilteredDataElements from 'helpers/getFilteredDataElements';
import { getEmbeddedFileData } from 'helpers/getFileAttachments';
import { isAndroid, isIOS } from 'helpers/device';
import selectors from 'selectors';
import core from 'core';
import DataElements from 'constants/dataElement';
import { setToolbarGroup, openElement } from './exposedActions';
import { panelNames } from 'constants/panel';

// viewer
/**
 * Remove an element from DOM
 * @ignore
 * @param {string} dataElement the value of the data-element attribute of the element
 * @param {number} priority a value that indicates how specific this element is disabled.
 * If a element is disabled with priority 3, then calling enableElement with priority 2 won't enable it back because the element is disabled in a more specific manner.
 * This priority argument is used by external APIs such as instance.disableElements and instance.disableFeatures(...)
 * For example, instance.disableElements has priority 3 and instance.enableFeatures has priority 1.
 * So calling instance.enableFeatures([instance.UI.Feature.NotesPanel]) won't enable the notes panel if it's disabled by instance.disableElements(['notesPanel'])
 */
export const disableElement = (dataElement, priority) => (
  dispatch,
  getState,
) => {
  if (dataElement === DataElements.LEFT_PANEL) {
    dispatch(disableElements([DataElements.LEFT_PANEL, DataElements.LEFT_PANEL_BUTTON], priority));
  } else if (dataElement === 'stylePopup') {
    dispatch(
      disableElements(['toolStylePopup', 'annotationStylePopup'], priority),
    );
  } else {
    const currentPriority = selectors.getDisabledElementPriority(
      getState(),
      dataElement,
    );
    if (!currentPriority || priority >= currentPriority) {
      dispatch({ type: 'DISABLE_ELEMENT', payload: { dataElement, priority } });
      updateCurrentToolbarGroup([dataElement], dispatch, getState);
    }
  }
};
export const disableElements = (dataElements, priority) => (
  dispatch,
  getState,
) => {
  const filteredDataElements = getFilteredDataElements(
    getState(),
    dataElements,
    priority,
  );
  dispatch({
    type: 'DISABLE_ELEMENTS',
    payload: { dataElements: filteredDataElements, priority },
  });

  updateCurrentToolbarGroup(filteredDataElements, dispatch, getState);
};

// A helper that updates the current toolbar group if the current toolbar group is disabled
const updateCurrentToolbarGroup = (dataElements, dispatch, getState) => {
  // Check if we disabled a toolbar group
  const disabledToolbarGroups = dataElements.filter((dataElement) => DataElements.TOOLBAR_GROUPS.includes(dataElement));
  if (disabledToolbarGroups.length > 0) {
    // If we did check if it is the currently active toolbar group
    const activeToolbarGroup = selectors.getCurrentToolbarGroup(getState());
    const wasActiveToolbarGroupDisabled = disabledToolbarGroups.includes(activeToolbarGroup);
    // If it is disabled, switch to the first enabled toolbar group, or the view group if none are enabled
    if (wasActiveToolbarGroupDisabled) {
      const enabledToolbarGroups = selectors.getEnabledToolbarGroups(getState());
      const firstEnabledToolbarGroup = enabledToolbarGroups[0] || DataElements.VIEW_TOOLBAR_GROUP;
      // Set the toolbar group, with no default tool selected by default
      setToolbarGroup(firstEnabledToolbarGroup, false)(dispatch, getState);
    }
  }
};
export const enableElement = (dataElement, priority) => (
  dispatch,
  getState,
) => {
  if (dataElement === DataElements.LEFT_PANEL) {
    dispatch(enableElements([DataElements.LEFT_PANEL, DataElements.LEFT_PANEL_BUTTON], priority));
  } else if (dataElement === 'stylePopup') {
    dispatch(
      enableElements(['toolStylePopup', 'annotationStylePopup'], priority),
    );
  } else {
    const currentPriority = selectors.getDisabledElementPriority(
      getState(),
      dataElement,
    );
    if (!currentPriority || priority >= currentPriority) {
      dispatch({ type: 'ENABLE_ELEMENT', payload: { dataElement, priority } });
    }
  }
};
export const enableElements = (dataElements, priority) => (
  dispatch,
  getState,
) => {
  let filteredDataElements = getFilteredDataElements(
    getState(),
    dataElements,
    priority,
  );

  if (!core.isCreateRedactionEnabled()) {
    filteredDataElements = filteredDataElements.filter(
      (ele) => ele !== 'redactionButton',
    );
  }

  dispatch({
    type: 'ENABLE_ELEMENTS',
    payload: { dataElements: filteredDataElements, priority },
  });
};

export const addPortfolioTab = ({ fileObject, name, extension }) => async (dispatch, getState) => {
  const state = getState();
  const tabManager = selectors.getTabManager(state);
  tabManager.addTab(
    await getEmbeddedFileData(fileObject),
    {
      setActive: true,
      extension: extension,
      filename: name,
    },
  );
};

export const setIsElementHidden = (dataElement, isHidden) => ({
  type: 'SET_IS_ELEMENT_HIDDEN',
  payload: { dataElement, isHidden }
});
export const setThumbnailMerging = (useThumbnailMerging = true) => ({
  type: 'SET_THUMBNAIL_MERGING',
  payload: { useThumbnailMerging },
});
export const setThumbnailReordering = (useThumbnailReordering = true) => ({
  type: 'SET_THUMBNAIL_REORDERING',
  payload: { useThumbnailReordering },
});
export const setThumbnailMultiselect = (useThumbnailMultiselect = true) => ({
  type: 'SET_THUMBNAIL_MULTISELECT',
  payload: { useThumbnailMultiselect },
});
export const setIsMultipleViewerMerging = (isMultipleViewerMerging = false) => ({
  type: 'SET_MULTI_VIEWER_MERGING',
  payload: { isMultipleViewerMerging },
});
export const updateCalibrationInfo = ({ isCalibration = true, tempScale = '', previousToolName, isFractionalUnit = false, defaultUnit = '' }) => ({
  type: 'UPDATE_CALIBRATION_INFO',
  payload: { isCalibration, tempScale, previousToolName, isFractionalUnit, defaultUnit }
});
export const setIsAddingNewScale = (isAddingNewScale = false) => ({
  type: 'SET_IS_ADDING_NEW_SCALE',
  payload: { isAddingNewScale }
});
export const updateDeleteScale = (deleteScale = '') => ({
  type: 'UPDATE_DELETE_SCALE',
  payload: { deleteScale }
});
export const setEnableNotesPanelVirtualizedList = (enableNotesPanelVirtualizedList = true) => ({
  type: 'SET_ENABLE_NOTE_PANEL_VIRTUALIZED_LIST',
  payload: { enableNotesPanelVirtualizedList },
});
export const setNotesShowLastUpdatedDate = (notesShowLastUpdatedDate = false) => ({
  type: 'SET_NOTES_SHOW_LAST_UPDATED_DATE',
  payload: { notesShowLastUpdatedDate },
});
export const setAllowPageNavigation = (allowPageNavigation = true) => ({
  type: 'SET_ALLOW_PAGE_NAVIGATION',
  payload: { allowPageNavigation },
});
export const setLastPickedToolForGroup = (group, toolName) => ({
  type: 'SET_LAST_PICKED_TOOL_FOR_GROUP',
  payload: { group, toolName },
});
export const setEnableToolGroupReordering = (enableToolGroupReordering = true) => ({
  type: 'ENABLE_TOOL_GROUP_REORDERING',
  payload: { enableToolGroupReordering },
});
export const setActiveToolNameAndStyle = (toolObject) => (dispatch, getState) => {
  const state = getState();
  let name;

  if (isIOS || isAndroid) {
    name = toolObject.name;
  } else {
    // on desktop, auto switch between AnnotationEdit and TextSelect is true when you hover on text
    // we do this to prevent this action from spamming the console
    const toolsName = window.Core.Tools.ToolNames;
    name = toolObject.name === toolsName['TEXT_SELECT'] || toolObject.name === toolsName['OFFICE_EDITOR_CONTENT_SELECT'] ? toolsName['EDIT'] : toolObject.name;
  }

  if (state.viewer.activeToolName === name) {
    return;
  }

  dispatch({
    type: 'SET_ACTIVE_TOOL_NAME_AND_STYLES',
    payload: { toolName: name, toolStyles: toolObject.defaults || {} },
  });
};
export const setActiveToolStyles = (toolStyles = {}) => ({
  type: 'SET_ACTIVE_TOOL_STYLES',
  payload: { toolStyles },
});
export const setCustomColor = (customColor = {}) => ({
  type: 'SET_CUSTOM_COLOR',
  payload: { customColor },
});
export const setCustomColors = (customColors = []) => ({
  type: 'SET_CUSTOM_COLORS',
  payload: { customColors },
});
export const setActiveToolGroup = (toolGroup) => (dispatch, getState) => {
  const currentActiveToolGroup = selectors.getActiveToolGroup(getState());
  const toolbarGroup = selectors.getCurrentToolbarGroup(getState());

  if (currentActiveToolGroup === toolGroup) {
    return;
  }

  dispatch({
    type: 'SET_ACTIVE_TOOL_GROUP',
    payload: { toolGroup, toolbarGroup },
  });
};

export const setActiveTabInPanel = (tabPanel, wrapperPanel) => (dispatch, getState) => {
  const currentActivePanel = selectors.getActiveTabInPanel(getState(), wrapperPanel);
  if (currentActivePanel === tabPanel) {
    return;
  }
  const state = getState();
  const targetPanel = selectors.getGenericPanels(state).find((panel) => panel.dataElement === wrapperPanel);
  if (!targetPanel) {
    console.warn(`TabPanel with dataElement ${wrapperPanel} does not exist.`);
    return;
  }

  const containsTab = targetPanel.panelsList.some((panel) => panel.render === tabPanel);
  if (!containsTab) {
    console.warn(`Panel with dataElement ${tabPanel} does not exist inside ${wrapperPanel}. The tab panel contains the following panels:\n${targetPanel.panelsList.map((panel) => panel.render).join(',\n')}`);
    return;
  }

  dispatch({
    type: 'SET_ACTIVE_TAB_IN_PANEL',
    payload: { wrapperPanel, tabPanel },
  });
};

export const openRedactionPanel = () => (dispatch, getState) => {
  const state = getState();
  const featureFlags = selectors.getFeatureFlags(state);
  const { customizableUI } = featureFlags;

  if (customizableUI) {
    // is the panel inside a tab panel or a standalone panel?
    const tabPanels = selectors.getGenericPanels(state).filter((panel) => panel.dataElement === panelNames.TABS);
    const tabPanelWithRedaction = tabPanels.find((panel) => panel.panelsList.some((panel) => panel.render === panelNames.REDACTION));
    if (tabPanelWithRedaction) {
      dispatch(setActiveTabInPanel(panelNames.REDACTION, tabPanelWithRedaction.dataElement));
      dispatch(openElement(tabPanelWithRedaction.dataElement));
    } else {
      dispatch(openElement(panelNames.REDACTION));
    }
  } else {
    dispatch(openElement(panelNames.REDACTION));
  }
};

export const setSelectedScale = (selectedScale) => ({
  type: 'SET_SELECTED_SCALE',
  payload: { selectedScale }
});

export const setNotePopupId = (id) => ({
  type: 'SET_NOTE_POPUP_ID',
  payload: { id },
});
export const triggerNoteEditing = () => ({
  type: 'SET_NOTE_EDITING',
  payload: { isNoteEditing: true },
});
export const finishNoteEditing = () => ({
  type: 'SET_NOTE_EDITING',
  payload: { isNoteEditing: false },
});
export const setFitMode = (fitMode) => ({
  type: 'SET_FIT_MODE',
  payload: { fitMode },
});
export const setZoom = (zoom, documentViewerKey = 1) => ({ type: 'SET_ZOOM', payload: { zoom, documentViewerKey } });
export const setRotation = (rotation) => ({
  type: 'SET_ROTATION',
  payload: { rotation },
});
export const setDisplayMode = (displayMode) => ({
  type: 'SET_DISPLAY_MODE',
  payload: { displayMode },
});
export const setCurrentPage = (currentPage) => ({
  type: 'SET_CURRENT_PAGE',
  payload: { currentPage },
});
export const setFullScreen = (isFullScreen) => ({
  type: 'SET_FULL_SCREEN',
  payload: { isFullScreen },
});
export const setReadOnly = (isReadOnly) => ({
  type: 'SET_READ_ONLY',
  payload: { isReadOnly },
});
export const registerTool = (tool) => ({
  type: 'REGISTER_TOOL',
  payload: { ...tool },
});
export const unregisterTool = (toolName) => ({
  type: 'UNREGISTER_TOOL',
  payload: { toolName },
});
export const setToolButtonObjects = (toolButtonObjects) => ({
  type: 'SET_TOOL_BUTTON_OBJECTS',
  payload: { toolButtonObjects },
});
export const setHeaderItems = (header, headerItems) => ({
  type: 'SET_HEADER_ITEMS',
  payload: { header, headerItems },
});
export const setCustomHeadersAdditionalProperties = (customHeader, additionalProperties) => ({
  type: 'SET_CUSTOM_HEADERS_ADDITIONAL_PROPERTIES',
  payload: { customHeader, additionalProperties },
});
export const setPopupItems = (dataElement, items) => ({
  type: 'SET_POPUP_ITEMS',
  payload: {
    dataElement,
    items,
  },
});
export const setMenuOverlayItems = (items) => ({
  type: 'SET_MENUOVERLAY_ITEMS',
  payload: {
    items,
  },
});
export const setActivePalette = (colorMapKey, colorPalette) => ({
  type: 'SET_ACTIVE_PALETTE',
  payload: { colorMapKey, colorPalette },
});

export const setIconColor = (colorMapKey, color) => ({
  type: 'SET_ICON_COLOR',
  payload: { colorMapKey, color },
});
export const setColorMap = (colorMap) => ({
  type: 'SET_COLOR_MAP',
  payload: { colorMap },
});
export const setLeftPanelWidth = (width) => ({
  type: 'SET_LEFT_PANEL_WIDTH',
  payload: { width },
});
export const disableReplyForAnnotations = (func) => ({
  type: 'SET_REPLY_DISABLED_FUNC',
  payload: { func },
});
export const setMouseWheelZoom = (enableMouseWheelZoom = true) => ({
  type: 'SET_MOUSE_WHEEL_ZOOM',
  payload: { enableMouseWheelZoom },
});
export const setReaderMode = (isReaderMode) => ({
  type: 'SET_READER_MODE',
  payload: { isReaderMode },
});
export const setThumbnailSelectingPages = (isSelecting = true) => ({
  type: 'SET_THUMBNAIL_PAGE_SELECT',
  payload: { isSelecting },
});
export const setPageManipulationOverlayItems = (items) => ({
  type: 'SET_PAGE_MANIPULATION_OVERLAY_ITEMS',
  payload: {
    items,
  },
});
export const setMultiPageManipulationControlsItems = (items) => ({
  type: 'SET_MULTI_PAGE_MANIPULATION_CONTROLS_ITEMS',
  payload: {
    items,
  },
});
export const setPageManipulationOverlayAlternativePosition = (position) => ({
  type: 'SET_PAGE_MANIPULATION_OVERLAY_ALTERNATIVE_POSITION',
  payload: { position },
});
export const setPageManipulationOverlayOpenByRightClick = (value) => ({
  type: 'SET_PAGE_MANIPULATION_OVERLAY_OPEN_BY_RIGHT_CLICK',
  payload: value,
});
export const setThumbnailControlMenuItems = (items) => ({
  type: 'SET_THUMBNAIL_CONTROL_MENU_ITEMS',
  payload: {
    items,
  },
});
export const setTabManager = (TabManager) => ({
  type: 'SET_TAB_MANAGER',
  payload: { TabManager },
});
export const setMultiTab = (isMultiTab = true) => ({
  type: 'SET_IS_MULTI_TAB',
  payload: { isMultiTab },
});
export const setTabs = (tabs) => ({
  type: 'SET_TABS',
  payload: { tabs },
});
export const setActiveTab = (activeTab) => ({
  type: 'SET_ACTIVE_TAB',
  payload: { activeTab },
});
export const setTabNameHandler = (tabNameHandler) => ({
  type: 'SET_TAB_NAME_HANDLER',
  payload: { tabNameHandler },
});
export const setFonts = (fonts = []) => ({
  type: 'SET_FONTS',
  payload: { fonts },
});
export const setIsMultiViewerMode = (isMultiViewerMode) => ({
  type: 'SET_IS_MULTI_VIEWER_MODE',
  payload: { isMultiViewerMode },
});
export const setIsMultiViewerReady = (isMultiViewerReady) => ({
  type: 'SET_IS_MULTI_VIEWER_READY',
  payload: { isMultiViewerReady },
});
export const setActiveDocumentViewerKey = (activeDocumentViewerKey) => ({
  type: 'SET_ACTIVE_DOCUMENT_VIEWER_KEY',
  payload: { activeDocumentViewerKey },
});
export const setIsComparisonOverlayEnabled = (isComparisonOverlayEnabled) => ({
  type: 'SET_COMPARISON_OVERLAY_ENABLED',
  payload: { isComparisonOverlayEnabled },
});
export const setIsCompareStarted = (isCompareStarted) => ({
  type: 'SET_IS_COMPARE_STARTED',
  payload: { isCompareStarted },
});
export const setSyncViewer = (syncViewer) => ({
  type: 'SET_SYNC_VIEWERS',
  payload: { syncViewer },
});
export const setSavedSignaturesTabEnabled = (enabled = true) => ({
  type: 'SET_SAVED_SIGNATURES_TAB_ENABLED',
  payload: { enabled }
});
export const setInitialsOffset = (initalsOffset) => ({
  type: 'SET_INITIALS_OFFSET',
  payload: { initalsOffset },
});
export const setFlyoutPosition = (newPosition) => ({
  type: 'SET_FLYOUT_POSITION',
  payload: { newPosition },
});
export const addFlyout = (newFlyout) => (dispatch, getState) => {
  const flyoutsToUpdateInstead = [DataElements.MAIN_MENU];
  const flyoutMap = selectors.getFlyoutMap(getState());
  const shouldUpdateInstead = flyoutsToUpdateInstead.includes(newFlyout.dataElement);
  while (flyoutMap[newFlyout.dataElement] && !shouldUpdateInstead) {
    const oldDataElement = newFlyout.dataElement;
    if (newFlyout.dataElement.match(/[0-9]$/)) {
      const number = parseInt(newFlyout.dataElement.match(/\d+$/)[0], 10);
      newFlyout.dataElement = newFlyout.dataElement.replace(/\d+$/, `${number + 1}`);
    } else {
      newFlyout.dataElement = `${newFlyout.dataElement}2`;
    }
    console.warn(`Flyout with dataElement ${oldDataElement} already exists. Renaming to ${newFlyout.dataElement}`);
  }
  dispatch({
    type: 'ADD_FLYOUT',
    payload: { dataElement: newFlyout.dataElement, flyout: newFlyout },
  });
};
export const removeFlyout = (dataElement) => ({
  type: 'REMOVE_FLYOUT',
  payload: { dataElement },
});
export const setActiveFlyout = (dataElement) => (dispatch, getState) => {
  const flyoutMap = selectors.getFlyoutMap(getState());
  if (dataElement && !flyoutMap[dataElement]) {
    console.warn(`Flyout with dataElement ${dataElement} does not exist.`);
    return;
  }
  dispatch({
    type: 'SET_ACTIVE_FLYOUT',
    payload: { dataElement },
  });
};

export const setFlyoutItems = (dataElement, items) => {
  return {
    type: 'SET_FLYOUT_ITEMS',
    payload: { dataElement, items },
  };
};
export const updateFlyout = (dataElement, newFlyout) => (dispatch, getState) => {
  const flyoutMap = selectors.getFlyoutMap(getState());
  if (!flyoutMap[dataElement]) {
    return dispatch(addFlyout(newFlyout));
  }
  dispatch({
    type: 'UPDATE_FLYOUT',
    payload: { dataElement, flyout: newFlyout },
  });
};
export const setFlyoutToggleElement = (toggleElement) => ({
  type: 'SET_FLYOUT_TOGGLE_ELEMENT',
  payload: { toggleElement },
});

export const setPanelWidth = (dataElement, width) => ({
  type: 'SET_PANEL_WIDTH',
  payload: { dataElement, width },
});

// document
export const setTotalPages = (totalPages, documentViewerKey = 1) => ({
  type: 'SET_TOTAL_PAGES',
  payload: { totalPages, documentViewerKey },
});
export const setOutlines = (outlines) => ({
  type: 'SET_OUTLINES',
  payload: { outlines },
});
export const setIsOutlineEditing = (isOutlineEditingEnabled = true) => ({
  type: 'SET_OUTLINE_EDITING',
  payload: { isOutlineEditingEnabled },
});
export const setAutoExpandOutlines = (autoExpandOutlines = false) => ({
  type: 'SET_AUTO_EXPAND_OUTLINES',
  payload: { autoExpandOutlines },
});
export const setAnnotationNumbering = (isAnnotationNumberingEnabled = false) => ({
  type: 'SET_ANNOTATION_NUMBERING',
  payload: { isAnnotationNumberingEnabled },
});
export const setBookmarks = (bookmarks) => ({
  type: 'SET_BOOKMARKS',
  payload: { bookmarks },
});
export const setBookmarkIconShortcutVisibility = (bookmarkIconShortcutVisibility) => ({
  type: 'SET_BOOKMARK_ICON_SHORTCUT_VISIBILITY',
  payload: { bookmarkIconShortcutVisibility },
});
export const setPortfolio = (portfolio) => ({
  type: 'SET_PORTFOLIO',
  payload: { portfolio },
});
export const setLayers = (layers) => ({
  type: 'SET_LAYERS',
  payload: { layers },
});
export const setPasswordAttempts = (attempt) => ({
  type: 'SET_PASSWORD_ATTEMPTS',
  payload: { attempt },
});
export const setPrintQuality = (quality) => ({
  type: 'SET_PRINT_QUALITY',
  payload: { quality },
});
export const setDefaultPrintOptions = (options) => ({
  type: 'SET_DEFAULT_PRINT_OPTIONS',
  payload: { options },
});
export const setLoadingProgress = (percent) => ({
  type: 'SET_LOADING_PROGRESS',
  payload: { progress: percent },
});
export const resetLoadingProgress = () => ({
  type: 'SET_LOADING_PROGRESS',
  payload: { progress: 0 },
});
export const setVerificationResult = (result) => ({
  type: 'SET_VERIFICATION_RESULT',
  payload: { result },
});
export const setIsRevocationCheckingEnabled = (isRevocationCheckingEnabled = false) => ({
  type: 'SET_IS_REVOCATION_CHECKING_ENABLED',
  payload: { isRevocationCheckingEnabled }
});
export const setRevocationProxyPrefix = (revocationProxyPrefix) => ({
  type: 'SET_REVOCATION_PROXY_PREFIX',
  payload: { revocationProxyPrefix }
});

// user
export const setUserName = (userName) => ({
  type: 'SET_USER_NAME',
  payload: { userName },
});
export const setAdminUser = (isAdminUser) => ({
  type: 'SET_ADMIN_USER',
  payload: { isAdminUser },
});

// search
export const searchText = (searchValue, options) => ({
  type: 'SEARCH_TEXT',
  payload: { searchValue, options },
});
export const searchTextFull = (searchValue, options) => ({
  type: 'SEARCH_TEXT_FULL',
  payload: { searchValue, options },
});
export const addSearchListener = (func) => ({
  type: 'ADD_SEARCH_LISTENER',
  payload: { func },
});
export const removeSearchListener = (func) => ({
  type: 'REMOVE_SEARCH_LISTENER',
  payload: { func },
});
export const setSearchValue = (value) => ({
  type: 'SET_SEARCH_VALUE',
  payload: { value },
});
export const setReplaceValue = (replaceText) => ({
  type: 'SET_REPLACE_VALUE',
  payload: { replaceText },
});
export const setNextResultValue = (nextResult, nextResultIndex) => ({
  type: 'SET_NEXT_RESULT',
  payload: { nextResult, nextResultIndex },
});
export const setCaseSensitive = (isCaseSensitive) => ({
  type: 'SET_CASE_SENSITIVE',
  payload: { isCaseSensitive },
});
export const setWholeWord = (isWholeWord) => ({
  type: 'SET_WHOLE_WORD',
  payload: { isWholeWord },
});
export const setWildcard = (isWildcard) => ({
  type: 'SET_WILD_CARD',
  payload: { isWildcard },
});

export const resetSearch = () => ({ type: 'RESET_SEARCH', payload: {} });

export const setNoteTransformFunction = (noteTransformFunction) => ({
  type: 'SET_NOTE_TRANSFORM_FUNCTION',
  payload: { noteTransformFunction },
});
export const setCustomNoteSelectionFunction = (customNoteFunction) => ({
  type: 'SET_CUSTOM_NOTE_SELECTION_FUNCTION',
  payload: { customNoteFunction },
});
export const setCustomApplyRedactionsHandler = (customApplyRedactionsHandler) => ({
  type: 'SET_CUSTOM_APPLY_REDACTIONS_HANDLER',
  payload: { customApplyRedactionsHandler },
});

export const setCustomMultiViewerSyncHandler = (customMultiViewerSyncHandler) => ({
  type: 'SET_CUSTOM_MULTI_VIEWER_SYNC_HANDLER',
  payload: { customMultiViewerSyncHandler },
});

export const setCustomMultiViewerAcceptedFileFormats = (customMultiViewerAcceptedFileFormats) => ({
  type: 'SET_CUSTOM_MULTI_VIEWER_ACCEPTED_FILE_FORMATS',
  payload: { customMultiViewerAcceptedFileFormats },
});

export const setEnableSnapMode = ({ toolName, isEnabled }) => ({
  type: 'SET_ENABLE_SNAP_MODE',
  payload: { toolName, isEnabled },
});

export const setLanguage = (language) => ({
  type: 'SET_LANGUAGE',
  payload: { language },
});

export const setHideContentEditWarning = (hideWarning) => ({
  type: 'SET_HIDE_CONTENT_EDIT_WARNING',
  payload: { hideWarning },
});

export const setContentWorkersAsLoaded = () => ({
  type: 'SET_CONTENT_EDIT_WORKERS_LOADED',
  payload: { contentEditWorkersLoaded: true },
});

export const setIsContentEditingEnabled = (isContentEditingEnabled) => ({
  type: 'SET_CONTENT_EDITING_ENABLED',
  payload: { isContentEditingEnabled },
});

export const setCurrentContentBeingEdited = ({ content, annotation }) => ({
  type: 'SET_CURRENT_CONTENT_BEING_EDITED',
  payload: { content, annotation },
});

export const updateCurrentContentBeingEdited = (content) => ({
  type: 'UPDATE_CURRENT_CONTENT_BEING_EDITED',
  payload: { content },
});

export const clearCurrentContentBeingEdited = () => ({
  type: 'CLEAR_CURRENT_CONTENT_BEING_EDITED',
  payload: {},
});

export const setProcessingSearchResults = (isProcessingSearchResults) => ({
  type: 'SET_PROCESSING_SEARCH_RESULTS',
  payload: { isProcessingSearchResults },
});

export const triggerResetAudioPlaybackPosition = (shouldResetAudioPlaybackPosition) => ({
  type: 'SET_RESET_AUDIO_PLAYBACK_POSITION',
  payload: { shouldResetAudioPlaybackPosition },
});

export const setActiveSoundAnnotation = (activeSoundAnnotation) => ({
  type: 'SET_ACTIVE_SOUND_ANNOTATION',
  payload: { activeSoundAnnotation },
});

export const setAnnotationFilters = (annotationFilters) => ({
  type: 'SET_ANNOTATION_FILTERS',
  payload: { annotationFilters }
});

export const setContentBoxEditor = (contentBoxEditor) => ({
  type: 'SET_CONTENTBOX_EDITOR',
  payload: { contentBoxEditor }
});

export const setInitialsMode = (isEnabled) => ({
  type: 'SET_INITIALS_MODE',
  payload: { isEnabled }
});

export const setShortcutKeyMap = (shortcutKeyMap) => ({
  type: 'SET_SHORTCUT_KEY_MAP',
  payload: shortcutKeyMap
});

export const enableFeatureFlag = (featureFlag) => ({
  type: 'ENABLE_FEATURE_FLAG',
  payload: { featureFlag }
});

export const disableFeatureFlag = (featureFlag) => ({
  type: 'DISABLE_FEATURE_FLAG',
  payload: { featureFlag }
});

export const setComparePagesButtonEnabled = (isShowComparisonButtonEnabled) => ({
  type: 'SET_COMPARE_PAGES_BUTTON_ENABLED',
  payload: { isShowComparisonButtonEnabled }
});

export const setIsMultiViewerModeAvailable = (isMultiViewerModeAvailable) => ({
  type: 'SET_IS_MULTI_VIEWER_MODE_AVAILABLE',
  payload: { isMultiViewerModeAvailable }
});

export const setIsOfficeEditorMode = (isOfficeEditorMode) => ({
  type: 'SET_IS_OFFICE_EDITOR_MODE',
  payload: { isOfficeEditorMode }
});

export const setIsOfficeEditorHeaderEnabled = (isOfficeEditorHeaderEnabled) => ({
  type: 'SET_IS_OFFICE_EDITOR_HEADER_ENABLED',
  payload: { isOfficeEditorHeaderEnabled }
});

export const setOfficeEditorEditMode = (editMode) => ({
  type: 'SET_OFFICE_EDITOR_EDIT_MODE',
  payload: { editMode }
});

export const setOfficeEditorActiveStream = (stream) => ({
  type: 'SET_OFFICE_EDITOR_ACTIVE_STREAM',
  payload: { stream }
});

export const enableSpreadsheetEditorMode = () => ({
  type: 'ENABLE_SPREADSHEET_EDITOR_MODE',
});

export const disableSpreadsheetEditorMode = () => ({
  type: 'DISABLE_SPREADSHEET_EDITOR_MODE',
});

export const growCustomElement = (dataElement) => (dispatch, getState) => {
  const currentSize = getState().viewer.customElementSizes[dataElement] || 0;
  const newSize = currentSize + 1;
  dispatch(setCustomElementSize(dataElement, newSize));
};

export const shrinkCustomElement = (dataElement) => (dispatch, getState) => {
  const currentSize = getState().viewer.customElementSizes[dataElement] || 0;
  const newSize = currentSize > 0 ? currentSize - 1 : 0;
  dispatch(setCustomElementSize(dataElement, newSize));
};

export const setCustomElementSize = (dataElement, size) => ({
  type: 'SET_CUSTOM_ELEMENT_SIZE',
  payload: { dataElement, size },
});

export const setNotesInLeftPanel = (notesInLeftPanel) => ({
  type: 'SET_NOTES_IN_LEFT_PANEL',
  payload: notesInLeftPanel
});

export const pushFocusedElement = (element) => ({
  type: 'PUSH_FOCUSED_ELEMENT',
  payload: element,
});

export const setFocusedElementsStack = (stack) => ({
  type: 'SET_FOCUSED_ELEMENTS_STACK',
  payload: stack,
});

export const popFocusedElement = () => (dispatch, getState) => {
  const focusedElementsStack = getState().viewer.focusedElementsStack;

  if (focusedElementsStack.length > 0) {
    const poppedElement = focusedElementsStack[focusedElementsStack.length - 1];
    const newStack = focusedElementsStack.slice(0, -1);
    dispatch(setFocusedElementsStack(newStack));
    return poppedElement;
  }

  return null;
};

export const setKeyboardOpen = (isKeyboardOpen) => ({
  type: 'SET_KEYBOARD_OPEN',
  payload: isKeyboardOpen,
});

export const setCompareAnnotationsMap = (compareAnnotationsMap) => ({
  type: 'SET_COMPARE_ANNOTATIONS_MAP',
  payload: compareAnnotationsMap,
});

export const stashComponents = (UIMode) => ({
  type: 'STASH_COMPONENTS',
  payload: { UIMode },
});

export const restoreComponents = (UIMode) => ({
  type: 'RESTORE_COMPONENTS',
  payload: { UIMode },
});

export const setActiveCellRange = ({ activeCellRange, cellProperties }) => ({
  type: 'SET_ACTIVE_CELL_RANGE',
  payload: { activeCellRange, cellProperties },
});

export const setUIConfiguration = (uiConfiguration) => ({
  type: 'SET_UI_CONFIGURATION',
  payload: uiConfiguration,
});

export const setActiveCellRangeStyle = (styles) => ({
  type: 'SET_ACTIVE_CELL_RANGE_STYLE',
  payload: { styles },
});