import core from 'core';
import actions from 'actions';
import selectors from 'selectors';

export default ({ dispatch, getState }) => annotation => {
  const state = getState();
  const isNotesPanelDisabled = selectors.isElementDisabled(state, 'notesPanel');
  const isLeftPanelOpen = selectors.isElementOpen(state, 'leftPanel');

  if (isNotesPanelDisabled) {
    return;
  }
  if (isLeftPanelOpen) {
    core.selectAnnotation(annotation);
    dispatch(actions.setActiveLeftPanel('notesPanel'));
    dispatch(actions.triggerNoteEditing());
  } else {
    dispatch(actions.openElement('notesPanel'));
    // wait for the left panel to fully open
    setTimeout(() => {
      core.selectAnnotation(annotation);
      dispatch(actions.triggerNoteEditing());
    }, 400);
  }
};
