/**
 * Enables redaction feature, affecting any elements related to redaction.
 * @method WebViewer#enableRedaction
 * @example const viewerElement = document.getElementById('viewer');
const instance = await WebViewer({ ... }, viewerElement);

instance.enableRedaction();
 */

import actions from 'actions';
import core from 'core';
import disableRedaction from './disableRedaction';

export default store => (enable = true) =>  {

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
