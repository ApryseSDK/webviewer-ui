/**
 * An instance of MenuOverlay that can be used to edit items in the settings menu overlay component.
 * @name UI.settingsMenuOverlay
 * @implements {UI.MenuOverlay}
 * @type {UI.MenuOverlay}
 * @example
WebViewer(...)
  .then(function (instance) {
    instance.UI.settingsMenuOverlay.someAPI();
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
   * Add an array of Actions Buttons after the item that has the given data element.
   * @method UI.MenuOverlay#add
   * @param {Array.<object>} items Same as <a href='https://www.pdftron.com/documentation/web/guides/customizing-header#actionbutton' target='_blank'>ActionButton</a>
   * @param {string} [dataElement] An optional string. If not given, items will be added in the beginning
   * @returns {this} The instance itself
   * @example
WebViewer(...)
  .then(function(instance) {
    instance.UI.settingsMenuOverlay.add({
      type: 'actionButton',
      className:"row",
      img: 'icon-header-print-line',
      onClick: () => {
        alert('Printing...');
      },
      dataElement: 'alertButton',
      label:'print button'
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
   * Update all the items in the menuOverlay dropdown.
   * To update an individual item, use {@link UI.updateElement updateElement}
   * @method UI.MenuOverlay#update
   * @param {Array.<object>} [items] the items that will be rendered in the menuOverlay dropdown
   * @returns {this} The instance itself
   * @example
WebViewer(...)
  .then(function(instance) {
    // replace existing items with a new array of items
    instance.UI.settingsMenuOverlay.update([
      {
        type: 'actionButton',
        className:"row",
        img: 'icon-header-print-line',
        onClick: () => {
          alert('Hello world!');
        },
        dataElement: 'alertButton',
        label:'test button',
        role:"option"
      },
      {
        type: 'actionButton',
        className:"row",
        img: 'icon-header-print-line',
        onClick: () => {
          alert('Hello world!');
        },
        dataElement: 'alertButton2',
        label:'test button 2',
        role:"option"
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
   * Return the array of items in the menuOverlay dropdown.
   * @method UI.MenuOverlay#getItems
   * @returns {Array.<object>} Current items in the menuOverlay dropdown.
   * @example
WebViewer(...)
  .then(function(instance) {
    instance.UI.settingsMenuOverlay.getItems();
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
