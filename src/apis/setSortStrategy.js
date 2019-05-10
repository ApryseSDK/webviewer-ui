/**
 * Sets a sorting algorithm in NotesPanel.
 * @method WebViewer#setSortStrategy
 * @param {string} sortStrategy Name of the algorithm. By default, there are two algorithm options: position and time.
 * @example // sort notes by time
viewerElement.addEventListener('ready', () => {
  const instance = viewer.getInstance();
  instance.setSortStrategy('time');
});
 */

import actions from 'actions';

export default store => sortStrategy => {
  store.dispatch(actions.setSortStrategy(sortStrategy));
};