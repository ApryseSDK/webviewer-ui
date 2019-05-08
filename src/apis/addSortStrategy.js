/**
 * Adds a sorting strategy in notes panel.
 * @method WebViewer#addSortStrategy
 * @param {object} sortStrategy Sorting strategy that will be used to sort notes
 * @param {string} sortStrategy.name Name of the strategy, which will be shown in notes panel's dropdown
 * @param {WebViewer~getSortedNotes} sortStrategy.getSortedNotes Function that takes unsorted notes (annotations) and returns them sorted
 * @param {WebViewer~shouldRenderSeparator} sortStrategy.shouldRenderSeparator Function that returns when a separator should be rendered
 * @param {WebViewer~getSeparatorContent} sortStrategy.getSeparatorContent Function that returns the content of a separator
 * @example // 5.1 and after
WebViewer(...)
.then(instance => {
  const mySortStrategy = {
    name: 'annotationType',
    getSortedNotes: notes => {
      return notes.sort((a ,b) => {
        if (a.Subject < b.Subject) return -1;
        if (a.Subject > b.Subject) return 1;
        if (a.Subject === b.Subject) return 0;
      })
    },
    shouldRenderSeparator: (prevNote, currNote) => prevNote.Subject !== currNote.Subject,
    getSeparatorContent: (prevNote, currNote) => currNote.Subject
  };

  instance.addSortStrategy(mySortStrategy);
});
 * @example // 4.0 ~ 5.0
var viewerElement = document.getElementById('viewer');
var viewer = new PDFTron.WebViewer(...);

viewerElement.addEventListener('ready', function() {
  var instance = viewer.getInstance();
  var mySortStrategy = {
    name: 'annotationType',
    getSortedNotes: function(notes) {
      return notes.sort(function(a ,b) {
        if (a.Subject < b.Subject) return -1;
        if (a.Subject > b.Subject) return 1;
        if (a.Subject === b.Subject) return 0;
      })
    },
    shouldRenderSeparator: function(prevNote, currNote) {
      return prevNote.Subject !== currNote.Subject;
    },
    getSeparatorContent: function(prevNote, currNote) {
      return currNote.Subject;
    }
  };

  instance.addSortStrategy(mySortStrategy);
});
 */
/**
 * Callback that gets passed to `sortStrategy.getSortedNotes` in {@link CoreControls.ReaderControl#addSortStrategy addSortStrategy}.
 * @callback WebViewer~getSortedNotes
 * @param {Array.<Annotation>} notes List of unsorted notes (annotations)
 * @return {Array<Annotation>} Sorted notes (annotations)
 */
/**
 * Callback that gets passed to `sortStrategy.shouldRenderSeparator` in {@link CoreControls.ReaderControl#addSortStrategy addSortStrategy}.
 * @callback WebViewer~shouldRenderSeparator
 * @param {Annotation} prevNote Previous note (annotation)
 * @param {Annotation} currNote Current note (annotation)
 * @return {boolean} Whether a separator should be rendered or not
 */
/**
 * Callback that gets passed to `sortStrategy.getSeparatorContent` in {@link CoreControls.ReaderControl#addSortStrategy addSortStrategy}.
 * @callback WebViewer~getSeparatorContent
 * @param {Annotation} prevNote Previous note (annotation)
 * @param {Annotation} currNote Current note (annotation)
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
