/**
 * Disables file picker feature, affecting the Open files button in menu overlay and shortcut to open local files (ctrl/cmd + o).
 * @method WebViewer#disableFilePicker
 * @example // 5.1 and after
WebViewer(...)
  .then(function(instance) {
    instance.disableFilePicker();
  });
 * @example // 4.0 ~ 5.0
var viewerElement = document.getElementById('viewer');
var viewer = new PDFTron.WebViewer(...);

viewerElement.addEventListener('ready', function() {
  var instance = viewer.getInstance();
  instance.disableFilePicker();
});
 */

import { PRIORITY_ONE } from 'constants/actionPriority';
import actions from 'actions';

export default store => () => {
  store.dispatch(actions.disableElements(['filePickerHandler', 'filePickerButton'], PRIORITY_ONE));
};
