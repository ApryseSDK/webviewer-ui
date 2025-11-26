import { isAndroid, isMobile } from 'helpers/device';
import { defaultNoteDateFormat, defaultPrintedNoteDateFormat } from 'constants/defaultTimeFormat';
import { panelMinWidth, RESIZE_BAR_WIDTH, panelNames } from 'constants/panel';
import { PLACEMENT, POSITION, ITEM_TYPE, PANEL_LOCATION } from 'constants/customizationVariables';
import DataElements from 'constants/dataElement';
import { getBasicItemsFromGroupedItems } from 'helpers/modularUIHelpers';
import * as exposedOfficeEditorSelectors from './officeEditorSelectors';
import getHashParameters from 'helpers/getHashParameters';
import { createSelector } from 'reselect';
import { isEquivalentPanelLocation } from 'src/helpers/rightToLeft';
// OE selectors
export const {
  isStyleButtonActive,
  getPointSizeSelectionKey,
  getCursorStyleToPreset,
  getCurrentFontFace,
  getLineSpacing,
  getActiveColor,
  getActiveListType,
  getIsOfficeEditorMode,
  isJustificationButtonActive,
  isNonPrintingCharactersEnabled,
  isOfficeEditorUndoEnabled,
  isOfficeEditorRedoEnabled,
  getOfficeEditorIsReplaceInProgress,
} = exposedOfficeEditorSelectors;

// viewer
export const getViewOnlyWhitelist = (state) => state.viewer.viewOnlyWhitelist;
export const isDisabledViewOnly = (state, dataElement, isRecursiveCall = false) => {
  if (!state.viewer.isViewOnly) {
    return false;
  }
  if (!dataElement) {
    return false;
  }
  const viewOnlyWhitelist = state.viewer.viewOnlyWhitelist;
  if (viewOnlyWhitelist.dataElement.includes(dataElement)) {
    return false;
  }
  if (viewOnlyWhitelist.dataElementBlacklist.includes(dataElement)) {
    return true;
  }
  const component = getModularComponent(state, dataElement);
  if (component) {
    if (component.type === ITEM_TYPE.DIVIDER) {
      return isRecursiveCall;
    }
    if (viewOnlyWhitelist[component.type]) {
      return !viewOnlyWhitelist[component.type]?.includes(component.toolName || component.buttonType || dataElement);
    }
    const containerTypes = [
      ITEM_TYPE.TOGGLE_BUTTON,
      ITEM_TYPE.GROUPED_ITEMS,
      ITEM_TYPE.RIBBON_ITEM,
      ITEM_TYPE.RIBBON_GROUP,
      ITEM_TYPE.MODULAR_HEADER,
    ];
    if (containerTypes.includes(component.type)) {
      for (let child of getChildren(component)) {
        if (!isDisabledViewOnly(state, child, true)) {
          return false;
        }
      }
      return true;
    }
    return false;
  }
  const flyout = getFlyout(state, dataElement);
  if (flyout) {
    for (let child of flyout.items) {
      if (child === 'divider') {
        continue;
      }
      if (!child?.dataElement) {
        return false;
      }
      if (!isDisabledViewOnly(state, child.dataElement, true)) {
        return false;
      }
    }
    return true;
  }
  const panel = getGenericPanel(state, dataElement);
  if (panel) {
    if (panel.render === 'tabPanel') {
      const hasEnabledChildren = panel.panelsList.some((childPanel) => {
        return viewOnlyWhitelist.panel.includes(childPanel.render || childPanel.dataElement);
      });

      if (!hasEnabledChildren) {
        return true;
      }
    }
    return !viewOnlyWhitelist.panel.includes(panel.render || dataElement);
  }
  const isModal = dataElement.endsWith('Modal');
  if (isModal) {
    return !viewOnlyWhitelist.modal.includes(dataElement);
  }
  const isOverlay = dataElement.endsWith('Overlay');
  if (isOverlay) {
    return !viewOnlyWhitelist.overlay.includes(dataElement);
  }
  return false;
};
export const isToolDisabledViewOnly = (state, toolName) => {
  const toolButtonObjects = getToolButtonObjects(state);
  const dataElement = toolButtonObjects[toolName]?.dataElement;
  return isDisabledViewOnly(state, dataElement);
};
const getChildren = (component) => {
  switch (component.type) {
    case ITEM_TYPE.TOGGLE_BUTTON:
      return [component.toggleElement];
    case ITEM_TYPE.GROUPED_ITEMS:
    case ITEM_TYPE.RIBBON_GROUP:
    case ITEM_TYPE.MODULAR_HEADER:
      return component.items;
    case ITEM_TYPE.RIBBON_ITEM:
      return component.groupedItems;
    default:
      return [];
  }
};

export const getGenericPanel = (state, dataElement) => {
  return state.viewer.genericPanels.find((panel) => panel.dataElement === dataElement || panel.render === dataElement);
};

export const getEnabledTabPanelTabs = (state, tabPanelDataElement) => {
  const disabledElements = state.viewer.disabledElements;
  const panelsList = getGenericPanel(state, tabPanelDataElement).panelsList;
  const enabledPanels = panelsList.filter((panel) => {
    const isPanelDisabled = disabledElements[panel.render]?.disabled;
    const isPanelTabDisabled = disabledElements[`${panel.render}-${tabPanelDataElement}`]?.disabled;
    const isPanelDisabledViewOnly = isDisabledViewOnly(state, panel.render);
    const isPortfolioPanelNotAvailable = panel.render === panelNames.PORTFOLIO && state.document?.portfolio?.length === 0;
    return !isPanelDisabled && !isPanelTabDisabled && !isPanelDisabledViewOnly && !isPortfolioPanelNotAvailable;
  });
  return enabledPanels;
};

export const getVisibleTabPanelTabs = (state, tabPanelDataElement) => {
  const visiblePanels = [];
  const enabledPanels = getEnabledTabPanelTabs(state, tabPanelDataElement);
  enabledPanels?.forEach((panel) => {
    const panelRenderer = panel.render;
    if (typeof panelRenderer === 'string') {
      const genericPanel = getGenericPanel(state, panelRenderer);
      if (!genericPanel) {
        console.warn(`Panel ${panelRenderer} is not a valid custom panel`);
        return;
      }
      visiblePanels.push(panelRenderer);
    } else if (typeof panelRenderer === 'function') {
      visiblePanels.push(panel.dataElement);
    }
  });
  return visiblePanels;
};

