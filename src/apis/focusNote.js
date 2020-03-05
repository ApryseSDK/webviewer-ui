/**
 * Focuses a note input field for the annotation. If the notes panel is closed, it is automatically opened before focusing.
 * @method WebViewerInstance#focusNote
 * @param {string} annotationId Id of an annotation.
 * @example
WebViewer(...)
  .then(function(instance) {
    var annotManager = instance.annotManager;

    annotManager.on('annotationChanged', function(e, annotations, action) {
      annotations.forEach(function(annotation) {
        // Focus the note when annotation is created
        if (action === 'add' && annotation.Listable) {
          instance.focusNote(annotation.Id); // note it is a capital i
        }
      });
    });
  });
 */

import core from 'core';
import actions from 'actions';

export default store => id => {
  // store.dispatch(actions.triggerNoteEditing());
  const annotation = core.getAnnotationById(id);
  store.dispatch(actions.openElement('notesPanel'));
  core.selectAnnotation(annotation);
};
