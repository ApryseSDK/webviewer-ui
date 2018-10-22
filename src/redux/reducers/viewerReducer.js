export default initialState => (state = initialState, action) => {
  const { type, payload } = action;

  switch(type) {
    case 'DISABLE_ELEMENT':
      return { ...state, disabledElements: { ...state.disabledElements, [payload.dataElement]: { disabled: true, priority: payload.priority } } };
    case 'DISABLE_ELEMENTS': {
      const disabledElements = {};
      payload.dataElements.forEach(dataElement => {
        disabledElements[dataElement] = {};
        disabledElements[dataElement].disabled = true;
        disabledElements[dataElement].priority = payload.priority;
      });

      return { ...state, disabledElements: { ...state.disabledElements, ...disabledElements } };
    }
    case 'ENABLE_ELEMENT':
      return { ...state, disabledElements: { ...state.disabledElements, [payload.dataElement]: { disabled: false, priority: payload.priority } } };
    case 'ENABLE_ELEMENTS': {
      const disabledElements = {};
      payload.dataElements.forEach(dataElement => {
        disabledElements[dataElement] = {};
        disabledElements[dataElement].disabled = false;
        disabledElements[dataElement].priority = payload.priority;
      });

      return { ...state, disabledElements: { ...state.disabledElements, ...disabledElements } };
    }
    case 'ENABLE_ALL_ELEMENTS':
      return { ...state, disabledElements: { ...initialState.disabledElements } };
    case 'OPEN_ELEMENT':
      return { ...state, openElements: { ...state.openElements, [payload.dataElement]: true } };
    case 'CLOSE_ELEMENT':
      return { ...state, openElements: { ...state.openElements, [payload.dataElement]: false } };
    case 'SET_ACTIVE_HEADER_GROUP':
      return { ...state, activeHeaderGroup: payload.headerGroup };
    case 'SET_ACTIVE_TOOL_NAME':
      return { ...state, activeToolName: payload.toolName };
    case 'SET_ACTIVE_TOOL_STYLES':
      return { ...state, activeToolStyles: payload.toolStyles };
    case 'SET_ACTIVE_TOOL_NAME_AND_STYLES':
      return { ...state, activeToolName: payload.toolName, activeToolStyles: payload.toolStyles };
    case 'SET_ACTIVE_LEFT_PANEL':
      return { ...state, activeLeftPanel: payload.dataElement };
    case 'SET_ACTIVE_TOOL_GROUP':
      return { ...state, activeToolGroup: payload.toolGroup };
    case 'SET_NOTE_POPUP_ID':
      return { ...state, notePopupId: payload.id };
    case 'EXPAND_NOTE':
      return { ...state, expandedNotes: { ...state.expandedNotes, [payload.id]: true } };
    case 'EXPAND_NOTES': {
      const expandedNotes = {};
      payload.ids.forEach(id => {
        expandedNotes[id] = true;
      });

      return { ...state, expandedNotes: { ...state.expandedNotes, ...expandedNotes } };
    }
    case 'COLLAPSE_NOTE':
      return { ...state, expandedNotes: { ...state.expandedNotes, [payload.id]: false } };
    case 'COLLAPSE_ALL_NOTES':
      return { ...state, expandedNotes: { ...initialState.expandedNotes } };
    case 'SET_IS_NOTE_EDITING':
      return { ...state, isNoteEditing: payload.isNoteEditing };
    case 'SET_FIT_MODE':
      return { ...state, fitMode: payload.fitMode };
    case 'SET_ZOOM':
      return { ...state, zoom: payload.zoom };
    case 'SET_DISPLAY_MODE':
      return { ...state, displayMode: payload.displayMode };
    case 'SET_CURRENT_PAGE':
      return { ...state, currentPage: payload.currentPage };
    case 'SET_SORT_NOTES_BY':
      return { ...state, sortNotesBy: payload.sortNotesBy };
    case 'SET_FULL_SCREEN':
      return { ...state, isFullScreen: payload.isFullScreen };
    case 'SET_HEADER_ITEMS':
      return { ...state, headers: { ...state.headers, [payload.header]: payload.headerItems} };
    case 'REGISTER_TOOL':
      return {
        ...state,
        toolButtonObjects: {
          ...state.toolButtonObjects,
          [payload.toolName]: {
            dataElement: payload.buttonName,
            title: payload.tooltip,
            group: payload.buttonGroup,
            img: payload.buttonImage,
            showColor: 'active'
          }
        }
      };
    case 'UNREGISTER_TOOL': {
      const newToolButtonObjects = { ...state.toolButtonObjects };
      delete newToolButtonObjects[payload.toolName];
      return { ...state, toolButtonObjects: newToolButtonObjects };
    }
    case 'UPDATE_TOOL': {
      const { toolName, properties } = payload;
      const { buttonName, tooltip, buttonGroup, buttonImage } = properties;
      return {
        ...state,
        toolButtonObjects: {
          ...state.toolButtonObjects,
          [toolName]: {
            ...state.toolButtonObjects[toolName],
            dataElement: buttonName || state.toolButtonObjects[toolName].dataElement,
            title: tooltip || state.toolButtonObjects[toolName].title,
            group: buttonGroup || state.toolButtonObjects[toolName].group,
            img: buttonImage || state.toolButtonObjects[toolName].img,
          }
        }
      };
    }
    case 'SET_TOOL_BUTTON_OBJECTS': 
      return { ...state, toolButtonObjects: { ...payload.toolButtonObjects } };
    case 'SET_DOCUMENT_LOADED':
      return { ...state, isDocumentLoaded: payload.isDocumentLoaded };
    case 'SET_READ_ONLY':
      return { ...state, isReadOnly: payload.isReadOnly };
    case 'SET_LOADING_MESSAGE':
      return { ...state, loadingMessage: payload.loadingMessage };
    case 'ENABLE_TOOL':
      return { ...state, disabledTools: { ...state.disabledTools, [payload.toolName]: false } };
    case 'ENABLE_TOOLS': 
      {
        const disabledTools = {};
        payload.toolNames.forEach(toolName => {
          disabledTools[toolName] = false;
        });
  
        return { ...state, disabledTools: { ...state.disabledTools, ...disabledTools } };
      }
    case 'DISABLE_TOOL':
      return { ...state, disabledTools: { ...state.disabledTools, [payload.toolName]: true } };
    case 'DISABLE_TOOLS': 
      {
        const disabledTools = {};
        payload.toolNames.forEach(toolName => {
          disabledTools[toolName] = true;
        });
  
        return { ...state, disabledTools: { ...state.disabledTools, ...disabledTools } };
      }
    default:
      return state;
  }
};