export const getModularComponent = (state, dataElement) => state.viewer.modularComponents[dataElement];
export const getScaleOverlayPosition = (state) => state.viewer.scaleOverlayPosition;
export const getDefaultPrintMargins = (state) => state.viewer.defaultPrintMargins;
export const getColors = (state, tool, type) => {
  type = type ? type.toLowerCase() : type;
  if (tool && state.viewer.toolColorOverrides[tool]) {
    return state.viewer.toolColorOverrides[tool];
  }
  return type === 'text' ? state.viewer.textColors : state.viewer.colors;
};
export const getCustomElementSize = (state, dataElement) => state.viewer.customElementSizes?.[dataElement] || 0;
export const getActiveFlyout = (state) => state.viewer.activeFlyout;
export const getFlyoutPosition = (state) => state.viewer.flyoutPosition;
export const getFlyoutMap = (state) => state.viewer.flyoutMap;
export const getFlyout = (state, dataElement) => state.viewer.flyoutMap[dataElement];
export const getFlyoutToggleElement = (state) => state.viewer.flyoutToggleElement;
export const getInitialsOffset = (state) => state.viewer.initalsOffset;
export const isSavedSignaturesTabEnabled = (state) => state.viewer.savedSignatureTabEnabled;
export const getSyncViewer = (state) => state.viewer.syncViewer;
export const isCompareStarted = (state) => state.viewer.isCompareStarted;
export const isComparisonDisabled = (state) => state.advanced.disableMultiViewerComparison;
export const getIsComparisonOverlayEnabled = (state) => state.viewer.isComparisonOverlayEnabled;
export const getActiveDocumentViewerKey = (state) => (state.viewer.isMultiViewerMode && state.viewer.activeDocumentViewerKey ? state.viewer.activeDocumentViewerKey : 1);
export const isMultiViewerMode = (state) => state.viewer.isMultiViewerMode;
export const isMultiViewerReady = (state) => state.viewer.isMultiViewerReady;
export const getGenericPanels = (state, location) => {
  if (location) {
    return state.viewer.genericPanels.filter((item) => isEquivalentPanelLocation(location, item.location));
  }
  return state.viewer.genericPanels;
};
export const getActiveTabInPanel = (state, wrapperPanel) => state.viewer.activeTabInPanel[wrapperPanel];
export const shouldShowApplyCropWarning = (state) => state.viewer.shouldShowApplyCropWarning;
export const shouldShowApplySnippingWarning = (state) => state.viewer.shouldShowApplySnippingWarning;
export const getPresetCropDimensions = (state) => state.viewer.presetCropDimensions;
export const getPresetNewPageDimensions = (state) => state.viewer.presetNewPageDimensions;
export const getDateTimeFormats = (state) => state.viewer.dateTimeFormats;
export const getThumbnailSelectionMode = (state) => state.viewer.thumbnailSelectionMode;
export const getFonts = (state) => state.viewer.fonts;
export const getTabs = (state) => state.viewer.tabs;
export const getActiveTab = (state) => state.viewer.activeTab;
export const getIsMultiTab = (state) => state.viewer.isMultiTab;
export const getTabManager = (state) => state.viewer.TabManager;
export const getTabNameHandler = (state) => state.viewer.tabNameHandler;
export const getIsHighContrastMode = (state) => state.viewer.highContrastMode;
export const getLastPickedToolForGroup = (state, group) => state.viewer.lastPickedToolForGroup[group];
export const getStandardStamps = (state) => state.viewer.standardStamps;
export const getCustomStamps = (state) => state.viewer.customStamps;
export const getSelectedStampIndex = (state) => state.viewer.selectedStampIndex;
export const getLastSelectedStampIndex = (state) => state.viewer.lastSelectedStampIndex;
export const getSelectedStamp = (state) => {
  const standardStamps = getStandardStamps(state);
  const customStamps = getCustomStamps(state);
  const index = getSelectedStampIndex(state);
  let selectedStamp = standardStamps[index];
  // selected stamp is not found in standard stamps, search dynamic stamps
  if (!selectedStamp && !!customStamps.length) {
    selectedStamp = customStamps[index - standardStamps.length];
  }
  return selectedStamp;
};
export const getSavedSignatures = (state) => state.viewer.savedSignatures;
export const getDisplayedSignatures = (state) => state.viewer.savedSignatures.filter(state.viewer.displayedSignaturesFilterFunction);
export const getSelectedDisplayedSignatureIndex = (state) => state.viewer.selectedDisplayedSignatureIndex;
export const getSelectedDisplayedSignature = (state) => getDisplayedSignatures(state)[getSelectedDisplayedSignatureIndex(state)];
export const getDisplayedSignaturesFilterFunction = (state) => state.viewer.displayedSignaturesFilterFunction;
export const getSignatureMode = (state) => state.viewer.signatureMode;
export const getSavedInitials = (state) => state.viewer.savedInitials;
export const getSelectedDisplayedInitialsIndex = (state) => state.viewer.selectedDisplayedInitialsIndex;
export const getIsInitialsModeEnabled = (state) => state.viewer.isInitialsModeEnabled;
export const getDisplayedInitial = (state) => state.viewer.savedInitials[state.viewer.selectedDisplayedInitialsIndex];

export const getAutoFocusNoteOnAnnotationSelection = (state) => state.viewer.autoFocusNoteOnAnnotationSelection;
export const getNotesInLeftPanel = (state) => state.viewer.notesInLeftPanel;
export const getLeftPanelWidth = (state) => state.viewer.panelWidths.leftPanel;
export const getSearchPanelWidth = (state) => state.viewer.panelWidths.searchPanel;
export const getNotesPanelWidth = (state) => state.viewer.panelWidths.notesPanel;

export const getDeleteScaleInfo = (state) => state.viewer.deleteScale;

export const getRedactionPanelWidth = (state) => state.viewer.panelWidths.redactionPanel;

export const getWv3dPropertiesPanelWidth = (state) => state.viewer.panelWidths.wv3dPropertiesPanel;

export const getComparePanelWidth = (state) => state.viewer.panelWidths.comparePanel;

export const getTextEditingPanelWidth = (state) => state.viewer.panelWidths.textEditingPanel;

export const getMobilePanelSize = (state) => state.viewer.mobilePanelSize;
export const getLeftPanelWidthWithResizeBar = (state) => state.viewer.panelWidths.leftPanel + RESIZE_BAR_WIDTH;
export const getSearchPanelWidthWithResizeBar = (state) => state.viewer.panelWidths.searchPanel + RESIZE_BAR_WIDTH;
export const getNotesPanelWidthWithResizeBar = (state) => state.viewer.panelWidths.notesPanel + RESIZE_BAR_WIDTH;
export const getComparePanelWidthWithResizeBar = (state) => state.viewer.panelWidths.comparePanel + RESIZE_BAR_WIDTH;
export const getDocumentContentContainerWidthStyle = (state) => {
  const notesPanelWidth = getNotesPanelWidthWithResizeBar(state);
  const searchPanelWidth = getSearchPanelWidthWithResizeBar(state);
  const leftPanelWidth = getLeftPanelWidthWithResizeBar(state);
  const textEditingPanelWidth = getTextEditingPanelWidth(state);
  const wv3dPropertiesPanelWidth = getWv3dPropertiesPanelWidth(state);
  const comparePanelWidth = getComparePanelWidthWithResizeBar(state);
  const redactionPanelWidth = getRedactionPanelWidth(state);
  const notesInLeftPanel = getNotesInLeftPanel(state);

  const isLeftPanelOpen = isElementOpen(state, 'leftPanel');
  const isNotesPanelOpen = isElementOpen(state, 'notesPanel');
  const isSearchPanelOpen = isElementOpen(state, 'searchPanel');
  const isRedactionPanelOpen = isElementOpen(state, 'redactionPanel');
  const isTextEditingPanelOpen = isElementOpen(state, 'textEditingPanel');
  const isWv3dPropertiesPanelOpen = isElementOpen(state, 'wv3dPropertiesPanel');
  const isComparePanelOpen = isElementOpen(state, 'comparePanel');

  const genericPanelOnLeft = getOpenGenericPanel(state, PANEL_LOCATION.LEFT);
  const genericPanelOnRight = getOpenGenericPanel(state, PANEL_LOCATION.RIGHT);

  const { customizableUI } = getFeatureFlags(state);

  const spaceTakenUpByPanels =
    0 +
    (!customizableUI &&
      (isLeftPanelOpen ? leftPanelWidth : 0) +
      (isNotesPanelOpen && !notesInLeftPanel ? notesPanelWidth : 0) +
      (isSearchPanelOpen ? searchPanelWidth : 0) +
      (isRedactionPanelOpen ? redactionPanelWidth : 0) +
      (isTextEditingPanelOpen ? textEditingPanelWidth : 0) +
      (isWv3dPropertiesPanelOpen ? wv3dPropertiesPanelWidth : 0) +
      (isComparePanelOpen ? comparePanelWidth : 0)
    )
    +
    (customizableUI &&
      (genericPanelOnLeft ? getPanelWidth(state, genericPanelOnLeft) : 0) +
      (genericPanelOnRight ? getPanelWidth(state, genericPanelOnRight) : 0));

  // Do not count headers without items
  const activeRightHeaderWidth = getActiveRightHeaderWidth(state);
  const activeLeftHeaderWidth = getActiveLeftHeaderWidth(state);
  const spaceTakenUpByHeaders = activeLeftHeaderWidth + activeRightHeaderWidth;
  return `calc(100% - ${spaceTakenUpByPanels + spaceTakenUpByHeaders}px)`;
};

