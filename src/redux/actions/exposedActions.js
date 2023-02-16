import core from 'core';
import isDataElementLeftPanel from 'helpers/isDataElementLeftPanel';
import fireEvent from 'helpers/fireEvent';
import { getMaxZoomLevel, getMinZoomLevel } from 'constants/zoomFactors';
import { disableElements, enableElements } from 'actions/internalActions';
import defaultTool from 'constants/defaultTool';
import { PRIORITY_TWO } from 'constants/actionPriority';
import Events from 'constants/events';
import { getAllPanels } from 'helpers/getElements';
import { getCustomFlxPanels } from 'selectors/exposedSelectors';

export const disableApplyCropWarningModal = () => ({
  type: 'SHOW_APPLY_CROP_WARNING',
  payload: { shouldShowApplyCropWarning: false },
});

export const enableApplyCropWarningModal = () => ({
  type: 'SHOW_APPLY_CROP_WARNING',
  payload: { shouldShowApplyCropWarning: true },
});

export const setPresetCropDimensions = (presetCropDimensions) => ({
  type: 'SET_PRESET_CROP_DIMENSIONS',
  payload: { presetCropDimensions },
});

export const setPresetNewPageDimensions = (presetNewPageDimensions) => ({
  type: 'SET_PRESET_NEW_PAGE_DIMENSIONS',
  payload: { presetNewPageDimensions },
});

export const setDateTimeFormats = (dateTimeFormats) => ({
  type: 'SET_DATE_TIME_FORMATS',
  payload: { dateTimeFormats },
});

export const setEnableDesktopOnlyMode = (enableDesktopOnlyMode) => ({
  type: 'SET_ENABLE_DESKTOP_ONLY_MODE',
  payload: { enableDesktopOnlyMode },
});

export const setHighContrastMode = (useHighContrastMode) => ({
  type: 'SET_HIGH_CONTRAST_MODE',
  payload: { useHighContrastMode },
});

export const setCanUndo = (canUndo, documentViewerKey = 1) => ({
  type: 'SET_CAN_UNDO',
  payload: { canUndo, documentViewerKey },
});

export const setCanRedo = (canRedo, documentViewerKey = 1) => ({
  type: 'SET_CAN_REDO',
  payload: { canRedo, documentViewerKey },
});

export const setStandardStamps = (t) => async (dispatch) => {
  const rubberStampTool = core.getTool('AnnotationCreateRubberStamp');
  const canvasWidth = 160;
  const canvasHeight = 58;

  const annotations = await rubberStampTool.getStandardStampAnnotations();
  const previews = await Promise.all(
    annotations.map((annotation) => {
      const text = t(`rubberStamp.${annotation['Icon']}`);

      const options = {
        canvasWidth,
        canvasHeight,
        text,
      };

      return rubberStampTool.getPreview(annotation, options);
    }),
  );

  const standardStamps = annotations.map((annotation, i) => ({
    annotation,
    imgSrc: previews[i],
  }));

  dispatch({
    type: 'SET_STANDARD_STAMPS',
    payload: { standardStamps },
  });
};

export const setCustomStamps = (t) => async (dispatch) => {
  const rubberStampTool = core.getTool('AnnotationCreateRubberStamp');
  const canvasWidth = 160;
  const canvasHeight = 58;

  const annotations = await rubberStampTool.getCustomStampAnnotations();
  await Promise.all(
    annotations.map((annotation) => {
      const text = t(`rubberStamp.${annotation['Icon']}`);

      const options = {
        canvasWidth,
        canvasHeight,
        text,
      };

      return rubberStampTool.getPreview(annotation, options);
    }),
  );

  const customStamps = annotations.map((annotation) => ({
    annotation,
    imgSrc: annotation['ImageData'],
  }));

  dispatch({
    type: 'SET_CUSTOM_STAMPS',
    payload: { customStamps },
  });
};

export const setReadOnlyRibbons = () => (dispatch, getState) => {
  dispatch(setToolbarGroup('toolbarGroup-View'));
  const state = getState();
  const toolbarGroupsToDisable = Object.keys(state.viewer.headers).filter(
    (key) => key.includes('toolbarGroup-') && key !== 'toolbarGroup-View',
  );

  disableElements(toolbarGroupsToDisable, PRIORITY_TWO)(dispatch, getState);
};

