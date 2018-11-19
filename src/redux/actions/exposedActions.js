import isDataElementPanel from 'helpers/isDataElementPanel';
import { fireEvent } from 'helpers/loadDocument';

// viewer
export const enableAllElements = () => ({ type: 'ENABLE_ALL_ELEMENTS', payload: {} });
export const openElement = dataElement => (dispatch, getState) => {
  const state = getState();

  const isElementDisabled = state.viewer.disabledElements[dataElement] && state.viewer.disabledElements[dataElement].disabled;
  const isElementOpen = isDataElementPanel(dataElement, state) ? state.viewer.activeLeftPanel === dataElement : state.viewer.openElements[dataElement];

  if (isElementDisabled || isElementOpen) {
    return;
  }

  if (isDataElementPanel(dataElement, state)) {
    if (!state.viewer.openElements['leftPanel']) {
      dispatch({ type: 'OPEN_ELEMENT', payload: { dataElement: 'leftPanel' } });
      fireEvent('visibilityChanged', { element: 'leftPanel', isVisible: true });
    }
    dispatch({ type: 'SET_ACTIVE_LEFT_PANEL', payload: { dataElement } });
  } else {
    dispatch({ type: 'OPEN_ELEMENT', payload: { dataElement } });
    fireEvent('visibilityChanged', { element: dataElement, isVisible: true });
  }
};
export const openElements = dataElements => dispatch => {
  dataElements.forEach(dataElement => {
    dispatch(openElement(dataElement));
  });
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
  }
};
export const closeElements = dataElements => dispatch => {
  dataElements.forEach(dataElement => {
    dispatch(closeElement(dataElement));
  });
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
    dispatch({ type: 'SET_ACTIVE_LEFT_PANEL', payload: { dataElement } });
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
export const setSortNotesBy = sortNotesBy => ({ type: 'SET_SORT_NOTES_BY', payload: { sortNotesBy } });
export const updateTool = (toolName, properties) => ({ type: 'UPDATE_TOOL', payload: { toolName, properties } });
export const setCustomPanel = newPanel => ({ type: 'SET_CUSTOM_PANEL', payload: { newPanel } });
