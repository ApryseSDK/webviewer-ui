import core from 'core';
import actions from 'actions';

export default store => (tool, annotationConstructor) => {
  registerToolInToolModeMap(tool);
  registerToolInRedux(store, tool, annotationConstructor);
};

const registerToolInRedux = (store, tool, annotationConstructor) => {
  store.dispatch(actions.registerTool(tool, annotationConstructor));
};

const registerToolInToolModeMap = ({ toolObject, toolName }) => {
  const toolModeMap = core.getToolModeMap();

  toolModeMap[toolName] = toolObject;
  toolModeMap[toolName].name = toolName;
};
