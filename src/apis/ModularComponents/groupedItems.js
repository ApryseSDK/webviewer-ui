import actions from 'actions';
import { ITEM_TYPE, DEFAULT_GAP } from 'constants/customizationVariables';

export default (store) => (props) => {
  class GroupedItems {
    constructor(props) {
      const {
        label,
        dataElement,
        alignment,
        grow = 0,
        gap = DEFAULT_GAP,
        position,
        placement,
        items = [],
        alwaysVisible = false
      } = props;
      this.label = label;
      this.dataElement = dataElement;
      this.placement = placement;
      this.alignment = alignment;
      this.grow = grow;
      this.gap = gap;
      this.position = position;
      this.items = items;
      this.type = ITEM_TYPE.GROUPED_ITEMS;
      this.alwaysVisible = alwaysVisible;
    }

    setGap = (gap) => {
      store.dispatch(actions.setGroupedItemsProperty('gap', gap, this.dataElement));
    };

    setAlignment = (alignment) => {
      store.dispatch(actions.setGroupedItemsProperty('alignment', alignment, this.dataElement));
    };

    setGrow = (grow) => {
      store.dispatch(actions.setGroupedItemsProperty('grow', grow, this.dataElement));
    };
  }

  return new GroupedItems(props);
};