import core from 'core';
import actions from 'actions';

export default store => tool => {
  registerToolInToolModeMap(tool);
  registerToolInRedux(store, tool);
};

const registerToolInRedux = (store, tool) => {
  store.dispatch(actions.registerTool(tool));
};

const registerToolInToolModeMap = ({ toolObject, toolName }) => {
  const toolModeMap = core.getToolModeMap();

  toolModeMap[toolName] = toolObject;
  toolModeMap[toolName].name = toolName;
};
