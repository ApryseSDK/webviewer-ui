import core from 'core';
import isDataElementLeftPanel from 'helpers/isDataElementLeftPanel';
import fireEvent from 'helpers/fireEvent';
import { getMaxZoomLevel, getMinZoomLevel } from 'constants/zoomFactors';
import { disableElements, enableElements, setActiveFlyout } from 'actions/internalActions';
import defaultTool from 'constants/defaultTool';
import { PRIORITY_TWO } from 'constants/actionPriority';
import Events from 'constants/events';
import { getGenericPanels, getOpenGenericPanel } from 'selectors/exposedSelectors';
import DataElements from 'constants/dataElement';
import { ITEM_TYPE } from 'constants/customizationVariables';
import pick from 'lodash/pick';
import { v4 as uuidv4 } from 'uuid';
import selectors from 'selectors';
import checkFeaturesToEnable from 'helpers/checkFeaturesToEnable';
import { getModularItem, getNestedGroupedItems } from 'helpers/modularUIHelpers';
import { isMobile } from 'helpers/device';

export const setScaleOverlayPosition = (position) => ({
  type: 'SET_SCALE_OVERLAY_POSITION',
  payload: { position },
});
export const setDefaultPrintMargins = (margins) => ({
  type: 'SET_DEFAULT_PRINT_MARGINS',
  payload: { margins },
});
export const disableApplyCropWarningModal = () => ({
  type: 'SHOW_APPLY_CROP_WARNING',
  payload: { shouldShowApplyCropWarning: false },
});

export const enableApplyCropWarningModal = () => ({
  type: 'SHOW_APPLY_CROP_WARNING',
  payload: { shouldShowApplyCropWarning: true },
});

export const disableApplySnippingWarningModal = () => ({
  type: 'SHOW_APPLY_SNIPPING_WARNING',
  payload: { shouldShowApplySnippingWarning: false },
});

export const enableApplySnippingWarningModal = () => ({
  type: 'SHOW_APPLY_SNIPPING_WARNING',
  payload: { shouldShowApplySnippingWarning: true },
});

export const setPresetCropDimensions = (presetCropDimensions) => ({
  type: 'SET_PRESET_CROP_DIMENSIONS',
  payload: { presetCropDimensions },
});

export const setPresetNewPageDimensions = (presetNewPageDimensions) => ({
  type: 'SET_PRESET_NEW_PAGE_DIMENSIONS',
  payload: { presetNewPageDimensions },
});

export const setDateTimeFormats = (dateTimeFormats) => ({
  type: 'SET_DATE_TIME_FORMATS',
  payload: { dateTimeFormats },
});

export const setEnableDesktopOnlyMode = (enableDesktopOnlyMode) => ({
  type: 'SET_ENABLE_DESKTOP_ONLY_MODE',
  payload: { enableDesktopOnlyMode },
});

export const setHighContrastMode = (useHighContrastMode) => ({
  type: 'SET_HIGH_CONTRAST_MODE',
  payload: { useHighContrastMode },
});

export const setCanUndo = (canUndo, documentViewerKey = 1) => ({
  type: 'SET_CAN_UNDO',
  payload: { canUndo, documentViewerKey },
});

export const setCanRedo = (canRedo, documentViewerKey = 1) => ({
  type: 'SET_CAN_REDO',
  payload: { canRedo, documentViewerKey },
});

export const setStandardStamps = (t) => async (dispatch) => {
  const rubberStampTool = core.getTool('AnnotationCreateRubberStamp');
  const canvasWidth = 160;
  const canvasHeight = 58;

  const annotations = await rubberStampTool.getStandardStampAnnotations();
  const previews = await Promise.all(
    annotations.map((annotation) => {
      const text = t(`rubberStamp.${annotation['Icon']}`);

      const options = {
        canvasWidth,
        canvasHeight,
        text,
      };

      return rubberStampTool.getPreview(annotation, options);
    }),
  );

  const standardStamps = annotations.map((annotation, i) => ({
    annotation,
    imgSrc: previews[i],
  }));

  dispatch({
    type: 'SET_STANDARD_STAMPS',
    payload: { standardStamps },
  });
};

export const setCustomStamps = (t) => async (dispatch) => {
  const rubberStampTool = core.getTool('AnnotationCreateRubberStamp');
  const canvasWidth = 160;
  const canvasHeight = 58;

  const annotations = await rubberStampTool.getCustomStampAnnotations();
  await Promise.all(
    annotations.map((annotation) => {
      const text = t(`rubberStamp.${annotation['Icon']}`);

      const options = {
        canvasWidth,
        canvasHeight,
        text,
      };

      return rubberStampTool.getPreview(annotation, options);
    }),
  );

  const customStampsPromises = annotations.map(async (annotation) => ({
    annotation,
    imgSrc: await annotation.getImageData(),
  }));

  const customStamps = await Promise.all(customStampsPromises);

  dispatch({
    type: 'SET_CUSTOM_STAMPS',
    payload: { customStamps },
  });
};

export const setReadOnlyRibbons = () => (dispatch, getState) => {
  dispatch(setToolbarGroup('toolbarGroup-View'));
  const state = getState();
  const toolbarGroupsToDisable = Object.keys(state.viewer.headers).filter(
    (key) => key.includes('toolbarGroup-') && key !== 'toolbarGroup-View',
  );

  disableElements(toolbarGroupsToDisable, PRIORITY_TWO)(dispatch, getState);
};

