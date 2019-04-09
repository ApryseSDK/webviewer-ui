import core from 'core';
import actions from 'actions';

export default store => toolName =>  {
  const state = store.getState();
  const group = state.viewer.toolButtonObjects[toolName].group;

  core.setToolMode(toolName);
  setActiveToolGroupAndGroupOverlay(store, group);
};

const setActiveToolGroupAndGroupOverlay = (store, group) => {
  if (!group) {
    store.dispatch(actions.setActiveToolGroup(''));
    store.dispatch(actions.closeElement('groupOverlay'));
  } else {
    store.dispatch(actions.setActiveToolGroup(group));
    store.dispatch(actions.openElement('groupOverlay'));
  }  
};
