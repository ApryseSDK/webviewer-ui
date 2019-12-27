/**
 * Set the number of signatures that can be stored in the WebViewer (default is 2)
 * @method WebViewerInstance#setMaxSignaturesCount
 * @param {number} [maxSignaturesCount=2] Number of signature webViewer can store
 * @example
WebViewer(...)
  .then(function(instance) {
    instance.setMaxSignaturesCount(5); // allow up to 5 stored signatures
  });
 */

import actions from 'actions';

export default store => maxSignaturesCount => {
  store.dispatch(actions.setMaxSignaturesCount(maxSignaturesCount));
};