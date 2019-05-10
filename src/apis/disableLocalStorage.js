/**
 * Disables localStorage feature, preventing tool styles from being saved to localStorage after changed.
 * @method WebViewer#disableLocalStorage
 * @example // disable localStorage feature
viewerElement.addEventListener('ready', () => {
  const instance = viewer.getInstance();
  instance.disableLocalStorage();
});
 */

import localStorageManager from 'helpers/localStorageManager';

export default () => {
  localStorageManager.disableLocalStorage();
};