/**
 * Adds a sorting strategy to the notes panel
 * @method UI.addSortStrategy
 * @param {UI.SortStrategy} sortStrategy Sorting strategy that will be used to sort notes in the notes panel
 * @example
WebViewer(...)
  .then(function(instance) {
    const mySortStrategy = {
      name: 'annotationType',
      getSortedNotes: function(notes) {
        return notes.sort(function(a, b) {
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
 * @typedef {object} UI.SortStrategy
 * @property {string} name Name of the strategy, which will be shown in notes panel's dropdown
 * @property {UI.getSortedNotes} getSortedNotes Function that takes unsorted notes (annotations) and returns them sorted
 * @property {UI.shouldRenderSeparator} shouldRenderSeparator Function that returns when a separator should be rendered
 * @property {UI.getSeparatorContent} getSeparatorContent Function that returns the content of a separator
 */
/**
 * Callback function for sorting notes in a custom sort strategy. This is used as the getSortedNotes property in {@link UI.SortStrategy}.
 * @callback UI.getSortedNotes
 * @param {Array<Core.Annotations.Annotation>} notes List of unsorted notes (annotations)
 * @return {Array<Core.Annotations.Annotation>} Sorted notes (annotations)
 */
/**
 * Callback function that determines when to render a separator between notes. This is used as the shouldRenderSeparator property in {@link UI.SortStrategy}.
 * @callback UI.shouldRenderSeparator
 * @param {Core.Annotations.Annotation} prevNote Previous note (annotation)
 * @param {Core.Annotations.Annotation} currNote Current note (annotation)
 * @return {boolean} Whether a separator should be rendered or not
 */
/**
 * Callback function that returns the content to display in a separator. This is used as the getSeparatorContent property in {@link UI.SortStrategy}.
 * @callback UI.getSeparatorContent
 * @param {Core.Annotations.Annotation} prevNote Previous note (annotation)
 * @param {Core.Annotations.Annotation} currNote Current note (annotation)
 * @param {UI.SeparatorOptions} options Optional values
 * @return {(string|number)} Content to be rendered in a separator
 */
/**
 * @typedef {object} UI.SeparatorOptions
 * @property {Array.<string>} pageLabels List of page labels
 */

import { addSortStrategy } from 'constants/sortStrategies';
import actions from 'actions';

export default (store) => (newStrategy) => {
  if (newStrategy.name) {
    addSortStrategy(newStrategy);
    store.dispatch(actions.setNotesPanelSortStrategy(newStrategy.name));
  } else {
    console.warn('The argument for addSortStrategy must have a "name" property, see https://docs.apryse.com/api/web/WebViewerInstance.html#addsortstrategy');
  }
};
