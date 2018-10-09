import core from 'core';
import actions from 'actions';

export default store => toolName => {
  store.dispatch(actions.disableTool(toolName));
  core.getTool(toolName).disabled = true;
};
