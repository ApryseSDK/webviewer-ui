import actions from 'actions';
import selectors from 'selectors';

export default store => Object.create(AnnotationPopup).initialize(store);

const AnnotationPopup = {
  initialize(store) {
    this.store = store;
    return this;
  },
  add(buttons, dataElement) {
    if (!Array.isArray(buttons)) {
      buttons = [buttons];
    }

    const index = this._getIndexByDataElement(dataElement);
    const items = [...selectors.getPopupItems(this.store.getState(), 'annotationPopup')];

    items.splice(index, 0, ...buttons);

    this.store.dispatch(actions.setPopupItems('annotationPopup', items));

    return this;
  },
  update(dataElement, props) {
    if (typeof dataElement === 'undefined') {
      return;
    }

    const index = this._getIndexByDataElement(dataElement);
    const items = [...selectors.getPopupItems(this.store.getState(), 'annotationPopup')];

    items[index] = {
      ...items[index],
      ...props,
    };

    this.store.dispatch(actions.setPopupItems('annotationPopup', items));

    return this;
  },
  delete(dataElement) {
    const index = this._getIndexByDataElement(dataElement);
    const items = [...selectors.getPopupItems(this.store.getState(), 'annotationPopup')];

    items.splice(index, 1);

    this.store.dispatch(actions.setPopupItems('annotationPopup', items));

    return this;
  },
  _getIndexByDataElement(dataElement) {
    let index;

    if (typeof dataElement === 'undefined') {
      index = 0;
    } else {
      const state = this.store.getState();
      index = selectors
        .getPopupItems(state, 'annotationPopup')
        .findIndex(obj => obj.dataElement === dataElement);

      index = index || 0;
    }

    return index;
  },
};
