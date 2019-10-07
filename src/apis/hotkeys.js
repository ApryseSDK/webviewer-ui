/**
 * An instance of Hotkeys that can be used to add custom or remove existing hotkey handlers
 * @name WebViewer#hotkeys
 * @see WebViewer.Hotkeys
 * @example // 6.0 and after
WebViewer(...)
  .then(function(instance) {
    instance.hotkeys.someAPIs();
  });
 */

import hotkeysManager from 'helpers/hotkeysManager';

export default {
  on: (...args) => {
    hotkeysManager.on(...args);
  },
  off: (...args) => {
    hotkeysManager.off(...args);
  },
};
