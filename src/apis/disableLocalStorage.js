/**
 * Disables localStorage feature, preventing tool styles from being saved to localStorage after changed.
 * @method WebViewer#disableLocalStorage
 * @example const viewerElement = document.getElementById('viewer');
const instance = await WebViewer({ ... }, viewerElement);

instance.disableLocalStorage();
 */

import localStorageManager from 'helpers/localStorageManager';

export default () => {
  localStorageManager.disableLocalStorage();
};