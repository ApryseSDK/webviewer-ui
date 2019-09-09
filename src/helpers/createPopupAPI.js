import actions from 'actions';
import selectors from 'selectors';

export default (store, popupDataElement) => Object.create(PopupAPI).initialize(store, popupDataElement);

const PopupAPI = {
  initialize(store, popupDataElement) {
    this.store = store;
    this.popupDataElement = popupDataElement;
    return this;
  },
  add(buttons, dataElement) {
    if (!Array.isArray(buttons)) {
      buttons = [buttons];
    }

    const index = this._getIndexByDataElement(dataElement);
    const items = this.getItems();

    items.splice(index, 0, ...buttons);

    this.store.dispatch(actions.setPopupItems(this.popupDataElement, items));

    return this;
  },
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
  delete(dataElement) {
    const index = this._getIndexByDataElement(dataElement);
    const items = this.getItems();

    items.splice(index, 1);

    this.store.dispatch(actions.setPopupItems(this.popupDataElement, items));

    return this;
  },
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