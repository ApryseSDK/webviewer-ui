/**
 * A class which contains popup APIs.<br/><br/>
 * <span style="color: red; font-size: 1.2em; font-weight: bold">⚠</span> If you want to remove an item in a popup, use {@link WebViewer#disableElements disableElements}.
 * @interface WebViewer.Popup
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
   * Add an array of items after the item that has the given data element
   * @method WebViewer.Popup#add
   * @param {Array.<object>} items Same as <a href='https://www.pdftron.com/documentation/web/guides/customizing-header#header-items' target='_blank'>header items</a>.
   * @param {string} [dataElement] An optional string. If not given, items will be added in the beginning.
   * @returns {object} The instance itself
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
   * Update one item or all the items in the popup
   * @method WebViewer.Popup#update
   * @param {string|Array.<object>} dataElement
   * If a string is passed, the item that has the given data element will be updated based on the given props.
   * If an array of object is passed, the items in the popup will become the array.
   * @param {object} [props] An optional object that is used to override an existing item's properties. Only useful when the first argument is a string.
   * @returns {object} The instance itself
   * @example
WebViewer(...)
  .then(function(instance) {
    // use a new image for a button
    instance.textPopup.update('copyTextButton', {
      img: 'path/to/image',
    });

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
  update(dataElement, props) {
    let items;

    if (Array.isArray(dataElement)) {
      items = dataElement;
    } else {
      const index = this._getIndexByDataElement(dataElement);

      items = this.getItems();
      items[index] = {
        ...items[index],
        ...props,
      };
    }

    this.store.dispatch(actions.setPopupItems(this.popupDataElement, items));

    return this;
  },
  /**
   * Return the array of items in the popup
   * @method WebViewer.Popup#getItems
   * @example
WebViewer(...)
  .then(function(instance) {
    instance.annotationPopup.delete('annotationCommentButton');
  });
   */
  getItems() {
    return [...selectors.getPopupItems(this.store.getState(), this.popupDataElement)];
  },
  _getIndexByDataElement(dataElement) {
    let index;

    if (typeof dataElement === 'undefined') {
      index = 0;
    } else {
      const state = this.store.getState();
      index = selectors
        .getPopupItems(state, this.popupDataElement)
        .findIndex(obj => obj.dataElement === dataElement);

      index = index || 0;
    }

    return index;
  },
};