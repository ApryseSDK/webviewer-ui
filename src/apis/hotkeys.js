/**
 * An instance of Hotkeys that can be used to enable, disable or register custom hotkeys in the viewer.
 * @name UI.hotkeys
 * @see UI.Hotkeys
 * @type {Class<UI.Hotkeys>}
 */

import hotkeysManager from 'helpers/hotkeysManager';
import { EventTypes, Keys } from 'helpers/hotkeysUtils';

export const createHotkeysAPI = (instanceHotkeysManager = hotkeysManager) => ({
  on: (...args) => {
    instanceHotkeysManager.on(...args);
  },
  off: (...args) => {
    instanceHotkeysManager.off(...args);
  },
  /**
   * Programmatically trigger a shortcut action by its key combination string. This is useful when you need to trigger WebViewer shortcuts from outside the WebViewer window (e.g. from a custom toolbar in your app or a sibling component).
   * @method UI.Hotkeys#trigger
   * @param {string} shortcut A key combo string (e.g. 'ctrl+b', 'command+b').
   *   You can also use values from {@link UI.Hotkeys.Keys} (e.g. `instance.UI.hotkeys.Keys.CTRL_B`).
   * @param {string} [eventType='keydown'] Either 'keydown' or 'keyup'. Useful for shortcuts that have different actions for keydown and keyup events (e.g. hold-to-release shortcuts like space for Pan).
   *   You can use {@link UI.Hotkeys.EventTypes} constants (e.g. `instance.UI.hotkeys.EventTypes.KEYUP`).
   * @example
   * instance.UI.hotkeys.trigger('command+b');
   *
   * // Works with remapped shortcuts. If bookmark was remapped from Ctrl+B to Ctrl+/
   * instance.UI.hotkeys.trigger('ctrl+/'); // triggers bookmark
   *
   * // Trigger keyup for hold-to-release shortcuts (e.g. space for Pan)
   * instance.UI.hotkeys.trigger('space', 'keydown');
   *
   * // Handle all shortcut keys
   * document.addEventListener('keydown', (e) => {
   *   const parts = [];
   *   if (e.ctrlKey) parts.push('ctrl');
   *   if (e.metaKey) parts.push('command');
   *   const key = e.key.toLowerCase();
   *   if (['control', 'meta', 'shift', 'alt'].includes(key)) return;
   *   parts.push(key);
   *   const combo = parts.join('+');
   *
   *   getInstance().UI.hotkeys.trigger(combo);
   * });
   */
  trigger: (shortcut, eventType) => {
    instanceHotkeysManager.trigger(shortcut, eventType);
  },
  /**
   * Restores the hotkeys to default and disables previously unbinded hotkeys.
   * @ignore
   */
  restoreHotkeys: () => {
    instanceHotkeysManager.restoreHotkeys();
  },
  Keys,
  EventTypes,
});

export default createHotkeysAPI();