export const getOpenGenericPanel = (state, location) => {
  let genericPanels = state.viewer.genericPanels;
  const panelsWithMobileVersion = [
    panelNames.SIGNATURE_LIST,
    panelNames.RUBBER_STAMP,
    panelNames.STYLE,
    panelNames.NOTES,
    panelNames.SEARCH,
    panelNames.TEXT_EDITING,
    panelNames.TABS,
    panelNames.REDACTION,
    panelNames.FORM_FIELD,
    panelNames.INDEX
  ];

  if (location) {
    genericPanels = state.viewer.genericPanels.filter((item) => {
      if (!isMobile()) {
        return isEquivalentPanelLocation(location, item.location);
      }
      // when we are on mobile, if the panel has a mobile version, we don't need to count on this panel measurement
      return isEquivalentPanelLocation(location, item.location) && !panelsWithMobileVersion.includes(item.dataElement);
    });
  }

  return genericPanels
    .map((item) => item.dataElement)
    .find((elName) => isElementOpen(state, elName) === true);
};

export const getGenericPanelsOnTheSameLocation = (state, dataElement) => {
  if (getIsCustomUIEnabled(state)) {
    const genericPanels = getGenericPanels(state);
    const genericPanel = genericPanels.find((item) => dataElement === item.dataElement);
    const genericPanelsInSameLocation = genericPanels.filter((item) => isEquivalentPanelLocation(genericPanel?.location, item.location) && item.dataElement !== genericPanel?.dataElement);
    return genericPanelsInSameLocation;
  }

  return [];
};

export const getDocumentContainerLeftMargin = (state) => {
  const isCustomUI = getIsCustomUIEnabled(state);
  if (isCustomUI) {
    const openLeftPanel = getOpenGenericPanel(state, PANEL_LOCATION.LEFT);
    return openLeftPanel ? getPanelWidth(state, openLeftPanel) : 0;
  } else {
    return 0 + (isElementOpen(state, 'leftPanel') ? getLeftPanelWidthWithResizeBar(state) : 0);
  }
};
export const getDocumentContainerRightMargin = (state) => {
  const isCustomUI = getIsCustomUIEnabled(state);
  if (isCustomUI) {
    const openRightPanel = getOpenGenericPanel(state, PANEL_LOCATION.RIGHT);
    return openRightPanel ? getPanelWidth(state, openRightPanel) : 0;
  }
  return 0;
};

export const getCalibrationInfo = (state) => state.viewer.calibrationInfo;
export const getIsAddingNewScale = (state) => state.viewer.isAddingNewScale;

export const getMeasurementScalePreset = (state) => state.viewer.measurementScalePreset;
export const getIsMultipleScalesMode = (state) => state.viewer.isMultipleScalesMode;
export const getIsNotesPanelMultiSelectEnabled = (state) => state.viewer.isNotesPanelMultiSelectEnabled;

export const getDocumentContainerWidth = (state) => state.viewer.documentContainerWidth;
export const getDocumentContainerHeight = (state) => state.viewer.documentContainerHeight;

export const isElementDisabled = (state, dataElement) => state.viewer?.disabledElements[dataElement]?.disabled;

export const isElementOpen = (state, dataElement) => !!(state.viewer?.openElements[dataElement] && !state.viewer?.disabledElements[dataElement]?.disabled);

export const isElementHidden = (state, dataElement) => state.viewer?.hiddenElements[dataElement];

export const allButtonsInGroupDisabled = (state, toolGroup) => {
  const toolButtonObjects = getToolButtonObjects(state);
  const dataElements = Object.values(toolButtonObjects)
    .filter(({ group }) => group === toolGroup)
    .map(({ dataElement }) => dataElement);

  return dataElements.every((dataElement) => isElementDisabled(state, dataElement));
};

export const getToolbarHeaders = (state) => state.viewer.headers;

export const getSelectedScale = (state) => state.viewer.selectedScale;

export const getCustomHeadersAdditionalProperties = (state) => {
  return state.viewer.customHeadersAdditionalProperties;
};

const getToolbarGroupDataElements = (state) => {
  return Object.keys(state.viewer.headers).filter((key) => key.includes('toolbarGroup-'));
};

export const getEnabledToolbarGroups = (state) => {
  const toolbarGroupDataElements = getToolbarGroupDataElements(state);
  return toolbarGroupDataElements.filter((dataElement) => {
    // The items will come from 'children' if it is a ToolbarGroup created by the API createTool
    const headerItems = state.viewer.headers[dataElement];
    const flattenHeaderItems = (dataItems) => {
      return dataItems.reduce((total, item) => {
        if (item.children) {
          total.push(...flattenHeaderItems(item.children));
        } else {
          total.push(item);
        }
        return total;
      }, []);
    };

    const itemsToCheck = flattenHeaderItems(headerItems);
    const toolGroupButtons = itemsToCheck.filter(({ dataElement }) => {
      return dataElement && dataElement.includes('ToolGroupButton');
    });
    const isEveryToolGroupButtonDisabled =
      !dataElement.includes('toolbarGroup-View') &&
      toolGroupButtons.every(({ dataElement: toolGroupDataElement }) => {
        return isElementDisabled(state, toolGroupDataElement);
      });
    return !isElementDisabled(state, `${dataElement}`) && !isEveryToolGroupButtonDisabled;
  });
};

export const getCurrentToolbarGroup = (state) => state.viewer.toolbarGroup;

export const getActiveGroupedItems = (state) => state.viewer.activeGroupedItems;

export const getFixedGroupedItems = (state) => state.viewer.fixedGroupedItems;

function collectRibbonItems(state, ribbonItemDataElement, itemType, mapFn) {
  const ribbonItem = state.viewer.modularComponents[ribbonItemDataElement];
  if (!ribbonItem) {
    return [];
  }

  const { groupedItems } = ribbonItem;
  const collectedItems = [];

  const findItemsRecursively = (groupedItem) => {
    const { items: componentItems } = state.viewer.modularComponents[groupedItem] || {};
    if (!componentItems) {
      return;
    }

    componentItems.forEach((item) => {
      const itemData = state.viewer.modularComponents[item];
      if (!itemData) {
        return;
      }

      if (itemData.type === itemType) {
        collectedItems.push(mapFn(itemData));
      } else if (itemData.type === ITEM_TYPE.GROUPED_ITEMS) {
        findItemsRecursively(item);
      }
    });
  };

  groupedItems.forEach((groupedItem) => {
    findItemsRecursively(groupedItem);
  });

  return collectedItems;
}


