import actions from 'actions';

/**
 * Turns high contrast mode on to help with accessibility.
 * @method UI.enableHighContrastMode
 * @example
WebViewer(...)
  .then(function(instance) {
    instance.UI.enableHighContrastMode();
  });
 */

export default store => () => {
  store.dispatch(actions.setHighContrastMode(true));
};