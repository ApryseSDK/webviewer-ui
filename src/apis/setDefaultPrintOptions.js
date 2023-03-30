/**
 * Sets the default print options.
 * @method UI.setDefaultPrintOptions
 * @param {object} options - The default print options of the document to print. Must be an object.
 * @param {boolean} [options.includeComments] - Whether or not will print the documents with the comments
 * @param {boolean} [options.includeAnnotations] - Whether or not will print the documents with the annotations
 * @param {boolean} [options.maintainPageOrientation] - Whether or not will maintain the pages orientation as set in the webviewer
 *
 * @example
WebViewer(...) .then(function(instance) {
  instance.UI.setDefaultPrintOptions({ includeComments: true, includeAnnotations: true });
});
 */

import actions from 'actions';

export default (store) => (options) => {
  if (typeof options !== 'object' || options === undefined || Object.keys(options).filter((option) => option !== 'includeComments' && option !== 'includeAnnotations' && option !== 'maintainPageOrientation').length !== 0 || Object.values(options).filter((val) => val !== true && val !== false).length !== 0) {
    throw Error('Invalid options provided');
  } else {
    store.dispatch(actions.setDefaultPrintOptions(options));
  }
};