/**
 * Sets the print quality. Higher values are higher quality but takes longer to complete and use more memory. The viewer's default quality is 1.
 * @method UI.setPrintQuality
 * @param {number} quality The quality of the document to print. Must be a positive number.
 * @example
WebViewer(...)
  .then(function(instance) {
    instance.UI.setPrintQuality(2);
  });
 */

import actions from 'actions';

export default store => quality => {
  if (quality <= 0) {
    throw Error('Value must be a positive number');
  }
  store.dispatch(actions.setPrintQuality(quality));
};
