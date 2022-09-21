import selectors from 'selectors';

/**
 * Check whether high contrast mode is enabled or not.
 * @deprecated since version 8.0. Use isHighContrastModeEnabled Instead
 * @method UI.getIsHighContrastMode
 * @example
WebViewer(...)
  .then(function(instance) {
    instance.UI.getIsHighContrastMode();
  });
 */

export default (store) => () => {
  console.warn('Deprecated since version 8.0. Please use isHighContrastModeEnabled Instead');
  return selectors.getIsHighContrastMode(store.getState());
};
