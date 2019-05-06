/**
 * Adds a listener function to be called when search is completed.
 * @method WebViewer#addSearchListener
 * @param {WebViewer~searchListener} searchListener Callback function that will be triggered when search completed
 * @example // 5.1 and after
const viewerElement = document.getElementById('viewer');
const instance = await WebViewer({ ... }, viewerElement);

const searchListener = (searchValue, options, results) => {
  console.log(searchValue, options, results);
};

instance.addSearchListener(searchListener);
   * @example // 4.0 ~ 5.0
var viewerElement = document.getElementById('viewer');
var viewer = new PDFTron.WebViewer({ ... }, viewerElement);

var searchListener = function(searchValue, options, results) {
  console.log(searchValue, options, results);
};

viewerElement.addEventListener('ready', function() {
  var instance = viewer.getInstance();
  instance.addSearchListener(searchListener);
});
 */
/**
 * Callback that gets passed to {@link CoreControls.ReaderControl#addSearchListener addSearchListener}.
 * @callback WebViewer~searchListener
 * @param {string} searchValue Search value
 * @param {object} options Search options object, which includes 'caseSensitive', 'wholeWord', 'wildcard' and 'regex'
 * @param {Array.<object>} results Search results
 */

import actions from 'actions';

export default store => listener => {
  store.dispatch(actions.addSearchListener(listener));
};