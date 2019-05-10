/**
 * Enables localStorage feature, tool styles will be saved to localStorage after changed.
 * @method WebViewer#enableLocalStorage
 * @example // enable localStorage feature
viewerElement.addEventListener('ready', () => {
  const instance = viewer.getInstance();
  instance.enableLocalStorage();
});
 */

import localStorageManager from 'helpers/localStorageManager';

export default () => {
  localStorageManager.enableLocalStorage();
};