/**
 * An instance of Popup that can be used to edit items in the text popup component
 * @name UI.textPopup
 * @implements {UI.Popup}
 * @type {UI.Popup}
 * @example
WebViewer(...)
  .then(function (instance) {
    instance.UI.textPopup.someAPI();
  });
 */
import createPopupAPI from 'helpers/createPopupAPI';

export default store => createPopupAPI(store, 'textPopup');