export const enableRibbons = () => (dispatch, getState) => {
  const state = getState();
  // There can be a situation where we switch to FormBuilder mode and we get a race condition between setting
  // the active toolbarGroup as what is in the current state and Forms, as redux hasnt dispatched the update to the Forms tool bar yet.
  // We double check here if we are in form mode and set the correct tool bar group
  // We enable ribbons when going into form mode, as we temporarily elevate the user's permissions
  const isInFormFieldCreationMode = core.getFormFieldCreationManager().isInFormFieldCreationMode();
  const toolbarGroup = isInFormFieldCreationMode ? 'toolbarGroup-Forms' : state.viewer.toolbarGroup;
  dispatch(setToolbarGroup(toolbarGroup || 'toolbarGroup-Annotate'));
  const toolbarGroupsToEnable = Object.keys(state.viewer.headers).filter((key) => key.includes('toolbarGroup-'));

  enableElements(toolbarGroupsToEnable, PRIORITY_TWO)(dispatch, getState);
};

const isElementDisabled = (state, dataElement) => state.viewer.disabledElements[dataElement]?.disabled;

export const allButtonsInGroupDisabled = (state, toolGroup) => {
  const dataElements = Object.values(state.viewer.toolButtonObjects)
    .filter(({ group }) => group === toolGroup)
    .map(({ dataElement }) => dataElement);

  return dataElements.every((dataElement) => isElementDisabled(state, dataElement));
};

export const setToolbarGroup = (toolbarGroup, pickTool = true) => (dispatch, getState) => {
  const getFirstToolGroupForToolbarGroup = (state, _toolbarGroup) => {
    const toolGroups = state.viewer.headers[_toolbarGroup];
    let firstToolGroupForToolbarGroup = '';
    if (toolGroups) {
      const firstTool = Object.values(toolGroups).find(({ toolGroup, dataElement }) => {
        if (toolGroup && !isElementDisabled(state, dataElement) && !allButtonsInGroupDisabled(state, toolGroup)) {
          return true;
        }
        return false;
      });
      if (firstTool) {
        firstToolGroupForToolbarGroup = firstTool.toolGroup;
      }
    }
    return firstToolGroupForToolbarGroup;
  };

  const getFirstToolNameForGroup = (state, toolGroup) => {
    const tools = state.viewer.toolButtonObjects;
    const firstTool = Object.keys(tools).find((key) => {
      return tools[key].group === toolGroup;
    });
    return firstTool;
  };

  if (toolbarGroup === 'toolbarGroup-View') {
    dispatch(closeElements(['toolsHeader']));
    core.setToolMode(defaultTool);
    dispatch({
      type: 'SET_ACTIVE_TOOL_GROUP',
      payload: { toolGroup: '', toolbarGroup },
    });
  } else {
    dispatch(openElements(['toolsHeader']));
    const state = getState();
    const lastPickedToolGroup =
      state.viewer.lastPickedToolGroup[toolbarGroup] || getFirstToolGroupForToolbarGroup(state, toolbarGroup);
    const lastPickedToolName =
      state.viewer.lastPickedToolForGroup[lastPickedToolGroup] || getFirstToolNameForGroup(state, lastPickedToolGroup);
    if (pickTool) {
      dispatch({
        type: 'SET_ACTIVE_TOOL_GROUP',
        payload: { toolGroup: lastPickedToolGroup, toolbarGroup },
      });

      if (lastPickedToolName === 'AnnotationCreateSignature') {
        core.setToolMode(defaultTool);
      } else {
        core.setToolMode(lastPickedToolName);
      }
    } else {
      core.setToolMode(defaultTool);
      dispatch({
        type: 'SET_ACTIVE_TOOL_GROUP',
        payload: { toolGroup: '', toolbarGroup },
      });
    }
  }
  dispatch(closeElements(['toolsOverlay', 'signatureOverlay', 'toolStylePopup']));
  dispatch({
    type: 'SET_TOOLBAR_GROUP',
    payload: { toolbarGroup },
  });
  fireEvent(Events.TOOLBAR_GROUP_CHANGED, toolbarGroup);
};
export const setSelectedStampIndex = (index) => ({
  type: 'SET_SELECTED_STAMP_INDEX',
  payload: { index },
});
export const setOutlineControlVisibility = (outlineControlVisibility) => ({
  type: 'SET_OUTLINE_CONTROL_VISIBILITY',
  payload: { outlineControlVisibility },
});
export const setSelectedDisplayedSignatureIndex = (index) => ({
  type: 'SET_SELECTED_DISPLAYED_SIGNATURE_INDEX',
  payload: { index },
});
export const setSavedSignatures = (savedSignatures) => ({
  type: 'SET_SAVED_SIGNATURES',
  payload: { savedSignatures },
});
export const setDisplayedSignaturesFilterFunction = (filterFunction) => ({
  type: 'SET_DISPLAYED_SIGNATURES_FILTER_FUNCTION',
  payload: { filterFunction },
});
export const setSignatureMode = (signatureMode) => ({
  type: 'SET_SIGNATURE_MODE',
  payload: { signatureMode }
});

