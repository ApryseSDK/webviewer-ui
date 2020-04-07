import core from 'core';
import localStorageManager from 'helpers/localStorageManager';

import actions from 'actions';

const setDefaultToolPositions = store => {
  const toolModeMap = core.getToolModeMap();

  const positions = [];

  Object.keys(toolModeMap).forEach(toolName => {
    try {
      const position = parseInt(localStorage.getItem(`toolPosition-${toolName}`));
      if (Number.isInteger(position)) {
        positions.push({ toolName, position });
      }
    } catch (ex) {
      console.warn(`Disabling "localStorage" because it could not be accessed.`);
      localStorageManager.disableLocalStorage();
    }
    // try {
    //   // const position = localStorage.getItem(`toolPosition-${toolName}`);
    //   positions.push[{ toolName, position: 5 }];
    // } catch (ex) {
    //   console.warn(`Disabling "localStorage" because it could not be accessed.`);
    //   localStorageManager.disableLocalStorage();
    // }
  });

  store.dispatch(actions.setDefaultToolPositions(positions));
};

export default setDefaultToolPositions;
