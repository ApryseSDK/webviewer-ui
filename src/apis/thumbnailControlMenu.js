/**
 * An  instance of ThumbnailControlMenu that can be used to edit the items included in the thumbnail menu overlay
 * @name UI.thumbnailControlMenu
 * @implements {UI.ThumbnailControlMenu}
 * @type {UI.ThumbnailControlMenu}
 * @example
 WebViewer(...)
  .then(function (instance) {
    instance.UI.thumbnailControlMenu.someAPI();
  })
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
   * @typedef UI.ThumbnailControlMenu.MenuItem
   * @type {object}
   * @property {string} title Title to be displayed for the operation
   * @property {string} img path to image to be used as an icon for the operation
   * @property {function} onClick onClick handler, which takes as a parameter an array of selected page numbers
   * @property {string} dataElement Unique dataElement for this operation
   */

  /**
   * Adds an array of thumbnail menu buttons to the default menu. If passed a dataElement parameter, it will
   * add the new menu buttons after this element. Otherwise, they will be appended to the start of the existing list
   * of buttons.
   * @method UI.ThumbnailControlMenu#add
   * @param {Array.<UI.ThumbnailControlMenu.MenuItem>} MenuItem Array of buttons to be added, each with its individual operations. See example below.
   * @param {('thumbRotateClockwise' | 'thumbDelete' )} [dataElementToInsertAfter] An optional string that determines where in the overlay the new section will be added. If not included, the new page manipulation section will be added at the top.
   * You can call {@link UI.ThumbnailControlMenu#getItems getItems} to get existing items and their dataElements.
   * @returns {UI.ThumbnailControlMenu} The instance itself
   * @example
      WebViewer(...)
      .then(function (instance) {
        instance.UI.thumbnailControlMenu.add([
          {
            title: 'alertme',
            img: 'data:image/png;base64,...',
            onClick: (selectedPageNumbers) => {
              alert(`Selected thumbnail: ${selectedPageNumbers}`);
            },
            dataElement: 'alertMeDataElement',
          },
        ]);
      })
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
   * Update all the buttons in the ThumbnailControlMenu, essentially replacing them with
   * a new list of buttons.
   * To update an individual item, use {@link UI.updateElement updateElement}
   * @method UI.ThumbnailControlMenu#update
   * @param {Array.<UI.ThumbnailControlMenu.MenuItem>} MenuItem The list of MenuItems that will be rendered in the thumbnail menu overlay. See the add documentation for an example.
   * @returns {UI.ThumbnailControlMenu} The instance of itself
   * @example
      WebViewer(...)
      .then(function (instance) {
        instance.UI.thumbnailControlMenu.update([
          {
            title: 'alertme',
            img: 'data:image/png;base64,...',
            onClick: (selectedPageNumbers) => {
              alert(`Selected thumbnail: ${selectedPageNumbers}`);
            },
            dataElement: 'alertMeDataElement',
          },
        ]);
      })
  */
  update(operations) {
    if (!operations) {
      operations = [];
    }
    this.store.dispatch(actions.setThumbnailControlMenuItems(operations));

    return this;
  },

  /**
   * Return the array of items in the ThumbnailControlMenu.
   * @method UI.ThumbnailControlMenu#getItems
   * @returns {Array.<UI.ThumbnailControlMenu.MenuItem>} Current items in the ThumbnailControlMenu.
   * @example
    WebViewer(...)
      .then(function(instance) {
        instance.UI.ThumbnailControlMenu.getItems();
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