import Item from './item';
import { ITEM_TYPE } from 'constants/customizationVariables';

/**
 * Creates a new instance of Label.
 * @name Label
 * @memberOf UI.Components
 * @class UI.Components.Label
 * @extends UI.Components.Item
 * @param {Object} properties An object that contains the properties of the Label Item.
 * @param {string} properties.dataElement The data element of the label item.
 * @param {string} properties.label The text to be shown as the label.
 * @param {string} [properties.title] The tooltip of the label item.
 * @param {Object} [properties.style] An object defining inline CSS styles for the label, where each key represents a CSS property and its corresponding value.
 * @param {string} [properties.className] String with CSS classes to be applied to the label, allowing additional styling and customization through external stylesheets.
 * @example
 const labelItem = new instance.UI.Components.Label({
 dataElement: 'label1',
 title: 'Testing Label',
 label: 'Label 1',
 });
 */
class Label extends Item {
  constructor(options) {
    const { checkTypes, TYPES } = window.Core;
    checkTypes([options], [TYPES.OBJECT({
      dataElement: TYPES.STRING,
      title: TYPES.OPTIONAL(TYPES.STRING),
      label: TYPES.STRING,
      style: TYPES.OPTIONAL(TYPES.OBJECT({})),
    })], 'Label Constructor');
    options.type = ITEM_TYPE.LABEL;
    options.disabled = options.disabled || false;
    super(options);
    this.label = options.label;
    this.style = options.style;
  }
}

export default (store) => (props) => {
  const propsWithStore = { ...props, store };
  return new Label(propsWithStore);
};