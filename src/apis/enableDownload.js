/**
 * Enables download feature, affecting the Download button in menu overlay.
 * @method WebViewer#enableDownload
 * @example // 5.1 and after
WebViewer(...)
  .then(function(instance) {
    instance.enableDownload();
  });
 * @example // 4.0 ~ 5.0
var viewerElement = document.getElementById('viewer');
var viewer = new PDFTron.WebViewer(...);

viewerElement.addEventListener('ready', function() {
  var instance = viewer.getInstance();
  instance.enableDownload();
});
 */

import { PRIORITY_ONE } from 'constants/actionPriority';
import actions from 'actions';
import disableDownload from './disableDownload';

export default store => (enable = true) =>  {
  if (enable) {
    store.dispatch(actions.enableElement('downloadButton', PRIORITY_ONE));
  } else {
    console.warn('enableDownload(false) is deprecated, please use disableDownload() instead');
    disableDownload(store)();
  }
};