export const enableRibbons = () => (dispatch, getState) => {
  const state = getState();
  // There can be a situation where we switch to FormBuilder mode and we get a race condition between setting
  // the active toolbarGroup as what is in the current state and Forms, as redux hasnt dispatched the update to the Forms tool bar yet.
  // We double check here if we are in form mode and set the correct tool bar group
  // We enable ribbons when going into form mode, as we temporarily elevate the user's permissions
  const featureFlags = selectors.getFeatureFlags(getState());
  const { customizableUI } = featureFlags;

  const isInFormFieldCreationMode = core.getFormFieldCreationManager().isInFormFieldCreationMode();
  const toolbarGroup = isInFormFieldCreationMode ? DataElements.FORMS_TOOLBAR_GROUP : state.viewer.toolbarGroup;
  if (!customizableUI) {
    dispatch(setToolbarGroup(toolbarGroup || DataElements.ANNOTATE_TOOLBAR_GROUP));
  }
  const toolbarGroupsToEnable = Object.keys(state.viewer.headers).filter((key) => key.includes('toolbarGroup-'));

  enableElements(toolbarGroupsToEnable, PRIORITY_TWO)(dispatch, getState);
};

const isElementDisabled = (state, dataElement) => state.viewer.disabledElements[dataElement]?.disabled;

export const allButtonsInGroupDisabled = (state, toolGroup) => {
  const dataElements = Object.values(state.viewer.toolButtonObjects)
    .filter(({ group }) => group === toolGroup)
    .map(({ dataElement }) => dataElement);

  return dataElements.every((dataElement) => isElementDisabled(state, dataElement));
};

export const getFirstToolForGroupedItems = (state, group) => {
  const modularComponents = state.viewer.modularComponents;
  const items = modularComponents[group]?.items;
  let firstTool = '';

  items?.find((item) => {
    const { type, toolName, dataElement } = modularComponents[item];
    if (type === ITEM_TYPE.TOOL_BUTTON && toolName && !isElementDisabled(state, dataElement)) {
      firstTool = toolName;
      return toolName;
    }
    return false;
  });
  return firstTool;
};

export const setLastPickedToolAndGroup = (toolAndGroup) => ({
  type: 'SET_LAST_PICKED_TOOL_AND_GROUP',
  payload: { tool: toolAndGroup.tool, group: toolAndGroup.group }
});

export const setActiveGroupedItems = (groupedItems) => (dispatch, getState) => {
  const state = getState();

  const childGroupedItems = getNestedGroupedItems(state, groupedItems);

  // Check and set the last picked tool for grouped items
  const isLastPickedToolSet = groupedItems.some((groupedItem) => state.viewer.lastPickedToolForGroupedItems?.[groupedItem]);
  if (!isLastPickedToolSet) {
    groupedItems.some((groupedItem) => {
      const firstTool = getFirstToolForGroupedItems(state, groupedItem);
      if (firstTool) {
        dispatch(setLastPickedToolForGroupedItems(firstTool, groupedItem));
        dispatch(setLastPickedToolAndGroup({
          tool: firstTool,
          group: [groupedItem]
        }));
        return true;
      }
      return false;
    });
  }

  childGroupedItems.forEach((childGroupedItem) => {
    if (state.viewer.lastPickedToolForGroupedItems?.[childGroupedItem]) {
      dispatch(setLastPickedToolForGroupedItems('', childGroupedItem));
    }
  });

  dispatch(setGroupedItems([...groupedItems, ...childGroupedItems]));
};

const setLastPickedToolForGroupedItems = (toolName, groupedItem) => ({
  type: 'SET_LAST_PICKED_TOOL_FOR_GROUPED_ITEMS',
  payload: { toolName, groupedItem },
});

const setGroupedItems = (groupedItems) => ({
  type: 'SET_ACTIVE_GROUPED_ITEMS',
  payload: { groupedItems },
});

export const setFixedGroupedItems = (groupedItems) => (dispatch) => {
  dispatch({
    type: 'SET_FIXED_GROUPED_ITEMS',
    payload: { groupedItems }
  });
};

export const setActiveCustomRibbon = (customRibbon) => ({
  type: 'SET_ACTIVE_CUSTOM_RIBBON',
  payload: { customRibbon }
});

export const setToolbarGroup = (toolbarGroup, pickTool = true, toolGroup = '') => (dispatch, getState) => {
  const getFirstToolGroupForToolbarGroup = (state, _toolbarGroup) => {
    const toolGroups = state.viewer.headers[_toolbarGroup];
    let firstToolGroupForToolbarGroup = '';
    if (toolGroups) {
      const firstTool = Object.values(toolGroups).find(({ toolGroup, dataElement }) => {
        if (toolGroup && !isElementDisabled(state, dataElement) && !allButtonsInGroupDisabled(state, toolGroup)) {
          return true;
        }
        return false;
      });
      if (firstTool) {
        firstToolGroupForToolbarGroup = firstTool.toolGroup;
      }
    }
    return firstToolGroupForToolbarGroup;
  };

  const getFirstToolNameForGroup = (state, toolGroup) => {
    const tools = state.viewer.toolButtonObjects;
    const firstTool = Object.keys(tools).find((key) => {
      return tools[key].group === toolGroup;
    });
    return firstTool;
  };

  if (toolbarGroup === 'toolbarGroup-View') {
    dispatch({
      type: 'SET_ACTIVE_TOOL_GROUP',
      payload: { toolGroup: '', toolbarGroup },
    });
    core.setToolMode(defaultTool);
  } else {
    dispatch(openElements(['toolsHeader']));
    const state = getState();
    const lastPickedToolGroup =
      toolGroup || state.viewer.lastPickedToolGroup[toolbarGroup] || getFirstToolGroupForToolbarGroup(state, toolbarGroup);
    const lastPickedToolName =
      state.viewer.lastPickedToolForGroup[lastPickedToolGroup] || getFirstToolNameForGroup(state, lastPickedToolGroup);
    if (pickTool) {
      if (toolbarGroup === DataElements.EDIT_TOOLBAR_GROUP || toolbarGroup === DataElements.EDIT_TEXT_TOOLBAR_GROUP) {
        dispatch(closeElement(DataElements.STYLE_PANEL));
      }
      dispatch({
        type: 'SET_ACTIVE_TOOL_GROUP',
        payload: { toolGroup: lastPickedToolGroup, toolbarGroup },
      });

      if (lastPickedToolName === 'AnnotationCreateSignature') {
        core.setToolMode(defaultTool);
      } else {
        core.setToolMode(lastPickedToolName);
      }
    } else {
      core.setToolMode(defaultTool);
      dispatch({
        type: 'SET_ACTIVE_TOOL_GROUP',
        payload: { toolGroup: '', toolbarGroup },
      });
    }
  }
  dispatch(closeElements(['toolsOverlay', 'signatureOverlay', 'toolStylePopup']));

  dispatch({
    type: 'SET_TOOLBAR_GROUP',
    payload: { toolbarGroup },
  });
  fireEvent(Events.TOOLBAR_GROUP_CHANGED, toolbarGroup);
};

