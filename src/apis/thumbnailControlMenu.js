/**
 * An instance of ThumbnailControlMenu that can be used to add, update, or retrieve menu items in the thumbnail control menu overlay
 * @name UI.thumbnailControlMenu
 * @type {UI.ThumbnailControlMenu}
 * @example
WebViewer(...)
  .then(function (instance) {
    // Add a custom menu item to the thumbnail control menu
    instance.UI.thumbnailControlMenu.add([{
      title: 'Alert me',
      img: 'data:image/png;base64,...',
      onClick: (selectedPageNumbers) => {
        console.log('Selected thumbnails:', selectedPageNumbers);
      },
      dataElement: 'alertMeDataElement',
    }]);
  });
 */
/**
 * A class which contains ThumbnailControlMenu APIs. <br/><br/>
 * <span style="color: red; font-size: 1.2em; font-weight: bold">⚠</span> If you want to remove an item in the ThumbnailControlMenu, use {@link UI.disableElements disableElements}.
 * @interface UI.ThumbnailControlMenu
 */
import actions from 'actions';
import selectors from 'selectors';

export default (store) => Object.create(ThumbnailControlMenuAPI).initialize(store);

const ThumbnailControlMenuAPI = {
  initialize(store) {
    this.store = store;
    return this;
  },

  /**
   * @typedef {Object} UI.ThumbnailControlMenu.MenuItem
   * @property {string} title Title to be displayed for the menu item
   * @property {string} img Path to the image to be used as an icon for the menu item
   * @property {function(Array.<number>): void} onClick Click handler function that receives an array of selected page numbers as a parameter
   * @property {string} dataElement Unique data element identifier for this menu item
   */

  /**
   * Adds menu items to the thumbnail control menu. If a dataElement parameter is provided, the new items will be added after that element. Otherwise, they will be added at the beginning.
   * @method UI.ThumbnailControlMenu#add
   * @memberof UI.ThumbnailControlMenu
   * @param {Array.<UI.ThumbnailControlMenu.MenuItem>} menuItems Array of menu items to be added
   * @param {string} [dataElementToInsertAfter] The data element of the item to insert after. Can be 'thumbRotateClockwise', 'thumbDelete', or a custom data element. If not provided, items will be added at the beginning. Call {@link UI.ThumbnailControlMenu#getItems getItems} to see existing items and their data elements.
   * @returns {UI.ThumbnailControlMenu} The ThumbnailControlMenu instance for chaining
   * @example
WebViewer(...)
  .then(function (instance) {
    instance.UI.thumbnailControlMenu.add([
      {
        title: 'Alert me',
        img: 'data:image/png;base64,...',
        onClick: (selectedPageNumbers) => {
          alert(`Selected thumbnails: ${selectedPageNumbers}`);
        },
        dataElement: 'alertMeDataElement',
      },
    ]);
  });
   */
  add(operations, dataElementToInsertAfter) {
    if (!operations || operations.length === 0) {
      return;
    }

    if (!Array.isArray(operations)) {
      operations = [operations];
    }

    const index = this._getIndexByDataElement(dataElementToInsertAfter);
    const items = this.getItems();

    items.splice(index + 1, 0, ...operations);
    this.store.dispatch(actions.setThumbnailControlMenuItems(items));

    return this;
  },

  /**
   * Replaces all items in the ThumbnailControlMenu with a new list of menu items.
   * To update an individual item, use {@link UI.updateElement}.
   * @method UI.ThumbnailControlMenu#update
   * @memberof UI.ThumbnailControlMenu
   * @param {Array.<UI.ThumbnailControlMenu.MenuItem>} menuItems The list of menu items that will be rendered in the thumbnail control menu. If not provided, the menu will be cleared.
   * @returns {UI.ThumbnailControlMenu} The ThumbnailControlMenu instance for chaining
   * @see UI.updateElement
   * @example
WebViewer(...)
  .then(function (instance) {
    instance.UI.thumbnailControlMenu.update([
      {
        title: 'Alert me',
        img: 'data:image/png;base64,...',
        onClick: (selectedPageNumbers) => {
          console.log('Selected thumbnails:', selectedPageNumbers);
        },
        dataElement: 'alertMeDataElement',
      },
    ]);
  });
  */
  update(operations) {
    if (!operations) {
      operations = [];
    }
    this.store.dispatch(actions.setThumbnailControlMenuItems(operations));

    return this;
  },

  /**
   * Returns the current array of items in the ThumbnailControlMenu
   * @method UI.ThumbnailControlMenu#getItems
   * @memberof UI.ThumbnailControlMenu
   * @returns {Array.<UI.ThumbnailControlMenu.MenuItem>} The current menu items in the thumbnail control menu
   * @example
WebViewer(...)
  .then(function(instance) {
    const items = instance.UI.thumbnailControlMenu.getItems();
    console.log('Current thumbnail control menu items:', items);
  });
   */
  getItems() {
    return [...selectors.getThumbnailControlMenuItems(this.store.getState())];
  },

  _getIndexByDataElement(dataElement) {
    let index;

    if (typeof dataElement === 'undefined') {
      index = -1;
    } else {
      const state = this.store.getState();
      index = selectors.getThumbnailControlMenuItems(state).findIndex((obj) => obj.dataElement === dataElement);
    }

    return index;
  },
};