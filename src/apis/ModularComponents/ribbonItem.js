import { ITEM_TYPE } from 'src/constants/customizationVariables';
import Item from './item';

/**
 * Creates a new instance of RibbonItem.
 * @name RibbonItem
 * @memberOf UI.Components
 * @class UI.Components.RibbonItem
 * @extends UI.Components.Item
 * @param {Object} properties An object that contains the properties of the Ribbon Item.
 * @param {string} [properties.dataElement] The data element of the ribbon item.
 * @param {string} [properties.title] The tooltip of the ribbon item.
 * @param {boolean} [properties.disabled] Whether the item is disabled or not.
 * @param {string} [properties.label] The label of the item.
 * @param {string} [properties.img] The icon of the item.
 * @param {string} [properties.toolbarGroup] The group that the item belongs to.
 * @param {object} [properties.style] An object defining inline CSS styles for the ribbon, where each key represents a CSS property and its corresponding value.
 * @param {string} [properties.className] String with CSS classes to be applied to the ribbon, allowing additional styling and customization through external stylesheets.
 * @param {Array<UI.Components.Item>} [properties.groupedItems] Grouped Items to be contained by the RibbonItem.
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
    const { label, img, toolbarGroup, groupedItems, direction } = props;
    super(props);
    this.type = ITEM_TYPE.RIBBON_ITEM;
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

export default (store) => (props) => {
  const propsWithStore = { ...props, store };
  return new RibbonItem(propsWithStore);
};