/**
 * An instance of Hotkeys that can be used to enable, disable or register custom hotkeys in the viewer
 * @name UI.hotkeys
 * @see UI.Hotkeys
 * @type {Class<UI.Hotkeys>}
 */

import hotkeysManager, { Keys } from 'helpers/hotkeysManager';

export default {
  on: (...args) => {
    hotkeysManager.on(...args);
  },
  off: (...args) => {
    hotkeysManager.off(...args);
  },
  Keys,
};