export const getToolsAssociatedWithRibbon = (state, ribbonItemDataElement) =>
  collectRibbonItems(state, ribbonItemDataElement, ITEM_TYPE.TOOL_BUTTON, (item) => item.toolName);

export const getRibbonAssociatedWithTool = (state, toolName) => {
  const modularComponents = state.viewer.modularComponents;

  const ribbonItems = Object.values(modularComponents)
    .filter((component) => component.type === ITEM_TYPE.RIBBON_ITEM)
    .map((ribbonItem) => ribbonItem.dataElement);

  for (const ribbonItemDataElement of ribbonItems) {
    const tools = getToolsAssociatedWithRibbon(state, ribbonItemDataElement);
    if (tools.includes(toolName)) {
      return ribbonItemDataElement;
    }
  }

  return null;
};

export const getToggleButtonsAssociatedWithRibbon = (state, ribbonItemDataElement) =>
  collectRibbonItems(state, ribbonItemDataElement, ITEM_TYPE.TOGGLE_BUTTON, (item) => item.dataElement);

export const getRibbonAssociatedWithToggleButton = (state, dataElement) => {
  const modularComponents = state.viewer.modularComponents;

  const ribbonItems = Object.values(modularComponents)
    .filter((component) => component.type === ITEM_TYPE.RIBBON_ITEM)
    .map((ribbonItem) => ribbonItem.dataElement);

  for (const ribbonItemDataElement of ribbonItems) {
    const toggleButtons = getToggleButtonsAssociatedWithRibbon(state, ribbonItemDataElement);
    if (toggleButtons.includes(dataElement)) {
      return ribbonItemDataElement;
    }
  }

  return null;
};

export const getLastActiveToolForRibbon = (state, ribbonDataElement) => {
  const lastActiveToolForRibbon = state.viewer.lastActiveToolForRibbon[ribbonDataElement];
  if (lastActiveToolForRibbon) {
    const isToolEnabled = !isToolDisabled(state, lastActiveToolForRibbon);
    if (isToolEnabled) {
      return lastActiveToolForRibbon;
    }
  }
  return undefined;
};

export const getFirstToolForRibbon = (state, ribbonDataElement) => {
  const toolsAssociatedWithRibbon = getToolsAssociatedWithRibbon(state, ribbonDataElement);
  for (const toolName of toolsAssociatedWithRibbon) {
    const isToolEnabled = !isToolDisabled(state, toolName);
    if (isToolEnabled) {
      return toolName;
    }
  }
  return undefined;
};

export const isToolDisabled = (state, toolName) => {
  const toolDataElement = getToolButtonDataElement(state, toolName);
  if (!toolDataElement) {
    return true;
  }
  return isElementDisabled(state, toolDataElement);
};

export const getFirstToolForGroupedItems = (state, group) => {
  const modularComponents = state.viewer.modularComponents;
  const allItems = getBasicItemsFromGroupedItems(state, group);
  let firstTool = '';

  allItems?.find((item) => {
    const { type, toolName, dataElement } = modularComponents[item];
    if (type === ITEM_TYPE.TOOL_BUTTON && toolName && !isElementDisabled(state, dataElement)) {
      firstTool = toolName;
      return toolName;
    }
    return false;
  });
  return firstTool;
};

export const getActiveCustomRibbon = (state) => state.viewer.activeCustomRibbon;


// An item is active if it is not disabled and meets one of the following conditions:
// 1. It is not a grouped item
// 2. It is a grouped item and its dataElement is in the activeGroupedItems or fixedGroupedItems
export const getActiveHeaders = createSelector(
  [
    (state) => state.viewer.modularHeaders,
    (state) => state.viewer.activeGroupedItems,
    (state) => state.viewer.fixedGroupedItems,
    (state) => state.viewer.modularComponents,
    (state) => state.viewer.disabledElements,
  ],
  (modularHeaders, activeGroupedItems, fixedGroupedItems, componentsMap, disabledElements) => {
    const activeGroupedItemsSet = new Set(activeGroupedItems);
    const fixedGroupedItemsSet = new Set(fixedGroupedItems);

    const isActiveItem = (item) => {
      const modularComponent = componentsMap[item];
      if (!modularComponent) {
        return false;
      }

      const { type, dataElement } = modularComponent;
      return type !== ITEM_TYPE.GROUPED_ITEMS ||
        activeGroupedItemsSet.has(dataElement) ||
        fixedGroupedItemsSet.has(dataElement);
    };

    return Object.values(modularHeaders).filter(({ items, dataElement }) => {
      if (disabledElements[dataElement]?.disabled) {
        return false;
      }
      // if a header contains at least one active item, it is active
      return !(disabledElements[dataElement]?.disabled) && items?.length && items.some(isActiveItem);
    });
  }
);

export const getActiveTheme = (state) => state.viewer.activeTheme;

export const getTimezone = (state) => state.viewer.timezone;

export const getDefaultHeaderItems = (state) => {
  return state.viewer.headers.default;
};

//* * The following selectors use the normalized header structure, replacing the existing selectors */
const hydrateItems = (itemIds, components) => {
  return itemIds.map((itemId) => {
    const item = components[itemId];
    if (!item) {
      return null;
    }

    const hydratedItem = { ...item };

    if (item.items && item.items.length > 0) {
      hydratedItem.items = hydrateItems(item.items, components);
    }

    return hydratedItem;
  }).filter((item) => item !== null);
};

export const getHydratedHeader = (state, dataElement) => {
  const header = state.viewer.modularHeaders[dataElement];
  if (!header) {
    return null;
  }

  const components = state.viewer.modularComponents;
  const hydratedHeader = {
    ...header,
    items: hydrateItems(header.items, components)
  };

  return hydratedHeader;
};

export const getModularComponents = (state) => state.viewer.modularComponents;
export const getModularHeaders = (state) => state.viewer.modularHeaders;
const headerSelectorFactory = (placement) => {
  return createSelector(
    [getModularHeaders, getModularComponents],
    (modularHeaders, components) => {
      const allHeaders = Object.values(modularHeaders);
      let headersToHydrate;

      if (placement) {
        headersToHydrate = allHeaders.filter((header) => header.placement === placement);
      } else {
        headersToHydrate = allHeaders;
      }

      const hydratedHeaders = headersToHydrate.map((header) => ({
        ...header,
        items: hydrateItems(header.items, components),
      }));

      return hydratedHeaders;
    }
  );
};

const headerSelectors = {
  'all': headerSelectorFactory(),
  [PLACEMENT.TOP]: headerSelectorFactory(PLACEMENT.TOP),
  [PLACEMENT.BOTTOM]: headerSelectorFactory(PLACEMENT.BOTTOM),
  [PLACEMENT.LEFT]: headerSelectorFactory(PLACEMENT.LEFT),
  [PLACEMENT.RIGHT]: headerSelectorFactory(PLACEMENT.RIGHT),
};

export const getHydratedHeaders = (state, placement) => {
  if (!placement) {
    return headerSelectors['all'](state);
  }
  return headerSelectors[placement](state);
};

export const getTopHeaders = (state) => {
  return headerSelectors[PLACEMENT.TOP](state);
};

export const getBottomHeaders = (state) => {
  return headerSelectors[PLACEMENT.BOTTOM](state);
};

export const getLeftHeader = (state) => {
  return headerSelectors[PLACEMENT.LEFT](state);
};

export const getRightHeader = (state) => {
  return headerSelectors[PLACEMENT.RIGHT](state);
};

