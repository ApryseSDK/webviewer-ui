/**
 * Exit Multi-Viewer Mode (Side by side view).
 * @method UI.exitMultiViewerMode
 * @example
WebViewer(...)
  .then(function(instance) {
    instance.UI.exitMultiViewerMode();
  });
 */

import { cleanUpMultiViewer } from 'helpers/multiViewerHelper';

export default (store) => () => {
  cleanUpMultiViewer(store);
};