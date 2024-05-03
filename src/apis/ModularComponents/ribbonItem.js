import { ITEM_TYPE } from 'src/constants/customizationVariables';
import Item from './item';

/**
 * Creates a new instance of RibbonItem.
 * @name RibbonItem
 * @memberOf UI.Components
 * @class UI.Components.RibbonItem
 * @extends UI.Components.Item
 * @property {ItemProperties} properties An object that contains the properties of the RibbonItem.
 * @property {string} [properties.label] The label of the item.
 * @property {string} [properties.img] The icon of the item.
 * @property {string} [properties.toolbarGroup] The group that the item belongs to.
 * @property {boolean} [properties.isActive] Whether the item is active or not.
 * @property {Array<UI.Components.Item>} [properties.groupedItems] Grouped Items to be contained by the RibbonItem.
 * @example
const ribbonItem = new instance.UI.Components.RibbonItem({
  dataElement: 'toolbarGroup-Annotate',
  title: 'Annotate',
  type: 'ribbonItem',
  label: 'Annotate',
  groupedItems: [
    'annotateGroupedItems'
  ],
  toolbarGroup: 'toolbarGroup-Annotate'
});
 */
class RibbonItem extends Item {
  constructor(props) {
    const { isActive, label, img, toolbarGroup, groupedItems, direction } = props;
    super(props);
    this.type = ITEM_TYPE.RIBBON_ITEM;
    this.isActive = isActive;
    this.label = label;
    this.img = img;
    this.toolbarGroup = toolbarGroup;
    this.type = ITEM_TYPE.RIBBON_ITEM;
    this.direction = direction;

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