export const getActiveTopHeaders = createSelector(
  [getActiveHeaders],
  (activeHeaders) => activeHeaders
    .filter((header) => header.placement === PLACEMENT.TOP)
    .filter((header) => !header.float)
);

export const getActiveBottomHeaders = createSelector(
  [getActiveHeaders],
  (activeHeaders) => activeHeaders
    .filter((header) => header.placement === PLACEMENT.BOTTOM)
    .filter((header) => !header.float)
);

export const getTopHeadersHeight = createSelector(
  [getActiveTopHeaders, (state) => state.viewer.modularHeadersHeight.topHeaders],
  (activeHeaders, topHeadersHeight) => activeHeaders.length * topHeadersHeight
);

export const getBottomHeadersHeight = createSelector(
  [getActiveBottomHeaders,
    (state) => state.viewer.modularHeadersHeight.bottomHeaders,
    (state) => state.viewer.isSpreadsheetEditorModeEnabled],
  // For SpreadsheetEditor Mode, we need to include the height of the Spreadsheet Switcher which is a special bottom header that doesn't get included in config files
  (activeHeaders, bottomHeadersHeight, isSpreadsheetEditorModeEnabled) => activeHeaders.length * bottomHeadersHeight + (isSpreadsheetEditorModeEnabled ? bottomHeadersHeight : 0)
);

export const getRightHeaderWidth = (state) => state.viewer.modularHeadersWidth.rightHeader;

export const getLeftHeaderWidth = (state) => state.viewer.modularHeadersWidth.leftHeader;

export const getBottomHeadersWidth = (state) => state.viewer.modularHeadersWidth.bottomHeaders;

export const getActiveLeftHeaderWidth = (state) => {
  const activeHeaders = getActiveHeaders(state);
  const isLeftHeaderActive = activeHeaders?.some((header) => header.placement === PLACEMENT.LEFT);
  return isLeftHeaderActive ? getLeftHeaderWidth(state) : 0;
};

export const getActiveRightHeaderWidth = (state) => {
  const activeHeaders = getActiveHeaders(state);
  const isRightHeaderActive = activeHeaders?.some((header) => header.placement === PLACEMENT.RIGHT);
  return isRightHeaderActive ? getRightHeaderWidth(state) : 0;
};

export const getTopFloatingContainerHeight = (state) => state.viewer.floatingContainersDimensions.topFloatingContainerHeight;

export const getBottomFloatingContainerHeight = (state) => state.viewer.floatingContainersDimensions.bottomFloatingContainerHeight;

// This returns the normalized header, not the fully hydrated header
export const getFloatingHeaders = (state, placement, position) => {
  return Object.values(state.viewer.modularHeaders).filter((header) => header.placement === placement &&
    header.position === position &&
    header.float
  );
};

export const getTopStartFloatingHeaders = (state) => getFloatingHeaders(state, PLACEMENT.TOP, POSITION.START);
export const getBottomStartFloatingHeaders = (state) => getFloatingHeaders(state, PLACEMENT.BOTTOM, POSITION.START);
export const getTopEndFloatingHeaders = (state) => getFloatingHeaders(state, PLACEMENT.TOP, POSITION.END);
export const getBottomEndFloatingHeaders = (state) => getFloatingHeaders(state, PLACEMENT.BOTTOM, POSITION.END);

export const getActiveHeaderItems = (state) => {
  return state.viewer.headers[state.viewer.activeHeaderGroup];
};

export const getDisabledElementPriority = (state, dataElement) => state.viewer.disabledElements[dataElement]?.priority;

export const getToolsHeaderItems = (state) => {
  const toolbarGroup = getCurrentToolbarGroup(state);
  return state.viewer.headers[toolbarGroup] || [];
};

export const getAlwaysVisibleGroupedItems = (state) => {
  const modularComponents = state.viewer.modularComponents;
  return Object.keys(modularComponents).filter((dataElement) => modularComponents[dataElement].alwaysVisible);
};

export const getDisabledElements = (state) => state.viewer.disabledElements;

export const getEnabledRibbonItems = createSelector(
  [getModularComponents, getDisabledElements],
  (modularComponents, disabledElements) => {
    return Object.keys(modularComponents).filter((dataElement) => {
      const { type } = modularComponents[dataElement];
      return type === ITEM_TYPE.RIBBON_ITEM && !(disabledElements[dataElement]?.disabled);
    });
  }
);
export const getModularComponentFunctions = (state) => state.viewer.modularComponentFunctions;

export const getToolbarGroupItems = (toolbarGroup) => (state) => {
  return state.viewer.headers[toolbarGroup];
};

export const getToolButtonObjects = (state) => {
  return state.viewer.toolButtonObjects;
};

export const isToolGroupReorderingEnabled = (state) => {
  return state.viewer.enableToolGroupReordering;
};

export const isNoteSubmissionWithEnterEnabled = (state) => {
  return state.viewer.enableNoteSubmissionWithEnter;
};

export const isNotesPanelTextCollapsingEnabled = (state) => {
  return state.viewer.isNotesPanelTextCollapsingEnabled;
};

export const isNotesPanelRepliesCollapsingEnabled = (state) => {
  return state.viewer.isNotesPanelRepliesCollapsingEnabled;
};

export const isCommentThreadExpansionEnabled = (state) => {
  return state.viewer.isCommentThreadExpansionEnabled;
};

export const getActiveToolNamesForActiveToolGroup = (state) => {
  const { activeToolGroup } = state.viewer;
  const toolButtonObjects = getToolButtonObjects(state);
  return Object.keys(toolButtonObjects).filter((toolName) => {
    const toolButtonObject = toolButtonObjects[toolName];
    const { group, dataElement } = toolButtonObject;
    return group === activeToolGroup && !isElementDisabled(state, dataElement);
  });
};

export const getToolButtonDataElements = (state, toolNames) => {
  const toolButtonObjects = getToolButtonObjects(state);
  return toolNames.map((toolName) => toolButtonObjects[toolName]?.dataElement).filter(Boolean);
};

export const getToolButtonObject = (state, toolName) => getToolButtonObjects(state)[toolName];

export const getToolButtonDataElement = (state, toolName) => getToolButtonObject(state, toolName)?.dataElement;

export const getToolNamesByGroup = (state, toolGroup) => {
  const toolButtonObjects = getToolButtonObjects(state);
  return Object.keys(toolButtonObjects).filter((name) => toolButtonObjects[name].group === toolGroup);
};

export const getToolNameByDataElement = (state, dataElement) => {
  const toolButtonObjects = getToolButtonObjects(state);
  return Object.keys(toolButtonObjects).find((name) => toolButtonObjects[name].dataElement === dataElement);
};

export const getActiveToolName = (state) => state.viewer.activeToolName;

export const getActiveToolStyles = (state) => state.viewer.activeToolStyles;

export const getCustomColor = (state) => state.viewer.customColor;

export const getCustomColors = (state) => state.viewer.customColors;

export const getActiveLeftPanel = (state) => state.viewer.activeLeftPanel;

export const isAnyCustomPanelOpen = (state) => state.viewer.genericPanels.some((panel) => state.viewer.openElements[panel.dataElement]);

export const getActiveToolGroup = (state) => state.viewer.activeToolGroup;

export const getNotePopupId = (state) => state.viewer.notePopupId;

export const getFitMode = (state) => state.viewer.fitMode;

export const getZoom = (state, documentViewerKey = 1) => state.viewer.zoomLevels[documentViewerKey];

export const getDisplayMode = (state) => state.viewer.displayMode;