export const setActiveGroupedItemWithTool = (toolName) => (dispatch, getState) => {
  const state = getState();
  const groupedItemsWithTool = selectors.getGroupedItemsWithSelectedTool(state, toolName);
  const activeGroupedItems = selectors.getActiveGroupedItems(state);
  const activeGroupedItemsContainsTool = activeGroupedItems.some((item) => groupedItemsWithTool.includes(item));

  // If no active grouped items have the selected tool, we set the first one as active
  if (!activeGroupedItemsContainsTool && groupedItemsWithTool.length > 0) {
    let firstGroupedItem = '';
    let associatedRibbonItem = '';
    for (let i = 0; i < groupedItemsWithTool.length; i++) {
      firstGroupedItem = groupedItemsWithTool[i];
      associatedRibbonItem = selectors.getRibbonItemAssociatedWithGroupedItem(state, firstGroupedItem);
      if (associatedRibbonItem) {
        break;
      }
    }
    // We just set the active custom ribbon if there is an associated ribbon item.
    if (associatedRibbonItem) {
      dispatch(setActiveCustomRibbon(associatedRibbonItem));
    }
    dispatch(setLastPickedToolForGroupedItems(toolName, firstGroupedItem));
    dispatch(setActiveGroupedItems([...activeGroupedItems, firstGroupedItem]));
  } else if (activeGroupedItemsContainsTool) {
    // If the active grouped items have the selected tool, we set the selected tool for the first one
    const firstGroupedItem = activeGroupedItems[0];
    const items = getModularItem(state, firstGroupedItem).items;
    const itemInFirstGroupedItem = items.some((item) => getModularItem(state, item).toolName === toolName);
    if (itemInFirstGroupedItem) {
      dispatch(setLastPickedToolForGroupedItems(toolName, firstGroupedItem));
    } else {
      dispatch(setLastPickedToolForGroupedItems('', firstGroupedItem));
    }
  }
};

export const setSelectedStampIndex = (index) => ({
  type: 'SET_SELECTED_STAMP_INDEX',
  payload: { index },
});
export const setLastSelectedStampIndex = (index) => ({
  type: 'SET_LAST_SELECTED_STAMP_INDEX',
  payload: { index },
});
export const setOutlineControlVisibility = (outlineControlVisibility) => ({
  type: 'SET_OUTLINE_CONTROL_VISIBILITY',
  payload: { outlineControlVisibility },
});
export const setSelectedDisplayedSignatureIndex = (index) => ({
  type: 'SET_SELECTED_DISPLAYED_SIGNATURE_INDEX',
  payload: { index },
});
export const setSavedSignatures = (savedSignatures) => ({
  type: 'SET_SAVED_SIGNATURES',
  payload: { savedSignatures },
});
export const setDisplayedSignaturesFilterFunction = (filterFunction) => ({
  type: 'SET_DISPLAYED_SIGNATURES_FILTER_FUNCTION',
  payload: { filterFunction },
});
export const setSignatureMode = (signatureMode) => ({
  type: 'SET_SIGNATURE_MODE',
  payload: { signatureMode }
});

export const setSavedInitials = (savedInitials) => ({
  type: 'SET_SAVED_INITIALS',
  payload: { savedInitials },
});

export const setSelectedDisplayedInitialsIndex = (index) => ({
  type: 'SET_SELECTED_DISPLAYED_INITIALS_INDEX',
  payload: { index },
});

export const setLeftPanelWidth = (width) => ({
  type: 'SET_LEFT_PANEL_WIDTH',
  payload: { width },
});
export const setSearchPanelWidth = (width) => ({
  type: 'SET_SEARCH_PANEL_WIDTH',
  payload: { width },
});
export const setNotesPanelWidth = (width) => ({
  type: 'SET_NOTES_PANEL_WIDTH',
  payload: { width },
});
export const setComparePanelWidth = (width) => ({
  type: 'SET_COMPARE_PANEL_WIDTH',
  payload: { width },
});
export const setRedactionPanelWidth = (width) => ({
  type: 'SET_REDACTION_PANEL_WIDTH',
  payload: { width },
});
export const setTextEditingPanelWidth = (width) => ({
  type: 'SET_TEXT_EDITING_PANEL_WIDTH',
  payload: { width },
});
export const setWatermarkPanelWidth = (width) => ({
  type: 'SET_WATERMARK_PANEL_WIDTH',
  payload: { width },
});
export const setWv3dPropertiesPanelWidth = (width) => ({
  type: 'SET_WV3D_PROPERTIES_PANEL_WIDTH',
  payload: { width },
});
export const setWv3dPropertiesPanelModelData = (modelData) => ({
  type: 'SET_WV3D_PROPERTIES_PANEL_MODEL_DATA',
  payload: { modelData },
});
export const setWv3dPropertiesPanelSchema = (schema) => ({
  type: 'SET_WV3D_PROPERTIES_PANEL_SCHEMA',
  payload: { schema },
});
export const setOfficeEditorCursorProperties = (cursorProperties) => ({
  type: 'SET_OFFICE_EDITOR_CURSOR_PROPERTIES',
  payload: { cursorProperties },
});
export const setOfficeEditorSelectionProperties = (selectionProperties) => ({
  type: 'SET_OFFICE_EDITOR_SELECTION_PROPERTIES',
  payload: { selectionProperties },
});
export const addOfficeEditorAvailableFontFace = (fontFace) => ({
  type: 'ADD_OFFICE_EDITOR_AVAILABLE_FONT_FACE',
  payload: { fontFace },
});

