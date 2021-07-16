/**
 * Adds a sorting strategy in notes panel.
 * @method UI.addSortStrategy
 * @param {object} sortStrategy Sorting strategy that will be used to sort notes
 * @param {string} sortStrategy.name Name of the strategy, which will be shown in notes panel's dropdown
 * @param {UI.getSortedNotes} sortStrategy.getSortedNotes Function that takes unsorted notes (annotations) and returns them sorted
 * @param {UI.shouldRenderSeparator} sortStrategy.shouldRenderSeparator Function that returns when a separator should be rendered
 * @param {UI.getSeparatorContent} sortStrategy.getSeparatorContent Function that returns the content of a separator
 * @example
WebViewer(...)
  .then(function(instance) {
    var mySortStrategy = {
      name: 'annotationType',
      getSortedNotes: function(notes) {
        return notes.sort(function(a ,b) {
          if (a.Subject < b.Subject) return -1;
          if (a.Subject > b.Subject) return 1;
          if (a.Subject === b.Subject) return 0;
        });
      },
      shouldRenderSeparator: function(prevNote, currNote) {
        return prevNote.Subject !== currNote.Subject;
      },
      getSeparatorContent: function(prevNote, currNote) {
        return currNote.Subject;
      }
    };

    instance.UI.addSortStrategy(mySortStrategy);
  });
 */
/**
 * Callback that gets passed to `sortStrategy.getSortedNotes` in {@link UI.addSortStrategy addSortStrategy}.
 * @callback UI.getSortedNotes
 * @param {Array<Core.Annotations.Annotation>} notes List of unsorted notes (annotations)
 * @return {Array<Core.Annotations.Annotation>} Sorted notes (annotations)
 */
/**
 * Callback that gets passed to `sortStrategy.shouldRenderSeparator` in {@link UI.addSortStrategy addSortStrategy}.
 * @callback UI.shouldRenderSeparator
 * @param {Core.Annotations.Annotation} prevNote Previous note (annotation)
 * @param {Core.Annotations.Annotation} currNote Current note (annotation)
 * @return {boolean} Whether a separator should be rendered or not
 */
/**
 * Callback that gets passed to `sortStrategy.getSeparatorContent` in {@link UI.addSortStrategy addSortStrategy}.
 * @callback UI.getSeparatorContent
 * @param {Core.Annotations.Annotation} prevNote Previous note (annotation)
 * @param {Core.Annotations.Annotation} currNote Current note (annotation)
 * @param {object} options Optional values
 * @param {Array.<string>} options.pageLabels List of page label
 * @return {(string|number)} Content to be rendered in a separator
 */

import { addSortStrategy } from 'constants/sortStrategies';
import actions from 'actions';

export default store => newStrategy => {
  if (newStrategy.name) {
    addSortStrategy(newStrategy);
    store.dispatch(actions.setSortStrategy(newStrategy.name));
  } else {
    console.warn('The argument for addSortStrategy must have a "name" property, see https://www.pdftron.com/documentation/web/guides/ui/apis#addsortstrategy');
  }
};
