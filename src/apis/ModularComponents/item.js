import actions from 'actions';

/**
 * Item options
 * @typedef {Object} UI.Components.ItemProperties
 * @memberof UI.Components
 * @property {string} [dataElement] The data element of the item.
 * @property {string} [title] The tooltip of the item.
 * @property {boolean} [disabled] Whether the item is disabled or not.
 * @property {string} [type] The type of the item.
 * @property {Object} [style] An object defining inline CSS styles for the item, where each key represents a CSS property and its corresponding value.
 * @property {string} [className] String with CSS classes to be applied to the item, allowing additional styling and customization through external stylesheets.
 */
/**
 * An abstract class for creating WebViewer Modular UI items.
 * @name Item
 * @memberOf UI.Components
 * @class UI.Components.Item
 * @abstract
 * @param {UI.Components.ItemProperties} [properties] An object that contains the properties of the item.
*/
class Item {
  constructor(props = {}) {
    if (this.constructor === Item) {
      throw new Error('Abstract class "Item" cannot be instantiated directly.');
    }
    const { dataElement, title, disabled, type, style, className, store } = props;
    this.dataElement = dataElement;
    this.title = title;
    this.disabled = disabled;
    this.type = type;
    this.style = style;
    this.className = className;
    this.store = store;
  }

  /**
   * Sets the style of the Item (padding, border, background, etc.)
   * @method UI.Components.Item#setStyle
   * @param {Object} style An object that can change the CSS style of the Item component.
   */
  setStyle(userDefinedStyle) {
    this.style = userDefinedStyle;
    this.store.dispatch(actions.setModularComponentProperty('style', userDefinedStyle, this.dataElement));
  }
}

export default Item;
