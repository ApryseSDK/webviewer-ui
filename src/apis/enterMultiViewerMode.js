/**
 * Activate Multi-Viewer Mode (Side by side view).
 * @method UI.enterMultiViewerMode
 * @example
WebViewer(...)
  .then(function(instance) {
    instance.UI.enterMultiViewerMode();
  });
 */

import actions from 'actions';
import selectors from 'selectors';

export default (store) => () => {
  if (selectors.getIsMultiTab(store.getState())) {
    console.error('MultiTab and MultiViewerMode cannot be enabled at the same time, disabling MultiTab');
    store.dispatch(actions.setMultiTab(false));
    store.dispatch(actions.setTabManager(null));
    store.dispatch(actions.setTabs([]));
    store.dispatch(actions.setActiveTab(0));
  }
  store.dispatch(actions.setIsMultiViewerMode(true));
};