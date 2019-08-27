import core from 'core';
import actions from 'actions';
import localStorageManager from 'helpers/localStorageManager';

export default dispatch => (e, tool) => {
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
    localStorage.setItem(`toolData-${toolName}`, JSON.stringify(toolStyles));
  } catch (err) {
    console.warn(`localStorage could not be accessed. ${err.message}`);
  }
};