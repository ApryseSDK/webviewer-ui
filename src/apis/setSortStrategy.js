/**
 * Sets a sorting algorithm in NotesPanel.
 * @method WebViewer#setSortStrategy
 * @param {string} sortStrategy Name of the algorithm. By default, there are two algorithm options: position and time.
 * @example const viewerElement = document.getElementById('viewer');
const instance = await WebViewer({ ... }, viewerElement);

instance.setSortStrategy('time'); // sort notes by time
 */

import actions from 'actions';

export default store => sortStrategy => {
  store.dispatch(actions.setSortStrategy(sortStrategy));
};