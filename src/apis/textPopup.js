/**
 * An instance of Popup that can be used to edit items in the text popup component
 * @name WebViewer#textPopup
 * @see WebViewer.Popup
 * @example // 6.0 and after
WebViewer(...)
  .then(function (instance) {
    instance.textPopup.someAPI();
  });
 */
import createPopupAPI from 'helpers/createPopupAPI';

export default store => createPopupAPI(store, 'textPopup');