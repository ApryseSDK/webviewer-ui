import actions from 'actions';
import { ITEM_TYPE } from 'constants/customizationVariables';

export default (store) => (props) => {
  class GroupedItems {
    constructor(props) {
      const {
        label,
        dataElement,
        alignment,
        grow = 0,
        gap = 16,
        position,
        placement,
        items = []
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