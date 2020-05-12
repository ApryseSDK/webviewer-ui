import core from 'core';
import actions from 'actions';
import selectors from 'selectors';
import defaultTool from 'constants/defaultTool';

export default ({ dispatch, getState }) => annotation => {
  const state = getState();
  const isNotesPanelDisabled = selectors.isElementDisabled(state, 'notesPanel');

  if (isNotesPanelDisabled) {
    return;
  }

  core.setToolMode(defaultTool);
  dispatch(actions.setActiveToolGroup(''));
  dispatch(actions.closeElement('searchPanel'));
  dispatch(actions.openElement('notesPanel'));
  core.selectAnnotation(annotation);
  dispatch(actions.triggerNoteEditing());
};
