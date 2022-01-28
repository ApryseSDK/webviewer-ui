/**
 * Filter the annotations shown in the notes panel
 * @method UI.setCustomNoteFilter
 * @param {UI.filterAnnotation} filterAnnotation Function that takes an annotation and returns if the annotation(note) should be shown in the notes panel.
 * @example
WebViewer(...)
  .then(function(instance) {
    // only show annotations that are created by John
    instance.UI.setCustomNoteFilter(function(annotation) {
      return annotation.Author === 'John';
    });
  });
 */
/**
 * Callback that gets passed to {@link UI.setCustomNoteFilter setCustomNoteFilter}.
 * @callback UI.filterAnnotation
 * @param {Core.Annotations.Annotation} annotation Annotation object
 * @returns {boolean} Whether the annotation should be kept.
 */

import actions from 'actions';

export default store => filterFunc => {
  store.dispatch(actions.setCustomNoteFilter(filterFunc));
};