// viewer
export const disableElement = dataElement => dispatch => {
  if (dataElement === 'stylePopup') {
    dispatch(disableElements(['toolStylePopup', 'annotationStylePopup']));
  } else {
    dispatch({ type: 'DISABLE_ELEMENT', payload: { dataElement }});
  }
};
export const disableElements = dataElements => ({ type: 'DISABLE_ELEMENTS', payload: { dataElements } });
export const enableElement = dataElement => dispatch => {
  if (dataElement === 'stylePopup') {
    dispatch(enableElements(['toolStylePopup', 'annotationStylePopup']));
  } else {
    dispatch({ type: 'ENABLE_ELEMENT', payload: { dataElement }});
  }
};
export const enableElements = dataElements => ({ type: 'ENABLE_ELEMENTS', payload: { dataElements } });
export const enableAllElements = () => ({ type: 'ENABLE_ALL_ELEMENTS', payload: { } });
export const openElement = (dataElement, loadingMessage) => (dispatch, getState) => {
  const state = getState();

  if (state.viewer.disabledElements[dataElement]) {
    return;
  }

  switch (dataElement) {
    case 'thumbnailsPanel':
    case 'outlinesPanel':
    case 'notesPanel':
      dispatch({ type: 'OPEN_ELEMENT', payload: { dataElement: 'leftPanel' } });
      dispatch({ type: 'SET_ACTIVE_LEFT_PANEL', payload: { dataElement } });
      break;
    default:
      if (dataElement === 'loadingModal') {
        dispatch({ type: 'SET_LOADING_MESSAGE', payload: { loadingMessage } });  
      }
      dispatch({ type: 'OPEN_ELEMENT', payload: { dataElement } });
      break;
  }
};
export const openElements = dataElements => dispatch => {
  dataElements.forEach(dataElement => {
    dispatch(openElement(dataElement));
  });
};
export const closeElement = dataElement => (dispatch, getState) => {
  const state = getState();

  if (state.viewer.disabledElements[dataElement]) {
    return;
  }

  switch (dataElement) {
    case 'thumbnailsPanel':
    case 'outlinesPanel':
    case 'notesPanel':
      if (state.viewer.openElements['leftPanel']) {
        dispatch({ type: 'CLOSE_ELEMENT', payload: { dataElement: 'leftPanel' } });
      }
      break;
    default:
      if (state.viewer.openElements[dataElement]) {
        if (dataElement === 'loadingModal') {
          dispatch({ type: 'SET_LOADING_MESSAGE', payload: { loadingMessage: '' } });  
        }
        dispatch({ type: 'CLOSE_ELEMENT', payload: { dataElement } });
      }
      break;
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
export const setActiveLeftPanel = dataElement => dispatch => {
  switch (dataElement) {
    case 'thumbnailsPanel':
    case 'outlinesPanel':
    case 'notesPanel':
      dispatch({ type: 'SET_ACTIVE_LEFT_PANEL', payload: { dataElement } });
      break;
    default:
      console.warn(`${dataElement} is not recognized by the left panel. Please use one of the following options: thumbnailsPanel, outlinesPanel or notesPanel.`);
  }
};
export const setSortNotesBy = sortNotesBy => ({ type: 'SET_SORT_NOTES_BY', payload: { sortNotesBy } });
export const updateTool = (toolName, properties) => ({ type: 'UPDATE_TOOL', payload: { toolName, properties } });