import replaceChildren from 'helpers/replaceChildren';

export default initialState => (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case 'DISABLE_ELEMENT':
      return {
        ...state,
        disabledElements: {
          ...state.disabledElements,
          [payload.dataElement]: { disabled: true, priority: payload.priority },
        },
      };
    case 'DISABLE_ELEMENTS': {
      const disabledElements = {};
      payload.dataElements.forEach(dataElement => {
        disabledElements[dataElement] = {};
        disabledElements[dataElement].disabled = true;
        disabledElements[dataElement].priority = payload.priority;
      });

      return {
        ...state,
        disabledElements: { ...state.disabledElements, ...disabledElements },
      };
    }
    case 'ENABLE_ELEMENT':
      return {
        ...state,
        disabledElements: {
          ...state.disabledElements,
          [payload.dataElement]: {
            disabled: false,
            priority: payload.priority,
          },
        },
      };
    case 'ENABLE_ELEMENTS': {
      const disabledElements = {};
      payload.dataElements.forEach(dataElement => {
        disabledElements[dataElement] = {};
        disabledElements[dataElement].disabled = false;
        disabledElements[dataElement].priority = payload.priority;
      });

      return {
        ...state,
        disabledElements: { ...state.disabledElements, ...disabledElements },
      };
    }
    case 'ENABLE_ALL_ELEMENTS':
      return {
        ...state,
        disabledElements: { ...initialState.disabledElements },
      };
    case 'OPEN_ELEMENT':
      return {
        ...state,
        openElements: { ...state.openElements, [payload.dataElement]: true },
      };
    case 'CLOSE_ELEMENT':
      return {
        ...state,
        openElements: { ...state.openElements, [payload.dataElement]: false },
      };
    case 'SET_ACTIVE_HEADER_GROUP':
      console.warn(`setActiveHeaderGroup is deprecated.`);
      return state;
    case 'SET_ACTIVE_TOOL_NAME':
      return { ...state, activeToolName: payload.toolName };
    case 'SET_ACTIVE_TOOL_STYLES':
      return { ...state, activeToolStyles: { ...payload.toolStyles } };
    case 'SET_ACTIVE_TOOL_NAME_AND_STYLES':
      return {
        ...state,
        activeToolName: payload.toolName,
        activeToolStyles: payload.toolStyles,
      };
    case 'SET_ACTIVE_LEFT_PANEL':
      return { ...state, activeLeftPanel: payload.dataElement };
    case 'SET_ACTIVE_TOOL_GROUP':
      return { ...state, activeToolGroup: payload.toolGroup };
    case 'SET_NOTE_POPUP_ID':
      return { ...state, notePopupId: payload.id };
    case 'SET_NOTE_EDITING':
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
      return { ...state, header: payload.headerItems };
    case 'REGISTER_TOOL':
      const availablePalettes = [
        'TextColor',
        'StrokeColor',
        'FillColor',
      ].filter(
        property =>
          payload.toolObject.defaults && payload.toolObject.defaults[property],
      );
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
            annotationCheck: payload.annotationConstructor
              ? annotation =>
                annotation instanceof payload.annotationConstructor
              : null,
          },
        },
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
            dataElement:
              buttonName || state.toolButtonObjects[toolName].dataElement,
            title: tooltip || state.toolButtonObjects[toolName].title,
            group:
              buttonGroup !== undefined
                ? buttonGroup
                : state.toolButtonObjects[toolName].group,
            img: buttonImage || state.toolButtonObjects[toolName].img,
          },
        },
      };
    }
    case 'SET_TOOL_BUTTON_OBJECTS':
      return { ...state, toolButtonObjects: { ...payload.toolButtonObjects } };
    case 'SET_DOCUMENT_LOADED':
      return { ...state, isDocumentLoaded: payload.isDocumentLoaded };
    case 'SET_READ_ONLY':
      return { ...state, isReadOnly: payload.isReadOnly };
    case 'SET_CUSTOM_PANEL':
      return {
        ...state,
        customPanels: [...state.customPanels, payload.newPanel],
      };
    case 'USE_EMBEDDED_PRINT':
      return { ...state, useEmbeddedPrint: payload.useEmbeddedPrint };
    case 'SET_PAGE_LABELS':
      return { ...state, pageLabels: [...payload.pageLabels] };
    case 'SET_COLOR_PALETTE': {
      const { toolName, colorPalette } = payload;
      return {
        ...state,
        toolButtonObjects: {
          ...state.toolButtonObjects,
          [toolName]: {
            ...state.toolButtonObjects[toolName],
            currentPalette: colorPalette,
          },
        },
      };
    }
    case 'SET_ICON_COLOR': {
      const { toolName, color } = payload;
      return {
        ...state,
        toolButtonObjects: {
          ...state.toolButtonObjects,
          [toolName]: { ...state.toolButtonObjects[toolName], iconColor: color },
        },
      };
    }
    case 'SET_WARNING_MESSAGE':
      return { ...state, warning: payload };
    case 'SET_ERROR_MESSAGE':
      return { ...state, errorMessage: payload.message };
    case 'SET_CUSTOM_NOTE_FILTER':
      return { ...state, customNoteFilter: payload.customNoteFilter };
    case 'ADD_ITEMS': {
      const headerArr = state.header;
      const { newItems, index, group } = payload;
      if (!group) {
        headerArr.splice(index, 0, ...newItems);
        return { ...state, header: [...headerArr] };
      }
      group.children.splice(index, 0, ...newItems);
      const modification = group.children;
      return replaceChildren(state, group, modification, headerArr);
    }
    case 'REMOVE_ITEMS': {
      const { itemList, group } = payload;
      const headerArr = state.header;
      let currentArr = [];
      if (!group) {
        currentArr = state.header;
      } else {
        currentArr = group.children;
      }
      const dataElementArr = currentArr.map(
        buttonObject => buttonObject.dataElement,
      );
      const removeIndices = [];
      itemList.forEach(item => {
        if (typeof item === 'string') {
          if (dataElementArr.includes(item)) {
            removeIndices.push(dataElementArr.indexOf(item));
            console.log(currentArr[dataElementArr.indexOf(item)]);
          } else {
            console.warn(
              `${item} does not exist. Make sure you are removing from the correct group.`,
            );
          }
        } else if (typeof item === 'number') {
          if (item < 0 || item >= currentArr.length) {
            console.warn(
              `${item} is an invalid index. Please make sure to remove index between 0 and ${currentArr.length -
                1}`,
            );
            return;
          }
          removeIndices.push(item);
          console.log(currentArr[item]);
        } else {
          console.warn(
            `type ${typeof item} is not a valid parameter. Pass string or number`,
          );
        }
      });
      for (let i = removeIndices.length - 1; i >= 0; i--) {
        currentArr.splice(removeIndices[i], 1);
      }
      if (!group) {
        return { ...state, header: [...currentArr] };
      }
      const modification = [...currentArr];
      return replaceChildren(state, group, modification, headerArr);
    }
    case 'UPDATE_ITEM': {
      const { dataElement, newProps, group } = payload;
      const headerArr = state.header;
      let currentArr = [];
      if (!group) {
        currentArr = [...state.header];
      } else {
        currentArr = [...group.children];
      }
      let updateObject = currentArr.find(
        buttonObject => buttonObject.dataElement === dataElement,
      );
      const updateObjectIndex = currentArr.indexOf(updateObject);
      updateObject = { ...updateObject, ...newProps };
      if (!group) {
        currentArr[updateObjectIndex] = updateObject;
        return { ...state, header: currentArr };
      }
      group.children[updateObjectIndex] = updateObject;
      const modification = [...group.children];
      return replaceChildren(state, group, modification, headerArr);
    }
    case 'SET_ITEMS': {
      const { items, group } = payload;
      const headerArr = state.header;
      if (!group) {
        return { ...state, header: [...items] };
      }
      const modification = [...items];
      return replaceChildren(state, group, modification, headerArr);
    }
    case 'SET_ZOOM_LIST':
      return { ...state, zoomList: payload.zoomList };
    case 'SET_MEASUREMENT_UNITS': {
      return { ...state, measurementUnits: payload };
    }
    case 'SET_MAX_SIGNATURES_COUNT':
      return { ...state, maxSignaturesCount: payload.maxSignaturesCount };
    default:
      return state;
  }
};