export const setDocumentContainerWidth = (width) => ({
  type: 'SET_DOCUMENT_CONTAINER_WIDTH',
  payload: { width },
});
export const setDocumentContainerHeight = (height) => ({
  type: 'SET_DOCUMENT_CONTAINER_HEIGHT',
  payload: { height },
});

export const setGapBetweenHeaderItems = (dataElement, gap) => updateHeaderProperty(dataElement, 'gap', gap);

export const setHeaderJustifyContent = (dataElement, justifyContent) => updateHeaderProperty(dataElement, 'justifyContent', justifyContent);

export const setHeaderMaxWidth = (dataElement, maxWidth) => updateHeaderProperty(dataElement, 'maxWidth', maxWidth);

export const setHeaderMaxHeight = (dataElement, maxHeight) => updateHeaderProperty(dataElement, 'maxHeight', maxHeight);

export const setHeaderStyle = (dataElement, style) => updateHeaderProperty(dataElement, 'style', style);

const updateHeaderProperty = (dataElement, property, value) => ({
  type: 'UPDATE_MODULAR_HEADER',
  payload: {
    dataElement,
    property,
    value,
  }
});

// We may want to expose an API to update the props of any modular component
// That is why the action refers to modular components and not just grouped items
export const setGroupedItemsProperty = (property, value, groupedItemsDataElement) => ({
  type: 'SET_MODULAR_COMPONENTS_PROPERTY',
  payload: {
    property,
    value,
    groupedItemsDataElement,
  }
});

export const setAllGroupedItemsProperty = (property, value) => ({
  type: 'SET_ALL_GROUPED_ITEMS_PROPERTY',
  payload: {
    property,
    value,
  }
});

export const updateGroupedItems = (groupedItemsDataElement, newGroupedItems) => (dispatch, getState) => {
  const componentsMap = {};
  const existingComponentsMap = getState().viewer.modularComponents;
  const normalizedItems = normalizeItems(newGroupedItems, componentsMap, existingComponentsMap);
  dispatch({
    type: 'UPDATE_GROUPED_ITEMS',
    payload: {
      groupedItemsDataElement,
      normalizedItems,
      componentsMap
    }
  });
};

export const enableAllElements = () => ({
  type: 'ENABLE_ALL_ELEMENTS',
  payload: {},
});
export const openElement = (dataElement) => (dispatch, getState) => {
  const state = getState();

  const isElementDisabled = state.viewer.disabledElements[dataElement]?.disabled;
  const isLeftPanelOpen = state.viewer.openElements['leftPanel'];
  const isElementOpen = isDataElementLeftPanel(dataElement, state)
    ? isLeftPanelOpen && state.viewer.activeLeftPanel === dataElement
    : state.viewer.openElements[dataElement];
  const isFlyoutElement = state.viewer.flyoutMap?.[dataElement];

  if (isFlyoutElement) {
    dispatch(setActiveFlyout(dataElement));
  }

  if (isElementDisabled || isElementOpen) {
    return;
  }

  const genericPanel = state.viewer.genericPanels.find((item) => dataElement === item.dataElement);
  if (genericPanel?.location === 'left' || genericPanel?.location === 'right') {
    const keys = genericPanel.location === 'left' ? ['leftPanel'] : [...rightPanelList];
    const genericPanelsInSameLocation = state.viewer.genericPanels.filter((item) => item.location === genericPanel?.location && item.dataElement !== genericPanel?.dataElement);
    genericPanelsInSameLocation.forEach((item) => keys.push(item.dataElement));
    dispatch(closeElements(keys));
  }

  // In the mobile UI, we can have only one panel open at a time
  if (genericPanel && isMobile()) {
    const openGenericPanel = getOpenGenericPanel(state);
    if (openGenericPanel) {
      dispatch(closeElement(openGenericPanel));
    }
  }

  if (isDataElementLeftPanel(dataElement, state) && dataElement !== DataElements.NOTES_PANEL) {
    if (!isLeftPanelOpen) {
      dispatch({ type: 'OPEN_ELEMENT', payload: { dataElement: 'leftPanel' } });
      fireEvent(Events.VISIBILITY_CHANGED, { element: 'leftPanel', isVisible: true });
    }
    dispatch(setActiveLeftPanel(dataElement));
  } else {
    dispatch({ type: 'OPEN_ELEMENT', payload: { dataElement } });
    fireEvent(Events.VISIBILITY_CHANGED, { element: dataElement, isVisible: true });

    if (dataElement === 'leftPanel' && !isLeftPanelOpen) {
      fireEvent(Events.VISIBILITY_CHANGED, {
        element: state.viewer.activeLeftPanel,
        isVisible: true,
      });
    }
  }
};
export const openElements = (dataElements) => (dispatch) => {
  if (typeof dataElements === 'string') {
    dispatch(openElement(dataElements));
  } else {
    dataElements.forEach((dataElement) => {
      dispatch(openElement(dataElement));
    });
  }
};
export const closeElement = (dataElement) => (dispatch, getState) => {
  const state = getState();

  const isElementDisabled = state.viewer.disabledElements[dataElement]?.disabled;
  const isFlyoutElement = state.viewer.flyoutMap?.[dataElement];
  const isElementClosed = isDataElementLeftPanel(dataElement, state)
    ? state.viewer.activeLeftPanel !== dataElement
    : !state.viewer.openElements[dataElement];

  if (isElementDisabled || isElementClosed) {
    return;
  }

  if (isDataElementLeftPanel(dataElement, state) && state.viewer.openElements['leftPanel']) {
    dispatch({ type: 'CLOSE_ELEMENT', payload: { dataElement: 'leftPanel' } });
    fireEvent(Events.VISIBILITY_CHANGED, { element: 'leftPanel', isVisible: false });
  } else {
    dispatch({ type: 'CLOSE_ELEMENT', payload: { dataElement } });
    fireEvent(Events.VISIBILITY_CHANGED, { element: dataElement, isVisible: false });

    if (isFlyoutElement) {
      dispatch({
        type: 'SET_ACTIVE_FLYOUT',
        payload: { dataElement: null }
      });
    }
    if (dataElement === DataElements.PAGE_MANIPULATION_OVERLAY) {
      dispatch({
        type: 'SET_PAGE_MANIPULATION_OVERLAY_ALTERNATIVE_POSITION',
        payload: null
      });
    }

    if (dataElement === 'leftPanel' && state.viewer.openElements['leftPanel']) {
      fireEvent(Events.VISIBILITY_CHANGED, {
        element: state.viewer.activeLeftPanel,
        isVisible: false,
      });
    }
  }
};
export const closeElements = (dataElements) => (dispatch) => {
  if (typeof dataElements === 'string') {
    dispatch(closeElement(dataElements));
  } else {
    dataElements.forEach((dataElement) => {
      dispatch(closeElement(dataElement));
    });
  }
};

