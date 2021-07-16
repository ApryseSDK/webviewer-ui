/**
 * Adds a listener function to be called when search is completed.
 * @method UI.addSearchListener
 * @param {UI.searchListener} searchListener Callback function that will be triggered when search completed
 * @example
WebViewer(...)
  .then(function(instance) {
    function searchListener(searchValue, options, results) {
      console.log(searchValue, options, results);
    };

    instance.UI.addSearchListener(searchListener);
  });
 */
/**
 * Callback that gets passed to {@link UI.addSearchListener addSearchListener}.
 * @callback UI.searchListener
 * @param {string} searchValue Search value
 * @param {object} options Search options object, which includes 'caseSensitive', 'wholeWord', 'wildcard' and 'regex'
 * @param {Array.<object>} results Search results
 */

import { addSearchListener as addSearchListenerHelper } from "helpers/search";

export default function addSearchListener(listener) {
  addSearchListenerHelper(listener);
}
