import localStorageManager from 'helpers/localStorageManager';
import { getInstanceID } from 'helpers/getRootNode';
import { ITEM_TYPE } from 'constants/customizationVariables';
import { defaultPanels } from '../modularComponents';

export default (initialState) => (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case 'SET_SCALE_OVERLAY_POSITION':
      return {
        ...state,
        scaleOverlayPosition: payload.position,
      };
    case 'SET_DEFAULT_PRINT_MARGINS':
      return {
        ...state,
        defaultPrintMargins: payload.margins,
      };
    case 'SET_COLORS':
      return {
        ...state,
        colors: payload.tool || !payload.colors ? state.colors : [...payload.colors],
        textColors: payload.textColors ? [...payload.textColors] : state.textColors,
        toolColorOverrides: payload.tool ? {
          ...state.toolColorOverrides,
          [payload.tool]: [...payload.colors],
        } : state.toolColorOverrides,
      };
    case 'SET_PANEL_WIDTH':
      return {
        ...state,
        panelWidths: {
          ...state.panelWidths,
          [payload.dataElement]: payload.width,
        },
      };
    case 'SET_CUSTOM_ELEMENT_SIZE':
      return {
        ...state,
        customElementSizes: {
          ...state.customElementSizes,
          [payload.dataElement]: payload.size,
        }
      };
    case 'SET_FLYOUTS': {
      const { flyoutMap } = payload;
      return {
        ...state,
        flyoutMap: { ...flyoutMap },
      };
    }
    case 'SET_ACTIVE_FLYOUT':
      return {
        ...state,
        activeFlyout: payload.dataElement,
      };
    case 'REMOVE_FLYOUT':
      const flyoutMap = state.flyoutMap;
      delete flyoutMap[payload.dataElement];
      return {
        ...state,
        flyoutMap,
      };
    case 'ADD_FLYOUT':
    case 'UPDATE_FLYOUT':
      return {
        ...state,
        flyoutMap: {
          ...state.flyoutMap,
          [payload.dataElement]: payload.flyout
        }
      };
    case 'SET_FLYOUT_POSITION':
      return {
        ...state,
        flyoutPosition: payload.newPosition,
      };
    case 'SET_FLYOUT_TOGGLE_ELEMENT':
      return {
        ...state,
        flyoutToggleElement: payload.toggleElement,
      };
    case 'SET_FLYOUT_ITEMS': {
      const { dataElement, items } = payload;
      const flyout = state.flyoutMap[dataElement];
      // Handle the case where the flyout is not yet registered with the UI
      if (!flyout) {
        return state;
      }
      const updatedFlyout = {
        ...flyout,
        items,
      };
      return {
        ...state,
        flyoutMap: {
          ...state.flyoutMap,
          [dataElement]: updatedFlyout,
        },
      };
    }
    case 'SET_INITIALS_OFFSET':
      return {
        ...state,
        initalsOffset: payload.initalsOffset,
      };
    case 'SET_SAVED_SIGNATURES_TAB_ENABLED':
      return {
        ...state,
        savedSignatureTabEnabled: payload.enabled,
      };
    case 'SET_SYNC_VIEWERS':
      return {
        ...state,
        syncViewer: payload.syncViewer,
      };
    case 'SET_IS_COMPARE_STARTED':
      return {
        ...state,
        isCompareStarted: payload.isCompareStarted,
      };
    case 'SET_COMPARE_PANEL_WIDTH':
      return {
        ...state,
        panelWidths: {
          ...state.panelWidths,
          comparePanel: payload.width,
        }
      };
    case 'SET_WATERMARK_PANEL_WIDTH':
      return {
        ...state,
        panelWidths: {
          ...state.panelWidths,
          watermarkPanel: payload.width,
        }
      };
    case 'SET_COMPARISON_OVERLAY_ENABLED':
      return {
        ...state,
        isComparisonOverlayEnabled: payload.isComparisonOverlayEnabled,
      };
    case 'SET_ACTIVE_DOCUMENT_VIEWER_KEY':
      return {
        ...state,
        activeDocumentViewerKey: payload.activeDocumentViewerKey,
      };
    case 'SET_IS_MULTI_VIEWER_READY':
      return {
        ...state,
        isMultiViewerReady: payload.isMultiViewerReady,
      };
    case 'SET_IS_MULTI_VIEWER_MODE':
      return {
        ...state,
        isMultiViewerMode: payload.isMultiViewerMode,
      };
    case 'SET_IS_MULTI_VIEWER_MODE_AVAILABLE':
      return {
        ...state,
        isMultiViewerModeAvailable: payload.isMultiViewerModeAvailable,
      };
    case 'SET_IS_OFFICE_EDITOR_MODE':
      return {
        ...state,
        isOfficeEditorMode: payload.isOfficeEditorMode,
      };
    case 'SET_IS_OFFICE_EDITOR_HEADER_ENABLED':
      return {
        ...state,
        isOfficeEditorHeaderEnabled: payload.isOfficeEditorHeaderEnabled,
      };
    case 'SET_COMPARE_PAGES_BUTTON_ENABLED':
      return {
        ...state,
        isShowComparisonButtonEnabled: payload.isShowComparisonButtonEnabled,
      };
    case 'SHOW_APPLY_CROP_WARNING':
      return {
        ...state,
        shouldShowApplyCropWarning: payload.shouldShowApplyCropWarning,
      };
    case 'SHOW_APPLY_SNIPPING_WARNING':
      return {
        ...state,
        shouldShowApplySnippingWarning: payload.shouldShowApplySnippingWarning,
      };
    case 'SET_PRESET_CROP_DIMENSIONS':
      return {
        ...state,
        presetCropDimensions: payload.presetCropDimensions,
      };
    case 'SET_PRESET_NEW_PAGE_DIMENSIONS':
      return {
        ...state,
        presetNewPageDimensions: payload.presetNewPageDimensions,
      };
    case 'SET_DATE_TIME_FORMATS':
      return {
        ...state,
        dateTimeFormats: payload.dateTimeFormats,
      };
    case 'SET_THUMBNAIL_SELECTION_MODE':
      return {
        ...state,
        thumbnailSelectionMode: payload.thumbnailSelectionMode,
      };
    case 'SET_FONTS':
      return {
        ...state,
        fonts: payload.fonts,
      };
    case 'SET_ACTIVE_TAB':
      return {
        ...state,
        activeTab: payload.activeTab,
      };
    case 'SET_TAB_NAME_HANDLER':
      return {
        ...state,
        tabNameHandler: payload.tabNameHandler,
      };
    case 'SET_TABS':
      return {
        ...state,
        tabs: payload.tabs,
      };
    case 'SET_IS_MULTI_TAB':
      return {
        ...state,
        isMultiTab: payload.isMultiTab,
      };
    case 'SET_TAB_MANAGER':
      return {
        ...state,
        TabManager: payload.TabManager,
      };
    case 'SET_THUMBNAIL_PAGE_SELECT':
      return {
        ...state,
        thumbnailSelectingPages: payload.isSelecting,
      };
    case 'SET_HIGH_CONTRAST_MODE':
      return {
        ...state,
        highContrastMode: payload.useHighContrastMode,
      };
    case 'SET_CAN_UNDO':
      return {
        ...state,
        canUndo: {
          ...state.canUndo,
          [payload.documentViewerKey]: payload.canUndo
        },
      };
    case 'SET_CAN_REDO':
      return {
        ...state,
        canRedo: {
          ...state.canRedo,
          [payload.documentViewerKey]: payload.canRedo
        }
      };
    case 'SET_LAST_PICKED_TOOL_FOR_GROUP':
      return {
        ...state,
        lastPickedToolForGroup: {
          ...state.lastPickedToolForGroup,
          [payload.group]: payload.toolName,
        },
      };
    case 'SET_ACTIVE_GROUPED_ITEMS':
      return {
        ...state,
        activeGroupedItems: payload.groupedItems,
      };
    case 'SET_FIXED_GROUPED_ITEMS':
      return {
        ...state,
        fixedGroupedItems: [...state.fixedGroupedItems, payload.groupedItems]
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
    case 'SET_LAST_SELECTED_STAMP_INDEX':
      return {
        ...state,
        lastSelectedStampIndex: payload.index,
      };
    case 'SET_SELECTED_DISPLAYED_SIGNATURE_INDEX':
      return {
        ...state,
        selectedDisplayedSignatureIndex: payload.index,
      };
    case 'SET_SELECTED_DISPLAYED_INITIALS_INDEX':
      return {
        ...state,
        selectedDisplayedInitialsIndex: payload.index,
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
    case 'SET_SAVED_INITIALS':
      return {
        ...state,
        savedInitials: payload.savedInitials,
      };
    case 'SET_LEFT_PANEL_WIDTH':
      return {
        ...state,
        panelWidths: {
          ...state.panelWidths,
          leftPanel: payload.width,
        },
      };
    case 'SET_SEARCH_PANEL_WIDTH':
      return {
        ...state,
        panelWidths: {
          ...state.panelWidths,
          searchPanel: payload.width,
        },
      };
    case 'SET_NOTES_PANEL_WIDTH':
      return {
        ...state,
        panelWidths: {
          ...state.panelWidths,
          notesPanel: payload.width,
        },
      };
    case 'SET_REDACTION_PANEL_WIDTH':
      return {
        ...state,
        panelWidths: {
          ...state.panelWidths,
          redactionPanel: payload.width,
        },
      };
    case 'SET_TEXT_EDITING_PANEL_WIDTH':
      return {
        ...state,
        panelWidths: {
          ...state.panelWidths,
          textEditingPanel: payload.width,
        },
      };
    case 'SET_WV3D_PROPERTIES_PANEL_WIDTH':
      return {
        ...state,
        panelWidths: {
          ...state.panelWidths,
          wv3dPropertiesPanel: payload.width,
        },
      };
    case 'SET_SELECTED_SCALE':
      return {
        ...state,
        selectedScale: payload.selectedScale
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
      payload.dataElements.forEach((dataElement) => {
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
      payload.dataElements.forEach((dataElement) => {
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
    case 'SET_IS_ELEMENT_HIDDEN':
      return {
        ...state,
        hiddenElements: { ...state.hiddenElements, [payload.dataElement]: payload.isHidden }
      };
    case 'ENABLE_TOOL_GROUP_REORDERING':
      return { ...state, enableToolGroupReordering: payload.enableToolGroupReordering };
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
        const instanceId = getInstanceID();
        window.localStorage.setItem(`${instanceId}-customColors`, JSON.stringify(payload.customColors));
      } else {
        console.error('localStorage is disabled, customColors cannot be restored');
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
    case 'SET_APP_STATE_AFTER_TOOL_MODE_CHANGED': {
      const { activeCustomRibbon, activeGroupedItems, lastPickedToolAndGroup, lastPickedToolForGroupedItems } = payload;
      return {
        ...state,
        activeCustomRibbon: activeCustomRibbon ?? state.activeCustomRibbon,
        activeGroupedItems: activeGroupedItems?? state.activeGroupedItems,
        lastPickedToolAndGroup: lastPickedToolAndGroup,
        lastPickedToolForGroupedItems: {
          ...state.lastPickedToolForGroupedItems,
          ...lastPickedToolForGroupedItems
        }
      };
    }
    case 'SET_LAST_PICKED_TOOL_FOR_GROUPED_ITEMS':
      return {
        ...state,
        lastPickedToolForGroupedItems: {
          ...state.lastPickedToolForGroupedItems,
          [payload.groupedItem]: payload.toolName,
        }
      };
    case 'SET_LAST_PICKED_TOOL_AND_GROUP':
      return {
        ...state,
        lastPickedToolAndGroup: payload,
      };
    case 'SET_ACTIVE_CUSTOM_RIBBON':
      return { ...state, activeCustomRibbon: payload.customRibbon };
    case 'SET_AUTO_EXPAND_OUTLINES':
      return { ...state, autoExpandOutlines: payload.autoExpandOutlines };
    case 'SET_ANNOTATION_NUMBERING':
      return { ...state, isAnnotationNumberingEnabled: payload.isAnnotationNumberingEnabled };
    case 'SET_BOOKMARK_ICON_SHORTCUT_VISIBILITY':
      return { ...state, bookmarkIconShortcutVisibility: payload.bookmarkIconShortcutVisibility };
    case 'SET_OUTLINE_EDITING':
      return { ...state, isOutlineEditingEnabled: payload.isOutlineEditingEnabled };
    case 'SET_NOTE_POPUP_ID':
      return { ...state, notePopupId: payload.id };
    case 'SET_NOTE_EDITING':
      return { ...state, isNoteEditing: payload.isNoteEditing };
    case 'SET_FIT_MODE':
      return { ...state, fitMode: payload.fitMode };
    case 'SET_ZOOM':
      return {
        ...state,
        zoomLevels: {
          ...state.zoomLevels,
          [payload.documentViewerKey]: payload.zoom,
        }
      };
    case 'SET_TIMEZONE':
      return { ...state, timezone: payload.timezone };
    case 'SET_ROTATION':
      return { ...state, rotation: payload.rotation };
    case 'SET_DISPLAY_MODE':
      return { ...state, displayMode: payload.displayMode };
    case 'SET_CURRENT_PAGE':
      return { ...state, currentPage: payload.currentPage };
    case 'SET_NOTES_PANEL_SORT_STRATEGY':
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
    case 'SET_CUSTOM_HEADERS_ADDITIONAL_PROPERTIES':
      return {
        ...state,
        customHeadersAdditionalProperties: { ...state.customHeadersAdditionalProperties, [payload.customHeader]: payload.additionalProperties },
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
            showPresets: payload.showPresets ?? true,
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
            dataElement: buttonName || state.toolButtonObjects[toolName].dataElement,
            title: tooltip || state.toolButtonObjects[toolName].title,
            group: buttonGroup !== undefined ? buttonGroup : state.toolButtonObjects[toolName].group,
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
    case 'SET_ENABLE_NOTE_PANEL_VIRTUALIZED_LIST':
      return { ...state, enableNotesPanelVirtualizedList: payload.enableNotesPanelVirtualizedList };
    case 'SET_NOTES_SHOW_LAST_UPDATED_DATE':
      return { ...state, notesShowLastUpdatedDate: payload.notesShowLastUpdatedDate };
    case 'SET_ALLOW_PAGE_NAVIGATION':
      return { ...state, allowPageNavigation: payload.allowPageNavigation };
    case 'SET_READ_ONLY':
      return { ...state, isReadOnly: payload.isReadOnly };
    case 'SET_CUSTOM_PANEL':
      return {
        ...state,
        customPanels: [...state.customPanels, payload.newPanel],
      };
    case 'ADD_PANEL':
      return {
        ...state,
        genericPanels: [...state.genericPanels, payload.newPanel],
      };
    case 'SET_GENERIC_PANELS':
      return {
        ...state,
        genericPanels: [...payload.genericPanels],
      };
    case 'SET_MOBILE_PANEL_SIZE':
      return {
        ...state,
        mobilePanelSize: payload.panelSize,
      };
    case 'USE_EMBEDDED_PRINT':
      return { ...state, useEmbeddedPrint: payload.useEmbeddedPrint };
    case 'USE_CLIENT_SIDE_PRINT':
      return { ...state, useClientSidePrint: payload.useClientSidePrint };
    case 'SET_PAGE_LABELS':
      return { ...state, pageLabels: [...payload.pageLabels] };
    case 'SET_SELECTED_THUMBNAIL_PAGE_INDEXES':
      return { ...state, selectedThumbnailPageIndexes: payload.selectedThumbnailPageIndexes };
    case 'SET_SHIFT_KEY_THUMBNAIL_PIVOT_INDEX':
      return { ...state, shiftKeyThumbnailPivotIndex: payload.shiftKeyThumbnailPivotIndex };
    case 'SET_ACTIVE_PALETTE': {
      const { colorMapKey, colorPalette } = payload;
      return {
        ...state,
        colorMap: {
          ...state.colorMap,
          [colorMapKey]: {
            ...state.colorMap[colorMapKey],
            currentStyleTab: colorPalette,
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
      return { ...state, warning: { ...state.warning, ...payload } };
    case 'ENABLE_DELETE_TAB_WARNING':
      return { ...state, warning: { ...state.warning, ...payload } };
    case 'DISABLE_DELETE_TAB_WARNING':
      return { ...state, warning: { ...state.warning, ...payload } };
    case 'SET_ERROR_MESSAGE':
      return { ...state, errorMessage: payload.message, errorTitle: payload.title };
    case 'SET_CUSTOM_NOTE_FILTER':
      return { ...state, customNoteFilter: payload.customNoteFilter };
    case 'SET_INLINE_COMMENT_FILTER':
      return { ...state, inlineCommentFilter: payload.inlineCommentFilter };
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
      return {
        ...state,
        customElementOverrides: { ...state.customElementOverrides, [payload.dataElement]: payload.overrides },
      };
    case 'SET_PAGE_REPLACEMENT_FILE_LIST':
      return { ...state, pageReplacementFileList: payload.list };

    case 'SET_NOTE_TRANSFORM_FUNCTION':
      return { ...state, noteTransformFunction: payload.noteTransformFunction };
    case 'SET_CUSTOM_NOTE_SELECTION_FUNCTION':
      return { ...state, customNoteFunction: payload.customNoteFunction };
    case 'SET_CUSTOM_APPLY_REDACTIONS_HANDLER':
      return { ...state, customApplyRedactionsHandler: payload.customApplyRedactionsHandler };
    case 'SET_ANNOTATION_CONTENT_OVERLAY_HANDLER':
      return { ...state, annotationContentOverlayHandler: payload.annotationContentOverlayHandler };
    case 'SET_CUSTOM_MULTI_VIEWER_SYNC_HANDLER':
      return { ...state, customMultiViewerSyncHandler: payload.customMultiViewerSyncHandler };
    case 'SET_CUSTOM_MULTI_VIEWER_ACCEPTED_FILE_FORMATS':
      return { ...state, customMultiViewerAcceptedFileFormats: payload.customMultiViewerAcceptedFileFormats };
    case 'ADD_CUSTOM_MODAL': {
      const existingDataElementFiltered = state.customModals.filter(function(modal) {
        return modal.dataElement !== payload.dataElement;
      });
      return {
        ...state,
        customModals: [...existingDataElementFiltered, payload],
      };
    }
    case 'UPDATE_MODULAR_HEADER': {
      const { dataElement, property, value } = payload;
      const existingModularHeader = state.modularHeaders[dataElement];

      // This is to prevent the case where the header is not yet initialized
      if (!existingModularHeader) {
        return state;
      }

      // Create a new updatedModularHeader object with the updated property value
      const updatedModularHeader = {
        ...existingModularHeader,
        [property]: value
      };

      return {
        ...state,
        modularHeaders: {
          ...state.modularHeaders,
          [dataElement]: updatedModularHeader,
        },
      };
    }
    case 'SET_MODULAR_COMPONENT_PROPERTY': {
      const { dataElement, property, value } = payload;
      const existingModularComponent = state.modularComponents[dataElement];
      if (!existingModularComponent) {
        return state;
      }
      const updatedModularComponent = {
        ...existingModularComponent,
        [property]: value,
      };
      return {
        ...state,
        modularComponents: {
          ...state.modularComponents,
          [dataElement]: updatedModularComponent,
        },
      };
    }
    case 'SET_ALL_GROUPED_ITEMS_PROPERTY': {
      const { property, value } = payload;
      // Clone the existing modularComponents to avoid direct mutation
      const newModularComponents = { ...state.modularComponents };

      // Iterate over modularComponents and update grouped items directly
      Object.keys(newModularComponents).forEach((key) => {
        if (newModularComponents[key].type === ITEM_TYPE.GROUPED_ITEMS) {
          newModularComponents[key] = {
            ...newModularComponents[key],
            [property]: value,
          };
        }
      });
      return {
        ...state,
        modularComponents: newModularComponents,
      };
    }
    case 'ADD_MODULAR_HEADERS_AND_COMPONENTS': {
      const { headersMap, componentsMap } = payload;
      return {
        ...state,
        modularHeaders: { ...state.modularHeaders, ...headersMap },
        modularComponents: { ...state.modularComponents, ...componentsMap }
      };
    }
    case 'SET_MODULAR_HEADERS_AND_COMPONENTS': {
      const { headersMap, componentsMap } = payload;
      return {
        ...state,
        modularHeaders: { ...headersMap },
        modularComponents: { ...componentsMap }
      };
    }
    case 'SET_MODULAR_HEADER_ITEMS': {
      const { headerDataElement, normalizedItems, itemsDataElements } = payload;
      const existingModularHeader = state.modularHeaders[headerDataElement];

      // This is to prevent the case where the header is not yet initialized
      if (!existingModularHeader) {
        return state;
      }

      // Remove existing items and replace with new one
      if (itemsDataElements) {
        itemsDataElements.forEach((key) => {
          delete state.modularComponents[key];
        });
      }

      const updatedModularHeader = {
        ...existingModularHeader,
        items: [...itemsDataElements]
      };

      return {
        ...state,
        modularHeaders: {
          ...state.modularHeaders,
          [headerDataElement]: updatedModularHeader,
        },
        modularComponents: {
          ...state.modularComponents,
          ...normalizedItems,
        },
      };
    }
    case 'UPDATE_GROUPED_ITEMS': {
      const { groupedItemsDataElement, normalizedItems, componentsMap } = payload;
      const existingGroupedItem = state.modularComponents[groupedItemsDataElement];
      // This is to prevent the case where the header is not yet initialized
      if (!existingGroupedItem) {
        return state;
      }
      // How do we handle "dangling" components? i.e. components that are no longer referenced anywhere
      const updatedGroupedItem = {
        ...existingGroupedItem,
        items: normalizedItems,
      };
      return {
        ...state,
        modularComponents: {
          ...state.modularComponents,
          [groupedItemsDataElement]: updatedGroupedItem,
          ...componentsMap,
        },
      };
    }
    case 'SET_MODULAR_COMPONENT_FUNCTIONS': {
      const { functionMap } = payload;
      return {
        ...state,
        modularComponentFunctions: { ...functionMap },
      };
    }
    case 'RESET_MODULAR_UI_STATE': {
      return {
        ...state,
        modularHeaders: initialState.modularHeaders,
        modularComponents: initialState.modularComponents,
        modularComponentFunctions: initialState.modularComponentFunctions,
        activeCustomRibbon: initialState.activeCustomRibbon,
        activeFlyout: initialState.activeFlyout,
        flyoutToggleElement: initialState.flyoutToggleElement,
        openElements: initialState.openElements,
        lastPickedToolAndGroup: initialState.lastPickedToolAndGroup,
        lastPickedToolForGroupedItems: initialState.lastPickedToolForGroupedItems,
        flyoutPosition: initialState.flyoutPosition,
        genericPanels: defaultPanels,
      };
    }
    case 'SET_ACTIVE_TAB_IN_PANEL':
      return {
        ...state,
        activeTabInPanel: {
          ...state.activeTabInPanel,
          [payload.wrapperPanel]: payload.tabPanel
        },
      };
    case 'SET_RIGHT_HEADER_WIDTH':
      return {
        ...state,
        modularHeadersWidth: {
          ...state.modularHeadersWidth,
          rightHeader: payload,
        }
      };
    case 'SET_LEFT_HEADER_WIDTH':
      return {
        ...state,
        modularHeadersWidth: {
          ...state.modularHeadersWidth,
          leftHeader: payload,
        }
      };
    case 'SET_TOP_FLOATING_CONTAINER_HEIGHT':
      return {
        ...state,
        floatingContainersDimensions: {
          ...state.floatingContainersDimensions,
          topFloatingContainerHeight: payload,
        }
      };
    case 'SET_BOTTOM_FLOATING_CONTAINER_HEIGHT':
      return {
        ...state,
        floatingContainersDimensions: {
          ...state.floatingContainersDimensions,
          bottomFloatingContainerHeight: payload,
        }
      };
    case 'SET_MOUSE_WHEEL_ZOOM':
      return { ...state, enableMouseWheelZoom: payload.enableMouseWheelZoom };
    case 'SET_ENABLE_SNAP_MODE':
      return { ...state, isSnapModeEnabled: payload.enable };
    case 'SET_READER_MODE':
      return { ...state, isReaderMode: payload.isReaderMode };
    case 'SET_SUBMIT_COMMENT_MODE':
      return {
        ...state,
        enableNoteSubmissionWithEnter: payload.enableNoteSubmissionWithEnter,
      };
    case 'SET_NOTES_PANEL_TEXT_COLLAPSING':
      return {
        ...state,
        isNotesPanelTextCollapsingEnabled: payload.enableNotesPanelTextCollapsing,
      };
    case 'SET_NOTES_PANEL_REPLIES_COLLAPSING':
      return {
        ...state,
        isNotesPanelRepliesCollapsingEnabled: payload.enableNotesPanelRepliesCollapsing,
      };
    case 'SET_COMMENT_THREAD_EXPANSION':
      return {
        ...state,
        isCommentThreadExpansionEnabled: payload.enableCommentThreadExpansion,
      };
    case 'SET_DISPLAYED_SIGNATURES_FILTER_FUNCTION':
      return { ...state, displayedSignaturesFilterFunction: payload.filterFunction };
    case 'SET_ANNOTATION_READ_STATE':
      const { unreadAnnotationIdSet } = state;
      const { annotationId, isRead } = payload;
      if (isRead) {
        unreadAnnotationIdSet.delete(annotationId);
      } else {
        unreadAnnotationIdSet.add(annotationId);
      }
      return { ...state, unreadAnnotationIdSet: new Set(unreadAnnotationIdSet) };
    case 'SET_LANGUAGE':
      return { ...state, currentLanguage: payload.language };
    case 'SET_FADE_PAGE_NAVIGATION_COMPONENT':
      return {
        ...state,
        fadePageNavigationComponent: payload.fadePageNavigationComponent,
      };
    case 'SET_HIDE_CONTENT_EDIT_WARNING':
      if (localStorageManager.isLocalStorageEnabled()) {
        const instanceId = getInstanceID();
        window.localStorage.setItem(`${instanceId}-hideContentEditWarning`, JSON.stringify(payload.hideWarning));
      } else {
        console.error('localStorage is disabled, hideContentEditWarning cannot be restored');
      }
      return { ...state, hideContentEditWarning: payload.hideWarning };
    case 'SET_CONTENT_EDIT_WORKERS_LOADED':
      return { ...state, contentEditWorkersLoaded: payload.contentEditWorkersLoaded };
    case 'SET_CURRENT_CONTENT_BEING_EDITED':
      return {
        ...state,
        currentContentBeingEdited: payload,
      };
    case 'UPDATE_CURRENT_CONTENT_BEING_EDITED':
      return {
        ...state,
        currentContentBeingEdited: {
          ...state.currentContentBeingEdited,
          content: payload.content,
        },
      };
    case 'UPDATE_CALIBRATION_INFO':
      return {
        ...state,
        calibrationInfo: {
          isCalibration: payload.isCalibration,
          tempScale: payload.tempScale,
          previousToolName: payload.previousToolName || state.calibrationInfo.previousToolName,
          isFractionalUnit: payload.isFractionalUnit,
          defaultUnit: payload.defaultUnit
        }
      };
    case 'SET_IS_ADDING_NEW_SCALE':
      return {
        ...state,
        isAddingNewScale: payload.isAddingNewScale,
      };
    case 'UPDATE_DELETE_SCALE':
      return {
        ...state,
        deleteScale: payload.deleteScale,
      };
    case 'CLEAR_CURRENT_CONTENT_BEING_EDITED':
      return {
        ...state,
        currentContentBeingEdited: null,
      };
    case 'SET_ENABLE_DESKTOP_ONLY_MODE':
      return {
        ...state,
        isInDesktopOnlyMode: payload.enableDesktopOnlyMode,
      };
    case 'PAGE_DELETION_CONFIRMATION_MODAL_POPUP':
      return {
        ...state,
        pageDeletionConfirmationModalEnabled: payload.pageDeletionConfirmationModalEnabled,
      };
    case 'SET_PAGE_MANIPULATION_OVERLAY_ITEMS':
      return {
        ...state,
        pageManipulationOverlay: payload.items,
      };
    case 'SET_MULTI_PAGE_MANIPULATION_CONTROLS_ITEMS':
      return {
        ...state,
        multiPageManipulationControls: payload.items,
      };
    case 'SET_MULTI_PAGE_MANIPULATION_CONTROLS_ITEMS_SMALL':
      return {
        ...state,
        multiPageManipulationControlsSmall: payload.items,
      };
    case 'SET_MULTI_PAGE_MANIPULATION_CONTROLS_ITEMS_LARGE':
      return {
        ...state,
        multiPageManipulationControlsLarge: payload.items,
      };
    case 'SET_PAGE_MANIPULATION_OVERLAY_ALTERNATIVE_POSITION':
      return {
        ...state,
        pageManipulationOverlayAlternativePosition: payload?.position,
      };
    case 'SET_PAGE_MANIPULATION_OVERLAY_OPEN_BY_RIGHT_CLICK':
      return {
        ...state,
        pageManipulationOverlayOpenByRightClick: payload,
      };
    case 'SET_THUMBNAIL_CONTROL_MENU_ITEMS':
      return {
        ...state,
        thumbnailControlMenu: payload.items,
      };
    case 'SET_WATERMARK_MODAL_OPTIONS':
      return { ...state, watermarkModalOptions: payload.watermarkModalOptions };
    case 'SET_RESET_AUDIO_PLAYBACK_POSITION':
      return { ...state, shouldResetAudioPlaybackPosition: payload.shouldResetAudioPlaybackPosition };
    case 'SET_ACTIVE_SOUND_ANNOTATION':
      return { ...state, activeSoundAnnotation: payload.activeSoundAnnotation };
    case 'SET_EMBEDDED_JS_POPUP_MENU_STYLE':
      return {
        ...state,
        embeddedJSPopupStyle: payload.embeddedJSPopupStyle,
      };
    case 'SET_ANNOTATION_FILTERS':
      return { ...state, annotationFilters: payload.annotationFilters };
    case 'SET_ZOOM_STEP_FACTORS':
      return { ...state, zoomStepFactors: payload.zoomStepFactors };
    case 'SET_CONTENTBOX_EDITOR':
      return { ...state, contentBoxEditor: payload.contentBoxEditor };
    case 'SET_NOTES_PANEL_CUSTOM_HEADER_OPTIONS':
      return { ...state, notesPanelCustomHeaderOptions: payload.notesPanelCustomHeaderOptions };
    case 'SET_NOTES_PANEL_CUSTOM_EMPTY_PANEL':
      return { ...state, notesPanelCustomEmptyPanel: payload.notesPanelCustomEmptyPanel };
    case 'ADD_MEASUREMENT_SCALE_PRESET': {
      const updatedState = { ...state };
      const addIndex = payload.index || updatedState.measurementScalePreset[payload.measurementSystem].length;
      updatedState.measurementScalePreset[payload.measurementSystem].splice(addIndex, 0, payload.newPreset);
      return updatedState;
    }
    case 'REMOVE_MEASUREMENT_SCALE_PRESET': {
      const updatedState = { ...state };
      updatedState.measurementScalePreset[payload.measurementSystem].splice(payload.index, 1);
      return updatedState;
    }
    case 'SET_IS_MULTIPLE_SCALE_MODE':
      return {
        ...state,
        isMultipleScalesMode: payload.isMultipleScalesMode,
      };
    case 'SET_NOTES_PANEL_MULTI_SELECT':
      return {
        ...state,
        isNotesPanelMultiSelectEnabled: payload.isNotesPanelMultiSelectEnabled,
      };
    case 'SET_SIGNATURE_MODE':
      return {
        ...state,
        signatureMode: payload.signatureMode,
      };
    case 'SET_INITIALS_MODE':
      return {
        ...state,
        isInitialsModeEnabled: payload.isEnabled,
      };
    case 'SET_REPLY_ATTACHMENT_PREVIEW':
      return { ...state, replyAttachmentPreviewEnabled: payload.replyAttachmentPreviewEnabled };
    case 'SET_REPLY_ATTACHMENT_HANDLER':
      return { ...state, replyAttachmentHandler: payload.replyAttachmentHandler };
    case 'SET_CUSTOM_SETTINGS':
      return { ...state, customSettings: payload };
    case 'SET_ENABLE_RIGHT_CLICK_ANNOTATION_POPUP':
      return { ...state, enableRightClickAnnotationPopup: payload.isEnabled };
    case 'SET_TOOL_DEFAULT_STYLE_UPDATE_FROM_ANNOTATION_POPUP_ENABLED':
      return { ...state, toolDefaultStyleUpdateFromAnnotationPopupEnabled: payload };
    case 'SET_ANNOTATION_TOOL_STYLE_SYNCING_ENABLED':
      return {
        ...state,
        annotationToolStyleSyncingEnabled: payload,
      };
    case 'SET_SHORTCUT_KEY_MAP':
      return { ...state, shortcutKeyMap: payload };
    case 'SET_MULTI_VIEWER_SYNC_SCROLLING_MODE':
      return { ...state, multiViewerSyncScrollMode: payload };
    case 'SET_TEXT_SIGNATURE_CANVAS_MULTIPLIER':
      return { ...state, textSignatureCanvasMultiplier: payload.multiplier };
    case 'SET_ENABLE_MEASUREMENT_ANNOTATIONS_FILTER':
      return { ...state, isMeasurementAnnotationFilterEnabled: payload.isEnabled };
    case 'SET_NOTES_IN_LEFT_PANEL':
      return { ...state, notesInLeftPanel: payload };
    case 'PUSH_FOCUSED_ELEMENT': {
      return {
        ...state,
        focusedElementsStack: [...state.focusedElementsStack, payload],
      };
    }
    case 'SET_FOCUSED_ELEMENTS_STACK': {
      return {
        ...state,
        focusedElementsStack: payload,
      };

    }
    case 'SET_KEYBOARD_OPEN': {
      return { ...state, isKeyboardOpen: payload };
    }
    case 'SET_COMPARE_ANNOTATIONS_MAP': {
      return { ...state, compareAnnotationsMap: payload };
    }
    case 'STASH_ENABLED_RIBBONS': {
      return { ...state, enabledRibbonsStash: [...payload.ribbonItems] };
    }
    default:
      return state;
  }
};