const rightPanelList = ['searchPanel', DataElements.NOTES_PANEL, 'comparePanel', 'redactionPanel', 'wv3dPropertiesPanel', 'textEditingPanel', 'watermarkPanel'];
export const toggleElement = (dataElement) => (dispatch, getState) => {
  const state = getState();
  const rightGenericPanels = getGenericPanels(state, 'right');
  const allPanelsOnTheRight = [...rightPanelList, ...rightGenericPanels.map((item) => item.dataElement)];

  if (state.viewer.disabledElements[dataElement]?.disabled) {
    return;
  }

  // hack for new ui
  if (!state.viewer.notesInLeftPanel) {
    if (allPanelsOnTheRight.includes(dataElement)) {
      for (const panel of allPanelsOnTheRight) {
        if (panel !== dataElement) {
          dispatch(closeElement(panel));
        }
      }
    }
  }

  if (state.viewer.openElements[dataElement]) {
    dispatch(closeElement(dataElement));
  } else {
    dispatch(openElement(dataElement));
  }
};

export const addCustomModal = (modalOptions) => ({
  type: 'ADD_CUSTOM_MODAL',
  payload: modalOptions,
});

const headerKeysToStore = [
  'dataElement', 'label', 'placement', 'justifyContent',
  'grow', 'gap', 'position', 'float', 'maxWidth', 'maxHeight',
  'opacityMode', 'opacity', 'stroke', 'dimension', 'position', 'style'
];

// These are all the keys from the items we will store
// There are a few non serializable ones here like the onclick function
// we can determine their fate later
const itemKeysToStore = [
  'dataElement', 'items', 'title', 'disabled', 'type',
  'isActive', 'label', 'img', 'onClick', 'justifyContent',
  'groupedItems', 'grow', 'gap', 'position', 'placement', 'alwaysVisible',
  'style', 'headerDirection', 'icon', 'toolbarGroup', 'direction',
  'states', 'mount', 'unmount', 'initialState', 'hidden', 'toggleElement',
  'toolName', 'color', 'buttonType'];

//* Recursively normalize the items in a header
const normalizeItems = (items, componentsMap, existingComponentsMap) => {
  const result = [];
  for (let i = 0, len = items.length; i < len; i++) {
    const item = items[i];
    const normalizedItem = pick(item, itemKeysToStore);
    const dataElementKey = normalizedItem.dataElement;

    // if the dataElementKey already exists in the header items, we will just continue
    if (result.indexOf(dataElementKey) > -1) {
      continue;
    }

    normalizedItem.dataElement = dataElementKey;

    // If there are nested items, recursively normalize them
    if (item.items && item.items.length > 0) {
      const nestedItemsDataElements = normalizeItems(item.items, componentsMap, existingComponentsMap);
      normalizedItem.items = nestedItemsDataElements;
    }

    let newNormalizedItem = normalizedItem;
    if (existingComponentsMap[dataElementKey]) {
      console.warn(`Modular component with dataElement ${dataElementKey} already exists.`);
      const comp = existingComponentsMap[dataElementKey];
      newNormalizedItem = { ...comp, ...normalizedItem };
    }
    componentsMap[dataElementKey] = newNormalizedItem;

    result.push(dataElementKey);
  }
  return result;
};

const prepareModularHeaders = (headersList, existingComponentsMap = {}) => {
  const headersMap = {};
  const componentsMap = {};

  headersList.forEach((header) => {
    if (headersMap[header.dataElement]) {
      const newKey = `${header.dataElement}-${uuidv4()}`;
      console.warn(`Modular header with dataElement ${header.dataElement} already exists. Appending unique ID to prevent collisions: ${newKey}`);
      header.dataElement = newKey;
    }

    const itemDataElements = normalizeItems(header.items, componentsMap, existingComponentsMap);
    headersMap[header.dataElement] = { ...pick(header, headerKeysToStore), items: itemDataElements };
  });
  return { headersMap, componentsMap };
};

