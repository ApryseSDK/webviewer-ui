/**
 * Enables redaction feature, affecting any elements related to redaction.
 * @method WebViewer#enableRedaction
 * @example // 5.1 and after
WebViewer(...)
  .then(function(instance) {
    instance.enableRedaction();
  });
 * @example // 4.0 ~ 5.0
var viewerElement = document.getElementById('viewer');
var viewer = new PDFTron.WebViewer(...);

viewerElement.addEventListener('ready', function() {
  var instance = viewer.getInstance();
  instance.enableRedaction();
});
 */

import actions from 'actions';
import core from 'core';
import disableRedaction from './disableRedaction';

export default store => (enable = true) => {
  if (enable) {
    store.dispatch(actions.enableElement('redactionButton', 1));
    core.enableRedaction(true);

    if (!core.isFullPDFEnabled()) {
      console.warn('Full api is not enabled, applying redactions is disabled');
    }
  } else {
    disableRedaction(store)();
  }
};
