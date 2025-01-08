/**
 * Item options
 * @typedef {Object} ItemProperties
 * @memberof UI.Components
 * @property {string} [dataElement] The data element of the item.
 * @property {string} [title] The tooltip of the item.
 * @property {boolean} [disabled] Whether the item is disabled or not.
 * @property {string} [type] The type of the item.
 */
/**
 * An abstract class for creating WebViewer Modular UI items.
 * @name Item
 * @memberOf UI.Components
 * @class UI.Components.Item
 * @abstract
 * @param {ItemProperties} [properties] An object that contains the properties of the item.
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