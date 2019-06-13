/**
 * Filter the annotations shown in the notes panel
 * @method WebViewer#setCustomNoteFilter
 * @param {WebViewer~filterAnnotation} filterAnnotation Function that takes an annotation and returns if the annotation(note) should be shown in the notes panel.
 * @example // 5.1 and after
WebViewer(...)
  .then(function(instance) {
    // only show annotations that are created by John
    instance.setCustomNoteFilter(function(annotation) {
      return annotation.Author === 'John';
    });
  });
 * @example // 4.0 ~ 5.0
var viewerElement = document.getElementById('viewer');
var viewer = new PDFTron.WebViewer(...);

viewerElement.addEventListener('ready', function() {
  var instance = viewer.getInstance();

  // only show annotations that are created by John
  instance.setCustomNoteFilter(function(annotation) {
    return annotation.Author === 'John';
  });
});
 */
/**
 * Callback that gets passed to {@link CoreControls.ReaderControl#setCustomNoteFilter setCustomNoteFilter}.
 * @callback WebViewer~filterAnnotation
 * @param {Annotations} annotation Annotation object
 * @returns {boolean} Whether the annotation should be kept.
 */

import actions from 'actions';

export default store => filterFunc => {
  store.dispatch(actions.setCustomNoteFilter(filterFunc));
};