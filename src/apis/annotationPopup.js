/**
 * An instance of Popup that can be used to edit items in the annotation popup component
 * @name WebViewerInstance#annotationPopup
 * @implements {WebViewerInstance.Popup}
 * @type {WebViewerInstance.Popup}
 * @example
WebViewer(...)
  .then(function (instance) {
    instance.annotationPopup.someAPI();
  });
 */
import createPopupAPI from 'helpers/createPopupAPI';

export default store => createPopupAPI(store, 'annotationPopup');