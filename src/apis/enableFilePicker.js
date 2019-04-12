/**
 * Enables file picker feature, affecting the Open files button in menu overlay and shortcut to open local files (ctrl/cmd + o).
 * @method CoreControls.ReaderControl#enableFilePicker
 * @example // enable file picker feature
viewerElement.addEventListener('ready', () => {
  const instance = viewer.getInstance();
  instance.enableFilePicker();
});
 */

import disableFilePicker from './disableFilePicker';
import { PRIORITY_ONE } from 'constants/actionPriority';
import actions from 'actions';

export default store => (enable = true) =>  {
  if (enable) {
    store.dispatch(actions.enableElements(['filePickerHandler', 'filePickerButton'], PRIORITY_ONE));
  } else {
    console.warn('enableFilePicker(false) is deprecated, please use disableFilePicker() instead');
    disableFilePicker(store)();
  }
};
