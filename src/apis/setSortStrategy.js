/**
 * Sets a sorting algorithm in NotesPanel.
 * @method WebViewer#setSortStrategy
 * @param {string} sortStrategy Name of the algorithm. By default, there are two algorithm options: position and time.
 * @example // 5.1 and after
WebViewer(...)
  .then(function(instance) {
    instance.setSortStrategy('time'); // sort notes by time
  });
 * @example // 4.0 ~ 5.0
var viewerElement = document.getElementById('viewer');
var viewer = new PDFTron.WebViewer(...);

viewerElement.addEventListener('ready', function() {
  var instance = viewer.getInstance();
  instance.setSortStrategy('time'); // sort notes by time
});
 */

import actions from 'actions';

export default store => sortStrategy => {
  store.dispatch(actions.setSortStrategy(sortStrategy));
};