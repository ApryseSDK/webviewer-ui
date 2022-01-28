/**
 * Sets a sorting algorithm in NotesPanel.
 * @method UI.setSortStrategy
 * @param {string} sortStrategy Name of the algorithm. There are a number of algorithm options: position, createDate, modifiedDate, status, author, type, and color.
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