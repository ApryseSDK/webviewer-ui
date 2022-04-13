import core from 'core';
import actions from 'actions';
import selectors from 'selectors';

export default (dispatch, store) => (newTool, oldTool) => {
  if (oldTool && oldTool.name === 'TextSelect') {
    core.clearSelection();
    dispatch(actions.closeElement('textPopup'));
  }

  dispatch(actions.setActiveToolNameAndStyle(newTool));

  const state = store.getState();
  const activeToolGroup = selectors.getActiveToolGroup(state);
  const activeToolName = selectors.getActiveToolName(state);
  if (activeToolName === 'AnnotationEdit' && activeToolGroup === 'signatureTools') {
    return;
  }
  const { group = '' } = selectors.getToolButtonObject(state, newTool.name);
  setActiveToolGroupAndToolsOverlay(store, group);
};

const setActiveToolGroupAndToolsOverlay = (store, group) => {
  if (!group) {
    store.dispatch(actions.setActiveToolGroup(''));
    store.dispatch(actions.closeElement('toolsOverlay'));
  } else {
    store.dispatch(actions.setActiveToolGroup(group));
    store.dispatch(actions.openElement('toolsOverlay'));
  }
};