export const addModularHeaders = (headersList) => (dispatch, getState) => {
  const existingComponentsMap = getState().viewer.modularComponents;
  const { headersMap, componentsMap } = prepareModularHeaders(headersList, existingComponentsMap);

  checkFeaturesToEnable(componentsMap);

  dispatch({
    type: 'ADD_MODULAR_HEADERS_AND_COMPONENTS',
    payload: { headersMap, componentsMap }
  });
};
export const setModularHeaders = (headersList) => (dispatch) => {
  const { headersMap, componentsMap } = prepareModularHeaders(headersList);
  dispatch({
    type: 'SET_MODULAR_HEADERS_AND_COMPONENTS',
    payload: { headersMap, componentsMap }
  });
};


export const setModularHeaderItems = (headerDataElement, items) => (dispatch, getState) => {
  const existingComponentsMap = getState().viewer.modularComponents;
  const newComponentsMap = {};
  const itemsDataElements = normalizeItems(items, newComponentsMap, existingComponentsMap);

  dispatch({
    type: 'SET_MODULAR_HEADER_ITEMS',
    payload: {
      headerDataElement: headerDataElement,
      normalizedItems: newComponentsMap,
      itemsDataElements: itemsDataElements
    }
  });
};

export const setRightHeaderWidth = (width) => ({
  type: 'SET_RIGHT_HEADER_WIDTH',
  payload: width
});
export const setLeftHeaderWidth = (width) => ({
  type: 'SET_LEFT_HEADER_WIDTH',
  payload: width
});
export const setTopFloatingContainerHeight = (height) => ({
  type: 'SET_TOP_FLOATING_CONTAINER_HEIGHT',
  payload: height
});
export const setBottomFloatingContainerHeight = (height) => ({
  type: 'SET_BOTTOM_FLOATING_CONTAINER_HEIGHT',
  payload: height
});
export const setActiveHeaderGroup = (headerGroup) => ({
  type: 'SET_ACTIVE_HEADER_GROUP',
  payload: { headerGroup },
});
export const setActiveLeftPanel = (dataElement) => (dispatch, getState) => {
  const state = getState();

  if (isDataElementLeftPanel(dataElement, state)) {
    if (state.viewer.activeLeftPanel !== dataElement) {
      dispatch({
        type: 'CLOSE_ELEMENT',
        payload: { dataElement: state.viewer.activeLeftPanel },
      });
      fireEvent(Events.VISIBILITY_CHANGED, {
        element: state.viewer.activeLeftPanel,
        isVisible: false,
      });
      dispatch({ type: 'SET_ACTIVE_LEFT_PANEL', payload: { dataElement } });
      fireEvent(Events.VISIBILITY_CHANGED, { element: dataElement, isVisible: true });
    }
  } else {
    const panelDataElements = [
      ...state.viewer.customPanels.map(({ panel }) => panel.dataElement),
      DataElements.PORTFOLIO_PANEL,
      'thumbnailsPanel',
      'outlinesPanel',
      'layersPanel',
      'bookmarksPanel',
      DataElements.NOTES_PANEL,
      'signaturePanel',
      'attachmentPanel',
    ].join(', ');
    console.warn(
      `${dataElement} is not recognized by the left panel. Please use one of the following options: ${panelDataElements}`,
    );
  }
};

export const setTimezone = (timezone) => ({
  type: 'SET_TIMEZONE',
  payload: { timezone },
});
export const setNotesPanelSortStrategy = (sortStrategy) => ({
  type: 'SET_NOTES_PANEL_SORT_STRATEGY',
  payload: { sortStrategy },
});

export const setNoteDateFormat = (noteDateFormat) => ({
  type: 'SET_NOTE_DATE_FORMAT',
  payload: { noteDateFormat },
});
export const setPrintedNoteDateFormat = (noteDateFormat) => ({
  type: 'SET_PRINTED_NOTE_DATE_FORMAT',
  payload: { noteDateFormat },
});
export const setCustomPanel = (newPanel) => ({
  type: 'SET_CUSTOM_PANEL',
  payload: { newPanel },
});

export const addPanel = (newPanel) => ({
  type: 'ADD_PANEL',
  payload: { newPanel },
});

export const setGenericPanels = (genericPanels) => ({
  type: 'SET_GENERIC_PANELS',
  payload: { genericPanels },
});

export const setMobilePanelSize = (panelSize) => ({
  type: 'SET_MOBILE_PANEL_SIZE',
  payload: { panelSize },
});

