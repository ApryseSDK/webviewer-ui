import isDataElementPanel from 'helpers/isDataElementPanel';
import core from 'core';
import fireEvent from 'helpers/fireEvent';

// viewer
export const enableAllElements = () => ({ type: 'ENABLE_ALL_ELEMENTS', payload: {} });
export const openElement = dataElement => (dispatch, getState) => {
  const state = getState();

  const isElementDisabled = state.viewer.disabledElements[dataElement] && state.viewer.disabledElements[dataElement].disabled;
  const isLeftPanelOpen = state.viewer.openElements['leftPanel'];
  const isElementOpen = isDataElementPanel(dataElement, state) ? isLeftPanelOpen && state.viewer.activeLeftPanel === dataElement : state.viewer.openElements[dataElement];

  if (isElementDisabled || isElementOpen) {
    return;
  }

  if (isDataElementPanel(dataElement, state)) {
    if (!isLeftPanelOpen) {
      dispatch({ type: 'OPEN_ELEMENT', payload: { dataElement: 'leftPanel' } });
      fireEvent('visibilityChanged', { element: 'leftPanel', isVisible: true });
    }
    dispatch(setActiveLeftPanel(dataElement));
  } else {
    dispatch({ type: 'OPEN_ELEMENT', payload: { dataElement } });
    fireEvent('visibilityChanged', { element: dataElement, isVisible: true });

    if (dataElement === 'leftPanel'  && !isLeftPanelOpen) {
      fireEvent('visibilityChanged', { element: state.viewer.activeLeftPanel, isVisible: true });
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

  const isElementDisabled = state.viewer.disabledElements[dataElement] && state.viewer.disabledElements[dataElement].disabled;
  const isElementClosed = isDataElementPanel(dataElement, state) ? state.viewer.activeLeftPanel !== dataElement : !state.viewer.openElements[dataElement];

  if (isElementDisabled || isElementClosed) {
    return;
  }

  if (isDataElementPanel(dataElement, state) && state.viewer.openElements['leftPanel']) {
    dispatch({ type: 'CLOSE_ELEMENT', payload: { dataElement: 'leftPanel' } });
    fireEvent('visibilityChanged', { element: 'leftPanel', isVisible: false });
  } else {
    dispatch({ type: 'CLOSE_ELEMENT', payload: { dataElement } });
    fireEvent('visibilityChanged', { element: dataElement, isVisible: false });

    if (dataElement === 'leftPanel'  && state.viewer.openElements['leftPanel']) {
      fireEvent('visibilityChanged', { element: state.viewer.activeLeftPanel, isVisible: false });
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

  if (state.viewer.disabledElements[dataElement]) {
    return;
  }

  if (state.viewer.openElements[dataElement]) {
    dispatch(closeElement(dataElement));
  } else {
    dispatch(openElement(dataElement));
  }
};

export const setActiveHeaderGroup =  headerGroup => ({ type: 'SET_ACTIVE_HEADER_GROUP', payload: { headerGroup } });
export const setActiveLeftPanel = dataElement => (dispatch, getState) => {
  const state = getState();

  if (isDataElementPanel(dataElement, state)) {
    if (state.viewer.activeLeftPanel !== dataElement) {
      dispatch({ type: 'CLOSE_ELEMENT', payload: { dataElement: state.viewer.activeLeftPanel } });
      fireEvent('visibilityChanged', { element: state.viewer.activeLeftPanel, isVisible: false });
      dispatch({ type: 'SET_ACTIVE_LEFT_PANEL', payload: { dataElement } });
      fireEvent('visibilityChanged', { element: dataElement, isVisible: true });
    }
  } else {
    const panelDataElements = [
      ...state.viewer.customPanels.map(({ panel }) => panel.dataElement),
      'thumbnailsPanel',
      'outlinesPanel',
      'notesPanel'
    ].join(', ');
    console.warn(`${dataElement} is not recognized by the left panel. Please use one of the following options: ${panelDataElements}`);
  }
};
export const setSortStrategy = sortStrategy => ({ type: 'SET_SORT_STRATEGY', payload: { sortStrategy } });
export const setSortNotesBy = sortStrategy => {
  console.warn('setSortNotesBy is going to be deprecated, please use setSortStrategy instead');

  return setSortStrategy(sortStrategy);
};
export const setNoteDateFormat = noteDateFormat => ({ type: 'SET_NOTE_DATE_FORMAT', payload: { noteDateFormat } });
export const updateTool = (toolName, properties) => ({ type: 'UPDATE_TOOL', payload: { toolName, properties } });
export const setCustomPanel = newPanel => ({ type: 'SET_CUSTOM_PANEL', payload: { newPanel } });
export const useEmbeddedPrint = (useEmbeddedPrint = true) => ({ type: 'USE_EMBEDDED_PRINT', payload: { useEmbeddedPrint } });
export const setPageLabels = pageLabels => dispatch => {
  if (pageLabels.length !== core.getTotalPages()) {
    console.warn('Number of page labels do not match with the total pages.');
    return;
  }
  dispatch({ type: 'SET_PAGE_LABELS', payload: { pageLabels: pageLabels.map(String) } });
};

export const setColorPalette = (annotationType, colorPalette) => dispatch => {
  const threeTypes = ["text","border","fill"];
  const twoTypes = ["border","fill"];

  switch(annotationType) {
    case "annotation.freeHand":
    case "Highlight":
    case "Underline":
    case "Squiggly":
    case "Strikeout":
    case "Line":
    case "Polyline":
    case "Signature":
    case "Comment":
      if (colorPalette !== "border"){
        console.warn("The selected color palette does not exist for " + annotationType + ".");
        return;
      } else {
        break;
      }
    case "Free text":
    case "Callout":
      if (!threeTypes.includes(colorPalette)){
        console.warn("The selected color palette does not exist for " + annotationType + ".");
        return;
      } else {
        break;
      }
    case "Rectangle":
    case "Ellipse":
    case "Polygon":
      if (!twoTypes.includes(colorPalette)){
        console.warn("The selected color palette does not exist for " + annotationType + ".");
        return;
      } else {
        break;
      }
  }
  dispatch({ type: 'SET_COLOR_PALETTE', payload: { annotationType: annotationType, colorPalette: colorPalette } });
};

export const setDefaultColorPalette = (annotationType, colorPalette) => dispatch => {
  setcolorPalette(annotationType, colorPalette);
  dispatch({ type: 'SET_DEFAULT_COLOR_PALETTE', payload: { annotationType: annotationType, colorPalette: colorPalette } });
}  