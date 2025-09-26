import core from 'core';
import actions from 'actions';
import localStorageManager from 'helpers/localStorageManager';
import { getInstanceID } from 'helpers/getRootNode';
import i18next from 'i18next';

export default (dispatch) => (tool) => {
  const toolName = tool.name;
  const toolStyles = tool.defaults;
  if (toolStyles) {
    storeStyle(toolName, toolStyles);
  }

  const currentTool = core.getToolMode();
  if (currentTool && currentTool.name === toolName) {
    dispatch(actions.setActiveToolStyles(toolStyles));
  }

  const shouldCallSetSnapMode = core.isFullPDFEnabled() && currentTool && currentTool.getSnapMode;
  if (shouldCallSetSnapMode) {
    const snapMode = currentTool.getSnapMode();
    dispatch(actions.setEnableSnapMode({ toolName, isEnabled: !!snapMode }));
  }
};

const storeStyle = (toolName, toolStyles) => {
  try {
    const instanceId = getInstanceID();
    localStorageManager.setItemSynchronous(`${instanceId}-toolData-${toolName}`, JSON.stringify(toolStyles));
    if (toolStyles.Font || toolStyles.TextAlign) {
      const currentDir = i18next.dir();
      const key = `${instanceId}-toolData-${toolName}-${currentDir}`;
      const prevStyles = localStorageManager.getItemSynchronous(key);
      const newStyles = {
        Font: toolStyles.Font,
        TextAlign: toolStyles.TextAlign
      };
      if (!prevStyles || prevStyles.Font !== newStyles.Font || prevStyles.TextAlign !== newStyles.TextAlign) {
        localStorageManager.setItemSynchronous(key, JSON.stringify(newStyles));
      }
    }
  } catch (err) {
    console.warn(`localStorage could not be accessed. ${err.message}`);
  }
};
