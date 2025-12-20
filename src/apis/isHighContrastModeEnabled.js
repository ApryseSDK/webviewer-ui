import selectors from 'selectors';

/**
 * Checks whether high contrast mode is enabled
 * @method UI.isHighContrastModeEnabled
 * @memberof UI
 * @returns {boolean} True if high contrast mode is enabled, false otherwise
 * @see UI.enableHighContrastMode
 * @see UI.disableHighContrastMode
 * @example
WebViewer(...)
  .then(function(instance) {
    const isEnabled = instance.UI.isHighContrastModeEnabled();
    console.log('High contrast mode enabled:', isEnabled);
  });
 */

export default (store) => () => {
  return selectors.getIsHighContrastMode(store.getState());
};
