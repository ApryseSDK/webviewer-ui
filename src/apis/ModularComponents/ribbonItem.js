import { ITEM_TYPE } from 'src/constants/customizationVariables';
import Item from './item';

class RibbonItem extends Item {
  constructor(props) {
    const { isActive, label, img, toolbarGroup, groupedItems } = props;
    super(props);
    this.type = ITEM_TYPE.RIBBON_ITEM;
    this.isActive = isActive;
    this.label = label;
    this.img = img;
    this.toolbarGroup = toolbarGroup;
    this.type = ITEM_TYPE.RIBBON_ITEM;

    this.groupedItems = [];
    if (Array.isArray(groupedItems)) {
      groupedItems.forEach((group) => {
        this.groupedItems.push(group);
      });
    } else {
      this.groupedItems.push(groupedItems);
    }
  }
}

export default RibbonItem;