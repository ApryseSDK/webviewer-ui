/**
 * @typedef {Object} ItemProperties
 * @property {string} dataElement The data element of the item.
 * @property {string} title The title of the item which appears in a tooltip.
 * @property {boolean} disabled Whether the item is disabled or not.
 * @property {string} type The type of the item.
 */

/**
 * An abstract class for creating WebViewer Modular UI items.
 * @name Item
 * @class UI.Components.Item
 * @abstract
 * @param {ItemProperties} options An object that contains the properties of the item.
 */

class Item {
  constructor(options) {
    if (this.constructor === Item) {
      throw new Error('Abstract class "Item" cannot be instantiated directly.');
    }
    const { dataElement, title, disabled, type } = options;
    this.dataElement = dataElement;
    this.title = title;
    this.disabled = disabled;
    this.type = type;
  }
}

export default Item;