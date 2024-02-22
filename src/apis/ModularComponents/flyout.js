import { ITEM_TYPE } from 'constants/customizationVariables';
import selectors from 'selectors';
import actions from 'actions';

const { checkTypes, TYPES } = window.Core;
const flyoutItemBase = {
  label: TYPES.STRING,
  onClick: TYPES.FUNCTION,
  icon: TYPES.OPTIONAL(TYPES.STRING),
};
flyoutItemBase.children = TYPES.OPTIONAL(TYPES.ARRAY(
  TYPES.MULTI_TYPE(
    TYPES.OBJECT(flyoutItemBase),
    TYPES.STRING // For dividers
  )
));
const flyoutItemType = TYPES.MULTI_TYPE(
  TYPES.OBJECT(flyoutItemBase),
  TYPES.STRING // For dividers
);
/**
 * @name Flyout
 * @memberOf UI.Components
 * @class
 * @constructor
 * @param {Object} options
 * @param {string} options.dataElement A unique string that identifies the flyout.
 * @param {Array<Object>} options.items An array of objects that represent the items in the flyout. Each object should have the following properties:
 * @param {string} options.items.label The text title of the item.
 * @param {Function} options.items.onClick A function that is called when the item is clicked.
 * @param {string} options.items.icon Path to an image or base64 data. Can also be the filename of a .svg from the WebViewer icons folder found here:
 *   {@link https://github.com/PDFTron/webviewer-ui/tree/master/assets/icons/ assets/icons/} (i.e. `icon-save` to use `icon-save.svg`).
 * @param {Array<UI.Components.Flyout>} options.items.children An array of objects that represents the items in a sub-menu, has the same properties as the parent items property and can be infinitely nested.
 */

/**
 * Adds items to the flyout.
 * @method UI.Components.Flyout#addItems
 * @param {Array<Object>} items An array of objects that represent the items to be added to the flyout.
 * @param {string} items.label The text title of the item.
 * @param {Function} items.onClick A function that is called when the item is clicked.
 * @param {string} items.icon Path to an image or base64 data. Can also be the filename of a .svg from the WebViewer icons folder found here:
 *  {@link https://github.com/PDFTron/webviewer-ui/tree/master/assets/icons/ assets/icons/} (i.e. `icon-save` to use `icon-save.svg`).
 *  @param {Array<UI.Components.Flyout>} items.children An array of objects that represents the items in a sub-menu, has the same properties as the parent items property and can be infinitely nested.
 *  @example
 *  const flyout = new UI.Components.Flyout({
 *    dataElement: 'exampleFlyout',
 *    label: 'Flyout',
 *  });
 *  flyout.addItems([
 *    {
 *      label: 'Item 1',
 *      onClick: () => {
 *        console.log('Item 1 clicked');
 *      },
 *    },
 *  ]);
 */

/**
 * Removes items from the flyout.
 * @method UI.Components.Flyout#removeItems
 * @param {Array<string>} items An array of items to be removed from the flyout.
 */

/**
 * A unique string that identifies the flyout. This property is ReadOnly.
 * @member {string} UI.Components.Flyout#dataElement
 */

/**
 * An array of objects that represent the items in the flyout. can be set to add or remove items from the flyout.
 * @member {Array<Object>} UI.Components.Flyout#items
 */


export class Flyout {
  properties;

  constructor(options) {
    checkTypes([options], [TYPES.OBJECT({
      dataElement: TYPES.STRING,
      items: TYPES.ARRAY(flyoutItemType),
    })], 'Flyout Constructor');
    const { dataElement } = options;
    this.properties = options;
    this.dataElement = dataElement;
    this.type = ITEM_TYPE.FLYOUT;
    this.store = options.store;
  }

  addItems(itemList) {
    checkTypes([itemList], [TYPES.ARRAY(flyoutItemType)], 'Flyout.addItem');
    const flyoutMap = selectors.getFlyoutMap(this.store.getState());
    if (flyoutMap[this.properties.dataElement]) {
      flyoutMap[this.properties.dataElement].items.push(...itemList);
      this.updateStore();
      return;
    }
    this.properties.items.push(...itemList);
  }

  removeItems(itemList) {
    const flyoutMap = selectors.getFlyoutMap(this.store.getState());
    const currentFlyout = flyoutMap[this.properties.dataElement];
    if (currentFlyout) {
      currentFlyout.items = currentFlyout.items.filter((item) => !itemList.includes(item.dataElement));
      this.updateStore();
    }
  }

  get items() {
    const flyoutMap = selectors.getFlyoutMap(this.store.getState());
    if (flyoutMap[this.properties.dataElement]) {
      return flyoutMap[this.properties.dataElement].items;
    }
    return this.properties.items;
  }

  set items(newItems) {
    checkTypes([newItems], [TYPES.ARRAY(flyoutItemType)], 'Flyout.initializeFlyoutItem');
    const flyoutMap = selectors.getFlyoutMap(this.store.getState());
    if (flyoutMap[this.properties.dataElement]) {
      flyoutMap[this.properties.dataElement].items = newItems;
      this.updateStore();
    }
    this.properties.items = newItems;
  }

  updateStore() {
    const flyoutMap = selectors.getFlyoutMap(this.store.getState());
    this.store.dispatch(actions.updateFlyout(this.properties.dataElement, flyoutMap[this.properties.dataElement]));
  }
}

export default (store) => (props) => {
  const propsWithStore = { ...props, store };
  return new Flyout(propsWithStore);
};