/**
 * Adds a listener function to be called when search is completed
 * @method UI.addSearchListener
 * @param {UI.searchListener} searchListener Callback function that will be triggered when search is completed
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
 * @typedef {object} UI.SearchOptions
 * @property {boolean} [caseSensitive=false] Whether the search is case sensitive
 * @property {boolean} [wholeWord=false] Whether to search for whole words only
 * @property {boolean} [wildcard=false] Whether to search with wildcard characters
 * @property {boolean} [regex=false] Whether to search using regular expressions
 * @property {boolean} [searchUp=false] Whether to search up the document (backwards)
 * @property {boolean} [ambientString=false] Whether to get the ambient string in the result
 */

/**
 * Callback that gets passed to {@link UI.addSearchListener addSearchListener}.
 * @callback UI.searchListener
 * @param {string} searchValue Search value
 * @param {UI.SearchOptions} options Search options object
 * @param {Array.<Core.Search.SearchResult>} results Search results
 */

import { addSearchListener as addSearchListenerHelper } from 'helpers/search';

export default function addSearchListener(listener) {
  addSearchListenerHelper(listener);
}
