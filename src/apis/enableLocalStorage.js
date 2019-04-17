/**
 * Enables localStorage feature, tool styles will be saved to localStorage after changed.
 * @method WebViewer#enableLocalStorage
 * @example const viewerElement = document.getElementById('viewer');
const instance = await WebViewer({ ... }, viewerElement);
instance.enableLocalStorage();
 */

import localStorageManager from 'helpers/localStorageManager';

export default () => {
  localStorageManager.enableLocalStorage();
};