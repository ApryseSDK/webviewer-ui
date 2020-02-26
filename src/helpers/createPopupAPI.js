/**
 * A class which contains popup APIs.<br/><br/>
 * <span style="color: red; font-size: 1.2em; font-weight: bold">⚠</span> If you want to remove an item in a popup, use {@link WebViewerInstance#disableElements disableElements}.
 * @interface WebViewerInstance.Popup
 */
import actions from 'actions';
import selectors from 'selectors';

export default (store, popupDataElement) => Object.create(PopupAPI).initialize(store, popupDataElement);

const PopupAPI = {
  initialize(store, popupDataElement) {
    this.store = store;
    this.popupDataElement = popupDataElement;
    return this;
  },
  /**
   * Add an array of items after the item that has the given data element.
   * @method WebViewerInstance.Popup#add
   * @param {Array.<object>} items Same as <a href='https://www.pdftron.com/documentation/web/guides/customizing-header#header-items' target='_blank'>header items</a>
   * @param {string} [dataElement] An optional string. If not given, items will be added in the beginning
   * @returns {this} The instance itself
   * @example
WebViewer(...)
  .then(function(instance) {
    instance.contextMenuPopup.add({
      type: 'actionButton',
      img: 'path/to/image',
      onClick: instance.downloadPdf,
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

    this.store.dispatch(actions.setPopupItems(this.popupDataElement, items));

    return this;
  },
  /**
   * Update all the items in the popup.
   * To update an individual item, use {@link WebViewerInstance#updateElement updateElement}
   * @method WebViewerInstance.Popup#update
   * @param {Array.<object>} [items] the items that will be rendered in the popup
   * @returns {this} The instance itself
   * @example
WebViewer(...)
  .then(function(instance) {
    // replace existing items with a new array of items
    instance.contextMenuPopup.update([
      {
        type: 'actionButton',
        img: 'path/to/image',
        onClick: instance.downloadPdf,
      },
      {
        type: 'actionButton',
        img: 'path/to/image',
        onClick: instance.print,
      },
    ]);
  });
   */
  update(items) {
    if (!items) {
      items = [];
    }
    this.store.dispatch(actions.setPopupItems(this.popupDataElement, items));

    return this;
  },
  /**
   * Return the array of items in the popup.
   * @method WebViewerInstance.Popup#getItems
   * @returns {Array.<object>} Current items in the popup.
   * @example
WebViewer(...)
  .then(function(instance) {
    instance.annotationPopup.getItems();
  });
   */
  getItems() {
    return [...selectors.getPopupItems(this.store.getState(), this.popupDataElement)];
  },
  _getIndexByDataElement(dataElement) {
    let index;

    if (typeof dataElement === 'undefined') {
      index = -1;
    } else {
      const state = this.store.getState();
      index = selectors
        .getPopupItems(state, this.popupDataElement)
        .findIndex(obj => obj.dataElement === dataElement);
    }

    return index;
  },
};