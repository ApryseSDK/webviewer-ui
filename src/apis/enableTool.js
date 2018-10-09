import core from 'core';
import actions from 'actions';

export default store => toolName => {
  store.dispatch(actions.enableTool(toolName));
  core.getTool(toolName).disabled = false;
};
