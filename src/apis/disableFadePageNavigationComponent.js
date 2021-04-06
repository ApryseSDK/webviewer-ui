/**
 * Always keep the Page Navigation Component on screen. Default behaviour is to fade it after certain period of inactivity.
 * @method WebViewerInstance#disableFadePageNavigationComponent
 * @example
WebViewer(...)
  .then(function(instance) {
    // Keeps the page navigation component on screen all the time
    instance.disableFadePageNavigationComponent();
  });
 */

import actions from 'actions';

export default store => () => {
  return store.dispatch(actions.disableFadePageNavigationComponent());
};