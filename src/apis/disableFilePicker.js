/**
 * Disables file picker feature, affecting the Open files button in menu overlay and shortcut to open local files (ctrl/cmd + o).
 * @method WebViewer#disableFilePicker
 * @example // disable file picker feature
viewerElement.addEventListener('ready', () => {
  const instance = viewer.getInstance();
  instance.disableFilePicker();
});
 */

import { PRIORITY_ONE } from 'constants/actionPriority';
import actions from 'actions';

export default store => () => {
  store.dispatch(actions.disableElements(['filePickerHandler', 'filePickerButton'], PRIORITY_ONE));
};
