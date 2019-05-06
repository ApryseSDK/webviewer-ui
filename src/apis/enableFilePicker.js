/**
 * Enables file picker feature, affecting the Open files button in menu overlay and shortcut to open local files (ctrl/cmd + o).
 * @method WebViewer#enableFilePicker
 * @example // 5.1 and after
const viewerElement = document.getElementById('viewer');
const instance = await WebViewer({ ... }, viewerElement);

instance.enableFilePicker();
 * @example // 4.0 ~ 5.0
var viewerElement = document.getElementById('viewer');
var viewer = new PDFTron.WebViewer({ ... }, viewerElement);

viewerElement.addEventListener('ready', function() {
  var instance = viewer.getInstance();
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
