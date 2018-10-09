import core from 'core';
import actions from 'actions';
import selectors from 'selectors';

export default ({ dispatch, getState }) => (e, annotation) => {
  const state = getState();
  const isNotesPanelDisabled = selectors.isElementDisabled(state, 'notesPanel');
  const isLeftPanelOpen = selectors.isElementOpen(state, 'leftPanel');

  core.setToolMode('AnnotationEdit');

  if (isNotesPanelDisabled) {
    return;
  }
  if (isLeftPanelOpen) {
    core.selectAnnotation(annotation);
    dispatch(actions.setActiveLeftPanel('notesPanel'));
    dispatch(actions.setIsNoteEditing(true));
  } else {
    dispatch(actions.openElement('notesPanel'));
    setTimeout(() => {
      core.selectAnnotation(annotation);
      dispatch(actions.setIsNoteEditing(true));
    }, 400);
  }
};