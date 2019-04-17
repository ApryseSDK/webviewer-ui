/**
 * Focuses a note input field for the annotation. If the notes panel is closed, it is automatically opened before focusing.
 * @method WebViewer#focusNote
 * @param {string} annotationId Id of an annotation.
 * @example const viewerElement = document.getElementById('viewer');
const instance = await WebViewer({ ... }, viewerElement);
const { annotManager } = instance;
annotManager.on('annotationChanged', (e, annotations, action) => {
  annotations.forEach((annotation) => {
    // Focus the note when annotation is created
    if (action === 'add' && annotation.Listable) {
      instance.focusNote(annotation.Id); // note it is a capital i
    }
  });
});
 */

import core from 'core';
import actions from 'actions';

export default store => id => {
  const state = store.getState();
  const annotation = core.getAnnotationById(id);
   if (selectors.isElementOpen(state, 'leftPanel')) {
    if (!core.isAnnotationSelected(annotation)) {
      core.selectAnnotation(annotation);
    }
    store.dispatch(actions.setActiveLeftPanel('notesPanel'));
    store.dispatch(actions.expandNote(id));
    store.dispatch(actions.setIsNoteEditing(true));
  } else {
    store.dispatch(actions.openElement('notesPanel'));
    setTimeout(() => {
      if (!core.isAnnotationSelected(annotation)) {
        core.selectAnnotation(annotation);
      }
      store.dispatch(actions.expandNote(id));
      store.dispatch(actions.setIsNoteEditing(true));
    }, 400);
  }
};