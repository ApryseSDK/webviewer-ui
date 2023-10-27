import { ITEM_TYPE } from 'constants/customizationVariables';
import selectors from 'selectors';
import actions from 'actions';
import { getZoomFlyoutItems } from 'components/ModularComponents/ZoomControls/ZoomHelper';

let store;
export const setItemToFlyoutStore = (newStore) => {
  store = newStore;
};

export const itemToFlyout = (item, {
  onClick = undefined,
  children = undefined,
} = {}) => {
  const itemProps = item.props || item;

  if (!itemProps || !itemProps.type || !Object.values(ITEM_TYPE).includes(itemProps.type)) {
    return null;
  }

  if (itemProps.type === ITEM_TYPE.DIVIDER) {
    return 'divider';
  }

  const flyoutItem = {
    label: itemProps.label || itemProps.title || (itemProps.dataElement ? dataElementToLabel(itemProps.dataElement) : ''),
    onClick: () => {
      itemProps.onClick && itemProps.onClick();
      onClick && onClick();
    },
    dataElement: itemProps.dataElement,
    icon: itemProps.icon || itemProps.img,
    children,
  };

  if (itemProps.type === ITEM_TYPE.BUTTON) {
    flyoutItem.className = 'FlyoutCustomButton';
  } else if (itemProps.type === ITEM_TYPE.RIBBON_ITEM) {
    flyoutItem.className = 'FlyoutRibbonItem';
    flyoutItem.onClick = () => {
      const currentToolbarGroup = selectors.getCurrentToolbarGroup(store.getState());
      if (currentToolbarGroup !== itemProps.toolbarGroup) {
        store.dispatch(actions.setToolbarGroup(itemProps.toolbarGroup));
        const activeGroups = itemProps.groupedItems.map((item) => item?.dataElement);
        store.dispatch(actions.setCurrentGroupedItem(activeGroups));
      }
      onClick && onClick();
    };
  } else if (itemProps.type === ITEM_TYPE.TOGGLE_BUTTON) {
    flyoutItem.className = 'FlyoutToggleButton';
    flyoutItem.onClick = () => {
      store.dispatch(actions.toggleElement(itemProps.toggleElement));
      onClick && onClick();
    };
  } else if (itemProps.type === ITEM_TYPE.ZOOM) {
    const zoomOptionsList = selectors.getZoomList(store.getState());
    flyoutItem.className = 'ZoomFlyoutMenu';
    flyoutItem.icon = 'icon-magnifying-glass';
    flyoutItem.children = getZoomFlyoutItems(zoomOptionsList, store.dispatch, 1);
  } else if (itemProps.type === ITEM_TYPE.RIBBON_GROUP) {
    flyoutItem.className = 'FlyoutRibbonGroup';
    flyoutItem.label = 'Views';
    flyoutItem.children = itemProps.items;
  } else if (itemProps.type === ITEM_TYPE.GROUPED_ITEMS) {
    flyoutItem.className = 'FlyoutGroupedItems';
    flyoutItem.children = itemProps.items.map((item) => itemToFlyout(item));
  } else if (itemProps.type === ITEM_TYPE.TOOL_BUTTON) {
    flyoutItem.className = 'FlyoutToolButton';
    flyoutItem.toolName = itemProps.toolName;
    flyoutItem.icon = itemProps.img || undefined;
    flyoutItem.label = itemProps.label || undefined;
  }

  return flyoutItem;
};

const dataElementToLabel = (dataElement) => {
  // Will split by CamelCase or symbols
  const regex = /([^[\p{L}\d]+|(?<=[\p{Ll}\d])(?=\p{Lu})|(?<=\p{Lu})(?=\p{Lu}[\p{Ll}\d])|(?<=[\p{L}\d])(?=\p{Lu}[\p{Ll}\d]))/gu;
  return dataElement.replace(regex, ' ');
};