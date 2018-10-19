// viewer
export const enableAllElements = () => ({ type: 'ENABLE_ALL_ELEMENTS', payload: {} });
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
    case 'loadingModal': 
      dispatch({ type: 'OPEN_ELEMENT', payload: { dataElement } });
      dispatch({ type: 'SET_LOADING_MESSAGE', payload: { loadingMessage } });  
      break;
    default:
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
    case 'loadingModal':
      if (state.viewer.openElements['loadingModal']) {
        dispatch({ type: 'CLOSE_ELEMENT', payload: { dataElement } });
        dispatch({ type: 'SET_LOADING_MESSAGE', payload: { loadingMessage: '' } });
      }
      break;
    default:
      if (state.viewer.openElements[dataElement]) {
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