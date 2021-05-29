import actions from 'actions';

/**
 * Turns high contrast mode on or off to help with accessibility.
 * @deprecated since version 8.0. Use enableHighContrastMode or disableHighContrastMode Instead
 * @method UI.setHighContrastMode
 * @param {boolean} useHighContrastMode If true then the UI will use high contrast colors to help with accessibility.
 * @example
// Using predefined string
WebViewer(...)
  .then(function(instance) {
    instance.UI.setHighContrastMode(true);
  });
 */

export default store => useHighContrastMode => {
  console.warn('Deprecated since version 8.0. Use enableHighContrastMode or disableHighContrastMode Instead');
  store.dispatch(actions.setHighContrastMode(useHighContrastMode));
};