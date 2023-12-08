import { GroupedItems } from './groupedItems';
import { ITEM_TYPE } from 'constants/customizationVariables';
import actions from 'actions';

class RibbonGroup extends GroupedItems {
  constructor(props) {
    const { dataElement, items, headerDirection, } = props;
    super(props);
    this.dataElement = dataElement;
    this.type = ITEM_TYPE.RIBBON_GROUP;
    this.items = items;
    this.headerDirection = headerDirection;
  }
}

export default (store) => (props) => {
  const propsWithStore = { ...props, store };

  // Adding the custom ribbon group items to the redux store
  props.items.forEach((item) => {
    if (item.groupedItems?.length) {
      let ribbonGroupItems = [];
      item.groupedItems.forEach((groupedItem) => {
        ribbonGroupItems = ribbonGroupItems.concat(groupedItem.items);
      });
      store.dispatch(actions.setHeaderItems(item.toolbarGroup, ribbonGroupItems));
    }
  });

  return new RibbonGroup(propsWithStore);
};