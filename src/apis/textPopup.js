/**
 * An instance of Popup that can be used to edit items in the text popup component
 * @name WebViewerInstance#textPopup
 * @implements {WebViewerInstance.Popup}
 * @type {WebViewerInstance.Popup}
 * @example
WebViewer(...)
  .then(function (instance) {
    instance.textPopup.someAPI();
  });
 */
import createPopupAPI from 'helpers/createPopupAPI';

export default store => createPopupAPI(store, 'textPopup');