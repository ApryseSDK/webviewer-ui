/**
 * An instance of Popup that can be used to edit items in the context menu popup component
 * @name WebViewer#contextMenuPopup
 * @see WebViewer.Popup
 * @example // 6.0 and after
WebViewer(...)
  .then(function (instance) {
    instance.contextMenuPopup.someAPI();
  });
 */
import createPopupAPI from 'helpers/createPopupAPI';

export default store => createPopupAPI(store, 'contextMenuPopup');