export const setPageLabels = (pageLabels) => (dispatch) => {
  if (pageLabels.length !== core.getTotalPages()) {
    console.warn('Number of page labels do not match with the total pages.');
    return;
  }
  dispatch({
    type: 'SET_PAGE_LABELS',
    payload: { pageLabels: pageLabels.map(String) },
  });
};
export const setSelectedPageThumbnails = (selectedThumbnailPageIndexes = []) => {
  fireEvent(Events.SELECTED_THUMBNAIL_CHANGED, selectedThumbnailPageIndexes);

  return {
    type: 'SET_SELECTED_THUMBNAIL_PAGE_INDEXES',
    payload: { selectedThumbnailPageIndexes },
  };
};
export const setShiftKeyThumbnailsPivotIndex = (shiftKeyThumbnailPivotIndex = null) => ({
  type: 'SET_SHIFT_KEY_THUMBNAIL_PIVOT_INDEX',
  payload: { shiftKeyThumbnailPivotIndex },
});
export const setSwipeOrientation = (swipeOrientation) => ({
  type: 'SET_SWIPE_ORIENTATION',
  payload: { swipeOrientation },
});
export const showWarningMessage = (options) => (dispatch) => {
  dispatch({ type: 'SET_WARNING_MESSAGE', payload: options });
  dispatch(openElement('warningModal'));
};
export const enableDeleteTabWarning = () => ({
  type: 'ENABLE_DELETE_TAB_WARNING',
  payload: { showDeleteTabWarning: true },
});
export const disableDeleteTabWarning = () => ({
  type: 'DISABLE_DELETE_TAB_WARNING',
  payload: { showDeleteTabWarning: false },
});
export const showErrorMessage = (message, title = '') => (dispatch) => {
  dispatch({ type: 'SET_ERROR_MESSAGE', payload: { message, title } });
  dispatch(openElement('errorModal'));
};
export const setCustomNoteFilter = (filterFunc) => ({
  type: 'SET_CUSTOM_NOTE_FILTER',
  payload: { customNoteFilter: filterFunc },
});
export const setInlineCommentFilter = (filterFunc) => ({
  type: 'SET_INLINE_COMMENT_FILTER',
  payload: { inlineCommentFilter: filterFunc },
});
export const setZoomList = (zoomList) => (dispatch) => {
  const minZoomLevel = getMinZoomLevel();
  const maxZoomLevel = getMaxZoomLevel();
  const filteredZoomList = zoomList.filter((zoom) => zoom >= minZoomLevel && zoom <= maxZoomLevel);

  if (filteredZoomList.length !== zoomList.length) {
    const outOfRangeZooms = zoomList.filter((zoom) => !filteredZoomList.includes(zoom));
    console.warn(`
      ${outOfRangeZooms.join(', ')} are not allowed zoom levels in the UI.
      Valid zoom levels should be in the range of ${minZoomLevel}-${maxZoomLevel}.
      You can use setMinZoomLevel or setMaxZoomLevel APIs to change the range.
      See https://docs.apryse.com/api/web/UI.html for more information.
    `);
  }

  dispatch({ type: 'SET_ZOOM_LIST', payload: { zoomList: filteredZoomList } });
};
export const useEmbeddedPrint = (useEmbeddedPrint = true) => ({
  type: 'USE_EMBEDDED_PRINT',
  payload: { useEmbeddedPrint },
});
export const setMaxSignaturesCount = (maxSignaturesCount) => ({
  type: 'SET_MAX_SIGNATURES_COUNT',
  payload: { maxSignaturesCount },
});
export const setUserData = (userData) => ({
  type: 'SET_USER_DATA',
  payload: { userData },
});
export const setCustomMeasurementOverlay = (customMeasurementOverlay) => ({
  type: 'SET_CUSTOM_MEASUREMENT_OVERLAY',
  payload: { customMeasurementOverlay },
});
export const setSelectedTab = (id, dataElement) => ({
  type: 'SET_SELECTED_TAB',
  payload: { id, dataElement },
});
export const setCustomElementOverrides = (dataElement, overrides) => ({
  type: 'SET_CUSTOM_ELEMENT_OVERRIDES',
  payload: { dataElement, overrides },
});
export const setPageReplacementModalFileList = (list) => ({
  type: 'SET_PAGE_REPLACEMENT_FILE_LIST',
  payload: { list },
});
export const setActiveTheme = (theme) => {
  fireEvent(Events.THEME_CHANGED, theme);

  return {
    type: 'SET_ACTIVE_THEME',
    payload: { theme },
  };
};
export const setSearchResults = (searchResults) => ({
  type: 'SET_SEARCH_RESULTS',
  payload: searchResults,
});

export const setClearSearchOnPanelClose = (shouldClear) => ({
  type: 'SET_CLEAR_SEARCH_ON_PANEL_CLOSE',
  payload: shouldClear,
});

export const setAnnotationContentOverlayHandler = (annotationContentOverlayHandler) => ({
  type: 'SET_ANNOTATION_CONTENT_OVERLAY_HANDLER',
  payload: { annotationContentOverlayHandler },
});

export const setAnnotationReadState = ({ isRead, annotationId }) => ({
  type: 'SET_ANNOTATION_READ_STATE',
  payload: { isRead, annotationId },
});
export const addTrustedCertificates = (certificates) => ({
  type: 'ADD_TRUSTED_CERTIFICATES',
  payload: { certificates },
});
export const addTrustList = (trustList) => ({
  type: 'ADD_TRUST_LIST',
  payload: { trustList },
});
export const setSignatureValidationModalWidgetName = (widgetName) => ({
  type: 'SET_VALIDATION_MODAL_WIDGET_NAME',
  payload: { validationModalWidgetName: widgetName },
});

export const setNoteSubmissionEnabledWithEnter = (enableNoteSubmissionWithEnter) => ({
  type: 'SET_SUBMIT_COMMENT_MODE',
  payload: { enableNoteSubmissionWithEnter },
});

export const setNotesPanelTextCollapsing = (enableNotesPanelTextCollapsing) => ({
  type: 'SET_NOTES_PANEL_TEXT_COLLAPSING',
  payload: { enableNotesPanelTextCollapsing },
});

export const setNotesPanelRepliesCollapsing = (enableNotesPanelRepliesCollapsing) => ({
  type: 'SET_NOTES_PANEL_REPLIES_COLLAPSING',
  payload: { enableNotesPanelRepliesCollapsing },
});

export const setCommentThreadExpansion = (enableCommentThreadExpansion) => ({
  type: 'SET_COMMENT_THREAD_EXPANSION',
  payload: { enableCommentThreadExpansion },
});

export const enableFadePageNavigationComponent = () => ({
  type: 'SET_FADE_PAGE_NAVIGATION_COMPONENT',
  payload: { fadePageNavigationComponent: true },
});

export const disableFadePageNavigationComponent = () => ({
  type: 'SET_FADE_PAGE_NAVIGATION_COMPONENT',
  payload: { fadePageNavigationComponent: false },
});

