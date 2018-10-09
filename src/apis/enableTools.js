import core from 'core';
import actions from 'actions';

export default store => toolNames => {
  toolNames.forEach(toolName => {
    core.getTool(toolName).disabled = false;
  });
  store.dispatch(actions.enableTools(toolNames));
};
