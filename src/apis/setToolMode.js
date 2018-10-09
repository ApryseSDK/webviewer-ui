import core from 'core';
import actions from 'actions';

export default store => toolName =>  {
  const state = store.getState();
  const group = state.viewer.toolButtonObjects[toolName].group;

  core.setToolMode(toolName);
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
