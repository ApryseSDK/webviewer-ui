/**
 * Fade the Page Navigation Component after it has not been interacted with. Reappears whenever the document is scrolled.
 * @method WebViewerInstance#enableFadePageNavigationComponent
 * @example
WebViewer(...)
  .then(function(instance) {
    // Sets behaviour to fade the page navigation component.
    // enabled by default
    instance.enableFadePageNavigationComponent();
  });
 */

import actions from 'actions';

export default store => () => {
  return store.dispatch(actions.enableFadePageNavigationComponent());
};