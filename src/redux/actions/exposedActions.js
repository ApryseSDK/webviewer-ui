import core from 'core';
import isDataElementLeftPanel from 'helpers/isDataElementLeftPanel';
import fireEvent from 'helpers/fireEvent';
import { getMinZoomLevel, getMaxZoomLevel } from 'constants/zoomFactors';
import localStorageManager from 'helpers/localStorageManager';

// viewer
export const enableAllElements = () => ({
  type: 'ENABLE_ALL_ELEMENTS',
  payload: {},
});
export const openElement = dataElement => (dispatch, getState) => {
  const state = getState();

  // if (dataElement === 'menuOverlay') {
  //   debugger;
  // }

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
      fireEvent('visibilityChanged', { element: 'leftPanel', isVisible: true });
    }
    dispatch(setActiveLeftPanel(dataElement));
  } else {
    dispatch({ type: 'OPEN_ELEMENT', payload: { dataElement } });
    fireEvent('visibilityChanged', { element: dataElement, isVisible: true });

    if (dataElement === 'leftPanel' && !isLeftPanelOpen) {
      fireEvent('visibilityChanged', {
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
    fireEvent('visibilityChanged', { element: 'leftPanel', isVisible: false });
  } else {
    dispatch({ type: 'CLOSE_ELEMENT', payload: { dataElement } });
    fireEvent('visibilityChanged', { element: dataElement, isVisible: false });

    if (dataElement === 'leftPanel' && state.viewer.openElements['leftPanel']) {
      fireEvent('visibilityChanged', {
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

  if (state.viewer.openElements[dataElement]) {
    dispatch(closeElement(dataElement));
  } else {
    dispatch(openElement(dataElement));
  }
};

export const swapTools = (toolNameToSwap, otherToolName) => (dispatch, getState) => {
  dispatch({
    type: 'SWAP_TOOLS',
    payload: { toolNameToSwap, otherToolName },
  });

  // if (localStorageManager.isLocalStorageEnabled()) {
  //   const storePosition = (toolName, { position }) => {
  //     try {
  //       localStorage.setItem(`toolPosition-${toolName}`, position);
  //     } catch (err) {
  //       console.warn(`localStorage could not be accessed. ${err.message}`);
  //     }
  //   };

  //   const state = getState();
  //   const toolToSwap = state.viewer.toolButtonObjects[toolNameToSwap];
  //   const otherTool = state.viewer.toolButtonObjects[otherToolName];

  //   storePosition(toolNameToSwap, toolToSwap);
  //   storePosition(otherToolName, otherTool);
  // }
};

export const setDefaultToolPositions = positions => ({
  type: 'SET_DEFAULT_TOOL_POSITIONS',
  payload: { positions },
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
      fireEvent('visibilityChanged', {
        element: state.viewer.activeLeftPanel,
        isVisible: false,
      });
      dispatch({ type: 'SET_ACTIVE_LEFT_PANEL', payload: { dataElement } });
      fireEvent('visibilityChanged', { element: dataElement, isVisible: true });
    }
  } else {
    const panelDataElements = [
      ...state.viewer.customPanels.map(({ panel }) => panel.dataElement),
      'thumbnailsPanel',
      'outlinesPanel',
      'layersPanel',
      'bookmarksPanel',
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
export const setSelectedPageThumbnails = (selectedThumbnailPageIndexes = []) => ({
  type: 'SET_SELECTED_THUMBNAIL_PAGE_INDEXES',
  payload: { selectedThumbnailPageIndexes },
});
export const deletePageIndex = pageIndexDeleted => ({
  type: 'REMOVE_PAGE_INDEX',
  payload: { pageIndexDeleted },
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

export const setActiveTheme = theme => ({
  type: 'SET_ACTIVE_THEME',
  payload: { theme },
});