export const getCurrentPage = (state) => state.viewer.currentPage;

export const getCurrentPageLabel = (state) => {
  const pageLabels = getPageLabels(state);
  const currentPage = getCurrentPage(state);
  return pageLabels?.[currentPage - 1] ?? '';
};

export const getSortStrategy = (state) => state.viewer.sortStrategy;

export const getRotation = (state) => state.viewer.rotation;

export const getNoteDateFormat = (state) => state.viewer.noteDateFormat || defaultNoteDateFormat;

export const getPrintedNoteDateFormat = (state) => state.viewer.printedNoteDateFormat || defaultPrintedNoteDateFormat;

export const isFullScreen = (state) => state.viewer.isFullScreen;

export const doesDocumentAutoLoad = (state) => state.viewer.doesAutoLoad;

export const isDocumentReadOnly = (state) => state.viewer.isReadOnly;

export const isViewOnly = (state) => state.viewer.isViewOnly;

export const getCustomPanels = (state) => state.viewer.customPanels;

export const getCustomModals = (state) => state.viewer.customModals;

export const getPageLabels = (state) => state.viewer.pageLabels;

export const isCustomPageLabelsEnabled = (state) => state.viewer.isCustomPageLabelsEnabled;

export const getSelectedThumbnailPageIndexes = (state) => state.viewer.selectedThumbnailPageIndexes;

export const getShiftKeyThumbnailPivotIndex = (state) => state.viewer.shiftKeyThumbnailPivotIndex;

export const getDisabledCustomPanelTabs = (state) => state.viewer.customPanels.reduce((disabledTabs, { tab }) => {
  if (state.viewer.disabledElements[tab.dataElement]?.disabled) {
    disabledTabs.push(tab.dataElement);
  }
  return disabledTabs;
}, []);

export const getDisabledToolNames = (state) => {
  const disabledElements = getDisabledElements(state);
  const disabledDataElements = Object.keys(disabledElements).filter(
    (dataElement) => isElementDisabled(state, dataElement)
  );

  return disabledDataElements
    .map((dataElement) => getToolNameByDataElement(state, dataElement))
    .filter(Boolean);
};

export const isEmbedPrintSupported = (state) => !isAndroid && state.viewer.useEmbeddedPrint;

export const useClientSidePrint = (state) => state.viewer.useClientSidePrint;

export const shouldAutoExpandOutlines = (state) => state.viewer.autoExpandOutlines;

export const isAnnotationNumberingEnabled = (state) => {
  return state.viewer.isAnnotationNumberingEnabled;
};

export const isBookmarkIconShortcutVisible = (state) => state.viewer.bookmarkIconShortcutVisibility;

export const getColorMap = (state) => state.viewer.colorMap;

export const getCursorOverlayData = (state) => state.viewer.cursorOverlay;

export const getOpenElements = (state) => state.viewer.openElements;

export const getcurrentStyleTab = (state, colorMapKey) => state.viewer.colorMap[colorMapKey]?.currentStyleTab;

export const getIconColor = (state, colorMapKey) => state.viewer.colorMap[colorMapKey]?.iconColor;

export const getCustomNoteFilter = (state) => state.viewer.customNoteFilter;

export const getInternalNoteFilter = (state) => state.viewer.internalNoteFilter;

export const getInlineCommentFilter = (state) => state.viewer.inlineCommentFilter;

export const getIsReplyDisabled = (state) => state.viewer.isReplyDisabledFunc;

export const getZoomList = (state) => state.viewer.zoomList;

export const getMeasurementUnits = (state) => state.viewer.measurementUnits;

export const getIsNoteEditing = (state) => state.viewer.isNoteEditing;

export const getMaxSignaturesCount = (state) => state.viewer.maxSignaturesCount;

export const getUserData = (state) => state.viewer.userData;

export const getIsMentionEnabled = (state) => !!state.viewer.userData;

export const getSignatureFonts = (state) => state.viewer.signatureFonts;

export const getSelectedTab = (state, id) => state.viewer.tab[id];

export const getCustomElementOverrides = (state, dataElement = '') => state.viewer.customElementOverrides[dataElement];

export const getPopupItems = (state, popupDataElement) => {
  const popup = state.viewer.modularPopups[popupDataElement];
  if (!popup) {
    return [];
  }
  return popup.filter((item) => {
    if (!state.viewer.isViewOnly) {
      return true;
    }
    const dataElement = item?.dataElement;
    if (!dataElement || state.viewer.viewOnlyWhitelist.dataElement.includes(dataElement)) {
      return true;
    }
    if (state.viewer.viewOnlyWhitelist.dataElementBlacklist.includes(dataElement)) {
      return true;
    }
    return state.viewer.viewOnlyWhitelist.popup.includes(dataElement);
  });
};

export const getMenuOverlayItems = (state) => state.viewer.menuOverlay;

export const getIsThumbnailMergingEnabled = (state) => state.viewer.isThumbnailMerging;

export const getIsThumbnailReorderingEnabled = (state) => state.viewer.isThumbnailReordering;

export const isThumbnailMultiselectEnabled = (state) => state.viewer.isThumbnailMultiselect;

export const getIsMultipleViewerMerging = (state) => state.viewer.isMultipleViewerMerging;

export const getEnableNotesPanelVirtualizedList = (state) => state.viewer.enableNotesPanelVirtualizedList;

export const notesShowLastUpdatedDate = (state) => state.viewer.notesShowLastUpdatedDate;

export const getAllowPageNavigation = (state) => state.viewer.allowPageNavigation;

export const getCustomMeasurementOverlay = (state) => state.viewer.customMeasurementOverlay;

export const getAnnotationContentOverlayHandler = (state) => state.viewer.annotationContentOverlayHandler;

export const getEnableMouseWheelZoom = (state) => state.viewer.enableMouseWheelZoom;

export const isReaderMode = (state) => state.viewer.isReaderMode;

export const getCertificates = (state) => state.digitalSignatureValidation.certificates;

export const getTrustListKey = (state) => state.digitalSignatureValidation.trustListKey;

export const getValidationModalWidgetName = (state) => state.digitalSignatureValidation.validationModalWidgetName;

export const getVerificationResult = (state, fieldName) => state.digitalSignatureValidation.verificationResult[fieldName] || {};

export const getIsRevocationCheckingEnabled = (state) => state.digitalSignatureValidation.isRevocationCheckingEnabled;

export const getRevocationProxyPrefix = (state) => state.digitalSignatureValidation.revocationProxyPrefix;

export const isThumbnailSelectingPages = (state) => state.viewer.thumbnailSelectingPages;

export const getWatermarkModalOptions = (state) => state.viewer.watermarkModalOptions;

export const getZoomStepFactors = (state) => state.viewer.zoomStepFactors;

// warning message
export const getWarningMessage = (state) => state.viewer.warning?.message || '';

export const getWarningTitle = (state) => state.viewer.warning?.title || '';

export const getWarningConfirmEvent = (state) => state.viewer.warning?.onConfirm;

export const getWarningConfirmBtnText = (state) => state.viewer.warning?.confirmBtnText;

export const getWarningSecondaryEvent = (state) => state.viewer.warning?.onSecondary;

export const getWarningSecondaryBtnText = (state) => state.viewer.warning?.secondaryBtnText;

export const getWarningSecondaryBtnClass = (state) => state.viewer.warning?.secondaryBtnClass;

export const getWarningCancelEvent = (state) => state.viewer.warning?.onCancel;

