/**
 * An instance of Popup that can be used to edit items in the context menu popup component
 * @name UI.contextMenuPopup
 * @implements {UI.Popup}
 * @type {UI.Popup}
 * @example
WebViewer(...)
  .then(function (instance) {
    instance.UI.contextMenuPopup.someAPI();
  });
 */
import createPopupAPI from 'helpers/createPopupAPI';
import DataElements from 'src/constants/dataElement';

export default (store) => createPopupAPI(store, DataElements.CONTEXT_MENU_POPUP);