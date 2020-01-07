/**
 * Filter the annotations shown in the notes panel
 * @method WebViewerInstance#setCustomNoteFilter
 * @param {WebViewerInstance.filterAnnotation} filterAnnotation Function that takes an annotation and returns if the annotation(note) should be shown in the notes panel.
 * @example
WebViewer(...)
  .then(function(instance) {
    // only show annotations that are created by John
    instance.setCustomNoteFilter(function(annotation) {
      return annotation.Author === 'John';
    });
  });
 */
/**
 * Callback that gets passed to {@link CoreControls.ReaderControl#setCustomNoteFilter setCustomNoteFilter}.
 * @callback WebViewerInstance.filterAnnotation
 * @param {Annotations.Annotation} annotation Annotation object
 * @returns {boolean} Whether the annotation should be kept.
 */

import actions from 'actions';

export default store => filterFunc => {
  store.dispatch(actions.setCustomNoteFilter(filterFunc));
};