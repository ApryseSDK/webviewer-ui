/**
 * Sets a sorting algorithm for the Notes Panel.
 * @method UI.setNotesPanelSortStrategy
 * @param {string} sortStrategy Name of the sort strategy algorithm. Check [UI.NotesPanelSortStrategy]{@link UI.NotesPanelSortStrategy} for the options or use your own strategy.
 * @see UI.NotesPanelSortStrategy
 * @example
WebViewer(...)
  .then(function(instance) {
    const sortStrategy = instance.UI.NotesPanelSortStrategy;
    instance.UI.setNotesPanelSortStrategy(sortStrategy.TYPE); // sort notes by type
  });
 */

import actions from 'actions';

export default store => sortStrategy => {
  if (!sortStrategy) {
    throw new Error('Unsupported sort strategy.');
  }

  store.dispatch(actions.setNotesPanelSortStrategy(sortStrategy));
};