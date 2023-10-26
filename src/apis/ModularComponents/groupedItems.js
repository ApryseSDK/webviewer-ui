import actions from 'actions';
import { ITEM_TYPE, DEFAULT_GAP } from 'constants/customizationVariables';

export class GroupedItems {
  constructor(props) {
    const {
      label,
      dataElement,
      justifyContent,
      grow = 0,
      gap = DEFAULT_GAP,
      position,
      placement,
      items = [],
      alwaysVisible = false,
      style = {},
    } = props;
    this.label = label;
    this.dataElement = dataElement;
    this.placement = placement;
    this.justifyContent = justifyContent;
    this.grow = grow;
    this.gap = gap;
    this.position = position;
    this.items = items;
    this.type = ITEM_TYPE.GROUPED_ITEMS;
    this.alwaysVisible = alwaysVisible;
    this.style = style;
    this.store = props.store;
  }

  setGap = (gap) => {
    this.store.dispatch(actions.setGroupedItemsProperty('gap', gap, this.dataElement));
  };

  setJustifyContent = (justifyContent) => {
    this.store.dispatch(actions.setGroupedItemsProperty('justifyContent', justifyContent, this.dataElement));
  };

  setGrow = (grow) => {
    this.store.dispatch(actions.setGroupedItemsProperty('grow', grow, this.dataElement));
  };

  setItems = (items) => {
    this.store.dispatch(actions.setGroupedItemsProperty('items', items, this.dataElement));
  };
}

export default (store) => (props) => {
  const propsWithStore = { ...props, store };
  return new GroupedItems(propsWithStore);
};