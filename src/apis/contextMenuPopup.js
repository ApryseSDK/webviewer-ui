/**
 * An instance of Popup that can be used to edit items in the context menu popup component
 * @name WebViewer#contextMenuPopup
 * @implements {WebViewer.Popup}
 * @example
WebViewer(...)
  .then(function (instance) {
    instance.contextMenuPopup.someAPI();
  });
 */
import createPopupAPI from 'helpers/createPopupAPI';

export default store => createPopupAPI(store, 'contextMenuPopup');