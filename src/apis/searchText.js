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
 * @example // 5.1 and after
WebViewer(...)
  .then(function(instance) {
    var docViewer = instance.docViewer;

    // you must have a document loaded when calling this api
    docViewer.on('documentLoaded', function() {
      instance.searchText('test', {
        caseSensitive: true,
        wholeWord: true
      });
    });
  });
 * @example // 4.0 ~ 5.0
var viewerElement = document.getElementById('viewer');
var viewer = new PDFTron.WebViewer(...);

viewerElement.addEventListener('ready', function() {
  var instance = viewer.getInstance();
  var docViewer = instance.docViewer;

  // you must have a document loaded when calling this api
  docViewer.on('documentLoaded', function() {
    instance.searchText('test', {
      caseSensitive: true,
      wholeWord: true
    });
  });
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
