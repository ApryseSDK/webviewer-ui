/**
 * Disables redaction feature, affecting any elements related to redaction.
 * @method WebViewer#disableRedaction
 * @example // 5.1 and after
WebViewer(...)
  .then(function(instance) {
    instance.disableRedaction();
  });
 * @example // 4.0 ~ 5.0
var viewerElement = document.getElementById('viewer');
var viewer = new PDFTron.WebViewer(...);

viewerElement.addEventListener('ready', function() {
  var instance = viewer.getInstance();
  instance.disableRedaction();
});
 */

import actions from 'actions';
import core from 'core';

export default store => () => {
  store.dispatch(actions.disableElement('redactionButton', 1));
  core.enableRedaction(false);
  core.setToolMode('AnnotationEdit');
};
