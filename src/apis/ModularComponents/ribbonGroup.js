import { GroupedItems } from './groupedItems';
import { ITEM_TYPE } from 'constants/customizationVariables';

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
  return new RibbonGroup(propsWithStore);
};