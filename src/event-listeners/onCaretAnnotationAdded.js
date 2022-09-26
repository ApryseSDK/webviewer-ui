import core from 'core';
import actions from 'actions';
import selectors from 'selectors';

export default ({ dispatch, getState }) => (annotation) => {
  const state = getState();
  const isNotesPanelDisabled = selectors.isElementDisabled(state, 'notesPanel');
  const isNotesPanelOpen = selectors.isElementOpen(state, 'notesPanel');

  if (isNotesPanelDisabled) {
    return;
  }

  dispatch(actions.closeElement('searchPanel'));
  dispatch(actions.closeElement('redactionPanel'));
  dispatch(actions.openElement('notesPanel'));
  // wait for the notes panel to be fully opened before focusing
  setTimeout(() => {
    core.selectAnnotation(annotation);
    dispatch(actions.triggerNoteEditing());
  }, isNotesPanelOpen ? 0 : 400);
};
