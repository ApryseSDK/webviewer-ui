/**
 * Activate Multi-Viewer Mode (Side by side view).
 * @method UI.enterMultiViewerMode
 * @example
WebViewer(...)
  .then(function(instance) {
    instance.UI.enterMultiViewerMode();
  });
 */

import { shouldEndAccessibleReadingOrderMode } from 'helpers/accessibility';
import { setupMultiViewer } from 'helpers/multiViewerHelper';

export default (store) => () => {
  shouldEndAccessibleReadingOrderMode();
  setupMultiViewer(store);
};