/**
 * Sets a sorting algorithm in NotesPanel.
 * @method UI.setSortStrategy
 * @param {string} sortStrategy Name of the algorithm. By default, there are two algorithm options: position and time.
 * @example
WebViewer(...)
  .then(function(instance) {
    instance.UI.setSortStrategy('time'); // sort notes by time
  });
 */

import actions from 'actions';

export default store => sortStrategy => {
  store.dispatch(actions.setSortStrategy(sortStrategy));
};