export const getShowAskAgainCheckbox = (state) => state.viewer.warning?.showAskAgainCheckbox || false;

export const getShowDeleteTabWarning = (state) => state.viewer.warning?.showDeleteTabWarning ?? true;

// Returns if the "accessibleMode" constructor option is set to true
export const isAccessibleMode = (state) => state.viewer.isAccessibleMode;

export const shouldAddA11yContentToDOM = (state) => state.viewer.shouldAddA11yContentToDOM;

export const getDisabledFeaturesInAccessibleReadingMode = (state) => state.viewer.disabledFeaturesInAccessibleReadingMode;

export const getWarningTemplateStrings = (state) => state.viewer.warning?.templateStrings || {};

export const getWarningModalClass = (state) => state.viewer.warning?.modalClass || '';

export const getWarningCloseEvent = (state) => state.viewer.warning?.onClose;

// error message
export const getErrorMessage = (state) => state.viewer.errorMessage || '';

// error title
export const getErrorTitle = (state) => state.viewer.errorTitle || '';

// document
export const getPasswordAttempts = (state) => state.document.passwordAttempts;

export const getPrintQuality = (state) => state.document.printQuality;

export const getDefaultPrintOptions = (state) => state.document.defaultPrintOptions;

export const getTotalPages = (state, documentViewerKey = 1) => state.document.totalPages[documentViewerKey];

export const getOutlines = (state) => state.document.outlines;

export const getOutlineEditingEnabled = (state) => state.viewer.isOutlineEditingEnabled;

export const getBookmarks = (state) => state.document.bookmarks;

export const getPortfolio = (state) => state.document.portfolio;

export const getLayers = (state) => state.document.layers;

export const getLoadingProgress = (state) => state.document.loadingProgress;

// user
export const getUserName = (state) => state.user.name;

// advanced
export const getServerUrl = (state) => state.advanced.serverUrl;

// search
export const getSearchValue = (state) => state.search.value;

export const shouldClearSearchPanelOnClose = (state) => state.search.clearSearchPanelOnClose;

export const isCaseSensitive = (state) => state.search.isCaseSensitive;

export const getReplaceValue = (state) => state.search.replaceValue;

export const getNextResultValue = (state) => state.search.nextResult;

export const isWholeWord = (state) => state.search.isWholeWord;

export const isWildcard = (state) => state.search.isWildcard;

export const isSearchUp = (state) => state.search.isSearchUp;

export const isSearchInProgress = (state) => state.search.isSearchInProgress;

export const isAmbientString = (state) => state.search.isAmbientString;

export const isRegex = (state) => state.search.isRegex;

export const isProcessingSearchResults = (state) => state.search.isProcessingSearchResults;

export const getRedactionSearchPatterns = (state) => state.search.redactionSearchPatterns;

export const getNoteTransformFunction = (state) => state.viewer.noteTransformFunction;

export const getCustomNoteSelectionFunction = (state) => state.viewer.customNoteFunction;

export const getCustomApplyRedactionsHandler = (state) => state.viewer.customApplyRedactionsHandler;

export const getCustomMultiViewerSyncHandler = (state) => state.viewer.customMultiViewerSyncHandler;

export const getCustomMultiViewerAcceptedFileFormats = (state) => state.viewer.customMultiViewerAcceptedFileFormats;

export const isSnapModeEnabled = (state) => !!state.viewer.snapMode[state.viewer.activeToolName];

export const getUnreadAnnotationIdSet = (state) => state.viewer.unreadAnnotationIdSet;

export const getCurrentLanguage = (state) => state.viewer.currentLanguage;

export const shouldFadePageNavigationComponent = (state) => state.viewer.fadePageNavigationComponent;

export const isWidgetHighlightingEnabled  = (state) => state.viewer.isWidgetHighlightingEnabled;

export const isContentEditWarningHidden = (state) => state.viewer.hideContentEditWarning;

export const areContentEditWorkersLoaded = (state) => state.viewer.contentEditWorkersLoaded;

export const getCurrentContentBeingEdited = (state) => state.viewer.currentContentBeingEdited;

export const isContentEditingEnabled = (state) => state.viewer.isContentEditingEnabled;

export const getFeatureFlags = (state) => state.featureFlags;

export const isRightClickAnnotationPopupEnabled = (state) => state.viewer.enableRightClickAnnotationPopup;

export const isInDesktopOnlyMode = (state) => state.viewer.isInDesktopOnlyMode;

export const getPanelWidth = (state, dataElement) => state.viewer.panelWidths[dataElement] || panelMinWidth;

export const pageDeletionConfirmationModalEnabled = (state) => state.viewer.pageDeletionConfirmationModalEnabled;

export const getPageReplacementFileList = (state) => state.viewer.pageReplacementFileList;

export const getPageManipulationOverlayItems = (state) => state.viewer.pageManipulationOverlay;

export const getMultiPageManipulationControlsItems = (state) => state.viewer.multiPageManipulationControls;

export const getPageManipulationOverlayAlternativePosition = (state) => state.viewer.pageManipulationOverlayAlternativePosition;

export const openingPageManipulationOverlayByRightClickEnabled = (state) => state.viewer.pageManipulationOverlayOpenByRightClick;

export const getThumbnailControlMenuItems = (state) => state.viewer.thumbnailControlMenu;

export const shouldShowPresets = (state) => {
  const response = state.viewer.toolButtonObjects[state.viewer.activeToolName];
  return response?.showPresets ?? true;
};

export const shouldResetAudioPlaybackPosition = (state) => state.viewer.shouldResetAudioPlaybackPosition;

export const getActiveSoundAnnotation = (state) => state.viewer.activeSoundAnnotation;

export const getEmbeddedJSPopupStyle = (state) => state.viewer.embeddedJSPopupStyle;

export const getWv3dPropertiesPanelModelData = (state) => state.wv3dPropertiesPanel.modelData;

export const getWv3dPropertiesPanelSchema = (state) => state.wv3dPropertiesPanel.schema;

export const getOfficeEditorCursorProperties = (state) => state.officeEditor.cursorProperties;
export const getOfficeEditorSelectionProperties = (state) => state.officeEditor.selectionProperties;
export const isCursorInTable = (state) => getOfficeEditorCursorProperties(state).locationProperties.inTable;

export const getOfficeEditorEditMode = (state) => state.officeEditor.editMode;

export const getOfficeEditorActiveStream = (state) => state.officeEditor.stream;

export const getOfficeEditorUnitMeasurement = (state) => state.officeEditor.unitMeasurement;

export const getAvailableFontFaces = (state) => state.officeEditor.availableFontFaces;

export const getCSSFontValues = (state) => state.officeEditor.cssFontValues;

export const getContentBoxEditor = (state) => state.viewer.contentBoxEditor;

export const getAnnotationFilters = (state) => state.viewer.annotationFilters;

export const getNotesPanelCustomHeaderOptions = (state) => state.viewer.notesPanelCustomHeaderOptions;

export const getNotesPanelCustomEmptyPanel = (state) => state.viewer.notesPanelCustomEmptyPanel;

export const isReplyAttachmentPreviewEnabled = (state) => state.viewer.replyAttachmentPreviewEnabled;

export const getReplyAttachmentHandler = (state) => state.viewer.replyAttachmentHandler;

export const getCustomSettings = (state) => state.viewer.customSettings;

export const isToolDefaultStyleUpdateFromAnnotationPopupEnabled = (state) => state.viewer.toolDefaultStyleUpdateFromAnnotationPopupEnabled;

