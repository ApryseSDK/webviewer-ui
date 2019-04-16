/**
 * Searches the full document for the texts matching searchValue.
 * @method WebViewer#searchTextFull
 * @param {string} searchValue The text value to look for.
 * @param {object} [options] Search options.
 * @param {boolean} [options.caseSensitive=false] Search with matching cases.
 * @param {boolean} [options.wholeWord=false] Search whole words only.
 * @param {boolean} [options.wildcard=false] Search a string with a wildcard *. For example, *viewer.
 * @param {boolean} [options.regex=false] Search for a regex string. For example, www(.*)com.
 * @example // search for string 'test', and match whole words only
viewerElement.addEventListener('ready', () => {
  const instance = viewer.getInstance();
  instance.searchTextFull('test', {
    wholeWord: true
  });
});
 */

import actions from 'actions';

export default store => (searchValue, options) =>  {
  store.dispatch(actions.searchTextFull(searchValue, options));
};
