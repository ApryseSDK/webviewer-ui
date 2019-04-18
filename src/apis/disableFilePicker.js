/**
 * Disables file picker feature, affecting the Open files button in menu overlay and shortcut to open local files (ctrl/cmd + o).
 * @method WebViewer#disableFilePicker
 * @example const viewerElement = document.getElementById('viewer');
const instance = await WebViewer({ ... }, viewerElement);

instance.disableFilePicker();
 */

import { PRIORITY_ONE } from 'constants/actionPriority';
import actions from 'actions';

export default store => () => {
  store.dispatch(actions.disableElements(['filePickerHandler', 'filePickerButton'], PRIORITY_ONE));
};
