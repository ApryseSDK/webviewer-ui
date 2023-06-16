import core from 'core';
import actions from 'actions';
import selectors from 'selectors';
import DataElements from 'src/constants/dataElement';

export default ({ dispatch, getState }) => (annotation) => {
  const state = getState();
  const isNotesPanelDisabled = selectors.isElementDisabled(state, DataElements.NOTES_PANEL);
  const isNotesPanelOpen = selectors.isElementOpen(state, DataElements.NOTES_PANEL);
  const isInlineCommentDisabled = selectors.isElementDisabled(state, DataElements.INLINE_COMMENT_POPUP);

  if (isNotesPanelDisabled) {
    return;
  }

  dispatch(actions.closeElement('searchPanel'));
  dispatch(actions.closeElement(DataElements.REDACTION_PANEL));
  if (!isInlineCommentDisabled || isNotesPanelOpen) {
    core.selectAnnotation(annotation);
    dispatch(actions.triggerNoteEditing());
  } else {
    dispatch(actions.openElement(DataElements.NOTES_PANEL));
    // wait for the notes panel to be fully opened before focusing
    setTimeout(() => {
      core.selectAnnotation(annotation);
      dispatch(actions.triggerNoteEditing());
    }, 400);
  }
};
