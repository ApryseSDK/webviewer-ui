/**
 * Enables text to be selected in the document.
 * @method WebViewer#enableTextSelection
 * @example // 5.1 and after
const viewerElement = document.getElementById('viewer');
const instance = await WebViewer({ ... }, viewerElement);

instance.enableTextSelection();
 * @example // 4.0 ~ 5.0
var viewerElement = document.getElementById('viewer');
var viewer = new PDFTron.WebViewer({ ... }, viewerElement);

viewerElement.addEventListener('ready', function() {
  var instance = viewer.getInstance();
  instance.enableTextSelection();
});
 */

import disableTextSelection from './disableTextSelection';
import { PRIORITY_ONE } from 'constants/actionPriority';
import actions from 'actions';

export default store => (enable = true) => {
  if (enable) {
    store.dispatch(actions.enableElements(['textPopup', 'textSelectButton'], PRIORITY_ONE));
  } else {
  console.warn('enableTextSelection(false) is deprecated, please use disableTextSelection() instead');
    disableTextSelection(store)();
  }

  window.Tools.Tool.ENABLE_TEXT_SELECTION = enable;
};
