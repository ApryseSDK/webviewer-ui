/**
 * Sets a header group to be rendered in the Header element. This API comes useful when replacing the entire header items in small screens.
 * @method WebViewer#setActiveHeaderGroup
 * @param {string} headerGroup Name of the header group to be rendered. Default WebViewer UI has two header groups: default and tools.
 * @example // 5.1 and after
WebViewer(...)
.then(instance => {
  instance.setActiveHeaderGroup('tools'); // switch to tools header
});
 * @example // 4.0 ~ 5.0
var viewerElement = document.getElementById('viewer');
var viewer = new PDFTron.WebViewer(...);

viewerElement.addEventListener('ready', function() {
  var instance = viewer.getInstance();
  instance.setActiveHeaderGroup('tools'); // switch to tools header
});
 */

import actions from 'actions';

export default store => headerGroup => {
  store.dispatch(actions.setActiveHeaderGroup(headerGroup));
};