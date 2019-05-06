/**
 * Removes the search listener function.
 * @method WebViewer#removeSearchListener
 * @param {searchListener} listener Search listener function that was added.
 * @example // 5.1 and after
const viewerElement = document.getElementById('viewer');
const instance = await WebViewer({ ... }, viewerElement);

const searchListener = (searchValue, options, results) => {
  console.log(searchValue, options, results);
};

instance.addSearchListener(searchListener);
instance.removeSearchListener(searchListener);
 * @example // 4.0 ~ 5.0
var viewerElement = document.getElementById('viewer');
var viewer = new PDFTron.WebViewer({ ... }, viewerElement);

var searchListener = function(searchValue, options, results) {
  console.log(searchValue, options, results);
};

viewerElement.addEventListener('ready', function() {
  var instance = viewer.getInstance();
  instance.addSearchListener(searchListener);
  instance.removeSearchListener(searchListener);
});
 */

import actions from 'actions';

export default store => listener => {
  store.dispatch(actions.removeSearchListener(listener));
};