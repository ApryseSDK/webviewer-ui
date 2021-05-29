import selectors from 'selectors';

/**
 * Check whether high contrast mode is enabled or not.
 * @method UI.isHighContrastModeEnabled
 * @example
WebViewer(...)
  .then(function(instance) {
    instance.UI.isHighContrastModeEnabled();
  });
 */

export default store => () => {
  return selectors.getIsHighContrastMode(store.getState());
};
