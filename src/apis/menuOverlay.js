/**
 * An instance of MenuOverlay that can be used to add, update, or retrieve items in the settings menu overlay component
 * @name UI.settingsMenuOverlay
 * @type {UI.MenuOverlay}
 * @example
WebViewer(...)
  .then(function (instance) {
    // Add a custom button to the settings menu
    instance.UI.settingsMenuOverlay.add({
      type: 'actionButton',
      className: 'row',
      img: 'icon-header-print-line',
      onClick: () => console.log('Custom action'),
      dataElement: 'customButton',
      label: 'Custom Action'
    });
  });
 */


/**
 * A class which contains MenuOverlay APIs.<br/><br/>
 * <span style="color: red; font-size: 1.2em; font-weight: bold">⚠</span> If you want to remove an item in a MenuOverlay, use {@link UI.disableElements disableElements}.
 * @interface UI.MenuOverlay
 */
import actions from 'actions';
import selectors from 'selectors';

export default (store) => Object.create(MenuOverlayAPI).initialize(store);

const MenuOverlayAPI = {
  initialize(store) {
    this.store = store;
    return this;
  },
  /**
   * Adds action buttons to the menu overlay after a specified item
   * @method UI.MenuOverlay#add
   * @memberof UI.MenuOverlay
   * @param {Array.<object>|object} items One or more action button objects. See the <a href='https://docs.apryse.com/documentation/web/guides/customizing-header/#actionbutton' target='_blank'>ActionButton documentation</a> for the object structure.
   * @param {string} [dataElement] The data element of the item to insert after. If not provided, items will be added at the beginning.
   * @returns {UI.MenuOverlay} The MenuOverlay instance for chaining
   * @example
WebViewer(...)
  .then(function(instance) {
    instance.UI.settingsMenuOverlay.add({
      type: 'actionButton',
      className: 'row',
      img: 'icon-header-print-line',
      onClick: () => {
        console.log('Print button clicked');
      },
      dataElement: 'printButton',
      label: 'Print'
    });
  });
   */
  add(buttons, dataElement) {
    if (!Array.isArray(buttons)) {
      buttons = [buttons];
    }

    const index = this._getIndexByDataElement(dataElement);
    const items = this.getItems();

    items.splice(index + 1, 0, ...buttons);

    this.store.dispatch(actions.setMenuOverlayItems(items));

    return this;
  },
  /**
   * Replaces all items in the menu overlay with a new set of items.
   * To update an individual item, use {@link UI.updateElement}.
   * @method UI.MenuOverlay#update
   * @memberof UI.MenuOverlay
   * @param {Array.<object>} [items=[]] The new array of items to render in the menu overlay. See the <a href='https://docs.apryse.com/documentation/web/guides/customizing-header/#actionbutton' target='_blank'>ActionButton documentation</a> for the object structure. If not provided, the menu will be cleared.
   * @returns {UI.MenuOverlay} The MenuOverlay instance for chaining
   * @see UI.updateElement
   * @example
WebViewer(...)
  .then(function(instance) {
    // Replace all existing items with a new array of items
    instance.UI.settingsMenuOverlay.update([
      {
        type: 'actionButton',
        className: 'row',
        img: 'icon-header-print-line',
        onClick: () => {
          console.log('Print action');
        },
        dataElement: 'printButton',
        label: 'Print',
        role: 'option'
      },
      {
        type: 'actionButton',
        className: 'row',
        img: 'icon-header-download',
        onClick: () => {
          console.log('Download action');
        },
        dataElement: 'downloadButton',
        label: 'Download',
        role: 'option'
      },
    ]);
  });
   */
  update(items) {
    if (!items) {
      items = [];
    }
    this.store.dispatch(actions.setMenuOverlayItems(items));

    return this;
  },
  /**
   * Returns the current array of items in the menu overlay
   * @method UI.MenuOverlay#getItems
   * @memberof UI.MenuOverlay
   * @returns {Array.<object>} The current items in the menu overlay
   * @example
WebViewer(...)
  .then(function(instance) {
    const items = instance.UI.settingsMenuOverlay.getItems();
    console.log('Current menu items:', items);
  });
   */
  getItems() {
    return [...selectors.getMenuOverlayItems(this.store.getState())];
  },
  _getIndexByDataElement(dataElement) {
    let index;

    if (typeof dataElement === 'undefined') {
      index = -1;
    } else {
      const state = this.store.getState();
      index = selectors.getMenuOverlayItems(state).findIndex((obj) => obj.dataElement === dataElement);
    }

    return index;
  },
};