export const setSavedInitials = (savedInitials) => ({
  type: 'SET_SAVED_INITIALS',
  payload: { savedInitials },
});

export const setSelectedDisplayedInitialsIndex = (index) => ({
  type: 'SET_SELECTED_DISPLAYED_INITIALS_INDEX',
  payload: { index },
});

export const setLeftPanelWidth = (width) => ({
  type: 'SET_LEFT_PANEL_WIDTH',
  payload: { width },
});
export const setSearchPanelWidth = (width) => ({
  type: 'SET_SEARCH_PANEL_WIDTH',
  payload: { width },
});
export const setNotesPanelWidth = (width) => ({
  type: 'SET_NOTES_PANEL_WIDTH',
  payload: { width },
});
export const setComparePanelWidth = (width) => ({
  type: 'SET_COMPARE_PANEL_WIDTH',
  payload: { width },
});
export const setRedactionPanelWidth = (width) => ({
  type: 'SET_REDACTION_PANEL_WIDTH',
  payload: { width },
});
export const setTextEditingPanelWidth = (width) => ({
  type: 'SET_TEXT_EDITING_PANEL_WIDTH',
  payload: { width },
});
export const setWatermarkPanelWidth = (width) => ({
  type: 'SET_WATERMARK_PANEL_WIDTH',
  payload: { width },
});
export const setWv3dPropertiesPanelWidth = (width) => ({
  type: 'SET_WV3D_PROPERTIES_PANEL_WIDTH',
  payload: { width },
});
export const setWv3dPropertiesPanelModelData = (modelData) => ({
  type: 'SET_WV3D_PROPERTIES_PANEL_MODEL_DATA',
  payload: { modelData },
});
export const setWv3dPropertiesPanelSchema = (schema) => ({
  type: 'SET_WV3D_PROPERTIES_PANEL_SCHEMA',
  payload: { schema },
});
export const setDocumentContainerWidth = (width) => ({
  type: 'SET_DOCUMENT_CONTAINER_WIDTH',
  payload: { width },
});
export const setDocumentContainerHeight = (height) => ({
  type: 'SET_DOCUMENT_CONTAINER_HEIGHT',
  payload: { height },
});

export const setGapBetweenHeaderItems = (dataElement, gap) => updateHeaderProperty(dataElement, 'gap', gap);

export const setHeaderAlignment = (dataElement, alignment) => updateHeaderProperty(dataElement, 'alignment', alignment);

const updateHeaderProperty = (dataElement, property, value) => ({
  type: 'UPDATE_MODULAR_HEADERS',
  payload: {
    dataElement,
    property,
    value,
  }
});

