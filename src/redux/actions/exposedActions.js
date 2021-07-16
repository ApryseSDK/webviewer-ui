import core from 'core';
import isDataElementLeftPanel from 'helpers/isDataElementLeftPanel';
import fireEvent from 'helpers/fireEvent';
import { getMinZoomLevel, getMaxZoomLevel } from 'constants/zoomFactors';
import { enableElements, disableElements } from 'actions/internalActions';
import defaultTool from 'constants/defaultTool';
import { PRIORITY_TWO } from 'constants/actionPriority';
import Events from 'constants/events';

export const setHighContrastMode = useHighContrastMode => ({
  type: 'SET_HIGH_CONTRAST_MODE',
  payload: { useHighContrastMode },
});

export const setCanUndo = canUndo => ({
  type: 'SET_CAN_UNDO',
  payload: { canUndo },
});

export const setCanRedo = canRedo => ({
  type: 'SET_CAN_REDO',
  payload: { canRedo },
});

export const setStandardStamps = t => async dispatch => {
  const rubberStampTool = core.getTool('AnnotationCreateRubberStamp');
  const canvasWidth = 160;
  const canvasHeight = 58;

  const annotations = await rubberStampTool.getStandardStampAnnotations();
  const previews = await Promise.all(
    annotations.map(annotation => {
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

export const setCustomStamps = t => async dispatch => {
  const rubberStampTool = core.getTool('AnnotationCreateRubberStamp');
  const canvasWidth = 160;
  const canvasHeight = 58;

  const annotations = await rubberStampTool.getCustomStampAnnotations();
  await Promise.all(
    annotations.map(annotation => {
      const text = t(`rubberStamp.${annotation['Icon']}`);

      const options = {
        canvasWidth,
        canvasHeight,
        text,
      };

      return rubberStampTool.getPreview(annotation, options);
    }),
  );

  const customStamps = await Promise.all(
    annotations.map(async (annotation) => ({
      annotation,
      imgSrc: await annotation.getImageData(),
    }))
  );

  dispatch({
    type: 'SET_CUSTOM_STAMPS',
    payload: { customStamps },
  });
};

export const setReadOnlyRibbons = () => (dispatch, getState) => {
  dispatch(setToolbarGroup('toolbarGroup-View'));
  const state = getState();
  const toolbarGroupsToDisable = Object.keys(state.viewer.headers)
    .filter(key => key.includes('toolbarGroup-') && key !== 'toolbarGroup-View');

  disableElements(toolbarGroupsToDisable, PRIORITY_TWO)(dispatch, getState);
};

export const enableRibbons = () => (dispatch, getState) => {
  const state = getState();
  dispatch(setToolbarGroup(state.viewer.toolbarGroup || 'toolbarGroup-Annotate', false));
  const toolbarGroupsToEnable = Object.keys(state.viewer.headers)
    .filter(key => key.includes('toolbarGroup-'));

  enableElements(toolbarGroupsToEnable, PRIORITY_TWO)(dispatch, getState);
};

const isElementDisabled = (state, dataElement) =>
  state.viewer.disabledElements[dataElement]?.disabled;

export const allButtonsInGroupDisabled = (state, toolGroup) => {
  const dataElements = Object.values(state.viewer.toolButtonObjects)
    .filter(({ group }) => group === toolGroup)
    .map(({ dataElement }) => dataElement);

  return dataElements.every(dataElement =>
    isElementDisabled(state, dataElement),
  );
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
    const firstTool = Object.keys(tools).find(key => {
      return tools[key].group === toolGroup;
    });
    return firstTool;
  };

  if (toolbarGroup === 'toolbarGroup-View') {
    dispatch(closeElements(['toolsHeader']));
    core.setToolMode(defaultTool);
    dispatch({
      type: 'SET_ACTIVE_TOOL_GROUP',
      payload: { toolGroup: '' },
    });
  } else {
    dispatch(openElements(['toolsHeader']));
    const state = getState();
    const lastPickedToolGroup = state.viewer.lastPickedToolGroup[toolbarGroup] || getFirstToolGroupForToolbarGroup(state, toolbarGroup);
    const lastPickedToolName = state.viewer.lastPickedToolForGroup[lastPickedToolGroup]
      || getFirstToolNameForGroup(state, lastPickedToolGroup);
    if (pickTool) {
      if (lastPickedToolName === 'AnnotationCreateSignature') {
        core.setToolMode(defaultTool);
      } else {
        core.setToolMode(lastPickedToolName);
      }
      dispatch({
        type: 'SET_ACTIVE_TOOL_GROUP',
        payload: { toolGroup: lastPickedToolGroup },
      });
    } else {
      core.setToolMode(defaultTool);
      dispatch({
        type: 'SET_ACTIVE_TOOL_GROUP',
        payload: { toolGroup: '' },
      });
    }
  }
  dispatch(closeElements(['toolsOverlay', 'signatureOverlay', 'toolStylePopup']));
  dispatch({
    type: 'SET_TOOLBAR_GROUP',
    payload: { toolbarGroup },
  });
};
export const setSelectedStampIndex = index => ({
  type: 'SET_SELECTED_STAMP_INDEX',
  payload: { index },
});
export const setOutlineControlVisibility = outlineControlVisibility => ({
  type: 'SET_OUTLINE_CONTROL_VISIBILITY',
  payload: { outlineControlVisibility },
});
export const setSelectedDisplayedSignatureIndex = index => ({
  type: 'SET_SELECTED_DISPLAYED_SIGNATURE_INDEX',
  payload: { index },
});
export const setSavedSignatures = savedSignatures => ({
  type: 'SET_SAVED_SIGNATURES',
  payload: { savedSignatures },
});
export const setDisplayedSignaturesFilterFunction = filterFunction => ({
  type: 'SET_DISPLAYED_SIGNATURES_FILTER_FUNCTION',
  payload: { filterFunction },
});
export const setLeftPanelWidth = width => ({
  type: 'SET_LEFT_PANEL_WIDTH',
  payload: { width },
});
export const setSearchPanelWidth = width => ({
  type: 'SET_SEARCH_PANEL_WIDTH',
  payload: { width },
});
export const setNotesPanelWidth = width => ({
  type: 'SET_NOTES_PANEL_WIDTH',
  payload: { width },
});
export const setDocumentContainerWidth = width => ({
  type: 'SET_DOCUMENT_CONTAINER_WIDTH',
  payload: { width },
});
export const setDocumentContainerHeight = height => ({
  type: 'SET_DOCUMENT_CONTAINER_HEIGHT',
  payload: { height },
});

export const enableAllElements = () => ({
  type: 'ENABLE_ALL_ELEMENTS',
  payload: {},
});
export const openElement = dataElement => (dispatch, getState) => {
  const state = getState();

  const isElementDisabled =
    state.viewer.disabledElements[dataElement]?.disabled;
  const isLeftPanelOpen = state.viewer.openElements['leftPanel'];
  const isElementOpen = isDataElementLeftPanel(dataElement, state)
    ? isLeftPanelOpen && state.viewer.activeLeftPanel === dataElement
    : state.viewer.openElements[dataElement];

  if (isElementDisabled || isElementOpen) {
    return;
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
  }
};
export const openElements = dataElements => dispatch => {
  if (typeof dataElements === 'string') {
    dispatch(openElement(dataElements));
  } else {
    dataElements.forEach(dataElement => {
      dispatch(openElement(dataElement));
    });
  }
};
export const closeElement = dataElement => (dispatch, getState) => {
  const state = getState();

  const isElementDisabled =
    state.viewer.disabledElements[dataElement]?.disabled;
  const isElementClosed = isDataElementLeftPanel(dataElement, state)
    ? state.viewer.activeLeftPanel !== dataElement
    : !state.viewer.openElements[dataElement];

  if (isElementDisabled || isElementClosed) {
    return;
  }

  if (
    isDataElementLeftPanel(dataElement, state) &&
    state.viewer.openElements['leftPanel']
  ) {
    dispatch({ type: 'CLOSE_ELEMENT', payload: { dataElement: 'leftPanel' } });
    fireEvent(Events.VISIBILITY_CHANGED, { element: 'leftPanel', isVisible: false });
  } else {
    dispatch({ type: 'CLOSE_ELEMENT', payload: { dataElement } });
    fireEvent(Events.VISIBILITY_CHANGED, { element: dataElement, isVisible: false });

    if (dataElement === 'leftPanel' && state.viewer.openElements['leftPanel']) {
      fireEvent(Events.VISIBILITY_CHANGED, {
        element: state.viewer.activeLeftPanel,
        isVisible: false,
      });
    }
  }
};
export const closeElements = dataElements => dispatch => {
  if (typeof dataElements === 'string') {
    dispatch(closeElement(dataElements));
  } else {
    dataElements.forEach(dataElement => {
      dispatch(closeElement(dataElement));
    });
  }
};

export const toggleElement = dataElement => (dispatch, getState) => {
  const state = getState();

  if (
    state.viewer.disabledElements[dataElement]?.disabled
  ) {
    return;
  }

  // hack for new ui
  if (!state.viewer.notesInLeftPanel) {
    if (dataElement === 'searchPanel') {
      dispatch(closeElement('notesPanel'));
    } else if (dataElement === 'notesPanel') {
      dispatch(closeElement('searchPanel'));
    }
  }

  if (state.viewer.openElements[dataElement]) {
    dispatch(closeElement(dataElement));
  } else {
    dispatch(openElement(dataElement));
  }
};

export const setCustomModal = modalOptions => ({
  type: 'SET_CUSTOM_MODAL',
  payload: modalOptions,
});

export const setActiveHeaderGroup = headerGroup => ({
  type: 'SET_ACTIVE_HEADER_GROUP',
  payload: { headerGroup },
});
export const setActiveLeftPanel = dataElement => (dispatch, getState) => {
  const state = getState();

  if (isDataElementLeftPanel(dataElement, state)) {
    if (state.viewer.activeLeftPanel !== dataElement) {
      dispatch({
        type: 'CLOSE_ELEMENT',
        payload: { dataElement: state.viewer.activeLeftPanel },
      });
      fireEvent(Events.VisibilityChanged, {
        element: state.viewer.activeLeftPanel,
        isVisible: false,
      });
      dispatch({ type: 'SET_ACTIVE_LEFT_PANEL', payload: { dataElement } });
      fireEvent(Events.VisibilityChanged, { element: dataElement, isVisible: true });
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
    ].join(', ');
    console.warn(
      `${dataElement} is not recognized by the left panel. Please use one of the following options: ${panelDataElements}`,
    );
  }
};
export const setSortStrategy = sortStrategy => ({
  type: 'SET_SORT_STRATEGY',
  payload: { sortStrategy },
});
export const setSortNotesBy = sortStrategy => {
  console.warn(
    'setSortNotesBy is deprecated, please use setSortStrategy instead',
  );

  return setSortStrategy(sortStrategy);
};
export const setNoteDateFormat = noteDateFormat => ({
  type: 'SET_NOTE_DATE_FORMAT',
  payload: { noteDateFormat },
});
export const setPrintedNoteDateFormat = noteDateFormat => ({
  type: 'SET_PRINTED_NOTE_DATE_FORMAT',
  payload: { noteDateFormat },
});
export const setCustomPanel = newPanel => ({
  type: 'SET_CUSTOM_PANEL',
  payload: { newPanel },
});
export const setPageLabels = pageLabels => dispatch => {
  if (pageLabels.length !== core.getTotalPages()) {
    console.warn('Number of page labels do not match with the total pages.');
    return;
  }
  dispatch({
    type: 'SET_PAGE_LABELS',
    payload: { pageLabels: pageLabels.map(String) },
  });
};
export const setSelectedPageThumbnails = (selectedThumbnailPageIndexes = []) =>{ 
  fireEvent(Events.SELECTED_THUMBNAIL_CHANGED, selectedThumbnailPageIndexes);

  return ({
    type: 'SET_SELECTED_THUMBNAIL_PAGE_INDEXES',
    payload: { selectedThumbnailPageIndexes },
  });
};
export const setShiftKeyThumbnailsPivotIndex = (shiftKeyThumbnailPivotIndex = null) => ({
  type: 'SET_SHIFT_KEY_THUMBNAIL_PIVOT_INDEX',
  payload: { shiftKeyThumbnailPivotIndex },
});
export const setSwipeOrientation = swipeOrientation => ({
  type: 'SET_SWIPE_ORIENTATION',
  payload: { swipeOrientation },
});
export const showWarningMessage = options => dispatch => {
  dispatch({ type: 'SET_WARNING_MESSAGE', payload: options });
  dispatch(openElement('warningModal'));
};
export const showErrorMessage = message => dispatch => {
  dispatch({ type: 'SET_ERROR_MESSAGE', payload: { message } });
  dispatch(openElement('errorModal'));
};
export const setCustomNoteFilter = filterFunc => ({
  type: 'SET_CUSTOM_NOTE_FILTER',
  payload: { customNoteFilter: filterFunc },
});
export const setZoomList = zoomList => dispatch => {
  const minZoomLevel = getMinZoomLevel();
  const maxZoomLevel = getMaxZoomLevel();
  const filteredZoomList = zoomList.filter(
    zoom => zoom >= minZoomLevel && zoom <= maxZoomLevel,
  );

  if (filteredZoomList.length !== zoomList.length) {
    const outOfRangeZooms = zoomList.filter(
      zoom => !filteredZoomList.includes(zoom),
    );
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
export const setMaxSignaturesCount = maxSignaturesCount => ({
  type: 'SET_MAX_SIGNATURES_COUNT',
  payload: { maxSignaturesCount },
});
export const setUserData = userData => ({
  type: 'SET_USER_DATA',
  payload: { userData },
});
export const setCustomMeasurementOverlay = customMeasurementOverlay => ({
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
export const setActiveTheme = theme => {
  fireEvent(Events.THEME_CHANGED, theme);

  return ({
    type: 'SET_ACTIVE_THEME',
    payload: { theme },
  });
};
export const setSearchResults = searchResults => ({
  type: 'SET_SEARCH_RESULTS',
  payload: searchResults,
});

export const setClearSearchOnPanelClose = shouldClear => ({
  type: 'SET_CLEAR_SEARCH_ON_PANEL_CLOSE',
  payload: shouldClear,
});

export const setAnnotationContentOverlayHandler = annotationContentOverlayHandler => ({
  type: 'SET_ANNOTATION_CONTENT_OVERLAY_HANDLER',
  payload: { annotationContentOverlayHandler }
});

export const setAnnotationReadState = ({ isRead, annotationId }) => ({
  type: 'SET_ANNOTATION_READ_STATE',
  payload: { isRead, annotationId }
});
export const addTrustedCertificates = certificates => ({
  type: 'ADD_TRUSTED_CERTIFICATES',
  payload: { certificates },
});
export const setSignatureValidationModalWidgetName = widgetName => ({
  type: 'SET_VALIDATION_MODAL_WIDGET_NAME',
  payload: { validationModalWidgetName: widgetName },
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
  type: "PAGE_DELETION_CONFIRMATION_MODAL_POPUP",
  payload: { pageDeletionConfirmationModalEnabled: true }
});

export const disablePageDeletionConfirmationModal = () => ({
  type: "PAGE_DELETION_CONFIRMATION_MODAL_POPUP",
  payload: { pageDeletionConfirmationModalEnabled: false }
});