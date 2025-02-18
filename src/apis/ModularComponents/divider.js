import Item from './item';
import { ITEM_TYPE } from 'constants/customizationVariables';

/**
 * Creates a new instance of Divider.
 * @name Divider
 * @memberOf UI.Components
 * @class UI.Components.Divider
 * @extends UI.Components.Item
 * @param {Object} properties An object that contains the properties of the Divider Item.
 * @param {string} properties.dataElement The data element of the divider item.
 * @param {Object} [properties.style] An object defining inline CSS styles for the divider, where each key represents a CSS property and its corresponding value.
 * @param {string} [properties.className] String with CSS classes to be applied to the divider, allowing additional styling and customization through external stylesheets.
 * @example
 const dividerItem = new instance.UI.Components.Divider({
  dataElement: 'divider1',
  className: 'custom-divider',
  style: {
    backgroundColor: 'red',
  },
 });
 */
class Divider extends Item {
  constructor(options) {
    const { checkTypes, TYPES } = window.Core;
    checkTypes([options], [TYPES.OBJECT({
      dataElement: TYPES.STRING,
      className: TYPES.OPTIONAL(TYPES.STRING),
      style: TYPES.OPTIONAL(TYPES.OBJECT({})),
    })], 'Divider Constructor');
    options.type = ITEM_TYPE.DIVIDER;
    options.disabled = options.disabled || false;
    super(options);
    this.divider = options.divider;
    this.style = options.style;
  }
}

export default (store) => (props) => {
  const propsWithStore = { ...props, store };
  return new Divider(propsWithStore);
};