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
 * @name Flyout
 * @memberOf UI.Components
 * @class
 * @constructor
 * @param {Object} options
 * @param {string} options.dataElement A unique string that identifies the flyout.
 * @param {Array<Object>} options.items An array of objects that represent the items in the flyout. Each object should have the following properties:
 * @param {string} options.items.dataElement A unique string that identifies the flyout item.
 * @param {string} options.items.label The text title of the item.
 * @param {Function} options.items.onClick A function that is called when the item is clicked.
 * @param {string} options.items.icon Path to an image or base64 data. Can also be the filename of a .svg from the WebViewer icons folder found here:
 *   {@link https://github.com/PDFTron/webviewer-ui/tree/master/assets/icons/ assets/icons/} (i.e. `icon-save` to use `icon-save.svg`).
 * @param {Array<UI.Components.Flyout>} options.items.children An array of objects that represents the items in a sub-menu, has the same properties as the parent items property and can be infinitely nested.
 */

/**
 * Sets the items of the flyout.
 * @method UI.Components.Flyout#setItems
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