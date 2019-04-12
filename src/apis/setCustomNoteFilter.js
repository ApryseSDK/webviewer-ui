/**
 * Filter the annotations shown in the notes panel
 * @method CoreControls.ReaderControl#setCustomNoteFilter
 * @param {CoreControls.ReaderControl~filterAnnotation} filterAnnotation Function that takes an annotation and returns if the annotation(note) should be shown in the notes panel.
 * @example viewerElement.addEventListener('ready', () => {
  const instance = viewer.getInstance();
  // only show annotations that are created by John
  instance.setCustomNoteFilter(annotation => annotation.Author === 'John');
});
 */
/**
 * Callback that gets passed to {@link CoreControls.ReaderControl#setCustomNoteFilter setCustomNoteFilter}.
 * @callback CoreControls.ReaderControl~filterAnnotation
 * @param {Annotations} annotation Annotation object
 * @returns {boolean} Whether the annotation should be kept.
 */

import actions from 'actions';

export default store => filterFunc => {
  store.dispatch(actions.setCustomNoteFilter(filterFunc));
}