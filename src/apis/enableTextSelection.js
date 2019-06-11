/**
 * Enables text to be selected in the document.
 * @method WebViewer#enableTextSelection
 * @example // 5.1 and after
WebViewer(...)
  .then(function(instance) {
    instance.enableTextSelection();
  });
 * @example // 4.0 ~ 5.0
var viewerElement = document.getElementById('viewer');
var viewer = new PDFTron.WebViewer(...);

viewerElement.addEventListener('ready', function() {
  var instance = viewer.getInstance();
  instance.enableTextSelection();
});
 */

import actions from 'actions';
import { PRIORITY_ONE } from 'constants/actionPriority';

import disableTextSelection from './disableTextSelection';

export default store => (enable = true) => {
  if (enable) {
    store.dispatch(actions.enableElements(['textPopup', 'textSelectButton'], PRIORITY_ONE));
  } else {
  console.warn('enableTextSelection(false) is deprecated, please use disableTextSelection() instead');
    disableTextSelection(store)();
  }

  window.Tools.Tool.ENABLE_TEXT_SELECTION = enable;
};
