import actions from 'actions';

/**
 * Sets the default print margins.
``
 * @method UI.setDefaultPrintMargins
 * @param {string} printMargins CSS value that will be used as the default margin for printing
 *
 * @example
 WebViewer(...) .then(function(instance) {
 instance.UI.setDefaultPrintMargins("0.5in"); // Set all sides to 0.5 inch margin
 instance.UI.setDefaultPrintMargins("2cm"); // Set all sides to 2cm margin
 // Set top margin to 0.5 inches right margin to 0.4 inches bottom margin to 0.3 inches and left margin to 0.2 inches
 instance.UI.setDefaultPrintMargins("0.5in 0.4in 0.3in 0.2in");
 });
 */

export default (store) => (printMargins) => {
  const { TYPES, checkTypes } = window.Core;
  checkTypes([printMargins], [TYPES.STRING], 'setDefaultPrintMargins');
  store.dispatch(actions.setDefaultPrintMargins(printMargins));
};