export const enableAllElements = () => ({
  type: 'ENABLE_ALL_ELEMENTS',
  payload: {},
});
export const openElement = (dataElement) => (dispatch, getState) => {
  const state = getState();

  const isElementDisabled = state.viewer.disabledElements[dataElement]?.disabled;
  const isLeftPanelOpen = state.viewer.openElements['leftPanel'];
  const isElementOpen = isDataElementLeftPanel(dataElement, state)
    ? isLeftPanelOpen && state.viewer.activeLeftPanel === dataElement
    : state.viewer.openElements[dataElement];

  if (isElementDisabled || isElementOpen) {
    return;
  }

  const isFlxPanel = state.viewer.customFlxPanels.find((item) => dataElement === item.dataElement);
  if (isFlxPanel) {
    const keys = ['leftPanel'];
    getAllPanels(isFlxPanel.location).forEach((item) => keys.push(item.dataset.element));
    dispatch(closeElements(keys));
  }

  if (isDataElementLeftPanel(dataElement, state)) {
    if (!isLeftPanelOpen) {
      dispatch({ type: 'OPEN_ELEMENT', payload: { dataElement: 'leftPanel' } });
      fireEvent(Events.VISIBILITY_CHANGED, { element: 'leftPanel', isVisible: true });
    }
    dispatch(setActiveLeftPanel(dataElement));
  } else {
    dispatch({ type: 'OPEN_ELEMENT', payload: { dataElement } });
    fireEvent(Events.VISIBILITY_CHANGED, { element: dataElement, isVisible: true });

    if (dataElement === 'leftPanel' && !isLeftPanelOpen) {
      fireEvent(Events.VISIBILITY_CHANGED, {
        element: state.viewer.activeLeftPanel,
        isVisible: true,
      });
    }

    if (dataElement === 'leftPanel') {
      const panels = getCustomFlxPanels(state, 'left');
      const keys = panels.map((item) => item.dataElement);
      dispatch(closeElements(keys));
    }
  }
};
export const openElements = (dataElements) => (dispatch) => {
  if (typeof dataElements === 'string') {
    dispatch(openElement(dataElements));
  } else {
    dataElements.forEach((dataElement) => {
      dispatch(openElement(dataElement));
    });
  }
};
export const closeElement = (dataElement) => (dispatch, getState) => {
  const state = getState();

  const isElementDisabled = state.viewer.disabledElements[dataElement]?.disabled;
  const isElementClosed = isDataElementLeftPanel(dataElement, state)
    ? state.viewer.activeLeftPanel !== dataElement
    : !state.viewer.openElements[dataElement];

  if (isElementDisabled || isElementClosed) {
    return;
  }

  if (isDataElementLeftPanel(dataElement, state) && state.viewer.openElements['leftPanel']) {
    dispatch({ type: 'CLOSE_ELEMENT', payload: { dataElement: 'leftPanel' } });
    fireEvent(Events.VISIBILITY_CHANGED, { element: 'leftPanel', isVisible: false });
  } else {
    dispatch({ type: 'CLOSE_ELEMENT', payload: { dataElement } });
    fireEvent(Events.VISIBILITY_CHANGED, { element: dataElement, isVisible: false });

    if (dataElement === 'pageManipulationOverlay') {
      dispatch({
        type: 'SET_PAGE_MANIPULATION_OVERLAY_ALTERNATIVE_POSITION',
        payload: null
      });
    }

    if (dataElement === 'leftPanel' && state.viewer.openElements['leftPanel']) {
      fireEvent(Events.VISIBILITY_CHANGED, {
        element: state.viewer.activeLeftPanel,
        isVisible: false,
      });
    }
  }
};
export const closeElements = (dataElements) => (dispatch) => {
  if (typeof dataElements === 'string') {
    dispatch(closeElement(dataElements));
  } else {
    dataElements.forEach((dataElement) => {
      dispatch(closeElement(dataElement));
    });
  }
};

const rightPanelList = ['searchPanel', 'notesPanel', 'comparePanel', 'redactionPanel', 'wv3dPropertiesPanel', 'textEditingPanel', 'watermarkPanel'];
export const toggleElement = (dataElement) => (dispatch, getState) => {
  const state = getState();

  if (state.viewer.disabledElements[dataElement]?.disabled) {
    return;
  }

  // hack for new ui
  if (!state.viewer.notesInLeftPanel) {
    if (rightPanelList.includes(dataElement)) {
      for (const panel of rightPanelList) {
        if (panel !== dataElement) {
          dispatch(closeElement(panel));
        }
      }
    }
  }

  if (state.viewer.openElements[dataElement]) {
    dispatch(closeElement(dataElement));
  } else {
    dispatch(openElement(dataElement));
  }
};

