import core from 'core';
import actions from 'actions';

export default store => toolNames => {
  toolNames.forEach(toolName => {
    core.getTool(toolName).disabled = true;
  });
  store.dispatch(actions.disableTools(toolNames));
};
