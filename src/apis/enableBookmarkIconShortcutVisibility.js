import core from 'core';
import actions from 'actions';
import selectors from 'selectors';
import DataElements from '../constants/dataElement';

/**
 * Show bookmark icon shortcuts on the top right corner of each page for quickly adding or removing a bookmark.
 * @method UI.enableBookmarkIconShortcutVisibility
 * @example
WebViewer(...)
  .then(function(instance) {
    instance.UI.enableBookmarkIconShortcutVisibility();
  });
 */
export default (store) => () => {
  store.dispatch(actions.setBookmarkIconShortcutVisibility(true));
  const isBookmarkPanelEnabled = !selectors.isElementDisabled(store.getState(), DataElements.BOOKMARK_PANEL);
  if (isBookmarkPanelEnabled) {
    core.setBookmarkIconShortcutVisibility(true);
  }
};