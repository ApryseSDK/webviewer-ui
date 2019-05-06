/**
 * Searches the full document for the texts matching searchValue.
 * @method WebViewer#searchTextFull
 * @param {string} searchValue The text value to look for.
 * @param {object} [options] Search options.
 * @param {boolean} [options.caseSensitive=false] Search with matching cases.
 * @param {boolean} [options.wholeWord=false] Search whole words only.
 * @param {boolean} [options.wildcard=false] Search a string with a wildcard *. For example, *viewer.
 * @param {boolean} [options.regex=false] Search for a regex string. For example, www(.*)com.
 * @example // 5.1 and after
const viewerElement = document.getElementById('viewer');
const instance = await WebViewer({ ... }, viewerElement);
const { docViewer } = instance;

// you must have a document loaded when calling this api
docViewer.on('documentLoaded', () => {
  instance.searchTextFull('test', {
    wholeWord: true
  });
});
 * @example // 4.0 ~ 5.0
var viewerElement = document.getElementById('viewer');
var viewer = new PDFTron.WebViewer({ ... }, viewerElement);

viewerElement.addEventListener('ready', function() {
  var instance = viewer.getInstance();
  var docViewer = instance.docViewer;
  // you must have a document loaded when calling this api  
  docViewer.on('documentLoaded', () => {
    instance.searchTextFull('test', {
      wholeWord: true
    });
  });
});
 */

import actions from 'actions';

export default store => (searchValue, options) =>  {
  store.dispatch(actions.searchTextFull(searchValue, options));
};