export const addCustomModal = (modalOptions) => ({
  type: 'ADD_CUSTOM_MODAL',
  payload: modalOptions,
});
export const addModularHeaders = (headersList) => ({
  type: 'ADD_MODULAR_HEADERS',
  payload: headersList
});
export const updateModularHeaders = (modularHeaders) => ({
  type: 'SET_MODULAR_HEADERS',
  payload: modularHeaders
});
export const setRightHeaderWidth = (width) => ({
  type: 'SET_RIGHT_HEADER_WIDTH',
  payload: width
});
export const setLeftHeaderWidth = (width) => ({
  type: 'SET_LEFT_HEADER_WIDTH',
  payload: width
});
export const setActiveHeaderGroup = (headerGroup) => ({
  type: 'SET_ACTIVE_HEADER_GROUP',
  payload: { headerGroup },
});
export const setActiveLeftPanel = (dataElement) => (dispatch, getState) => {
  const state = getState();

  if (isDataElementLeftPanel(dataElement, state)) {
    if (state.viewer.activeLeftPanel !== dataElement) {
      dispatch({
        type: 'CLOSE_ELEMENT',
        payload: { dataElement: state.viewer.activeLeftPanel },
      });
      fireEvent(Events.VISIBILITY_CHANGED, {
        element: state.viewer.activeLeftPanel,
        isVisible: false,
      });
      dispatch({ type: 'SET_ACTIVE_LEFT_PANEL', payload: { dataElement } });
      fireEvent(Events.VISIBILITY_CHANGED, { element: dataElement, isVisible: true });
    }
  } else {
    const panelDataElements = [
      ...state.viewer.customPanels.map(({ panel }) => panel.dataElement),
      'thumbnailsPanel',
      'outlinesPanel',
      'layersPanel',
      'bookmarksPanel',
      'notesPanel',
      'signaturePanel',
      'attachmentPanel',
    ].join(', ');
    console.warn(
      `${dataElement} is not recognized by the left panel. Please use one of the following options: ${panelDataElements}`,
    );
  }
};
export const setNotesPanelSortStrategy = (sortStrategy) => ({
  type: 'SET_NOTES_PANEL_SORT_STRATEGY',
  payload: { sortStrategy },
});
export const setSortNotesBy = (sortStrategy) => {
  console.warn('setSortNotesBy is deprecated, please use setNotesPanelSortStrategy instead');

  return setNotesPanelSortStrategy(sortStrategy);
};
export const setNoteDateFormat = (noteDateFormat) => ({
  type: 'SET_NOTE_DATE_FORMAT',
  payload: { noteDateFormat },
});
export const setPrintedNoteDateFormat = (noteDateFormat) => ({
  type: 'SET_PRINTED_NOTE_DATE_FORMAT',
  payload: { noteDateFormat },
});
export const setCustomPanel = (newPanel) => ({
  type: 'SET_CUSTOM_PANEL',
  payload: { newPanel },
});

export const addPanel = (newPanel) => ({
  type: 'ADD_PANEL',
  payload: { newPanel },
});

