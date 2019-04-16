/**
 * Disables download feature, affecting the Download button in menu overlay.
 * @method WebViewer#disableDownload
 * @example // disable download feature
viewerElement.addEventListener('ready', () => {
  const instance = viewer.getInstance();
  instance.disableDownload();
});
 */

import { PRIORITY_ONE } from 'constants/actionPriority';
import actions from 'actions';

export default store => () => {
  store.dispatch(actions.disableElement('downloadButton', PRIORITY_ONE));
};
