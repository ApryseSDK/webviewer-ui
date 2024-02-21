import actions from 'actions';

/**
 * Turns high contrast mode off.
 * @method UI.disableHighContrastMode
 * @example
WebViewer(...)
  .then(function(instance) {
    instance.UI.disableHighContrastMode();
  });
 */

export default (store) => () => {
  store.dispatch(actions.setHighContrastMode(false));
};
