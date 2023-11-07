/**
 * Exit Multi-Viewer Mode (Side by side view).
 * @method UI.exitMultiViewerMode
 * @example
WebViewer(...)
  .then(function(instance) {
    instance.UI.exitMultiViewerMode();
  });
 */

import actions from 'actions';

export default (store) => () => {
  store.dispatch(actions.setIsMultiViewerMode(false));
};