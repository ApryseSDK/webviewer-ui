import core from 'core';
import { register, copyMapWithDataProperties } from 'constants/map';
import actions from 'actions';

export default store => (tool, annotationConstructor) => {
  registerToolInToolModeMap(tool);
  registerToolInRedux(store, tool);
  register(tool, annotationConstructor);
  updateColorMapInRedux(store);
};

const registerToolInRedux = (store, tool) => {
  store.dispatch(actions.registerTool(tool));
};

const registerToolInToolModeMap = ({ toolObject, toolName }) => {
  const toolModeMap = core.getToolModeMap();

  toolModeMap[toolName] = toolObject;
  toolModeMap[toolName].name = toolName;
};

const updateColorMapInRedux = store => {
  store.dispatch(actions.setColorMap(copyMapWithDataProperties('iconColor', 'currentPalette')));
};
