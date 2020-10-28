import actions from 'actions';

/**
 * Turns high contrast mode on or off to help with accessibility.
 * @method WebViewerInstance#setTheme
 * @param {boolean} useHighContrastMode If true then the UI will use high constrast colours.
 * @example
// Using predefined string
WebViewer(...)
  .then(function(instance) {
    instance.setHighContrastMode(true);
  });
 */

export default store => useHighContrastMode => {
  store.dispatch(actions.setHighContrastMode(useHighContrastMode));
};