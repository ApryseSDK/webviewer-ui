/**
 * Always keep the Page Navigation Component on screen. Default behaviour is to fade it after certain period of inactivity.
 * @method UI.disableFadePageNavigationComponent
 * @example
WebViewer(...)
  .then(function(instance) {
    // Keeps the page navigation component on screen all the time
    instance.UI.disableFadePageNavigationComponent();
  });
 */

import actions from 'actions';

export default (store) => () => {
  return store.dispatch(actions.disableFadePageNavigationComponent());
};