export const enablePageDeletionConfirmationModal = () => ({
  type: 'PAGE_DELETION_CONFIRMATION_MODAL_POPUP',
  payload: { pageDeletionConfirmationModalEnabled: true },
});

export const disablePageDeletionConfirmationModal = () => ({
  type: 'PAGE_DELETION_CONFIRMATION_MODAL_POPUP',
  payload: { pageDeletionConfirmationModalEnabled: false },
});

export const setWatermarkModalOptions = (watermarkModalOptions) => ({
  type: 'SET_WATERMARK_MODAL_OPTIONS',
  payload: { watermarkModalOptions },
});
export const setEmbeddedPopupMenuStyle = (customStyle) => ({
  type: 'SET_EMBEDDED_JS_POPUP_MENU_STYLE',
  payload: { embeddedJSPopupStyle: customStyle },
});
export const replaceRedactionSearchPattern = (searchPattern, regex) => ({
  type: 'REPLACE_REDACTION_SEARCH_PATTERN',
  payload: { searchPattern, regex },
});

export const setThumbnailSelectionMode = (thumbnailSelectionMode) => ({
  type: 'SET_THUMBNAIL_SELECTION_MODE',
  payload: { thumbnailSelectionMode },
});

export const addRedactionSearchPattern = (searchPattern) => ({
  type: 'ADD_REDACTION_SEARCH_PATTERN',
  payload: { searchPattern },
});

export const removeRedactionSearchPattern = (searchPatternType) => ({
  type: 'REMOVE_REDACTION_SEARCH_PATTERN',
  payload: { searchPatternType },
});

export const setColorMap = (colorMap) => ({
  type: 'SET_COLOR_MAP',
  payload: { colorMap }
});

export const setZoomStepFactors = (zoomStepFactors) => ({
  type: 'SET_ZOOM_STEP_FACTORS',
  payload: { zoomStepFactors },
});

export const setNotesPanelCustomHeader = (notesPanelCustomHeaderOptions) => ({
  type: 'SET_NOTES_PANEL_CUSTOM_HEADER_OPTIONS',
  payload: { notesPanelCustomHeaderOptions },
});

export const setNotesPanelEmptyPanel = (notesPanelCustomEmptyPanel) => ({
  type: 'SET_NOTES_PANEL_CUSTOM_EMPTY_PANEL',
  payload: { notesPanelCustomEmptyPanel },
});

export const addMeasurementScalePreset = (measurementSystem, newPreset, index) => ({
  type: 'ADD_MEASUREMENT_SCALE_PRESET',
  payload: { measurementSystem, newPreset, index }
});

export const removeMeasurementScalePreset = (measurementSystem, index) => ({
  type: 'REMOVE_MEASUREMENT_SCALE_PRESET',
  payload: { measurementSystem, index }
});

export const setIsMultipleScalesMode = (isMultipleScalesMode) => ({
  type: 'SET_IS_MULTIPLE_SCALE_MODE',
  payload: { isMultipleScalesMode }
});

export const setReplyAttachmentPreviewEnabled = (replyAttachmentPreviewEnabled) => ({
  type: 'SET_REPLY_ATTACHMENT_PREVIEW',
  payload: { replyAttachmentPreviewEnabled }
});

export const setNotesPanelMultiSelect = (isNotesPanelMultiSelectEnabled) => ({
  type: 'SET_NOTES_PANEL_MULTI_SELECT',
  payload: { isNotesPanelMultiSelectEnabled }
});

export const setReplyAttachmentHandler = (replyAttachmentHandler) => ({
  type: 'SET_REPLY_ATTACHMENT_HANDLER',
  payload: { replyAttachmentHandler }
});

export const setCustomSettings = (customSettings) => ({
  type: 'SET_CUSTOM_SETTINGS',
  payload: customSettings
});

export const setEnableRightClickAnnotationPopup = (isEnabled) => ({
  type: 'SET_ENABLE_RIGHT_CLICK_ANNOTATION_POPUP',
  payload: { isEnabled }
});

export const setToolDefaultStyleUpdateFromAnnotationPopupEnabled = (isToolDefaultStyleUpdateFromAnnotationPopupEnabled) => ({
  type: 'SET_TOOL_DEFAULT_STYLE_UPDATE_FROM_ANNOTATION_POPUP_ENABLED',
  payload: isToolDefaultStyleUpdateFromAnnotationPopupEnabled
});

export const setAnnotationToolStyleSyncingEnabled = (isAnnotationToolStyleSyncingEnabled) => ({
  type: 'SET_ANNOTATION_TOOL_STYLE_SYNCING_ENABLED',
  payload: isAnnotationToolStyleSyncingEnabled
});

export const setMultiViewerSyncScrollingMode = (multiViewerComparedSyncScrollingMode) => ({
  type: 'SET_MULTI_VIEWER_SYNC_SCROLLING_MODE',
  payload: multiViewerComparedSyncScrollingMode
});

export const setTextSignatureQuality = (multiplier) => ({
  type: 'SET_TEXT_SIGNATURE_CANVAS_MULTIPLIER',
  payload: { multiplier },
});

export const setEnableMeasurementAnnotationsFilter = (isEnabled) => ({
  type: 'SET_ENABLE_MEASUREMENT_ANNOTATIONS_FILTER',
  payload: { isEnabled },
});

export const setColors = (colors, tool, type, updateOnly = false) => (dispatch, getState) => {
  type = type ? type.toLowerCase() : type;
  const state = getState();
  if (tool && (!updateOnly || (updateOnly && state.viewer.toolColorOverrides[tool]))) {
    return dispatch({
      type: 'SET_COLORS',
      payload: { tool, colors },
    });
  }
  dispatch({
    type: 'SET_COLORS',
    payload: type === 'text' ? { textColors: colors } : { colors },
  });
};