export const isAnnotationToolStyleSyncingEnabled = (state) => state.viewer.annotationToolStyleSyncingEnabled;

export const getShortcutKeyMap = (state) => state.viewer.shortcutKeyMap;

export const getMultiViewerSyncScrollMode = (state) => state.viewer.multiViewerSyncScrollMode;

export const getCompareAnnotationsMap = (state) => state.viewer.compareAnnotationsMap;

export const getTextSignatureQuality = (state) => state.viewer.textSignatureCanvasMultiplier;

export const getIsMeasurementAnnotationFilterEnabled = (state) => state.viewer.isMeasurementAnnotationFilterEnabled;

export const isRightPanelOpen = (state) => {
  const openRightPanel = getOpenGenericPanel(state, PANEL_LOCATION.RIGHT);
  return openRightPanel?.length > 0;
};

export const isLeftPanelOpen = (state) => {
  const openLeftPanel = getOpenGenericPanel(state, PANEL_LOCATION.LEFT);
  return openLeftPanel?.length > 0;
};

export const getOpenRightPanelWidth = (state) => {
  const isCustomUI = getIsCustomUIEnabled(state);

  if (isCustomUI) {
    const isRightPanelVisible = isRightPanelOpen(state);
    return isRightPanelVisible ? getDocumentContainerRightMargin(state) : 0;
  }

  const panelMap = [
    { name: DataElements.NOTES_PANEL, isOpen: isElementOpen, getWidth: getNotesPanelWidthWithResizeBar },
    { name: DataElements.SEARCH_PANEL, isOpen: isElementOpen, getWidth: getSearchPanelWidthWithResizeBar },
    { name: DataElements.TEXT_EDITING_PANEL, isOpen: isElementOpen, getWidth: getTextEditingPanelWidth },
    { name: DataElements.WV3D_PROPERTIES_PANEL, isOpen: isElementOpen, getWidth: getWv3dPropertiesPanelWidth },
    { name: DataElements.COMPARE_PANEL, isOpen: isElementOpen, getWidth: getComparePanelWidthWithResizeBar },
    { name: DataElements.REDACTION_PANEL, isOpen: isElementOpen, getWidth: getRedactionPanelWidth },
  ];

  for (const panel of panelMap) {
    if (panel.isOpen(state, panel.name)) {
      return panel.getWidth(state);
    }
  }

  return 0; // return 0 if no panel is open
};

export const getIsShowComparisonButtonEnabled = (state) => {
  return state.viewer.isShowComparisonButtonEnabled;
};

export const getIsMultiViewerModeAvailable = (state) => {
  return state.viewer.isMultiViewerModeAvailable;
};

export const getMaxPasswordAttempts = (state) => {
  return state.document.maxPasswordAttempts;
};

export const isKeyboardOpen = (state) => state.viewer.isKeyboardOpen;

export const canUndo = (state) => {
  return state.viewer.canUndo[state.viewer.activeDocumentViewerKey];
};

export const canRedo = (state) => {
  return state.viewer.canRedo[state.viewer.activeDocumentViewerKey];
};

export const spreadsheetEditorCanUndo = (state) => {
  return state.spreadsheetEditor.canUndo;
};

export const spreadsheetEditorCanRedo = (state) => {
  return state.spreadsheetEditor.canRedo;
};

export const getIsCustomUIEnabled = (state) => {
  return getHashParameters('ui', 'default') != 'legacy' || getFeatureFlags(state).customizableUI;
};

export const getIsOfficeEditorHeaderEnabled = (state) => {
  return state.viewer.isOfficeEditorHeaderEnabled;
};

export const isSpreadsheetEditorModeEnabled = (state) => {
  return state.viewer.isSpreadsheetEditorModeEnabled;
};

export const getUIConfiguration = (state) => state.viewer.uiConfiguration;

// ** Spreadsheet Editor Selectors **
export const getActiveCellRange = (state) => state.spreadsheetEditor.activeCellRange;
export const getCellFormula = (state) => state.spreadsheetEditor.cellProperties.cellFormula;
export const getStringCellValue = (state) => state.spreadsheetEditor.cellProperties.stringCellValue;
export const getSpreadsheetEditorEditMode = (state) => state.spreadsheetEditor.editMode;
export const getActiveCellRangeVerticalAlignment = (state) => state.spreadsheetEditor.cellProperties.styles.verticalAlignment;
export const getActiveCellRangeHorizontalAlignment = (state) => state.spreadsheetEditor.cellProperties.styles.horizontalAlignment;
export const getActiveCellRangeWrapText = (state) => state.spreadsheetEditor.cellProperties.styles.wrapText;
export const getActiveCellRangeFontStyle = (state, style) => state.spreadsheetEditor.cellProperties.styles.font[style];
export const getActiveCellFormatType = (state) => state.spreadsheetEditor.cellProperties.styles.formatType;
export const getActiveCellBorderStyle = (state) => state.spreadsheetEditor.cellProperties.styles.border;
export const getSelectedBorderColorOption = (state) => state.spreadsheetEditor.selectedBorderColorOption;
export const getSelectedBorderStyleListOption = (state) => state.spreadsheetEditor.selectedBorderStyleListOption;
export const getTextColors = (state) => state.spreadsheetEditor.textColors;
export const getCustomTextColors = (state) => state.spreadsheetEditor.customTextColors;
export const getBorderColors = (state) => state.spreadsheetEditor.borderColors;
export const getCustomBorderColors = (state) => state.spreadsheetEditor.customBorderColors;
export const getCellBackgroundColors = (state) => state.spreadsheetEditor.cellBackgroundColors;
export const getCustomCellBackgroundColors = (state) => state.spreadsheetEditor.customCellBackgroundColors;
export const getIsSingleCell = (state) => state.spreadsheetEditor.cellProperties.isSingleCell;
export const getIsCellRangeMerged = (state) => state.spreadsheetEditor.cellProperties.styles.isCellRangeMerged;
export const getCellBackgroundColor = (state) => state.spreadsheetEditor.cellProperties.styles.backgroundColor;
export const getCanCopy = (state) => state.spreadsheetEditor.cellProperties.canCopy;
export const getCanPaste = (state) => state.spreadsheetEditor.cellProperties.canPaste;
export const getCanCut = (state) => state.spreadsheetEditor.cellProperties.canCut;
export const getAvailableSpreadsheetEditorFontFaces = (state) => state.spreadsheetEditor.availableFontFaces;
export const getSpreadsheetEditorCSSFontValues = (state) => state.spreadsheetEditor.cssFontValues;

export const hasPanelInItems = (items, panelType) => {
  if (!items || !Array.isArray(items)) {
    return false;
  }
  return items.some((item) => {
    if (!item) {
      return false;
    }
    if (typeof item === 'object' && item.props && item.hasOwnProperty('key')) {
      if (item.props.isFlyout && item.key.startsWith(panelType)) {
        return true;
      }
    }

    if (typeof item === 'object' && item.render === panelType) {
      return true;
    }

    if (item.children) {
      return hasPanelInItems(item.children, panelType);
    }
    return false;
  });
};

export const getIsPanelInFlyout = (state, panelType, flyoutsToExclude = []) => {
  const flyoutMap = state.viewer.flyoutMap;

  for (const flyoutKey in flyoutMap) {
    const flyout = flyoutMap[flyoutKey];
    const panelInFlyout = flyout?.items && hasPanelInItems(flyout.items, panelType) && !flyoutsToExclude.includes(flyout?.dataElement);
    if (panelInFlyout) {
      return flyout;
    }
  }

  return null;
};
