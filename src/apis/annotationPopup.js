/**
 * An instance of Popup that can be used to edit items in the annotation popup component
 * @name UI.annotationPopup
 * @implements {UI.Popup}
 * @type {UI.Popup}
 * @example
WebViewer(...)
  .then(function (instance) {
    instance.UI.annotationPopup.someAPI();
  });
 */
import createPopupAPI from 'helpers/createPopupAPI';
import DataElements from 'constants/dataElement';

export default (store) => createPopupAPI(store, DataElements.ANNOTATION_POPUP);