/**
 * Searches the current page for the texts matching searchValue.
 * @method WebViewer#searchText
 * @param {string} searchValue The text value to look for.
 * @param {object} [options] Search options.
 * @param {boolean} [options.caseSensitive=false] Search with matching cases.
 * @param {boolean} [options.wholeWord=false] Search whole words only.
 * @param {boolean} [options.wildcard=false] Search a string with a wildcard *. For example, *viewer.
 * @param {boolean} [options.regex=false] Search for a regex string. For example, www(.*)com.
 * @param {boolean} [options.searchUp=false] Search up the document (backwards).
 * @param {boolean} [options.ambientString=false] Get the ambient string in the result.
 * @example const viewerElement = document.getElementById('viewer');
const instance = await WebViewer({ ... }, viewerElement);
instance.searchText('test', {
  caseSensitive: true,
  wholeWord: true
});
 */

import actions from 'actions';

export default store => (searchValue, options) => {
  let searchOptions = {};
  if (typeof options === 'string') {
    const modes = options.split(',');
    modes.forEach(mode => {
      searchOptions[lowerCaseFirstLetter(mode)] = true;        
    });
  } else {
    searchOptions = options;
  }

  store.dispatch(actions.searchText(searchValue, searchOptions));
};

const lowerCaseFirstLetter = mode => `${mode.charAt(0).toLowerCase()}${mode.slice(1)}`; 
