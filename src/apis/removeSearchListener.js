/**
 * Removes the search listener function.
 * @method WebViewerInstance#removeSearchListener
 * @param {WebViewerInstance.searchListener} listener Search listener function that was added.
 * @example
WebViewer(...)
  .then(function(instance) {
    function searchListener(searchValue, options, results) {
      console.log(searchValue, options, results);
    };

    instance.addSearchListener(searchListener);
    instance.removeSearchListener(searchListener);
  });
 */

import { removeSearchListener as removeSearchListenerHelper } from 'helpers/search';

export default function removeSearchListener(listener) {
  removeSearchListenerHelper(listener);
}
