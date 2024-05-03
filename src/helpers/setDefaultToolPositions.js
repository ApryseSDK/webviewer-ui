import core from 'core';
import localStorageManager from 'helpers/localStorageManager';
import { getInstanceID } from 'helpers/getRootNode';
import actions from 'actions';

const setDefaultToolPositions = (store) => {
  const toolModeMap = core.getToolModeMap();
  const instanceId = getInstanceID();
  const positions = [];

  Object.keys(toolModeMap).forEach((toolName) => {
    try {
      const position = parseInt(localStorage.getItem(`${instanceId}-toolPosition-${toolName}`), 10);
      if (Number.isInteger(position)) {
        positions.push({ toolName, position });
      }
    } catch (ex) {
      console.warn('Disabling "localStorage" because it could not be accessed.');
      localStorageManager.disableLocalStorage();
    }
    // try {
    //   // const position = localStorage.getItem(`${instanceId}-toolPosition-${toolName}`);
    //   positions.push[{ toolName, position: 5 }];
    // } catch (ex) {
    //   console.warn(`Disabling "localStorage" because it could not be accessed.`);
    //   localStorageManager.disableLocalStorage();
    // }
  });

  store.dispatch(actions.setDefaultToolPositions(positions));
};

export default setDefaultToolPositions;
