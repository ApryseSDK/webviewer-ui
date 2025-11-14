import React from 'react';
import core from 'core';
import { FLYOUT_ITEM_TYPES, ITEM_TYPE } from 'constants/customizationVariables';
import selectors from 'selectors';
import actions from 'actions';
import Icon from 'components/Icon';
import { getZoomFlyoutItems } from 'components/ModularComponents/ZoomControls/ZoomHelper';
import { menuItems } from 'components/ModularComponents/Helpers/menuItems';
import DataElements from 'constants/dataElement';
import classNames from 'classnames';

let store;
export const setItemToFlyoutStore = (newStore) => {
  store = newStore;
};

export const itemToFlyout = (item, {
  onClick = undefined,
  children = undefined,
  useOverrideClickOnly = false,
  extraProps = {},
  skipCheck = false,
} = {}) => {
  const itemProps = item.properties || item.props || item;
  const {
    type,
    label,
    title,
    dataElement,
    img,
    icon,
    items,
    toolName
  } = itemProps;

  const isDisabledItem = itemProps?.dataElement && store && selectors.isElementDisabled(store.getState(), dataElement);
  if (!skipCheck && (!itemProps || !type || !Object.values(ITEM_TYPE).includes(type) || isDisabledItem)) {
    return null;
  }

  if (type === ITEM_TYPE.DIVIDER) {
    return 'divider';
  }

  cleanObject(extraProps);
  cleanObject(itemProps);

  const flyoutItem = {
    label: label || title || (dataElement ? dataElementToLabel(dataElement) : ''),
    onClick: () => {
      !useOverrideClickOnly && itemProps.onClick && itemProps.onClick();
      onClick && onClick();
    },
    icon: icon || img,
    children,
    ...extraProps,
    ...itemProps,
  };

  switch (type) {
    case ITEM_TYPE.STATEFUL_BUTTON:
      return itemProps;
    case ITEM_TYPE.FLYOUT:
      delete flyoutItem.items;
      flyoutItem.children = itemProps.items;
      break;
    case ITEM_TYPE.BUTTON:
      flyoutItem.className = 'FlyoutButton';
      break;
    case ITEM_TYPE.TOGGLE_BUTTON: {
      const togglesFlyout = selectors.getFlyoutMap(store.getState())[itemProps.toggleElement];

      if (togglesFlyout) {
        flyoutItem.children = togglesFlyout.items;
        break;
      }

      flyoutItem.onClick = () => {
        store.dispatch(actions.toggleElement(itemProps.toggleElement));
      };
      break;
    }
    case ITEM_TYPE.VIEW_CONTROLS: {
      const flyoutMap = selectors.getFlyoutMap(store.getState());
      const viewControlsItems = flyoutMap[DataElements.VIEW_CONTROLS_FLYOUT]?.items;
      flyoutItem.children = viewControlsItems;
      break;
    }
    case ITEM_TYPE.ZOOM: {
      const zoomOptionsList = selectors.getZoomList(store.getState());
      flyoutItem.className = 'ZoomFlyoutMenu';
      flyoutItem.icon = 'icon-magnifying-glass';
      flyoutItem.children = getZoomFlyoutItems({ zoomOptionsList, dispatch: store.dispatch, size: 1 });
      break;
    }
    case ITEM_TYPE.RIBBON_GROUP:
      flyoutItem.className = 'FlyoutRibbonGroup';
      flyoutItem.label = 'option.toolbarGroup.flyoutLabel';
      flyoutItem.children = items;
      break;
    case ITEM_TYPE.GROUPED_ITEMS:
    case ITEM_TYPE.MODULAR_HEADER:
      flyoutItem.className = 'FlyoutGroupedItems';
      flyoutItem.children = items.map((item) => itemToFlyout(item));
      break;
    case ITEM_TYPE.TOOL_BUTTON:
      flyoutItem.className = 'FlyoutToolButton';
      flyoutItem.toolName = toolName;
      flyoutItem.icon = img;
      flyoutItem.label = label;
      break;
    case ITEM_TYPE.PRESET_BUTTON: {
      let menuItem = menuItems[itemProps.buttonType];
      if (!menuItem) {
        menuItem = menuItems[itemProps.dataElement];
      }
      const dataElement = itemProps.dataElement || menuItem?.dataElement;
      const icon = itemProps.img || menuItem?.icon;
      const title = itemProps.title || menuItem?.title;
      flyoutItem.label = menuItem?.label;
      flyoutItem.dataElement = dataElement;
      flyoutItem.icon = icon;
      flyoutItem.title = title;
      flyoutItem.type = type;
      break;
    }
    case ITEM_TYPE.PAGE_CONTROLS: {
      const flyoutMap = selectors.getFlyoutMap(store.getState());
      const pageControlsItems = flyoutMap[DataElements.PAGE_CONTROLS_FLYOUT]?.items;
      flyoutItem.children = pageControlsItems;
      break;
    }
    case ITEM_TYPE.PAGE_NAVIGATION_BUTTON: {
      const state = store.getState();
      const activeDocumentViewerKey = state.viewer.activeDocumentViewerKey;
      const isDisabled = flyoutItem.dataElement === DataElements.PREVIOUS_PAGE_BUTTON ?
        core.getCurrentPage() === 1 :
        core.getCurrentPage() === state.document.totalPages[activeDocumentViewerKey];
      flyoutItem.disabled = isDisabled;
      break;
    }
    case ITEM_TYPE.FONT_SIZE_DROPDOWN:{
      flyoutItem.type = type;
      flyoutItem.className = 'FontSizeDropdown';
      break;
    }
    case ITEM_TYPE.FONT_FAMILY_DROPDOWN:{
      flyoutItem.type = type;
      flyoutItem.className = 'FontFamilyDropdown';
      break;
    }
    case ITEM_TYPE.STYLE_PRESET_DROPDOWN:{
      flyoutItem.type = type;
      flyoutItem.className = 'StylePresetDropdown';
      break;
    }
    case ITEM_TYPE.OFFICE_EDITOR_MODE_DROPDOWN:{
      flyoutItem.type = type;
      flyoutItem.className = 'OfficeEditorModeDropdown';
      break;
    }
  }

  return flyoutItem;
};

