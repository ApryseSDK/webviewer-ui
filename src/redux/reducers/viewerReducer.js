import modifyHeader from 'helpers/modifyHeader';

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
      console.warn(`setActiveHeaderGroup is deprecated.`);
      return state;
    case 'SET_ACTIVE_TOOL_NAME':
      return { ...state, activeToolName: payload.toolName };
    case 'SET_ACTIVE_TOOL_STYLES':
      return { ...state, activeToolStyles: { ...payload.toolStyles }};
    case 'SET_ACTIVE_TOOL_NAME_AND_STYLES':
      return { ...state, activeToolName: payload.toolName, activeToolStyles: payload.toolStyles };
    case 'SET_LIST_INDEX':
    {
      const { listKey, index } = payload;
      return {
        ...state,
        listIndex: {
          ...state.listIndex,
          [listKey]: index,
        },
      };
    }
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
    case 'SET_ROTATION':
      return { ...state, rotation: payload.rotation };
    case 'SET_DISPLAY_MODE':
      return { ...state, displayMode: payload.displayMode };
    case 'SET_CURRENT_PAGE':
      return { ...state, currentPage: payload.currentPage };
    case 'SET_SORT_STRATEGY':
      return { ...state, sortStrategy: payload.sortStrategy };
    case 'SET_NOTE_DATE_FORMAT':
      return { ...state, noteDateFormat: payload.noteDateFormat };
    case 'SET_FULL_SCREEN':
      return { ...state, isFullScreen: payload.isFullScreen };
    case 'SET_HEADER_ITEMS':
      return { ...state, headers: { ...state.headers, [payload.header]: payload.headerItems} };
    case 'REGISTER_TOOL':
      const availablePalettes = ['TextColor', 'StrokeColor', 'FillColor'].filter(property => payload.toolObject.defaults && payload.toolObject.defaults[property]);
      return {
        ...state,
        toolButtonObjects: {
          ...state.toolButtonObjects,
          [payload.toolName]: {
            dataElement: payload.buttonName,
            title: payload.tooltip,
            group: payload.buttonGroup,
            img: payload.buttonImage,
            showColor: 'active',
            iconColor: availablePalettes[0],
            currentPalette: availablePalettes[0],
            availablePalettes,
            annotationCheck: payload.annotationConstructor ? annotation => annotation instanceof payload.annotationConstructor : null
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
            group: (buttonGroup !== undefined) ? buttonGroup : state.toolButtonObjects[toolName].group,
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
    case 'SET_CUSTOM_PANEL':
      return { ...state, customPanels: [ ...state.customPanels, payload.newPanel ] };
    case 'USE_EMBEDDED_PRINT':
      return { ...state, useEmbeddedPrint: payload.useEmbeddedPrint };
    case 'SET_PAGE_LABELS':
      return { ...state, pageLabels: [ ...payload.pageLabels ] };
    case 'SET_COLOR_PALETTE': {
      const { toolName, colorPalette } = payload;
      return { ...state, toolButtonObjects: { ...state.toolButtonObjects, [toolName]: { ...state.toolButtonObjects[toolName], currentPalette: colorPalette } } };
    }
    case 'SET_ICON_COLOR': {
      const { toolName, color } = payload;
      return { ...state, toolButtonObjects: { ...state.toolButtonObjects, [toolName]: { ...state.toolButtonObjects[toolName], iconColor: color } } };
    }
    case 'SET_CURSOR_OVERLAY': {
      const { imgSrc, width, height } = payload.data;

      return {
        ...state,
        cursorOverlay: { imgSrc, width, height }
      };
    }
    case 'SET_SWIPE_ORIENTATION':
      return { ...state, swipeOrientation: payload.swipeOrientation };
    case 'SET_WARNING_MESSAGE':
      return { ...state, warning: payload };
    case 'SET_ERROR_MESSAGE':
      return { ...state, errorMessage: payload.message };
    case 'SET_CUSTOM_NOTE_FILTER':
      return { ...state, customNoteFilter: payload.customNoteFilter };
    case 'ADD_ITEMS': {
      let defaultArr = state.headers.default;
      const { newItems, index, group } = payload;
      if (!group) {
        defaultArr.splice(index, 0, ...newItems);
        return { ...state, headers: { default: [ ...defaultArr ] } };
      } else {
          group.children.splice(index, 0, ...newItems);
          const modification = group.children;
          return modifyHeader(state, group, modification, defaultArr);
      }
    }
    case 'REMOVE_ITEMS': {
      const { itemList, group } = payload;
      let defaultArr = state.headers.default;
      let currentArr = [];
      if (!group) {
        currentArr = state.headers.default;
      } else {
        currentArr = group.children;
      }
      let sortedList = [];
      if (typeof itemList[0] === 'string') {
        currentArr.filter(buttonObject => itemList.includes(buttonObject.dataElement)).forEach(buttonObject => {
          sortedList.push(currentArr.indexOf(buttonObject));
        });
        sortedList = sortedList.sort();
      } else {
        sortedList = itemList.sort();
      }
      for (let i = sortedList.length - 1; i >= 0; i--) {
        currentArr.splice(sortedList[i], 1);
      }
      if (!group){
        return { ...state, headers: { default: [ ...currentArr ] } }
      } else {
        const modification = [ ...currentArr ];
        return modifyHeader(state, group, modification, defaultArr);
      }
    }
    case 'UPDATE_ITEM': {
      const { dataElement, newProps, group } = payload;
      let defaultArr = state.headers.default;
      let currentArr = [];
      if (!group) {
        currentArr = [ ...state.headers.default ];
      } else {
        currentArr = [ ...group.children ];
      }
      let updateObject = currentArr.find(buttonObject => buttonObject.dataElement === dataElement);
      const updateObjectIndex = currentArr.indexOf(updateObject);
      updateObject = { ...updateObject, ...newProps }
      if (!group) {
        currentArr[updateObjectIndex] = updateObject;
        return { ...state, headers: { default: currentArr } }
      } else {
        group.children[updateObjectIndex] = updateObject;
        const modification = [ ...group.children ];
        return modifyHeader(state, group, modification, defaultArr);
      }
    }
    case 'SET_ITEMS': {
      const { items, group } = payload;
      let defaultArr = state.headers.default;
      if (!group) {
        return { ...state, headers: { default: [ ...items ] } }
      } else {
        const modification = [ ...items ];
        return modifyHeader(state, group, modification, defaultArr);
      }
    }
    case 'SET_ZOOM_LIST':
      return { ...state, zoomList: payload.zoomList };
    default:
      return state;
    }
  };
