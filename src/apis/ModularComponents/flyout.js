import { ITEM_TYPE } from 'constants/customizationVariables';
import actions from 'actions';

const { checkTypes, TYPES } = window.Core;
export const flyoutItemBase = {
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
export const flyoutItemType = TYPES.MULTI_TYPE(
  TYPES.OBJECT({ type: TYPES.ONE_OF(Object.values(ITEM_TYPE)) }),
  TYPES.OBJECT(flyoutItemBase),
  TYPES.STRING // For dividers
);

/**
 * Represents an item in a flyout with optional submenu.
 * @typedef {Object} FlyoutItem
 * @property {string} [dataElement] - A unique string that identifies the flyout item.
 * @property {string} [label] - The label of the flyout item.
 * @property {Function} [onClick] - A function that is called when the item is clicked.
 * @property {string} [icon] -  Path to an image or base64 data. Can also be the filename of a .svg from the WebViewer icons folder found here:
 *   {@link https://github.com/PDFTron/webviewer-ui/tree/master/assets/icons/ assets/icons/} (i.e. `icon-save` to use `icon-save.svg`).
 * @property {Array<FlyoutItem>} [children] - An array of objects that represents the items in a sub-menu, has the same properties as the parent items property and can be infinitely nested.
 */

/**
 * @name Flyout
 * @memberOf UI.Components
 * @class UI.Components.Flyout
 * @constructor
 * @param {Object} options - An object that contains the properties of the flyout.
 * @param {string} options.dataElement - A unique string that identifies the flyout.
 * @param {Array<FlyoutItem>} options.items - An array of objects that represent the items in the flyout.
*/

/**
 * Sets the items of the flyout.
 * @method UI.Components.Flyout#setItems
 * @param {Array<FlyoutItem>} items An array of objects that represent the items to be added to the flyout.
 * @example
 *  const flyout = new UI.Components.Flyout({
 *    dataElement: 'exampleFlyout',
 *    label: 'Flyout',
 *  });
 *  flyout.setItems([
 *    {
 *      label: 'Item 1',
 *      onClick: () => {
 *        console.log('Item 1 clicked');
 *      },
 *    },
 *  ]);
 */

/**
 * A unique string that identifies the flyout. This property is ReadOnly.
 * @member {string} UI.Components.Flyout#dataElement
 */

/**
 * An array of objects that represent the items in the flyout. This property can be used both as a getter and setter.
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
    options.store = undefined;
  }

  setItems(items) {
    checkTypes([items], [TYPES.ARRAY(flyoutItemType)], 'Flyout.setItems');
    this.properties.items = items;
    this.store.dispatch(actions.setFlyoutItems(this.properties.dataElement, items));
  }

  get items() {
    return this.properties.items;
  }

  set items(newItems) {
    this.setItems(newItems);
  }
}

export default (store) => (props) => {
  const propsWithStore = { ...props, store };
  return new Flyout(propsWithStore);
};