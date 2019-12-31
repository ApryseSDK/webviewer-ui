/**
 * Sets the print quality. Higher values are higher quality but takes longer to complete and use more memory. The viewer's default quality is 1.
 * @method WebViewerInstance#setPrintQuality
 * @param {number} quality The quality of the document to print
 * @example
WebViewer(...)
  .then(function(instance) {
    instance.setPrintQuality(2);
  });
 */

import actions from 'actions';

export default store => quality => {
  store.dispatch(actions.setPrintQuality(quality));
};
