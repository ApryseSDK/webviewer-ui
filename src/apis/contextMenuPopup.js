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

export default store => createPopupAPI(store, 'contextMenuPopup');