export const getFlyoutItemType = (flyoutItem) => {
  if (flyoutItem === FLYOUT_ITEM_TYPES.DIVIDER) {
    return FLYOUT_ITEM_TYPES.DIVIDER;
  } else if (typeof flyoutItem === 'string' && flyoutItem !== FLYOUT_ITEM_TYPES.DIVIDER) {
    return FLYOUT_ITEM_TYPES.LABEL;
  } else if (flyoutItem.toolName) {
    return FLYOUT_ITEM_TYPES.TOOL_BUTTON;
  } else if (flyoutItem.dataElement === FLYOUT_ITEM_TYPES.ZOOM_OPTIONS_BUTTON || flyoutItem.className === 'ZoomFlyoutMenu') {
    return FLYOUT_ITEM_TYPES.ZOOM_OPTIONS_BUTTON;
  } else if (flyoutItem.dataElement?.includes('zoom-button-')) {
    return FLYOUT_ITEM_TYPES.ZOOM_BUTTON;
  } else if (flyoutItem.dataElement?.includes('line-spacing-button-')) {
    return FLYOUT_ITEM_TYPES.LINE_SPACING_OPTIONS_BUTTON;
  } else if (flyoutItem.dataElement === FLYOUT_ITEM_TYPES.PAGE_NAVIGATION_INPUT) {
    return FLYOUT_ITEM_TYPES.PAGE_NAVIGATION_INPUT;
  } else if (flyoutItem.dataElement?.includes('office-editor-list-type-')) {
    return FLYOUT_ITEM_TYPES.LIST_TYPE_BUTTON;
  } else if (flyoutItem.tabPanel) {
    return FLYOUT_ITEM_TYPES.TAB_PANEL_ITEM;
  } else if (flyoutItem.toolbarGroup) {
    return FLYOUT_ITEM_TYPES.RIBBON_ITEM;
  } else if (flyoutItem.buttonType) {
    return FLYOUT_ITEM_TYPES.PRESET_BUTTON;
  } else {
    return FLYOUT_ITEM_TYPES.BUTTON;
  }
};

const dataElementToLabel = (dataElement) => {
  try {
    // Will split by CamelCase or symbols
    const regex = new RegExp('([^[\\p{L}\\d]+|(?<=[\\p{Ll}\\d])(?=\\p{Lu})|(?<=\\p{Lu})(?=\\p{Lu}[\\p{Ll}\\d])|(?<=[\\p{L}\\d])(?=\\p{Lu}[\\p{Ll}\\d]))', 'gu');
    return dataElement.replace(regex, ' ');
  } catch (e) {
    // In some browsers the regex above is not supported
    return dataElement;
  }
};

export const getIconDOMElement = (currentItem, allItems = [currentItem], disabled = false) => {
  const areAllitemsWithoutIcons = allItems.every((item) => !item.icon && !item.img && !item.toolName);
  const currentItemIconWithoutIcon = !currentItem.icon && !currentItem.img && !currentItem.toolName;
  if (currentItemIconWithoutIcon && areAllitemsWithoutIcons) {
    return null;
  }

  const iconElement = currentItem.icon ? currentItem.icon : currentItem.img;
  const isBase64 = iconElement?.trim().startsWith('data:');

  // if there is no file extension then assume that this is a glyph
  const isGlyph =
    iconElement && !isBase64 && (!iconElement.includes('.') || iconElement.startsWith('<svg'));

  if (isGlyph) {
    return <Icon className={classNames({ 'menu-icon': true, 'disabled': disabled })} glyph={iconElement} />;
  }
  if (iconElement && !isGlyph) {
    return <img className={classNames({ 'menu-icon': true, 'disabled': disabled })} alt="Flyout item icon" src={iconElement} />;
  }
  return <div className={classNames({ 'menu-icon': true, 'disabled': disabled })}></div>;
};

const cleanObject = (object) => {
  for (const key in object) {
    if (object[key] === undefined || object[key] === null) {
      delete object[key];
    }
  }
};
