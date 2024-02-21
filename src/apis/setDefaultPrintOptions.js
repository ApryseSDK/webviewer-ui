/**
 * Sets the default print options.
 * @method UI.setDefaultPrintOptions
 * @param {object} options - The default print options of the document to print. Must be an object.
 * @param {boolean} [options.includeComments] - Whether or not will print the documents with the comments
 * @param {boolean} [options.includeAnnotations] - Whether or not will print the documents with the annotations
 * @param {boolean} [options.maintainPageOrientation] - Whether or not will maintain the pages orientation as set in the webviewer
 * @param {string} [options.margins] CSS value that will be used as the default margin for printing
 *
 * @example
WebViewer(...) .then(function(instance) {
  instance.UI.setDefaultPrintOptions({ includeComments: true, includeAnnotations: true });
instance.UI.setDefaultPrintOptions({ margins: "0.5in"});  // Set all sides to 0.5 inch margin
instance.UI.setDefaultPrintOptions({ margins: "2cm" }); // Set all sides to 2cm margin
// Set top margin to 0.5 inches right margin to 0.4 inches bottom margin to 0.3 inches and left margin to 0.2 inches
instance.UI.setDefaultPrintOptions({ margins: "0.5in 0.4in 0.3in 0.2in" });
});
 */

import actions from 'actions';

export default (store) => (options) => {
  const { TYPES, checkTypes } = window.Core;
  checkTypes([options], [TYPES.OBJECT({
    includeComments: TYPES.OPTIONAL(TYPES.BOOLEAN),
    includeAnnotations: TYPES.OPTIONAL(TYPES.BOOLEAN),
    maintainPageOrientation: TYPES.OPTIONAL(TYPES.BOOLEAN),
    margins: TYPES.OPTIONAL(TYPES.STRING),
  })], 'setDefaultPrintOptions');
  const objectKeyCount = Object.keys(options).length;
  if (objectKeyCount === 0) {
    return console.error('setDefaultPrintOptions requires at least one option to be set');
  }
  if (options.margins) {
    store.dispatch(actions.setDefaultPrintMargins(options.margins));
    if (objectKeyCount === 1) {
      return;
    }
  }
  store.dispatch(actions.setDefaultPrintOptions(options));
};