export const setPageLabels = (pageLabels) => (dispatch) => {
  if (pageLabels.length !== core.getTotalPages()) {
    console.warn('Number of page labels do not match with the total pages.');
    return;
  }
  dispatch({
    type: 'SET_PAGE_LABELS',
    payload: { pageLabels: pageLabels.map(String) },
  });
};
export const setSelectedPageThumbnails = (selectedThumbnailPageIndexes = []) => {
  fireEvent(Events.SELECTED_THUMBNAIL_CHANGED, selectedThumbnailPageIndexes);

  return {
    type: 'SET_SELECTED_THUMBNAIL_PAGE_INDEXES',
    payload: { selectedThumbnailPageIndexes },
  };
};
export const setShiftKeyThumbnailsPivotIndex = (shiftKeyThumbnailPivotIndex = null) => ({
  type: 'SET_SHIFT_KEY_THUMBNAIL_PIVOT_INDEX',
  payload: { shiftKeyThumbnailPivotIndex },
});
export const setSwipeOrientation = (swipeOrientation) => ({
  type: 'SET_SWIPE_ORIENTATION',
  payload: { swipeOrientation },
});
export const showWarningMessage = (options) => (dispatch) => {
  dispatch({ type: 'SET_WARNING_MESSAGE', payload: options });
  dispatch(openElement('warningModal'));
};
export const disableDeleteTabWarning = () => ({
  type: 'DISABLE_DELETE_TAB_WARNING',
  payload: { showDeleteTabWarning: false },
});
export const showErrorMessage = (message) => (dispatch) => {
  dispatch({ type: 'SET_ERROR_MESSAGE', payload: { message } });
  dispatch(openElement('errorModal'));
};
export const setCustomNoteFilter = (filterFunc) => ({
  type: 'SET_CUSTOM_NOTE_FILTER',
  payload: { customNoteFilter: filterFunc },
});
export const setZoomList = (zoomList) => (dispatch) => {
  const minZoomLevel = getMinZoomLevel();
  const maxZoomLevel = getMaxZoomLevel();
  const filteredZoomList = zoomList.filter((zoom) => zoom >= minZoomLevel && zoom <= maxZoomLevel);

  if (filteredZoomList.length !== zoomList.length) {
    const outOfRangeZooms = zoomList.filter((zoom) => !filteredZoomList.includes(zoom));
    console.warn(`
      ${outOfRangeZooms.join(', ')} are not allowed zoom levels in the UI.
      Valid zoom levels should be in the range of ${minZoomLevel}-${maxZoomLevel}.
      You can use setMinZoomLevel or setMaxZoomLevel APIs to change the range.
      See https://www.pdftron.com/documentation/web/guides/ui/apis for more information.
    `);
  }

  dispatch({ type: 'SET_ZOOM_LIST', payload: { zoomList: filteredZoomList } });
};
export const useEmbeddedPrint = (useEmbeddedPrint = true) => ({
  type: 'USE_EMBEDDED_PRINT',
  payload: { useEmbeddedPrint },
});
export const setMaxSignaturesCount = (maxSignaturesCount) => ({
  type: 'SET_MAX_SIGNATURES_COUNT',
  payload: { maxSignaturesCount },
});
export const setUserData = (userData) => ({
  type: 'SET_USER_DATA',
  payload: { userData },
});
export const setCustomMeasurementOverlay = (customMeasurementOverlay) => ({
  type: 'SET_CUSTOM_MEASUREMENT_OVERLAY',
  payload: { customMeasurementOverlay },
});
export const setSelectedTab = (id, dataElement) => ({
  type: 'SET_SELECTED_TAB',
  payload: { id, dataElement },
});
export const setCustomElementOverrides = (dataElement, overrides) => ({
  type: 'SET_CUSTOM_ELEMENT_OVERRIDES',
  payload: { dataElement, overrides },
});
export const setPageReplacementModalFileList = (list) => ({
  type: 'SET_PAGE_REPLACEMENT_FILE_LIST',
  payload: { list },
});
export const setActiveTheme = (theme) => {
  fireEvent(Events.THEME_CHANGED, theme);

  return {
    type: 'SET_ACTIVE_THEME',
    payload: { theme },
  };
};
export const setSearchResults = (searchResults) => ({
  type: 'SET_SEARCH_RESULTS',
  payload: searchResults,
});

export const setClearSearchOnPanelClose = (shouldClear) => ({
  type: 'SET_CLEAR_SEARCH_ON_PANEL_CLOSE',
  payload: shouldClear,
});

export const setAnnotationContentOverlayHandler = (annotationContentOverlayHandler) => ({
  type: 'SET_ANNOTATION_CONTENT_OVERLAY_HANDLER',
  payload: { annotationContentOverlayHandler },
});

export const setAnnotationReadState = ({ isRead, annotationId }) => ({
  type: 'SET_ANNOTATION_READ_STATE',
  payload: { isRead, annotationId },
});
export const addTrustedCertificates = (certificates) => ({
  type: 'ADD_TRUSTED_CERTIFICATES',
  payload: { certificates },
});
export const addTrustList = (trustList) => ({
  type: 'ADD_TRUST_LIST',
  payload: { trustList },
});
export const setSignatureValidationModalWidgetName = (widgetName) => ({
  type: 'SET_VALIDATION_MODAL_WIDGET_NAME',
  payload: { validationModalWidgetName: widgetName },
});

export const setNoteSubmissionEnabledWithEnter = (enableNoteSubmissionWithEnter) => ({
  type: 'SET_SUBMIT_COMMENT_MODE',
  payload: { enableNoteSubmissionWithEnter },
});

export const setNotesPanelTextCollapsing = (enableNotesPanelTextCollapsing) => ({
  type: 'SET_NOTES_PANEL_TEXT_COLLAPSING',
  payload: { enableNotesPanelTextCollapsing },
});

export const setNotesPanelRepliesCollapsing = (enableNotesPanelRepliesCollapsing) => ({
  type: 'SET_NOTES_PANEL_REPLIES_COLLAPSING',
  payload: { enableNotesPanelRepliesCollapsing },
});

