/**
 * Set the number of signatures that can be stored in the WebViewer UI (default is 4)
 * @method UI.setMaxSignaturesCount
 * @param {number} [maxSignaturesCount=4] Number of signature webViewer can store
 * @example
WebViewer(...)
  .then(function(instance) {
    instance.UI.setMaxSignaturesCount(5); // allow up to 5 stored signatures
  });
 */

import actions from 'actions';

export default (store) => (maxSignaturesCount) => {
  store.dispatch(actions.setMaxSignaturesCount(maxSignaturesCount));
};