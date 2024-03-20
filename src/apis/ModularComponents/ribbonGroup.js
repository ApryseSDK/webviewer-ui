import { GroupedItems } from './groupedItems';
import { ITEM_TYPE } from 'constants/customizationVariables';
import actions from 'actions';

/**
 * Creates a new instance of RibbonGroup.
 * @name RibbonGroup
 * @memberOf UI.Components
 * @extends UI.Components.GroupedItems
 * @class UI.Components.RibbonGroup
 * @constructor
 * @param {ContainerProperties} properties - An object that contains the properties of the ribbon group.
 * @param {Array<UI.Components.RibbonItem>} properties.items - The items in the ribbon group. Non-ribbon items will be ignored.
 * @param {'column' | 'row'} [properties.headerDirection] - A string describing the direction of the header in which the ribbon will be placed.
 * @param {'top' | 'bottom' | 'left' | 'right'} [properties.placement] - A string describing the placement of the header in which the ribbon will be placed.
 * @example
const ribbonGroup = new instance.UI.Components.RibbonGroup({
  dataElement: 'default-ribbon-group',
  grow: 2,
  justifyContent: 'start',
  title: 'Default Ribbon Group',
  type: 'ribbonGroup',
  items: [
  // these items would need to be defined in your code
    viewRibbonItem,
    annotateRibbonItem,
    shapesRibbomItem,
    insertRibbonItem,
    redactionRibbonItem,
    measureRibbonItem,
    editRibbonItem,
    contentEditRibbonItem,
    fillAndSignRibbonItem,
    formsRibbonItem,
  ]
});
 */
class RibbonGroup extends GroupedItems {
  constructor(props) {
    const { dataElement, items, headerDirection, headerPlacement } = props;
    super(props);
    this.dataElement = dataElement;
    this.type = ITEM_TYPE.RIBBON_GROUP;
    this.items = items;
    // change how the flex dropdown appears based on the direction and placement of the header
    this.headerDirection = headerDirection;
    this.headerPlacement = headerPlacement;
  }
}

export default (store) => (props) => {
  const propsWithStore = { ...props, store };

  // Adding the custom ribbon group items to the redux store
  props.items.forEach((item) => {
    if (item.groupedItems?.length) {
      store.dispatch(actions.setHeaderItems(item.toolbarGroup, item.groupedItems));
    }
  });

  return new RibbonGroup(propsWithStore);
};