export const setCommentThreadExpansion = (enableCommentThreadExpansion) => ({
  type: 'SET_COMMENT_THREAD_EXPANSION',
  payload: { enableCommentThreadExpansion },
});

export const enableFadePageNavigationComponent = () => ({
  type: 'SET_FADE_PAGE_NAVIGATION_COMPONENT',
  payload: { fadePageNavigationComponent: true },
});

export const disableFadePageNavigationComponent = () => ({
  type: 'SET_FADE_PAGE_NAVIGATION_COMPONENT',
  payload: { fadePageNavigationComponent: false },
});

export const enablePageDeletionConfirmationModal = () => ({
  type: 'PAGE_DELETION_CONFIRMATION_MODAL_POPUP',
  payload: { pageDeletionConfirmationModalEnabled: true },
});

export const disablePageDeletionConfirmationModal = () => ({
  type: 'PAGE_DELETION_CONFIRMATION_MODAL_POPUP',
  payload: { pageDeletionConfirmationModalEnabled: false },
});

export const setWatermarkModalOptions = (watermarkModalOptions) => ({
  type: 'SET_WATERMARK_MODAL_OPTIONS',
  payload: { watermarkModalOptions },
});

export const replaceRedactionSearchPattern = (searchPattern, regex) => ({
  type: 'REPLACE_REDACTION_SEARCH_PATTERN',
  payload: { searchPattern, regex },
});

export const setThumbnailSelectionMode = (thumbnailSelectionMode) => ({
  type: 'SET_THUMBNAIL_SELECTION_MODE',
  payload: { thumbnailSelectionMode },
});

export const addRedactionSearchPattern = (searchPattern) => ({
  type: 'ADD_REDACTION_SEARCH_PATTERN',
  payload: { searchPattern },
});

export const removeRedactionSearchPattern = (searchPatternType) => ({
  type: 'REMOVE_REDACTION_SEARCH_PATTERN',
  payload: { searchPatternType },
});

export const setColorMap = (colorMap) => ({
  type: 'SET_COLOR_MAP',
  payload: { colorMap }
});

export const setZoomStepFactors = (zoomStepFactors) => ({
  type: 'SET_ZOOM_STEP_FACTORS',
  payload: { zoomStepFactors },
});

export const setNotesPanelCustomHeader = (notesPanelCustomHeaderOptions) => ({
  type: 'SET_NOTES_PANEL_CUSTOM_HEADER_OPTIONS',
  payload: { notesPanelCustomHeaderOptions },
});

export const setNotesPanelEmptyPanel = (notesPanelCustomEmptyPanel) => ({
  type: 'SET_NOTES_PANEL_CUSTOM_EMPTY_PANEL',
  payload: { notesPanelCustomEmptyPanel },
});

export const addMeasurementScalePreset = (measurementSystem, newPreset, index) => ({
  type: 'ADD_MEASUREMENT_SCALE_PRESET',
  payload: { measurementSystem, newPreset, index }
});

export const removeMeasurementScalePreset = (measurementSystem, index) => ({
  type: 'REMOVE_MEASUREMENT_SCALE_PRESET',
  payload: { measurementSystem, index }
});

export const setIsMultipleScalesMode = (isMultipleScalesMode) => ({
  type: 'SET_IS_MULTIPLE_SCALE_MODE',
  payload: { isMultipleScalesMode }
});

export const setReplyAttachmentPreviewEnabled = (replyAttachmentPreviewEnabled) => ({
  type: 'SET_REPLY_ATTACHMENT_PREVIEW',
  payload: { replyAttachmentPreviewEnabled }
});

export const setReplyAttachmentHandler = (replyAttachmentHandler) => ({
  type: 'SET_REPLY_ATTACHMENT_HANDLER',
  payload: { replyAttachmentHandler }
});

export const setCustomSettings = (customSettings) => ({
  type: 'SET_CUSTOM_SETTINGS',
  payload: customSettings
});

export const setToolDefaultStyleUpdateFromAnnotationPopupEnabled = (isToolDefaultStyleUpdateFromAnnotationPopupEnabled) => ({
  type: 'SET_TOOL_DEFAULT_STYLE_UPDATE_FROM_ANNOTATION_POPUP_ENABLED',
  payload: isToolDefaultStyleUpdateFromAnnotationPopupEnabled
});
