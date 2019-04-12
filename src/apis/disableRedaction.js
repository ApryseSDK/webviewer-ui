/**
 * Disables redaction feature, affecting any elements related to redaction.
 * @method CoreControls.ReaderControl#disableRedaction
 * @example // disable redaction feature
viewerElement.addEventListener('ready', () => {
  const instance = viewer.getInstance();
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
