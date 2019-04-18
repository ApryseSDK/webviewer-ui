/**
 * Disables redaction feature, affecting any elements related to redaction.
 * @method WebViewer#disableRedaction
 * @example const viewerElement = document.getElementById('viewer');
const instance = await WebViewer({ ... }, viewerElement);

instance.disableRedaction();
 */

import actions from 'actions';
import core from 'core';

export default store => () => {
  store.dispatch(actions.disableElement('redactionButton', 1));
  core.enableRedaction(false);
  core.setToolMode('AnnotationEdit');
};
