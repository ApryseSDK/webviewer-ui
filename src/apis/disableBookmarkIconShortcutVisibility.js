import core from 'core';
import actions from 'actions';

/**
 * Hide bookmark icon shortcuts on the top right corner of each page.
 * @method UI.disableBookmarkIconShortcutVisibility
 * @example
WebViewer(...)
  .then(function(instance) {
    instance.UI.disableBookmarkIconShortcutVisibility();
  });
 */
export default (store) => () => {
  store.dispatch(actions.setBookmarkIconShortcutVisibility(false));
  core.setBookmarkIconShortcutVisibility(false);
};