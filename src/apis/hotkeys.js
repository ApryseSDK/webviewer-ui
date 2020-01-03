/**
 * An instance of Hotkeys that can be used to enable, disable or register custom hotkeys in the viewer
 * @name WebViewerInstance#hotkeys
 * @see WebViewerInstance.Hotkeys
 * @type {Class<WebViewerInstance.Hotkeys>}
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
