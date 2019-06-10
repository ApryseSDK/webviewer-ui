/**
 * Disables download feature, affecting the Download button in menu overlay.
 * @method WebViewer#disableDownload
 * @example // 5.1 and after
WebViewer(...)
  .then(function(instance) {
    instance.disableDownload();
  });
 * @example // 4.0 ~ 5.0
var viewerElement = document.getElementById('viewer');
var viewer = new PDFTron.WebViewer(...);

viewerElement.addEventListener('ready', function() {
  var instance = viewer.getInstance();
  instance.disableDownload();
});
 */

import { PRIORITY_ONE } from 'constants/actionPriority';
import actions from 'actions';

export default store => () => {
  store.dispatch(actions.disableElement('downloadButton', PRIORITY_ONE));
};
