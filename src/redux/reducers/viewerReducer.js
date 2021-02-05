import localStorageManager from 'helpers/localStorageManager';

export default initialState => (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case 'SET_HIGH_CONTRAST_MODE':
      return {
        ...state,
        highContrastMode: payload.useHighContrastMode,
      };
    case 'SET_CAN_UNDO':
      return {
        ...state,
        canUndo: payload.canUndo,
      };
    case 'SET_CAN_REDO':
      return {
        ...state,
        canRedo: payload.canRedo,
      };
    case 'SET_LAST_PICKED_TOOL_FOR_GROUP':
      return {
        ...state,
        lastPickedToolForGroup: {
          ...state.lastPickedToolForGroup,
          [payload.group]: payload.toolName,
        }
      };
    case 'SET_TOOLBAR_GROUP':
      return {
        ...state,
        toolbarGroup: payload.toolbarGroup,
      };
    case 'SET_SELECTED_STAMP_INDEX':
      return {
        ...state,
        selectedStampIndex: payload.index,
      };
    case 'SET_SELECTED_DISPLAYED_SIGNATURE_INDEX':
      return {
        ...state,
        selectedDisplayedSignatureIndex: payload.index,
      };
    case 'SET_STANDARD_STAMPS':
      return {
        ...state,
        standardStamps: payload.standardStamps,
      };
    case 'SET_CUSTOM_STAMPS':
      return {
        ...state,
        customStamps: payload.customStamps,
      };
    case 'SET_SAVED_SIGNATURES':
      return {
        ...state,
        savedSignatures: payload.savedSignatures,
      };
    case 'SET_LEFT_PANEL_WIDTH':
      return {
        ...state,
        panelWidths: {
          ...state.panelWidths,
          leftPanel: payload.width,
        }
      };
    case 'SET_SEARCH_PANEL_WIDTH':
      return {
        ...state,
        panelWidths: {
          ...state.panelWidths,
          searchPanel: payload.width,
        }
      };
    case 'SET_NOTES_PANEL_WIDTH':
      return {
        ...state,
        panelWidths: {
          ...state.panelWidths,
          notesPanel: payload.width,
        }
      };
    case 'SET_DOCUMENT_CONTAINER_WIDTH':
      return {
        ...state,
        documentContainerWidth: payload.width,
      };
    case 'SET_DOCUMENT_CONTAINER_HEIGHT':
      return {
        ...state,
        documentContainerHeight: payload.height,
      };
    case 'SET_ACTIVE_THEME':
      return {
        ...state,
        activeTheme: payload.theme,
      };
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
      return { ...state, activeHeaderGroup: payload.headerGroup };
    case 'SET_ACTIVE_TOOL_NAME':
      return { ...state, activeToolName: payload.toolName };
    case 'SET_ACTIVE_TOOL_STYLES':
      return { ...state, activeToolStyles: { ...payload.toolStyles } };
    case 'SET_CUSTOM_COLOR':
      return { ...state, customColor: payload.customColor };
    case 'SET_CUSTOM_COLORS':
      if (localStorageManager.isLocalStorageEnabled()) {
        window.localStorage.setItem('customColors', JSON.stringify(payload.customColors));
      }
      else {
        console.error("localStorage is disabled, customColors cannot be restored");
      }
      return { ...state, customColors: payload.customColors };
    case 'SET_ACTIVE_TOOL_NAME_AND_STYLES':
      return {
        ...state,
        activeToolName: payload.toolName,
        activeToolStyles: payload.toolStyles,
      };
    case 'SET_ACTIVE_LEFT_PANEL':
      return { ...state, activeLeftPanel: payload.dataElement };
    case 'SET_ACTIVE_TOOL_GROUP':
      return {
        ...state,
        activeToolGroup: payload.toolGroup,
        lastPickedToolGroup: {
          ...state.lastPickedToolGroup,
          [payload.toolbarGroup]: payload.toolGroup,
        },
      };
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
    case 'SET_PRINTED_NOTE_DATE_FORMAT':
      return { ...state, printedNoteDateFormat: payload.noteDateFormat };
    case 'SET_FULL_SCREEN':
      return { ...state, isFullScreen: payload.isFullScreen };
    case 'SET_HEADER_ITEMS':
      return {
        ...state,
        headers: { ...state.headers, [payload.header]: payload.headerItems },
      };
    case 'SET_POPUP_ITEMS':
      return {
        ...state,
        [payload.dataElement]: payload.items,
      };
    case 'SET_MENUOVERLAY_ITEMS':
      return {
        ...state,
        menuOverlay: payload.items,
      };
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
            showColor: payload.showColor || 'active',
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
    case 'SET_THUMBNAIL_MERGING':
      return { ...state, isThumbnailMerging: payload.useThumbnailMerging };
    case 'SET_THUMBNAIL_REORDERING':
      return { ...state, isThumbnailReordering: payload.useThumbnailReordering };
    case 'SET_THUMBNAIL_MULTISELECT':
      return { ...state, isThumbnailMultiselect: payload.useThumbnailMultiselect };
    case 'SET_MULTI_VIEWER_MERGING':
      return { ...state, isMultipleViewerMerging: payload.isMultipleViewerMerging };
    case 'SET_ALLOW_PAGE_NAVIGATION':
      return { ...state, allowPageNavigation: payload.allowPageNavigation };
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
    case 'SET_SELECTED_THUMBNAIL_PAGE_INDEXES':
      return { ...state, selectedThumbnailPageIndexes: payload.selectedThumbnailPageIndexes };
    case 'SET_ACTIVE_PALETTE': {
      const { colorMapKey, colorPalette } = payload;
      return {
        ...state,
        colorMap: {
          ...state.colorMap,
          [colorMapKey]: {
            ...state.colorMap[colorMapKey],
            currentPalette: colorPalette,
          },
        },
      };
    }
    case 'SET_REPLY_DISABLED_FUNC': {
      const { func } = payload;
      return {
        ...state,
        isReplyDisabledFunc: func,
      };
    }
    case 'SET_ICON_COLOR': {
      const { colorMapKey, color } = payload;
      return {
        ...state,
        colorMap: {
          ...state.colorMap,
          [colorMapKey]: { ...state.colorMap[colorMapKey], iconColor: color },
        },
      };
    }
    case 'SET_COLOR_MAP':
      return { ...state, colorMap: payload.colorMap };
    case 'SET_WARNING_MESSAGE':
      return { ...state, warning: payload };
    case 'SET_ERROR_MESSAGE':
      return { ...state, errorMessage: payload.message };
    case 'SET_CUSTOM_NOTE_FILTER':
      return { ...state, customNoteFilter: payload.customNoteFilter };
    case 'SET_ZOOM_LIST':
      return { ...state, zoomList: payload.zoomList };
    case 'SET_MEASUREMENT_UNITS': {
      return { ...state, measurementUnits: payload };
    }
    case 'SET_MAX_SIGNATURES_COUNT':
      return { ...state, maxSignaturesCount: payload.maxSignaturesCount };
    case 'SET_USER_DATA':
      return { ...state, userData: payload.userData };
    case 'SET_CUSTOM_MEASUREMENT_OVERLAY':
      return { ...state, customMeasurementOverlay: payload.customMeasurementOverlay };
    case 'SET_SIGNATURE_FONTS':
      return { ...state, signatureFonts: payload.signatureFonts };
    case 'SET_SELECTED_TAB':
      return { ...state, tab: { ...state.tab, [payload.id]: payload.dataElement } };
    case 'SET_CUSTOM_ELEMENT_OVERRIDES':
      return { ...state, customElementOverrides: { ...state.customElementOverrides, [payload.dataElement]: payload.overrides } };
    case 'SET_NOTE_TRANSFORM_FUNCTION':
      return { ...state, noteTransformFunction: payload.noteTransformFunction };
    case 'SET_CUSTOM_NOTE_SELECTION_FUNCTION':
      return { ...state, customNoteFunction: payload.customNoteFunction };
    case 'SET_ANNOTATION_CONTENT_OVERLAY_HANDLER':
      return { ...state, annotationContentOverlayHandler: payload.annotationContentOverlayHandler };
    case 'SET_CUSTOM_MODAL': {
      const existingDataElementFiltered = state.customModals.filter(function(modal) {
        return modal.dataElement !== payload.dataElement;
      });
      return {
        ...state,
        customModals: [...existingDataElementFiltered, payload],
      };
    }
    case 'SET_MOUSE_WHEEL_ZOOM':
      return { ...state, enableMouseWheelZoom: payload.enableMouseWheelZoom };
    case 'SET_ENABLE_SNAP_MODE':
      return { ...state, isSnapModeEnabled: payload.enable };
    case 'SET_READER_MODE':
      return { ...state, isReaderMode: payload.isReaderMode };
    case 'ADD_TRUSTED_CERTIFICATES':
      /**
       * To mimic the behavior of the Core implementation, where certificates
       * can only be added but not removed, only allow this action to append
       * to the existing array
       */
      return {
        ...state,
        certificates: [
          ...state.certificates,
          ...payload.certificates,
        ]
      };
    case 'SET_VERIFICATION_RESULT':
      return { ...state, verificationResult: payload.result };
    case 'SET_DISPLAYED_SIGNATURES_FILTER_FUNCTION':
      return { ...state, displayedSignaturesFilterFunction: payload.filterFunction };
    case 'SET_LANGUAGE':
      return { ...state, currentLanguage: payload.language };
    default:
      return state;
  }
};
