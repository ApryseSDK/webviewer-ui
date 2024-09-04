import { FLYOUT_ITEM_TYPES, ITEM_TYPE } from 'constants/customizationVariables';
import selectors from 'selectors';
import actions from 'actions';
import { getZoomFlyoutItems } from 'components/ModularComponents/ZoomControls/ZoomHelper';
import { menuItems } from 'components/ModularComponents/Helpers/menuItems';

let store;
export const setItemToFlyoutStore = (newStore) => {
  store = newStore;
};

export const itemToFlyout = (item, {
  onClick = undefined,
  children = undefined,
  useOverrideClickOnly = false,
  extraProps = {},
} = {}) => {
  const itemProps = item.props || item;
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
  if (!itemProps || !type || !Object.values(ITEM_TYPE).includes(type) || isDisabledItem) {
    return null;
  }

  if (type === ITEM_TYPE.DIVIDER) {
    return 'divider';
  }

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
    case ITEM_TYPE.BUTTON:
      flyoutItem.className = 'FlyoutButton';
      break;
    case ITEM_TYPE.TOGGLE_BUTTON:
      flyoutItem.onClick = () => {
        store.dispatch(actions.toggleElement(itemProps.toggleElement));
        onClick && onClick();
      };
      break;
    case ITEM_TYPE.ZOOM: {
      const zoomOptionsList = selectors.getZoomList(store.getState());
      flyoutItem.className = 'ZoomFlyoutMenu';
      flyoutItem.icon = 'icon-magnifying-glass';
      flyoutItem.children = getZoomFlyoutItems(zoomOptionsList, store.dispatch, 1);
      break;
    }
    case ITEM_TYPE.RIBBON_GROUP:
      flyoutItem.className = 'FlyoutRibbonGroup';
      flyoutItem.label = 'Views';
      flyoutItem.children = items;
      break;
    case ITEM_TYPE.GROUPED_ITEMS:
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
      const { label, dataElement, icon } = menuItems[itemProps.buttonType || itemProps.dataElement];
      flyoutItem.label = label;
      flyoutItem.dataElement = dataElement;
      flyoutItem.icon = icon;
      flyoutItem.type = type;
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
  } else if (flyoutItem.dataElement === FLYOUT_ITEM_TYPES.PAGE_NAVIGATION_BUTTON) {
    return FLYOUT_ITEM_TYPES.PAGE_NAVIGATION_BUTTON;
  } else if (flyoutItem.tabPanel) {
    return FLYOUT_ITEM_TYPES.TAB_PANEL_ITEM;
  } else if (flyoutItem.toolbarGroup) {
    return FLYOUT_ITEM_TYPES.RIBBON_ITEM;
  } else if (flyoutItem.buttonType || flyoutItem.type === ITEM_TYPE.PRESET_BUTTON) {
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
