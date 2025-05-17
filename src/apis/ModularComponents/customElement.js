import Item from './item';
import { ITEM_TYPE } from 'constants/customizationVariables';

/**
 * Creates a new instance of a Custom Element.
 * @name CustomElement
 * @memberOf UI.Components
 * @class UI.Components.CustomElement
 * @extends UI.Components.Item
 * @param {Object} properties An object that contains the properties of the custom element.
 * @param {string} properties.dataElement The data element of the custom element.
 * @param {function} properties.render Function that returns the React element or HTML element to render. Cannot use React Hooks in the render. For more information see; https://docs.apryse.com/web/faq/react-hooks-error
 * @param {Array} [properties.renderArguments] Array of arguments to pass to the render function
 * @param {string} [properties.title] Text to show on hover of the item (Tooltip)
 * @param {object} [properties.style] An object defining inline CSS styles for the element, where each key represents a CSS property and its corresponding value.
 * @param {string} [properties.className] String with CSS classes to be applied to the element, allowing additional styling and customization through external stylesheets.
 * @example
 const customItem = new instance.UI.Components.CustomElement({
 dataElement: 'myCustomElement',
 render: () => document.createElement('div'),
 });
 */
class CustomElement extends Item {
  constructor(options) {
    const { checkTypes, TYPES } = window.Core;
    checkTypes([options], [TYPES.OBJECT({
      dataElement: TYPES.STRING,
      render: TYPES.FUNCTION,
      renderArguments: TYPES.OPTIONAL(TYPES.ARRAY(TYPES.ANY)),
      className: TYPES.OPTIONAL(TYPES.STRING),
      title: TYPES.OPTIONAL(TYPES.STRING),
    })], 'CustomElement Constructor');
    options.type = ITEM_TYPE.CUSTOM_ELEMENT;
    options.disabled = options.disabled || false;
    super(options);
    this.render = options.render;
    this.renderArguments = options.renderArguments;
    this.className = options.className;
  }
}

export default (store) => (props) => {
  const propsWithStore = { ...props, store };
  return new CustomElement(propsWithStore);
};