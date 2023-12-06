import actions from 'actions';
import { ITEM_TYPE, DEFAULT_GAP } from 'constants/customizationVariables';
import { isGapValid, isGrowValid, isJustifyContentValid } from 'components/ModularComponents/Helpers/validation-helper';

const { checkTypes, TYPES } = window.Core;

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
    if (isGapValid(gap)) {
      this.gap = gap;
      this.store.dispatch(actions.setGroupedItemsProperty('gap', gap, this.dataElement));
    }
  };

  setJustifyContent = (justifyContent) => {
    if (isJustifyContentValid(justifyContent)) {
      this.justifyContent = justifyContent;
      this.store.dispatch(actions.setGroupedItemsProperty('justifyContent', justifyContent, this.dataElement));
    }
  };

  setGrow = (grow) => {
    if (isGrowValid(grow)) {
      this.grow = grow;
      this.store.dispatch(actions.setGroupedItemsProperty('grow', grow, this.dataElement));
    }
  };

  setItems = (items) => {
    checkTypes([items], [TYPES.ARRAY(TYPES.ANY)], 'GroupedItems.setItems');
    this.items = items;
    this.store.dispatch(actions.setGroupedItemsProperty('items', items, this.dataElement));
  };
}

export default (store) => (props) => {
  const propsWithStore = { ...props, store };
  return new GroupedItems(propsWithStore);
};