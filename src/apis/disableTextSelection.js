/**
 * Disables text to be selected in the document.
 * @method WebViewer#disableTextSelection
 * @example // 5.1 and after
WebViewer(...)
.then(instance => {
  instance.disableTextSelection();
});
 * @example // 4.0 ~ 5.0
var viewerElement = document.getElementById('viewer');
var viewer = new PDFTron.WebViewer(...);

viewerElement.addEventListener('ready', function() {
  var instance = viewer.getInstance();
  instance.disableTextSelection();
});
 */

import core from 'core';
import { PRIORITY_ONE } from 'constants/actionPriority';
import defaultTool from 'constants/defaultTool';
import actions from 'actions';

export default store => () => {
  core.clearSelection();
  core.setToolMode(defaultTool);
  store.dispatch(actions.closeElement('textPopup'));
  store.dispatch(actions.disableElements(['textPopup', 'textSelectButton'], PRIORITY_ONE));

  window.Tools.Tool.ENABLE_TEXT_SELECTION = false;
};