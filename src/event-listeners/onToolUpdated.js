import core from 'core';
import actions from 'actions';
import localStorageManager from 'helpers/localStorageManager';
import { getInstanceID } from 'helpers/getRootNode';

export default (dispatch) => (tool) => {
  const toolName = tool.name;
  const toolStyles = tool.defaults;
  if (toolStyles && localStorageManager.isLocalStorageEnabled()) {
    storeStyle(toolName, toolStyles);
  }

  const currentTool = core.getToolMode();
  if (currentTool && currentTool.name === toolName) {
    dispatch(actions.setActiveToolStyles(toolStyles));
  }
};

const storeStyle = (toolName, toolStyles) => {
  try {
    const instanceId = getInstanceID();
    localStorage.setItem(`${instanceId}-toolData-${toolName}`, JSON.stringify(toolStyles));
  } catch (err) {
    console.warn(`localStorage could not be accessed. ${err.message}`);
  }
};
